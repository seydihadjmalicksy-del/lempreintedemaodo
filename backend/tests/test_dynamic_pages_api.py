"""
Test Dynamic Pages API endpoints
Tests the CRUD operations and public access for dynamic pages system
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "tivaouane2025"


class TestDynamicPagesPublicAPI:
    """Public API tests - no auth required"""
    
    def test_get_all_active_pages(self):
        """Test GET /api/dynamic-pages/ returns all active pages"""
        response = requests.get(f"{BASE_URL}/api/dynamic-pages/")
        assert response.status_code == 200
        
        data = response.json()
        assert "pages" in data
        assert isinstance(data["pages"], list)
        print(f"Found {len(data['pages'])} active dynamic pages")
    
    def test_get_page_by_slug_el_hadji_malick_sy(self):
        """Test GET /api/dynamic-pages/by-slug/histoire/el-hadji-malick-sy"""
        response = requests.get(f"{BASE_URL}/api/dynamic-pages/by-slug/histoire/el-hadji-malick-sy")
        assert response.status_code == 200
        
        data = response.json()
        assert data["slug"] == "histoire/el-hadji-malick-sy"
        assert "titre" in data
        assert "sections" in data
        print(f"El Hadji Malick Sy page has {len(data['sections'])} sections")
    
    def test_get_page_by_slug_origines(self):
        """Test GET /api/dynamic-pages/by-slug/histoire/origines"""
        response = requests.get(f"{BASE_URL}/api/dynamic-pages/by-slug/histoire/origines")
        assert response.status_code == 200
        
        data = response.json()
        assert data["slug"] == "histoire/origines"
        assert "titre" in data
        assert "fr" in data["titre"] or isinstance(data["titre"], str)
        print(f"Origines page loaded: {data['titre']}")
    
    def test_get_page_by_slug_maodo(self):
        """Test GET /api/dynamic-pages/by-slug/histoire/maodo"""
        response = requests.get(f"{BASE_URL}/api/dynamic-pages/by-slug/histoire/maodo")
        assert response.status_code == 200
        
        data = response.json()
        assert data["slug"] == "histoire/maodo"
        assert "titre" in data
        print(f"Maodo page loaded: {data['titre']}")
    
    def test_get_nonexistent_page_returns_404(self):
        """Test GET /api/dynamic-pages/by-slug/nonexistent returns 404"""
        response = requests.get(f"{BASE_URL}/api/dynamic-pages/by-slug/nonexistent/page")
        assert response.status_code == 404
    
    def test_get_menu_pages(self):
        """Test GET /api/dynamic-pages/menu returns menu structure"""
        response = requests.get(f"{BASE_URL}/api/dynamic-pages/menu")
        assert response.status_code == 200
        
        data = response.json()
        # Menu should have categories
        assert "histoire" in data or "enseignements" in data or "standalone" in data
        print(f"Menu categories: {list(data.keys())}")
    
    def test_get_pages_stats(self):
        """Test GET /api/dynamic-pages/stats returns statistics"""
        response = requests.get(f"{BASE_URL}/api/dynamic-pages/stats")
        assert response.status_code == 200
        
        data = response.json()
        assert "total" in data
        assert "active" in data
        print(f"Pages stats - Total: {data['total']}, Active: {data['active']}")


class TestWattuAPI:
    """Test Wattu (articles) API"""
    
    def test_get_wattu_articles(self):
        """Test GET /api/wattu/articles returns articles"""
        response = requests.get(f"{BASE_URL}/api/wattu/articles")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        if len(data) > 0:
            # Check first article structure
            article = data[0]
            assert "titre" in article
            assert "contenu" in article
            print(f"Found {len(data)} Wattu articles")
    
    def test_get_wattu_categories(self):
        """Test GET /api/wattu/categories returns categories"""
        response = requests.get(f"{BASE_URL}/api/wattu/categories")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        print(f"Found {len(data)} Wattu categories")


class TestContactAPI:
    """Test Contact form API"""
    
    def test_submit_contact_message(self):
        """Test POST /api/contact/messages creates a message"""
        payload = {
            "name": "TEST_Automated Test",
            "email": "test@example.com",
            "subject": "Test Subject",
            "message": "This is an automated test message"
        }
        
        response = requests.post(f"{BASE_URL}/api/contact/messages", json=payload)
        # Should succeed or return proper validation error
        assert response.status_code in [200, 201, 422]
        
        if response.status_code in [200, 201]:
            print("Contact message submitted successfully")


class TestAdminAuthentication:
    """Test Admin authentication endpoints"""
    
    def test_admin_login_success(self):
        """Test POST /api/admin/login with valid credentials"""
        payload = {
            "username": ADMIN_USERNAME,
            "password": ADMIN_PASSWORD
        }
        
        response = requests.post(f"{BASE_URL}/api/admin/login", json=payload)
        assert response.status_code == 200
        
        data = response.json()
        assert "token" in data
        assert "expires_at" in data
        print("Admin login successful")
        return data["token"]
    
    def test_admin_login_invalid_credentials(self):
        """Test POST /api/admin/login with invalid credentials"""
        payload = {
            "username": "wrong",
            "password": "wrong"
        }
        
        response = requests.post(f"{BASE_URL}/api/admin/login", json=payload)
        assert response.status_code == 401


class TestDynamicPagesAdminAPI:
    """Admin API tests - requires authentication"""
    
    @pytest.fixture
    def auth_token(self):
        """Get admin authentication token"""
        payload = {
            "username": ADMIN_USERNAME,
            "password": ADMIN_PASSWORD
        }
        response = requests.post(f"{BASE_URL}/api/admin/login", json=payload)
        if response.status_code == 200:
            return response.json()["token"]
        pytest.skip("Admin authentication failed")
    
    def test_get_all_pages_admin(self, auth_token):
        """Test GET /api/dynamic-pages/admin/all returns all pages including inactive"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.get(f"{BASE_URL}/api/dynamic-pages/admin/all", headers=headers)
        assert response.status_code == 200
        
        data = response.json()
        assert "pages" in data
        print(f"Admin view: {len(data['pages'])} total pages")
    
    def test_admin_all_pages_unauthorized(self):
        """Test GET /api/dynamic-pages/admin/all without auth returns 401/403"""
        response = requests.get(f"{BASE_URL}/api/dynamic-pages/admin/all")
        assert response.status_code in [401, 403]


class TestHealthCheck:
    """Test health check endpoints"""
    
    def test_health_endpoint(self):
        """Test GET /health returns healthy status"""
        response = requests.get(f"{BASE_URL}/health")
        assert response.status_code == 200
        
        data = response.json()
        assert "status" in data
        print(f"Health status: {data['status']}")
    
    def test_api_health_endpoint(self):
        """Test GET /api/health returns healthy status"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        
        data = response.json()
        assert "status" in data


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
