import os
import json
import re
import copy
from typing import Dict, List, Any, Optional
from dotenv import load_dotenv

try:
    from openai import OpenAI
except ImportError:
    OpenAI = None

load_dotenv()

def get_hf_token() -> Optional[str]:
    return os.environ.get('HF_TOKEN')

SYSTEM_PROMPT = """Ты ассистент тимлида. Тебе дают готовые метрики команды. 
Твоя задача — сформулировать на русском короткую человеческую рекомендацию на основе этих чисел. 
ЖЁСТКОЕ ПРАВИЛО: 
- НЕ придумывай и не меняй числа — используй ТОЛЬКО данные из запроса.
- НЕ добавляй аналитику, которой нет в данных.
- Если в данных нет рекомендаций — скажи, что всё в порядке.
- Формат: 2-3 предложения, по делу, без воды.
- Пиши на русском языке.
Пример хорошего ответа:
"Сотрудник A (backend) перегружен на 22% (загрузка 122%), а Сотрудник B (backend) недогружен (20%). Рекомендуется делегировать часть задач от A к B, чтобы выровнять загрузку."
"""

USER_PROMPT_TEMPLATE = """На основе данных ниже сформулируй короткую рекомендацию для тимлида (2-3 предложения, на русском):
{summary}
Важно: используй только цифры из данных. Ничего не додумывай."""

def prepare_llm_summary(analytics_result: Dict[str, Any]) -> Dict[str, Any]:

    recommendations = analytics_result.get('team', {}).get('recommendations', [])
    members = analytics_result.get('members', [])
    
    person_data = {}
    for member in members:
        person_id = member['person_id']
        if member['weekly_metrics']:
            latest = member['weekly_metrics'][-1]
            person_data[person_id] = {
                'role': member.get('role', 'unknown'),
                'load_pct': latest.get('load_pct', 0),
                'is_stagnant': latest.get('is_stagnant', False),
                'mean_complexity': latest.get('mean_complexity', 0)
            }
    
    all_ids = sorted(person_data.keys())
    id_to_letter = {person_id: chr(65 + i) for i, person_id in enumerate(all_ids)}
    
    summary_parts = []
    summary_parts.append("Сводка по загрузке команды и рекомендации по делегированию:")
    summary_parts.append("")
    
    if not recommendations:
        summary_parts.append("В данный момент рекомендации по делегированию отсутствуют. Все сотрудники находятся в зоне комфортной загрузки.")
        return {
            'text': "\n".join(summary_parts),
            'person_data': person_data,
            'id_to_letter': id_to_letter
        }
    
    for idx, rec in enumerate(recommendations, 1):
        from_id = rec.get('from')
        to_id = rec.get('to')
        role = rec.get('role', 'unknown')
        estimated_transfer = rec.get('estimated_load_transfer', 0)
        reason = rec.get('reason', '')
        
        from_data = person_data.get(from_id, {})
        to_data = person_data.get(to_id, {})
        
        from_letter = id_to_letter.get(from_id, f"Сотрудник {from_id}")
        to_letter = id_to_letter.get(to_id, f"Сотрудник {to_id}")
        
        from_load = from_data.get('load_pct', 0)
        to_load = to_data.get('load_pct', 0)
        from_role = from_data.get('role', role)
        to_role = to_data.get('role', role)
        from_stagnant = from_data.get('is_stagnant', False)
        to_stagnant = to_data.get('is_stagnant', False)
        
        pair_text = f"Рекомендация {idx}:\n"
        pair_text += f" Сотрудник {from_letter} ({from_role}): загрузка {from_load:.0f}%"
        
        if from_stagnant:
            pair_text += " (есть признаки стагнации)"
        if from_load > 100:
            pair_text += f" перегружен на {from_load - 100:.0f}%"
        pair_text += "\n"
        
        pair_text += f" Сотрудник {to_letter} ({to_role}): загрузка {to_load:.0f}%"
        if to_load < 40:
            pair_text += " имеет свободный ресурс"
        pair_text += "\n"
        
        pair_text += f" Рекомендация: делегировать часть задач от {from_letter} к {to_letter} "
        pair_text += f"(ориентировочный объём перераспределения: {estimated_transfer:.0f}% загрузки)"
        
        if reason:
            pair_text += f"\n Основание: {reason}"
        
        summary_parts.append(pair_text)
        summary_parts.append("")
    
    total_members = len(person_data)
    stagnant_count = sum(1 for d in person_data.values() if d.get('is_stagnant', False))
    avg_load = sum(d.get('load_pct', 0) for d in person_data.values()) / total_members if total_members > 0 else 0
    
    summary_parts.append("Общая статистика команды:")
    summary_parts.append(f" Всего сотрудников: {total_members}")
    summary_parts.append(f" Средняя загрузка: {avg_load:.0f}%")
    summary_parts.append(f" Сотрудников с признаками стагнации: {stagnant_count}")
    
    if total_members > 0:
        sorted_by_load = sorted(
            [(pid, data) for pid, data in person_data.items()],
            key=lambda x: x[1]['load_pct'],
            reverse=True
        )
        
        most_loaded = sorted_by_load[0] if sorted_by_load else None
        least_loaded = sorted_by_load[-1] if sorted_by_load else None
        
        if most_loaded and most_loaded[1]['load_pct'] > 80:
            letter = id_to_letter.get(most_loaded[0], most_loaded[0])
            summary_parts.append(f" Наиболее загружен: Сотрудник {letter} ({most_loaded[1]['load_pct']:.0f}%)")
        
        if least_loaded and least_loaded[1]['load_pct'] < 40:
            letter = id_to_letter.get(least_loaded[0], least_loaded[0])
            summary_parts.append(f" Наименее загружен: Сотрудник {letter} ({least_loaded[1]['load_pct']:.0f}%)")
    
    return {
        'text': "\n".join(summary_parts),
        'person_data': person_data,
        'id_to_letter': id_to_letter
    }

def generate_recommendation_text(
    summary_text: str,
    analytics_result: Optional[Dict[str, Any]] = None,
    id_to_letter: Optional[Dict[str, str]] = None,
    person_data: Optional[Dict[str, Any]] = None,
    hf_token: Optional[str] = None
) -> str:
    token = hf_token or get_hf_token()
    
    if not token or not OpenAI:
        if analytics_result and id_to_letter and person_data:
            return _generate_fallback_text_from_data(analytics_result, id_to_letter, person_data)
        return "В команде наблюдается дисбаланс загрузки. Рекомендуется перераспределить задачи."
    
    try:
        client = OpenAI(
            base_url="https://router.huggingface.co/v1",
            api_key=token
        )
        
        completion = client.chat.completions.create(
            model="Qwen/Qwen3-235B-A22B-Instruct-2507:novita",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": USER_PROMPT_TEMPLATE.format(summary=summary_text)}
            ],
            temperature=0.3,
            top_p=0.95,
            max_tokens=300
        )
        
        result = completion.choices[0].message.content.strip()
        if result:
            return result
    except Exception as e:
        print(f"[LLM] Ошибка: {e}")
    
    if analytics_result and id_to_letter and person_data:
        return _generate_fallback_text_from_data(analytics_result, id_to_letter, person_data)
    return "В команде наблюдается дисбаланс загрузки. Рекомендуется перераспределить задачи."


def _generate_fallback_text_from_data(
    analytics_result: Dict[str, Any],
    id_to_letter: Dict[str, str],
    person_data: Dict[str, Any]
) -> str:
    """Генерирует fallback-текст из структуры данных, а не из текста"""
    recommendations = analytics_result.get('team', {}).get('recommendations', [])
    
    if not recommendations:
        return "В данный момент рекомендации по делегированию отсутствуют."
    
    texts = []
    for rec in recommendations:
        from_id = rec.get('from')
        to_id = rec.get('to')
        role = rec.get('role', 'разработчик')
        transfer = rec.get('estimated_load_transfer', 0)
        
        from_letter = id_to_letter.get(from_id, from_id)
        to_letter = id_to_letter.get(to_id, to_id)
        from_load = person_data.get(from_id, {}).get('load_pct', 0)
        to_load = person_data.get(to_id, {}).get('load_pct', 0)
        
        if from_load > 100:
            texts.append(
                f"Сотрудник {from_letter} ({role}) перегружен на {from_load - 100:.0f}% "
                f"(загрузка {from_load:.0f}%), а Сотрудник {to_letter} ({role}) имеет свободный ресурс "
                f"(загрузка {to_load:.0f}%). Рекомендуется делегировать часть задач от {from_letter} к {to_letter}."
            )
        else:
            texts.append(
                f"Рекомендуется перераспределить задачи между Сотрудником {from_letter} и "
                f"Сотрудником {to_letter} для балансировки загрузки команды."
            )
    
    return " ".join(texts)

def enrich_with_llm(analytics_result: Dict[str, Any], hf_token: Optional[str] = None) -> Dict[str, Any]:
    enriched = copy.deepcopy(analytics_result)
    recommendations = enriched.get('team', {}).get('recommendations', [])
    if not recommendations:
        return enriched
    
    summary_data = prepare_llm_summary(analytics_result)
    summary_text = summary_data['text']
    id_to_letter = summary_data['id_to_letter']
    person_data = summary_data['person_data']
    
    llm_text = generate_recommendation_text(
        summary_text=summary_text,
        analytics_result=analytics_result,
        id_to_letter=id_to_letter,
        person_data=person_data,
        hf_token=hf_token
    )
    
    for rec in recommendations:
        rec['llm_text'] = llm_text
        rec['from_letter'] = id_to_letter.get(rec.get('from'), rec.get('from'))
        rec['to_letter'] = id_to_letter.get(rec.get('to'), rec.get('to'))
    
    return enriched





