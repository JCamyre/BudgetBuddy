from fastapi import FastAPI, UploadFile, File
from server.routes import expenses_router, goals_router, tracking_router
from supabase import create_client
import os
import dotenv
from utils import ReceiptScanner

dotenv.load_dotenv()

app = FastAPI()

app.include_router(expenses_router)
app.include_router(goals_router)
app.include_router(tracking_router)

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

@app.post("/photo-receipts/")
async def create_photo_receipt(file: UploadFile = File(...)):
    # Save the uploaded file temporarily
    temp_file_path = f"temp_{file.filename}"
    try:
        contents = await file.read()
        with open(temp_file_path, "wb") as f:
            f.write(contents)
        
        # Process the receipt
        scanner = ReceiptScanner()
        result = scanner.scan_receipt(temp_file_path)
        
        return result
    finally:
        # Clean up the temporary file
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)