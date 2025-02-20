from fastapi import APIRouter, HTTPException, Depends
from typing import Optional
from pydantic import BaseModel, EmailStr
from supabase import create_client
import os
from datetime import datetime, timezone
import jwt
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

router = APIRouter()

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    id: Optional[str] = None
    email: EmailStr
    full_name: str
    created_at: Optional[datetime] = None

@router.post("/api/users/register", response_model=User)
async def register_user(user: UserCreate):
    supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
    
    try:
        auth_response = supabase.auth.sign_up({
            "email": user.email,
            "password": user.password
        })
        
        user_data = {
            "id": auth_response.user.id,
            "email": user.email,
            "full_name": user.full_name,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        
        data = supabase.table("users").insert(user_data).execute()
        
        return User(**user_data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/api/users/login")
async def login_user(user: UserLogin):
    supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
    
    try:
        auth_response = supabase.auth.sign_in_with_password({
            "email": user.email,
            "password": user.password
        })
        print("Auth Response:", auth_response)
        user_data = supabase.table("users").select("*").eq("id", auth_response.user.id).single().execute()
        return {
            "access_token": auth_response.session.access_token,
            "token_type": "bearer",
            "user": user_data.data
        }
    except Exception as e:
        print("Login Error:", str(e))
        raise HTTPException(status_code=401, detail="Invalid credentials")
