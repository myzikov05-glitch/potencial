from app.analytics.source import get_events
from datetime import datetime
import numpy as np
from collections import defaultdict, Counter

def get_week_number(date_str):
    date_obj = datetime.fromisoformat(date_str.replace('T', ' '))
    year, week, _ = date_obj.isocalendar()
    return f"{year}-W{week:02d}"

def aggregate_person_week(data):

    result = {}
    
    for event in data:
        person = event['person_id']
        week = get_week_number(event['ts'])
        key = (person, week)
        
        if key not in result:
            result[key] = {
                'person_id': person,
                'week': week,
                'task_closed_count': 0,
                'total_complexity': 0,
                'mean_complexity': 0,
                'commit_count': 0,
                'meeting_hours': 0,
                'review_count': 0,
                'total_events': 0
            }
        
        metrics = result[key]
        metrics['total_events'] += 1
        
        if event['type'] == 'task_closed':
            metrics['task_closed_count'] += 1
            metrics['total_complexity'] += event['payload'].get('complexity', 0)
        
        elif event['type'] == 'commit':
            metrics['commit_count'] += 1
        
        elif event['type'] == 'meeting':
            metrics['meeting_hours'] += event['payload'].get('duration_hours', 0)
        
        elif event['type'] == 'review':
            metrics['review_count'] += 1  

    for key in result:
        if result[key]['task_closed_count'] > 0:
            result[key]['mean_complexity'] = result[key]['total_complexity'] / result[key]['task_closed_count']

    return list(result.values())

def percent_of_load(agg_data):
    for event in agg_data:
        meeting_hours = event['meeting_hours']
        total_complexity = event['total_complexity']

        load = meeting_hours + total_complexity * 2
        load_pct = (load / 40) * 100
        load_meeting_hours = (meeting_hours / 40) * 100
        load_total_complexity = (total_complexity * 2 / 40) * 100

        event['load_pct'] = load_pct
        event['load_meeting_hours'] = load_meeting_hours
        event['load_total_complexity'] = load_total_complexity

    return agg_data


def stagnation(agg_data_with_load_pct, slope_threshold=0.3, complexity_threshold=4.0):
    grouped_by_person = {}

    for record in agg_data_with_load_pct:
        person = record['person_id']
        if person not in grouped_by_person:
            grouped_by_person[person] = []
        grouped_by_person[person].append(record)

    for person in grouped_by_person:
        records = grouped_by_person[person]
        records.sort(key=lambda x: x['week'])
        
        valid_records = [r for r in records if r['task_closed_count'] > 0]
        
        if len(valid_records) >= 2:
            x_values = list(range(len(valid_records)))
            y_values = [r['mean_complexity'] for r in valid_records]
            
            slope, intercept = np.polyfit(x_values, y_values, 1)
            
            avg_complexity = np.mean(y_values)
            
            for record in records:
                record['trend_slope'] = slope
                record['is_stagnant'] = (slope < slope_threshold) and (avg_complexity < complexity_threshold)
        else:
            for record in records:
                record['trend_slope'] = 0
                if record['task_closed_count'] > 0:
                    avg_complexity = record['mean_complexity']
                    record['is_stagnant'] = avg_complexity < complexity_threshold
                else:
                    record['is_stagnant'] = False
    
    return agg_data_with_load_pct

def team_balance(agg_data_with_stagnation):

    weeks_data = defaultdict(list)
    
    for record in agg_data_with_stagnation:
        week = record['week']
        weeks_data[week].append(record['load_pct'])
    
    balance_metrics = {}
    
    for week, loads in weeks_data.items():
        if len(loads) > 1:
            std_dev = np.std(loads)
            max_min_diff = max(loads) - min(loads)
            cv = std_dev / np.mean(loads) if np.mean(loads) > 0 else 0  
        else:
            std_dev = 0
            max_min_diff = 0
            cv = 0
        
        balance_metrics[week] = {
            'week': week,
            'std_deviation': round(std_dev, 2),
            'max_min_diff': round(max_min_diff, 2),
            'coefficient_variation': round(cv, 3),
            'avg_load': round(np.mean(loads), 2),
            'min_load': round(min(loads), 2),
            'max_load': round(max(loads), 2),
            'is_imbalanced': max_min_diff > 30 or cv > 0.3 
        }
    
    return balance_metrics

def help_network(raw_data):
    reviews_by_reviewer = Counter()
    reviews_by_author = Counter()
    help_connections = defaultdict(list)
    
    for event in raw_data:
        if event['type'] == 'review':
            reviewer = event['person_id']
            reviewed_author = event['payload'].get('reviewed_author_id')
            reviewed_task = event['payload'].get('reviewed_task_id')
            
            if reviewed_author:
                reviews_by_reviewer[reviewer] += 1
                reviews_by_author[reviewed_author] += 1
                help_connections[reviewer].append({
                    'reviewed_author': reviewed_author,
                    'task_id': reviewed_task
                })
    
    help_matrix = defaultdict(lambda: defaultdict(int))
    for reviewer, connections in help_connections.items():
        for conn in connections:
            help_matrix[reviewer][conn['reviewed_author']] += 1
    
    help_pairs = []
    for reviewer, reviewees in help_matrix.items():
        for reviewee, count in reviewees.items():
            help_pairs.append({
                'reviewer': reviewer,
                'reviewee': reviewee,
                'help_count': count
            })
    
    return {
        'total_reviews': sum(reviews_by_reviewer.values()),
        'reviews_by_reviewer': dict(reviews_by_reviewer),
        'reviews_received_by_author': dict(reviews_by_author),
        'help_connections': help_pairs,
        'most_helpful': reviews_by_reviewer.most_common(3) if reviews_by_reviewer else [],
        'most_reviewed': reviews_by_author.most_common(3) if reviews_by_author else []
    }

def balance_recommendations(agg_data, roles_dict, load_threshold_high=80, load_threshold_low=40):
    latest_week = max([r['week'] for r in agg_data]) if agg_data else None
    if not latest_week:
        return []
    
    current_loads = [r for r in agg_data if r['week'] == latest_week]
    
    overloaded = defaultdict(list)  
    underloaded = defaultdict(list) 
    
    for record in current_loads:
        person = record['person_id']
        role = roles_dict.get(person, 'developer')
        load_pct = record['load_pct']
        
        if load_pct > load_threshold_high:
            overloaded[role].append({
                'person_id': person,
                'load_pct': load_pct,
                'excess': load_pct - load_threshold_high
            })
        elif load_pct < load_threshold_low:
            underloaded[role].append({
                'person_id': person,
                'load_pct': load_pct,
                'capacity': load_threshold_high - load_pct
            })
    
    recommendations = []
    
    for role in overloaded:
        overload_list = sorted(overloaded[role], key=lambda x: x['excess'], reverse=True)
        underload_list = sorted(underloaded[role], key=lambda x: x['capacity'], reverse=True)
        
        i, j = 0, 0
        while i < len(overload_list) and j < len(underload_list):
            overloaded_person = overload_list[i]
            underloaded_person = underload_list[j]
            
            transfer_amount = min(overloaded_person['excess'], underloaded_person['capacity'])
            
            recommendations.append({
                'from': overloaded_person['person_id'],
                'to': underloaded_person['person_id'],
                'role': role,
                'estimated_load_transfer': round(transfer_amount, 1),
                'reason': f"Перегруз {overloaded_person['load_pct']:.0f}% → недогруз {underloaded_person['load_pct']:.0f}%"
            })
            
            overload_list[i]['excess'] -= transfer_amount
            underload_list[j]['capacity'] -= transfer_amount
            
            if overload_list[i]['excess'] <= 0:
                i += 1
            if underload_list[j]['capacity'] <= 0:
                j += 1
    
    return recommendations

def team_score(agg_data, balance_metrics, help_network_stats, stagnation_threshold=0.3):

    latest_week = max([r['week'] for r in agg_data]) if agg_data else None
    if not latest_week:
        return 0
    
    loads = [r['load_pct'] for r in agg_data if r['week'] == latest_week]
    avg_load = np.mean(loads) if loads else 0
    if 60 <= avg_load <= 80:
        load_score = 100
    else:
        load_score = max(0, 100 - abs(avg_load - 70) * 2)
    
    cv = balance_metrics.get(latest_week, {}).get('coefficient_variation', 0)
    balance_score = max(0, 100 - cv * 150)
    
    persons_stagnant = set()
    total_persons = set()
    for r in agg_data:
        total_persons.add(r['person_id'])
        if r.get('is_stagnant', False):
            persons_stagnant.add(r['person_id'])
    
    stagnation_rate = len(persons_stagnant) / len(total_persons) if total_persons else 0
    stagnation_score = max(0, 100 - stagnation_rate * 150)
    
    total_people = len(total_persons)
    reviews_given = len(help_network_stats.get('reviews_by_reviewer', {}))
    reviews_rate = reviews_given / total_people if total_people > 0 else 0
    help_score = min(100, reviews_rate * 30)  
    
    weights = {
        'load': 0.25,
        'balance': 0.25,
        'stagnation': 0.30,
        'help': 0.20
    }
    
    final_score = (
        load_score * weights['load'] +
        balance_score * weights['balance'] +
        stagnation_score * weights['stagnation'] +
        help_score * weights['help']
    )
    
    return {
        'total_score': round(final_score, 1),
        'components': {
            'avg_load': round(avg_load, 1),
            'avg_load_score': round(load_score, 1),
            'balance_score': round(balance_score, 1),
            'stagnation_rate': round(stagnation_rate * 100, 1),
            'stagnation_score': round(stagnation_score, 1),
            'help_score': round(help_score, 1)
        },
        'weights': weights
    }

def build_team_analytics(roles_dict=None, slope_threshold=0.3, complexity_threshold=3.0, load_threshold_high=80, load_threshold_low=40):

    if roles_dict is None:
        roles_dict = {
            'u1': 'backend',
            'u2': 'backend',
            'u3': 'frontend',
            'u4': 'frontend',
            'u5': 'backend',
            'u6': 'analyst',
            'u7': 'analyst'
        }
    
    raw_data = get_events()
    aggregated = aggregate_person_week(raw_data)
    with_load = percent_of_load(aggregated)
    with_stagnation = stagnation(with_load, slope_threshold, complexity_threshold)
    balance = team_balance(with_stagnation)
    help_stats = help_network(raw_data)
    recommendations = balance_recommendations(with_stagnation, roles_dict, load_threshold_high, load_threshold_low)
    score = team_score(with_stagnation, balance, help_stats, slope_threshold)
    personal_metrics = {}
    for record in with_stagnation:
        person = record['person_id']
        week = record['week']
        
        if person not in personal_metrics:
            personal_metrics[person] = {
                'person_id': person,
                'role': roles_dict.get(person, 'developer'),
                'weekly_metrics': []
            }
        
        personal_metrics[person]['weekly_metrics'].append({
            'week': week,
            'load_pct': record['load_pct'],
            'load_meeting_hours_pct': record['load_meeting_hours'],
            'load_complexity_pct': record['load_total_complexity'],
            'task_closed_count': record['task_closed_count'],
            'mean_complexity': record['mean_complexity'],
            'commit_count': record['commit_count'],
            'meeting_hours': record['meeting_hours'],
            'review_count': record['review_count'],
            'trend_slope': record.get('trend_slope', 0),
            'is_stagnant': record.get('is_stagnant', False)
        })
        
        personal_metrics[person]['weekly_metrics'].sort(key=lambda x: x['week'])
    
    for person in personal_metrics:
        personal_metrics[person]['total_reviews_given'] = help_stats['reviews_by_reviewer'].get(person, 0)
        personal_metrics[person]['total_reviews_received'] = help_stats['reviews_received_by_author'].get(person, 0)

    result = {
        'team': {
            'total_members': len(personal_metrics),
            'score': score,
            'balance_by_week': balance,
            'latest_balance': balance.get(max(balance.keys()) if balance else None, {}),
            'recommendations': recommendations,
            'help_network': {
                'total_reviews': help_stats['total_reviews'],
                'most_helpful': help_stats['most_helpful'],
                'most_reviewed': help_stats['most_reviewed'],
                'help_connections': help_stats['help_connections'][:10] 
            }
        },
        'members': list(personal_metrics.values())
    }
    
    return result

