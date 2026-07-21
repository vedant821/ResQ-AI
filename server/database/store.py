"""
In-memory data store with seed data for development.
"""
from datetime import datetime

USERS = [
    {
        "id": "admin-001",
        "name": "Admin Officer",
        "email": "admin@resqai.com",
        "password": "admin123",
        "role": "admin",
        "phone": "+91 9876543210",
    },
    {
        "id": "citizen-001",
        "name": "Rahul Sharma",
        "email": "rahul@gmail.com",
        "password": "user123",
        "role": "citizen",
        "phone": "+91 9876543211",
        "location": "Mumbai, Maharashtra",
    },
]

INCIDENTS = [
    {
        "id": "INC-001",
        "title": "Major Highway Pile-up on NH48",
        "type": "Road Accident",
        "description": "Multi-vehicle collision involving 5 cars and a truck near Toll Plaza. Multiple people injured.",
        "severity": "Critical",
        "status": "In Progress",
        "location": "NH48, Gurugram",
        "contact_number": "+91 9876543210",
        "reported_by": "citizen-001",
        "reporter_name": "Rahul Sharma",
        "confidence": 0.94,
        "priority_score": 1,
        "image_url": None,
        "analysis": None,
        "created_at": "2026-07-21T05:30:00Z",
        "updated_at": "2026-07-21T06:15:00Z",
    },
    {
        "id": "INC-002",
        "title": "Warehouse Fire in Industrial Area",
        "type": "Fire",
        "description": "Large fire engulfing a chemical storage warehouse. Heavy smoke visible from 2km.",
        "severity": "Critical",
        "status": "Assigned",
        "location": "MIDC Industrial Area, Pune",
        "contact_number": "+91 9876543211",
        "reported_by": "citizen-002",
        "reporter_name": "Priya Patel",
        "confidence": 0.91,
        "priority_score": 1,
        "image_url": None,
        "analysis": None,
        "created_at": "2026-07-21T04:45:00Z",
        "updated_at": "2026-07-21T05:00:00Z",
    },
]


def get_users():
    return USERS


def get_user_by_email(email: str):
    return next((u for u in USERS if u["email"] == email), None)


def add_user(user_data: dict):
    USERS.append(user_data)
    return user_data


def get_incidents():
    return INCIDENTS


def get_incident_by_id(incident_id: str):
    return next((i for i in INCIDENTS if i["id"] == incident_id), None)


def add_incident(incident_data: dict):
    INCIDENTS.insert(0, incident_data)
    return incident_data


def update_incident_status(incident_id: str, new_status: str):
    for inc in INCIDENTS:
        if inc["id"] == incident_id:
            inc["status"] = new_status
            inc["updated_at"] = datetime.utcnow().isoformat() + "Z"
            return inc
    return None
