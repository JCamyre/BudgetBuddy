from fastapi import APIRouter, HTTPException, Depends, Response, Cookie, Request
from typing import Optional
import os
from datetime import datetime, timezone
import jwt
from fastapi.security import OAuth2PasswordBearer
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import APIKeyCookie
from utils.supabase_client import supabase_client
from server.schemas import User, UserCreate, UserLogin
router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
cookie_auth = APIKeyCookie(name="access_token", auto_error=False)

# users.py - Simplified validation endpoint
@router.get("/api/validate-session")
async def validate_session(access_token: Optional[str] = Cookie(default=None)):
    if not access_token:
        return {"valid": False}
    
    try:
        user = supabase_client.auth.get_user(access_token)
        return {"valid": True, "user": user.user}
    except:
        return {"valid": False}

@router.post("/api/users/register", response_model=User)
async def register_user(user: UserCreate):
    """
    Register a new user and return the user object.

    Args:
        user (UserCreate): The user information (email, password, full name) for registration.

    Returns:
        User: The newly registered user object.

    Raises:
        HTTPException: If registration fails due to existing email or other errors.
    """

    
    try:
        auth_response = supabase_client.auth.sign_up({
            "email": user.email,
            "password": user.password
        })
        
        user_data = {
            "id": auth_response.user.id,
            "email": user.email,
            "full_name": user.full_name,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        
        data = supabase_client.table("users").insert(user_data).execute()
        
        return User(**user_data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/api/users/login")
async def login_user(user: UserLogin, response: Response):
    """
    Authenticate a user and return the access token.

    Args:
        user (UserCreate): The user credentials (email and password) for authentication.
        response (Response): The response object to set the cookie.

    Returns:
        dict: A dictionary containing the access token and successful message.

    Raises:
        HTTPException: If the credentials are invalid or authentication fails.
    """

    
    try:
        auth_response = supabase_client.auth.sign_in_with_password({
            "email": user.email,
            "password": user.password
        })
        response.set_cookie(
            key="access_token", 
            value=auth_response.session.access_token, 
            httponly=True,  
            samesite='Lax'  
        )
        return{
            "access_token": auth_response.session.access_token,
            "message": "Login successful"
        }
        # print("Auth Response:", auth_response)
        # user_data = supabase.table("users").select("*").eq("id", auth_response.user.id).single().execute()
        # return {
        #     "access_token": auth_response.session.access_token,
        #     "token_type": "bearer",
        #     "user": user_data.data
        # }

    except Exception as e:
        print("Login Error:", str(e))
        raise HTTPException(status_code=401, detail="Invalid credentials")
async def get_current_user(access_token: str = Cookie(default=None), testing: bool = False):
    """
    Retrieve the current authenticated user.

    Args:
        access_token (str): The access token from the cookie.

    Returns:
        User: The current user object.
    """
    if testing:
        return {
            "id": "c4304cf3-d239-449f-986e-e879da77ae01",
            "email": "aryankaul31@gmail.com",
            "full_name": "Aryan Kaul"
        }

    if access_token is None:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

    # Verify the token with Supabase
    user = supabase_client.auth.get_user(access_token)
    if user is None:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    return user.user

# users.py
@router.post("/api/users/logout")
async def logout_user(response: Response):
    response.delete_cookie(
        key="access_token",
        httponly=True,
        samesite="Lax",
        domain="localhost",
        path="/"
    )
    return {"message": "Logout successful"}