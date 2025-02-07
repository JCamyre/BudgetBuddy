from fastapi import FastAPI
from server.routes import expenses_router, goals_router
from supabase import create_client
import os
import dotenv

dotenv.load_dotenv()

app = FastAPI()

app.include_router(expenses_router)
app.include_router(goals_router)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/test_db")
async def test_db():
    supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
    data = supabase.table("expenses").select("*").execute()
    return data

@app.get("/items/{item_id}")
async def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}

@app.post("/items/")
async def create_item(item: dict):
    return item