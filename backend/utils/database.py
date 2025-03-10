from utils.supabase_client import supabase_client

async def save_receipt_result(result, user_id, category):
    """
    Save the receipt scanning result to the Supabase database in the expenses table.
    
    Args:
        result: The processed receipt data from the receipt scanner
        user_id: The UUID of the user who owns this expense
        
    Returns:
        The response from the Supabase insert operation
    """
    try:
        # Format the receipt data to match the expenses table structure
        print(f"{result=}")
        expense_data = {
            "user_id": user_id,
            "amount": result.get("total_amount"),
            "category": category,
            # date will use the default CURRENT_TIMESTAMP if not provided
        }
        
        # Insert the data into the 'expenses' table
        response = supabase_client.table("expenses").insert(expense_data).execute()
        
        return response.data
    except Exception as e:
        # Log the error and re-raise it to be handled by the caller
        print(f"Error saving receipt to database: {str(e)}")
        raise e
