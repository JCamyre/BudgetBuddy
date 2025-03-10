from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
import os
from utils import ReceiptScanner, save_receipt_result
import together
from server.routes.users import get_current_user

router = APIRouter()

together_client = together.Client()

@router.post("/api/track-receipt")
async def create_photo_receipt(file: UploadFile = File(...)):
    # Save the uploaded file temporarily
    temp_file_path = f"temp_{file.filename}"
    
    try:
        contents = await file.read()
        current_user = await get_current_user(testing=True)
        user_id = current_user.id
        with open(temp_file_path, "wb") as f:
            f.write(contents)
        
        # Process the receipt
        scanner = ReceiptScanner()
        result = scanner.scan_receipt(temp_file_path)
        
        # Use an LLM to classify the receipt in a category
        response = together_client.chat.completions.create(
            model="deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free",
            messages=[
                {"role": "system", "content": """You are an expert in classifying receipts into categories.\
                    You will be given a parsed receipt (in form of a JSON object) and you will need to classify it into a category.\
                    The categories are: \
                    - Food\
                    - Entertainment\
                    - Shopping\
                    - Travel\
                    - Pets\
                    - Medical\
                    - Rent\
                    - Transportation\
                    - Other\
                    ***IMPORTANT FORMATTING INSTRUCTIONS***\
                    - Only respond with the category name, no other text\
                    - If the receipt cannot be classified into any of the categories, respond with "Other"\
                    """},
                {"role": "user", "content": result}
            ]
        )
        category = response.choices[0].message.content
        # Save the result to the database
        await save_receipt_result(result, user_id, category)
        
        return True
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Clean up the temporary file
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
