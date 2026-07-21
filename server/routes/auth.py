from fastapi import APIRouter, HTTPException
from database.store import get_user_by_email, add_user, get_users

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login")
async def login(data: dict):
    user = get_user_by_email(data.get("email", ""))
    if not user or user["password"] != data.get("password", ""):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "role": user["role"],
        "phone": user.get("phone"),
        "location": user.get("location"),
    }


@router.post("/register")
async def register(data: dict):
    existing = get_user_by_email(data.get("email", ""))
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    import time
    new_user = {
        "id": f"citizen-{int(time.time())}",
        "name": data["name"],
        "email": data["email"],
        "password": data["password"],
        "role": "citizen",
        "phone": data.get("phone"),
        "location": data.get("location"),
    }
    add_user(new_user)

    return {
        "id": new_user["id"],
        "name": new_user["name"],
        "email": new_user["email"],
        "role": new_user["role"],
    }
