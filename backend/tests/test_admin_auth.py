"""
Admin Authentication API Tests
Tests for admin login, verify, logout endpoints
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestAdminAuthentication:
    """Admin authentication endpoint tests"""
    
    def test_admin_login_success(self):
        """Test successful admin login with correct credentials"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "username": "admin",
            "password": "tivaouane2025"
        })
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify response structure
        assert data.get("success") == True
        assert "token" in data
        assert "expires_at" in data
        assert data.get("username") == "admin"
        assert isinstance(data["token"], str)
        assert len(data["token"]) > 0
    
    def test_admin_login_wrong_password(self):
        """Test login with wrong password returns 401"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "username": "admin",
            "password": "wrongpassword"
        })
        
        assert response.status_code == 401
        data = response.json()
        assert "detail" in data
        assert "incorrect" in data["detail"].lower() or "identifiants" in data["detail"].lower()
    
    def test_admin_login_wrong_username(self):
        """Test login with wrong username returns 401"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "username": "wronguser",
            "password": "tivaouane2025"
        })
        
        assert response.status_code == 401
        data = response.json()
        assert "detail" in data
    
    def test_admin_verify_without_token(self):
        """Test verify endpoint without token returns 401"""
        response = requests.get(f"{BASE_URL}/api/admin/verify")
        
        assert response.status_code == 401
        data = response.json()
        assert "detail" in data
        assert "token" in data["detail"].lower() or "authentification" in data["detail"].lower()
    
    def test_admin_verify_with_invalid_token(self):
        """Test verify endpoint with invalid token returns 401"""
        response = requests.get(f"{BASE_URL}/api/admin/verify", headers={
            "Authorization": "Bearer invalid_token_12345"
        })
        
        assert response.status_code == 401
        data = response.json()
        assert "detail" in data
    
    def test_admin_verify_with_valid_token(self):
        """Test verify endpoint with valid token returns success"""
        # First login to get token
        login_response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "username": "admin",
            "password": "tivaouane2025"
        })
        assert login_response.status_code == 200
        token = login_response.json()["token"]
        
        # Verify with valid token
        response = requests.get(f"{BASE_URL}/api/admin/verify", headers={
            "Authorization": f"Bearer {token}"
        })
        
        assert response.status_code == 200
        data = response.json()
        assert data.get("valid") == True
    
    def test_admin_logout_success(self):
        """Test logout endpoint invalidates session"""
        # First login to get token
        login_response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "username": "admin",
            "password": "tivaouane2025"
        })
        assert login_response.status_code == 200
        token = login_response.json()["token"]
        
        # Logout
        logout_response = requests.post(f"{BASE_URL}/api/admin/logout", headers={
            "Authorization": f"Bearer {token}"
        })
        
        assert logout_response.status_code == 200
        data = logout_response.json()
        assert data.get("success") == True
        
        # Verify token is now invalid
        verify_response = requests.get(f"{BASE_URL}/api/admin/verify", headers={
            "Authorization": f"Bearer {token}"
        })
        
        assert verify_response.status_code == 401
    
    def test_admin_logout_without_token(self):
        """Test logout without token still returns success"""
        response = requests.post(f"{BASE_URL}/api/admin/logout")
        
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True


class TestAdminProtectedEndpoints:
    """Test admin-protected endpoints require authentication"""
    
    def test_notification_stats_requires_auth(self):
        """Test notification stats endpoint requires authentication"""
        response = requests.get(f"{BASE_URL}/api/notifications/stats")
        
        assert response.status_code == 401


class TestQuotesAndEventsAPI:
    """Test quotes and events endpoints (used by admin panel)"""
    
    def test_get_quotes(self):
        """Test getting quotes list"""
        response = requests.get(f"{BASE_URL}/api/quotes")
        
        assert response.status_code == 200
        data = response.json()
        assert "quotes" in data
        assert "count" in data
    
    def test_get_events(self):
        """Test getting events list"""
        response = requests.get(f"{BASE_URL}/api/events")
        
        assert response.status_code == 200
        data = response.json()
        assert "events" in data
        assert "count" in data
    
    def test_get_upcoming_events(self):
        """Test getting upcoming events"""
        response = requests.get(f"{BASE_URL}/api/events/upcoming")
        
        assert response.status_code == 200
        data = response.json()
        assert "events" in data
        assert "count" in data
    
    def test_get_daily_quote(self):
        """Test getting daily quote"""
        response = requests.get(f"{BASE_URL}/api/quotes/daily")
        
        # May return null if no quotes exist
        assert response.status_code == 200


class TestAdminSeedData:
    """Test admin seed data endpoint"""
    
    def test_seed_database(self):
        """Test seeding database with initial content"""
        response = requests.post(f"{BASE_URL}/api/admin/seed")
        
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        # Either seeded new data or data already exists
        assert "seeded" in data or "existing" in data


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
