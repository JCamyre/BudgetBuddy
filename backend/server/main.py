from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from server.routes import expenses_router, goals_router, suggestions_router, budgets_router, users_router, tracking_router
from supabase import create_client
import os
import dotenv
from utils import ReceiptScanner

dotenv.load_dotenv()

app = FastAPI(swagger_ui_parameters={"withCredentials": True})

supabase_client = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))


app.add_middleware(
    CORSMiddleware,
     allow_origins=[
        "http://localhost:3000",
        "https://budget-buddy-eight-phi.vercel.app",
        "https://budgetbuddy-688497269708.us-west2.run.app"
    ],
    allow_credentials=True,  # Allow cookies/session authentication
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


# Include routers
app.include_router(expenses_router)
app.include_router(goals_router)
app.include_router(tracking_router)
app.include_router(users_router)
app.include_router(suggestions_router)
app.include_router(budgets_router)

@app.get("/health")
async def health():
    return {"message": "Health Check"}

# TODO: Update user's budget based on receipt
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