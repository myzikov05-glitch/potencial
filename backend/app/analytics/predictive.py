from app.analytics.source import get_events
from app.analytics.engine import aggregate_person_week, percent_of_load


def build_weekly_table():
    events = get_events()
    agg = aggregate_person_week(events) 
    agg = percent_of_load(agg)           

    by_person = {}
    for rec in agg:
        by_person.setdefault(rec['person_id'], []).append(rec)

    for pid in by_person:
        by_person[pid].sort(key=lambda r: r['week'])

    return by_person


def build_training_dataset(n_lags=2):
    by_person = build_weekly_table()

    X, y, meta = [], [], []

    for pid, weeks in by_person.items():
        for i in range(n_lags - 1, len(weeks) - 1):
            window = weeks[i - (n_lags - 1): i + 1]
            target_week = weeks[i + 1]         

            features = {}
            for lag_idx, wrec in enumerate(window):
                features[f'load_pct_lag{lag_idx}'] = wrec['load_pct']
                features[f'task_count_lag{lag_idx}'] = wrec['task_closed_count']
                features[f'meeting_hours_lag{lag_idx}'] = wrec['meeting_hours']
                features[f'mean_complexity_lag{lag_idx}'] = wrec['mean_complexity']
                features[f'commit_count_lag{lag_idx}'] = wrec['commit_count']

            features['load_trend'] = window[-1]['load_pct'] - window[0]['load_pct']

            X.append(features)
            y.append(target_week['load_pct'])    
            meta.append((pid, target_week['week']))

    return X, y, meta

import numpy as np
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error
from sklearn.feature_extraction import DictVectorizer


def split_by_time(X, y, meta, test_weeks=4):
    all_weeks = sorted({tw for (_, tw) in meta})
    cutoff_weeks = set(all_weeks[-test_weeks:]) if len(all_weeks) > test_weeks else set(all_weeks[-1:])

    X_train, y_train, X_test, y_test = [], [], [], []
    for i in range(len(X)):
        target_week = meta[i][1]
        if target_week in cutoff_weeks:
            X_test.append(X[i]); y_test.append(y[i])
        else:
            X_train.append(X[i]); y_train.append(y[i])

    return X_train, y_train, X_test, y_test

# на данный момент на синтетике модель переобучилась из-за малого количества данных (это норм). Реальное качество проявится с реальными данными

def train_and_validate(n_lags=2, test_weeks=4):
    X, y, meta = build_training_dataset(n_lags=n_lags)

    X_train, y_train, X_test, y_test = split_by_time(X, y, meta, test_weeks=test_weeks)

    vectorizer = DictVectorizer(sparse=False)
    X_train_mat = vectorizer.fit_transform(X_train)
    X_test_mat = vectorizer.transform(X_test)

    
    model = GradientBoostingRegressor(random_state=42)
    model.fit(X_train_mat, y_train)

    pred_train = model.predict(X_train_mat)
    pred_test = model.predict(X_test_mat)

    mae_train = mean_absolute_error(y_train, pred_train)
    mae_test = mean_absolute_error(y_test, pred_test)

    naive_pred_test = [x[f'load_pct_lag{n_lags-1}'] for x in X_test]
    mae_naive = mean_absolute_error(y_test, naive_pred_test)

    metrics = {
        'n_train': len(X_train),
        'n_test': len(X_test),
        'mae_train': round(mae_train, 1),
        'mae_test': round(mae_test, 1),
        'mae_naive_baseline': round(mae_naive, 1),
    }

    return model, vectorizer, metrics


def predict_next_week(model, vectorizer, n_lags=2):
    by_person = build_weekly_table()

    predictions = []

    for pid, weeks in by_person.items():
        if len(weeks) < n_lags:
            continue

        window = weeks[-n_lags:]

        features = {}
        for lag_idx, wrec in enumerate(window):
            features[f'load_pct_lag{lag_idx}'] = wrec['load_pct']
            features[f'task_count_lag{lag_idx}'] = wrec['task_closed_count']
            features[f'meeting_hours_lag{lag_idx}'] = wrec['meeting_hours']
            features[f'mean_complexity_lag{lag_idx}'] = wrec['mean_complexity']
            features[f'commit_count_lag{lag_idx}'] = wrec['commit_count']
        features['load_trend'] = window[-1]['load_pct'] - window[0]['load_pct']

        X_mat = vectorizer.transform([features])
        predicted_load = float(model.predict(X_mat)[0])

        last_known_week = window[-1]['week']
        last_known_load = window[-1]['load_pct']

        predictions.append({
            'person_id': pid,
            'last_known_week': last_known_week,
            'last_known_load_pct': round(last_known_load, 1),
            'predicted_next_load_pct': round(predicted_load, 1),
            'trend': (
                'рост' if predicted_load > last_known_load + 5
                else 'спад' if predicted_load < last_known_load - 5
                else 'стабильно'
            ),
        })

    return predictions


def run_predictive_pipeline(n_lags=2, test_weeks=4):
    model, vectorizer, metrics = train_and_validate(n_lags=n_lags, test_weeks=test_weeks)
    predictions = predict_next_week(model, vectorizer, n_lags=n_lags)

    return {
        'metrics': metrics,
        'predictions': predictions,
    }
        

import pickle
from pathlib import Path

MODEL_PATH = Path(__file__).parent.parent.parent / "data" / "load_model.pkl"


def train_and_save(n_lags=2, test_weeks=4):
    model, vectorizer, metrics = train_and_validate(n_lags=n_lags, test_weeks=test_weeks)

    bundle = {
        'model': model,
        'vectorizer': vectorizer,
        'n_lags': n_lags,
        'metrics': metrics,
    }

    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    with MODEL_PATH.open('wb') as f:
        pickle.dump(bundle, f)

    print(f"Модель сохранена: {MODEL_PATH}")
    print(f"Метрики обучения: {metrics}")
    return bundle


def load_model_bundle():
    if not MODEL_PATH.exists():
        return None
    with MODEL_PATH.open('rb') as f:
        return pickle.load(f)


def get_predictions_from_saved(n_lags=2):
    bundle = load_model_bundle()
    if bundle is None:
        return None 

    return predict_next_week(bundle['model'], bundle['vectorizer'], n_lags=bundle['n_lags'])

if __name__ == "__main__":
    train_and_save()