"""
Data access layer — simple in-memory storage for the ResQ AI backend.
Removes the Supabase dependency and keeps users/incidents in memory for testing.
"""
from datetime import datetime, timezone

_users = [
    {
        "id": "1",
        "auth_id": "admin",
        "name": "Admin Officer",
        "email": "admin@demo.com",
        "password": "admin123",
        "role": "admin",
        "phone": "9999999999",
        "location": "Headquarters",
    },
    {
        "id": "2",
        "auth_id": "user2",
        "name": "Test Citizen",
        "email": "user@demo.com",
        "password": "user123",
        "role": "citizen",
        "phone": "8888888888",
        "location": "Test City",
    },
]

_incidents = []


def _now_iso():
    return datetime.now(timezone.utc).isoformat()


def get_users():
    return [user.copy() for user in _users]


def get_user_by_email(email: str):
    if not email:
        return None
    return next((user for user in _users if user["email"].lower() == email.lower()), None)


def get_user_by_auth_id(auth_id: str):
    if not auth_id:
        return None
    return next((user for user in _users if user["auth_id"] == auth_id), None)


def add_user(user_data: dict):
    next_id = str(int(_users[-1]["id"]) + 1) if _users else "1"
    new_user = {
        "id": next_id,
        "auth_id": user_data.get("auth_id") or f"user{next_id}",
        "name": user_data.get("name"),
        "email": user_data.get("email"),
        "password": user_data.get("password"),
        "role": user_data.get("role", "citizen"),
        "phone": user_data.get("phone"),
        "location": user_data.get("location"),
    }
    _users.append(new_user)
    return new_user


def update_user(user_id: str, updates: dict):
    user = next((u for u in _users if u["id"] == user_id), None)
    if not user:
        return None
    user.update(updates)
    return user


def get_incidents():
    return [incident.copy() for incident in _incidents]


def get_incident_by_id(incident_id: str):
    if not incident_id:
        return None
    return next((incident for incident in _incidents if incident["id"] == incident_id), None)


def add_incident(incident_data: dict):
    incident = incident_data.copy()
    if "created_at" not in incident:
        incident["created_at"] = _now_iso()
    if "updated_at" not in incident:
        incident["updated_at"] = _now_iso()
    _incidents.append(incident)
    return incident


def update_incident_status(incident_id: str, new_status: str, dispatched_units: list = None):
    incident = get_incident_by_id(incident_id)
    if not incident:
        return None
    incident["status"] = new_status
    incident["updated_at"] = _now_iso()
    if dispatched_units is not None:
        incident["dispatched_units"] = dispatched_units
    return incident
