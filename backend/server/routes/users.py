from fastapi import APIRouter, HTTPException, Depends, Response, Cookie, Request
from typing import Optional
from pydantic import BaseModel, EmailStr
from supabase import create_client
import os
from datetime import datetime, timezone
import jwt
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import APIKeyCookie

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
cookie_auth = APIKeyCookie(name="access_token", auto_error=False)

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    """Model representing a user."""

    id: Optional[str] = None
    email: EmailStr
    full_name: str
    created_at: Optional[datetime] = None

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

    supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
    
    try:
        auth_response = supabase.auth.sign_in_with_password({
            "email": user.email,
            "password": user.password
        })
        response.set_cookie(
            key="access_token", 
            value=auth_response.session.access_token, 
            httponly=True,  # Prevent JavaScript access
            secure=True,    # Use HTTPS
            samesite='Lax'  # Adjust according to your needs
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
async def get_current_user(access_token: str = Cookie(default=None)):
    """
    Retrieve the current authenticated user.

    Args:
        access_token (str): The access token from the cookie.

    Returns:
        User: The current user object.
    """
    

    supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
    if access_token is None:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

    print("Current Token:", access_token)

    # Verify the token with Supabase
    user = supabase.auth.get_user(access_token)
    print("Current User:", user)
    if user is None:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    return user.user
