from fastapi import APIRouter, HTTPException
from database.store import get_user_by_email, add_user

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login")
async def login(data: dict):
    email = data.get("email", "").strip()
    password = data.get("password", "")
    user = get_user_by_email(email)
    if not user or user.get("password") != password:
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
    email = data.get("email", "").strip()
    password = data.get("password", "")
    name = data.get("name", "").strip()

    if not email or not password or not name:
        raise HTTPException(status_code=400, detail="name, email and password are required")

    existing = get_user_by_email(email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_row = {
        "name": name,
        "email": email,
        "password": password,
        "role": "citizen",
        "phone": data.get("phone") or None,
        "location": data.get("location") or None,
    }

    created = add_user(user_row)
    if not created:
        raise HTTPException(status_code=500, detail="Failed to create user profile")

    return {
        "id": created["id"],
        "name": created["name"],
        "email": created["email"],
        "role": created["role"],
        "phone": created.get("phone"),
        "location": created.get("location"),
    }


@router.post("/create-admin")
async def create_admin(data: dict):
    email = data.get("email", "").strip()
    password = data.get("password", "")
    name = data.get("name", "Admin Officer").strip()

    if not email or not password:
        raise HTTPException(status_code=400, detail="email and password are required")

    existing = get_user_by_email(email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_row = {
        "name": name,
        "email": email,
        "password": password,
        "role": "admin",
        "phone": data.get("phone") or None,
        "location": data.get("location") or None,
    }

    created = add_user(user_row)
    if not created:
        raise HTTPException(status_code=500, detail="Failed to create admin account")

    return {
        "id": created["id"],
        "name": created["name"],
        "email": created["email"],
        "role": created["role"],
        "message": "Admin account created successfully",
    }
