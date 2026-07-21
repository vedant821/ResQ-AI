from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class SeverityLevel(str, Enum):
    CRITICAL = "Critical"
    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"


class IncidentStatus(str, Enum):
    PENDING = "Pending"
    ASSIGNED = "Assigned"
    IN_PROGRESS = "In Progress"
    RESOLVED = "Resolved"
    CLOSED = "Closed"


class IncidentType(str, Enum):
    ROAD_ACCIDENT = "Road Accident"
    FIRE = "Fire"
    FLOOD = "Flood"
    MEDICAL_EMERGENCY = "Medical Emergency"
    EARTHQUAKE = "Earthquake"
    BUILDING_COLLAPSE = "Building Collapse"
    GAS_LEAK = "Gas Leak"
    CHEMICAL_SPILL = "Chemical Spill"


class AIAnalysis(BaseModel):
    incident_type: str
    severity: SeverityLevel
    confidence: float
    confidence_percent: int
    first_aid: List[str]
    emergency_services: List[str]
    recommendations: List[str]
    priority_score: int


class IncidentCreate(BaseModel):
    title: str
    type: str
    description: str
    location: str
    contact_number: Optional[str] = None


class IncidentResponse(BaseModel):
    id: str
    title: str
    type: str
    description: str
    severity: str
    status: str
    location: str
    contact_number: Optional[str] = None
    reported_by: str
    reporter_name: str
    confidence: float
    priority_score: int
    image_url: Optional[str] = None
    analysis: Optional[AIAnalysis] = None
    created_at: str
    updated_at: str


class StatusUpdate(BaseModel):
    status: IncidentStatus


class UserLogin(BaseModel):
    email: str
    password: str


class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    phone: Optional[str] = None
    location: Optional[str] = None


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    phone: Optional[str] = None
    location: Optional[str] = None


class AnalyticsSummary(BaseModel):
    total_reports: int
    critical_reports: int
    resolved_reports: int
    pending_reports: int
    avg_response_time: str
    resolution_rate: float
