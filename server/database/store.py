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

INCIDENTS = []


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
