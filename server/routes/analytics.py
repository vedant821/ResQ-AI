from fastapi import APIRouter
from database.store import get_incidents

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


@router.get("/summary")
async def get_summary():
    incidents = get_incidents()
    total = len(incidents)
    critical = sum(1 for i in incidents if i["severity"] == "Critical")
    resolved = sum(1 for i in incidents if i["status"] in ("Resolved", "Closed"))
    pending = sum(1 for i in incidents if i["status"] == "Pending")

    return {
        "total_reports": total,
        "critical_reports": critical,
        "resolved_reports": resolved,
        "pending_reports": pending,
        "avg_response_time": "12 min",
        "resolution_rate": round((resolved / total * 100) if total > 0 else 0, 1),
    }
