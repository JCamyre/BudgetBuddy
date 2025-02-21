import pytest
import pytest_asyncio
from fastapi.testclient import TestClient
from server.main import app
from server.routes.tracking import Expense, Income
from datetime import datetime, timezone
import json
from unittest.mock import patch

client = TestClient(app)

@pytest.fixture
def sample_expense():
    return {
        "amount": 50.00,
        "category": "Food",
        "description": "Grocery shopping",
        "date": datetime.now(timezone.utc).isoformat(),
        "user_id": "test-user-id"
    }

@pytest.fixture
def sample_income():
    return {
        "amount": 2000.00,
        "source": "Salary",
        "description": "Monthly salary payment",
        "date": datetime.now(timezone.utc).isoformat(),
        "user_id": "test-user-id"
    }

@pytest.mark.asyncio
async def test_add_expense():
    expense_data = {
        "amount": 50.00,
        "category": "Food",
        "description": "Grocery shopping",
        "date": datetime.now(timezone.utc).isoformat(),
        "user_id": "test-user-id"
    }
    
    response = client.post("/expenses/", json=expense_data)
    assert response.status_code == 200
    data = response.json()
    assert data["amount"] == 50.00
    assert data["category"] == "Food"
    assert "id" in data

@pytest.mark.asyncio
async def test_add_income():
    income_data = {
        "amount": 2000.00,
        "source": "Salary",
        "description": "Monthly salary payment",
        "date": datetime.now(timezone.utc).isoformat(),
        "user_id": "test-user-id"
    }
    
    response = client.post("/income/", json=income_data)
    assert response.status_code == 200
    data = response.json()
    assert data["amount"] == 2000.00
    assert data["source"] == "Salary"
    assert "id" in data

@pytest.mark.asyncio
async def test_get_expenses():
    # First add a test expense
    expense_data = {
        "amount": 50.00,
        "category": "Food",
        "description": "Grocery shopping",
        "date": datetime.now(timezone.utc).isoformat(),
        "user_id": "test-user-id"
    }
    client.post("/expenses/", json=expense_data)
    
    # Get expenses for the user
    response = client.get("/expenses/test-user-id")
    assert response.status_code == 200
    expenses = response.json()
    assert isinstance(expenses, list)
    assert len(expenses) > 0
    assert expenses[0]["category"] == "Food"

@pytest.mark.asyncio
async def test_get_income():
    # First add a test income
    income_data = {
        "amount": 2000.00,
        "source": "Salary",
        "description": "Monthly salary payment",
        "date": datetime.now(timezone.utc).isoformat(),
        "user_id": "test-user-id"
    }
    client.post("/income/", json=income_data)
    
    # Get income for the user
    response = client.get("/income/test-user-id")
    assert response.status_code == 200
    income_list = response.json()
    assert isinstance(income_list, list)
    assert len(income_list) > 0
    assert income_list[0]["source"] == "Salary"

@pytest.mark.asyncio
async def test_delete_expense():
    # First add a test expense
    expense_data = {
        "amount": 50.00,
        "category": "Food",
        "description": "Grocery shopping",
        "date": datetime.now(timezone.utc).isoformat(),
        "user_id": "test-user-id"
    }
    response = client.post("/expenses/", json=expense_data)
    expense_id = response.json()["id"]
    
    # Delete the expense
    response = client.delete(f"/expenses/{expense_id}")
    assert response.status_code == 200
    
    # Verify expense is deleted
    response = client.get("/expenses/test-user-id")
    expenses = response.json()
    assert not any(expense["id"] == expense_id for expense in expenses)

@pytest.mark.asyncio
async def test_delete_income():
    # First add a test income
    income_data = {
        "amount": 2000.00,
        "source": "Salary",
        "description": "Monthly salary payment",
        "date": datetime.now(timezone.utc).isoformat(),
        "user_id": "test-user-id"
    }
    response = client.post("/income/", json=income_data)
    income_id = response.json()["id"]
    
    # Delete the income
    response = client.delete(f"/income/{income_id}")
    assert response.status_code == 200
    
    # Verify income is deleted
    response = client.get("/income/test-user-id")
    income_list = response.json()
    assert not any(income["id"] == income_id for income in income_list)

def test_invalid_expense_data():
    invalid_expense = {
        "amount": -50.00,  # Negative amount should be invalid
        "category": "Food",
        "description": "Grocery shopping",
        "date": datetime.now(timezone.utc).isoformat(),
        "user_id": "test-user-id"
    }
    
    response = client.post("/expenses/", json=invalid_expense)
    assert response.status_code == 422  # Validation error

def test_invalid_income_data():
    invalid_income = {
        "amount": -2000.00,  # Negative amount should be invalid
        "source": "Salary",
        "description": "Monthly salary payment",
        "date": datetime.now(timezone.utc).isoformat(),
        "user_id": "test-user-id"
    }
    
    response = client.post("/income/", json=invalid_income)
    assert response.status_code == 422  # Validation error

@pytest.mark.asyncio
async def test_update_expense():
    # First add a test expense
    expense_data = {
        "amount": 50.00,
        "category": "Food",
        "description": "Grocery shopping",
        "date": datetime.now(timezone.utc).isoformat(),
        "user_id": "test-user-id"
    }
    response = client.post("/expenses/", json=expense_data)
    expense_id = response.json()["id"]
    
    # Update the expense
    updated_data = {
        "amount": 75.00,
        "category": "Food",
        "description": "Updated grocery shopping",
        "date": datetime.now(timezone.utc).isoformat(),
        "user_id": "test-user-id"
    }
    response = client.put(f"/expenses/{expense_id}", json=updated_data)
    assert response.status_code == 200
    updated_expense = response.json()
    assert updated_expense["amount"] == 75.00
    assert updated_expense["description"] == "Updated grocery shopping"

@pytest.mark.asyncio
async def test_update_income():
    # First add a test income
    income_data = {
        "amount": 2000.00,
        "source": "Salary",
        "description": "Monthly salary payment",
        "date": datetime.now(timezone.utc).isoformat(),
        "user_id": "test-user-id"
    }
    response = client.post("/income/", json=income_data)
    income_id = response.json()["id"]
    
    # Update the income
    updated_data = {
        "amount": 2500.00,
        "source": "Salary",
        "description": "Updated monthly salary",
        "date": datetime.now(timezone.utc).isoformat(),
        "user_id": "test-user-id"
    }
    response = client.put(f"/income/{income_id}", json=updated_data)
    assert response.status_code == 200
    updated_income = response.json()
    assert updated_income["amount"] == 2500.00
    assert updated_income["description"] == "Updated monthly salary"
