from fastapi import APIRouter, HTTPException
from database.store import get_incidents, get_incident_by_id, add_incident, update_incident_status
from services.ai_service import analyze_incident
import time

router = APIRouter(prefix="/api/incidents", tags=["incidents"])


@router.get("/")
async def list_incidents():
    return get_incidents()


@router.get("/{incident_id}")
async def get_incident(incident_id: str):
    incident = get_incident_by_id(incident_id)
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    return incident


@router.post("/")
async def create_incident(data: dict):
    # Run AI analysis
    analysis = analyze_incident(
        description=data.get("description", ""),
        selected_type=data.get("type"),
    )

    incident = {
        "id": f"INC-{str(int(time.time()))[-6:]}",
        "title": data["title"],
        "type": analysis["incident_type"],
        "description": data["description"],
        "severity": analysis["severity"],
        "status": "Pending",
        "location": data.get("location", "Unknown"),
        "contact_number": data.get("contact_number"),
        "reported_by": data.get("reported_by", "unknown"),
        "reporter_name": data.get("reporter_name", "Anonymous"),
        "confidence": analysis["confidence"],
        "priority_score": analysis["priority_score"],
        "image_url": None,
        "analysis": analysis,
        "created_at": f"{time.strftime('%Y-%m-%dT%H:%M:%S')}Z",
        "updated_at": f"{time.strftime('%Y-%m-%dT%H:%M:%S')}Z",
    }

    add_incident(incident)
    return incident


@router.patch("/{incident_id}/status")
async def change_status(incident_id: str, data: dict):
    new_status = data.get("status")
    if not new_status:
        raise HTTPException(status_code=400, detail="Status is required")

    valid_statuses = ["Pending", "Assigned", "In Progress", "Resolved", "Closed"]
    if new_status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")

    updated = update_incident_status(incident_id, new_status)
    if not updated:
        raise HTTPException(status_code=404, detail="Incident not found")

    return updated
