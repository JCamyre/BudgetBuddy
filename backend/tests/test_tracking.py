import pytest
import pytest_asyncio
from fastapi.testclient import TestClient
from server.main import app
import json
from unittest.mock import patch
import os

client = TestClient(app)

@pytest.mark.asyncio
async def test_photo_receipt_upload():
    # Create a mock image file
    test_file_content = b"mock image content"
    test_filename = "test_receipt.jpg"
    
    # Mock the ReceiptScanner.scan_receipt method
    mock_result = {"amount": 42.99, "merchant": "Test Store"}
    with patch("server.routes.tracking.ReceiptScanner") as MockScanner:
        mock_scanner_instance = MockScanner.return_value
        mock_scanner_instance.scan_receipt.return_value = mock_result
        
        # Create test file and make request
        files = {"file": (test_filename, test_file_content, "image/jpeg")}
        response = client.post("/photo-receipts/", files=files)
        
        # Verify response
        assert response.status_code == 200
        assert response.json() == mock_result
        
        # Verify scanner was called
        mock_scanner_instance.scan_receipt.assert_called_once()
        
        # Verify temporary file was cleaned up
        temp_file = f"temp_{test_filename}"
        assert not os.path.exists(temp_file)

@pytest.mark.asyncio
async def test_photo_receipt_invalid_file():
    # Test with empty file
    files = {"file": ("empty.jpg", b"", "image/jpeg")}
    response = client.post("/photo-receipts/", files=files)
    assert response.status_code == 422  # FastAPI validates file is not empty
