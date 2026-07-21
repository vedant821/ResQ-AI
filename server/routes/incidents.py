from fastapi import APIRouter, HTTPException
from database.store import get_incidents, get_incident_by_id, add_incident, update_incident_status
from services.ai_service import analyze_incident
from services.notification_service import send_incident_email
from services.pdf_service import generate_incident_pdf_stream
from fastapi.responses import StreamingResponse
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


@router.get("/{incident_id}/pdf")
async def get_incident_pdf(incident_id: str):
    incident = get_incident_by_id(incident_id)
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    
    pdf_stream = generate_incident_pdf_stream(incident)
    return StreamingResponse(
        pdf_stream,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=ResQ-Report-{incident_id}.pdf"}
    )


@router.post("/")
async def create_incident(data: dict):
    # Run AI analysis
    analysis = analyze_incident(
        description=data.get("description", ""),
        selected_type=data.get("type"),
    )

    # Map AI classified type to actual dispatcher units autonomously
    dispatched_units = []
    incident_type = analysis["incident_type"]
    if incident_type in ["Road Accident", "Medical Emergency", "Fire", "Flood", "Earthquake", "Building Collapse", "Gas Leak", "Chemical Spill"]:
        dispatched_units.append("Ambulance")
    if incident_type in ["Fire", "Gas Leak", "Chemical Spill", "Building Collapse", "Earthquake"]:
        dispatched_units.append("Fire Truck")
    if incident_type in ["Road Accident", "Medical Emergency", "Fire", "Gas Leak", "Chemical Spill"]:
        dispatched_units.append("Police")
    if incident_type in ["Gas Leak", "Chemical Spill"]:
        dispatched_units.append("Hazmat")

    status = "Assigned" if dispatched_units else "Pending"

    incident = {
        "id": f"INC-{str(int(time.time()))[-6:]}",
        "title": data["title"],
        "type": incident_type,
        "description": data["description"],
        "severity": analysis["severity"],
        "status": status,
        "location": data.get("location", "Unknown"),
        "contact_number": data.get("contact_number"),
        "reported_by": data.get("reported_by", "unknown"),
        "reporter_name": data.get("reporter_name", "Anonymous"),
        "confidence": analysis["confidence"],
        "priority_score": analysis["priority_score"],
        "image_url": data.get("image_url"),  # Support base64 image strings
        "analysis": analysis,
        "dispatched_units": dispatched_units,
        "created_at": f"{time.strftime('%Y-%m-%dT%H:%M:%S')}Z",
        "updated_at": f"{time.strftime('%Y-%m-%dT%H:%M:%S')}Z",
    }

    add_incident(incident)
    
    # Trigger real-time email notification
    send_incident_email(incident)

    # Trigger Autonomous SMS dispatch simulation
    if dispatched_units:
        print(f"\n[AUTONOMOUS AI AGENT DISPATCH ALERT] Sent to reporter {data.get('reporter_name', 'Anonymous')} ({data.get('contact_number', 'N/A')}):")
        print(f"Update: ResQ AI Autonomous Agent has triaged this incident as '{status}'.")
        print(f"Automatically Dispatched: {', '.join(dispatched_units)} are en route to {data.get('location', 'Unknown')}.")
        print(f"=====================================\n")
    
    return incident


@router.patch("/{incident_id}/status")
async def change_status(incident_id: str, data: dict):
    new_status = data.get("status")
    if not new_status:
        raise HTTPException(status_code=400, detail="Status is required")

    valid_statuses = ["Pending", "Assigned", "In Progress", "Resolved", "Closed"]
    if new_status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")

    dispatched_units = data.get("dispatched_units", [])
    updated = update_incident_status(incident_id, new_status, dispatched_units)
    if not updated:
        raise HTTPException(status_code=404, detail="Incident not found")

    # Trigger SMS dispatch simulation
    if dispatched_units:
        print(f"\n[SMS DISPATCH ALERT] Sent to reporter {updated.get('reporter_name')} ({updated.get('contact_number')}):")
        print(f"Update: ResQ AI crew status is '{new_status}'. Dispatched units: {', '.join(dispatched_units)} are en route to {updated.get('location')}.")
        print(f"=====================================\n")

    return updated
