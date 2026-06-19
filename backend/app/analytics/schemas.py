from typing import Optional

from pydantic import BaseModel


class ScoreComponents(BaseModel):
    avg_load: float
    avg_load_score: float
    balance_score: float
    stagnation_rate: float
    stagnation_score: float
    help_score: float


class TeamScore(BaseModel):
    total: float
    components: ScoreComponents


class MetricCard(BaseModel):
    value: str           
    label: str            
    source: str        
    note: str           
    tone: str            


class WorkloadCard(BaseModel):
    type: str      
    initials: str
    name: str
    load: str            
    warning: Optional[str] = None
    recommendation: Optional[str] = None


class ActionItem(BaseModel):
    text: str


class HelpPerson(BaseModel):
    name: str
    detail: str


class HelpSection(BaseModel):
    overloaded: list[HelpPerson]
    available: list[HelpPerson]
    reviewers: list[str]


class DashboardResponse(BaseModel):
    score: TeamScore
    metrics: list[MetricCard]
    workload: list[WorkloadCard]
    action_items: list[ActionItem]
    help: HelpSection
    ai_summary: str     
    generated_at: str
    llm_used: bool