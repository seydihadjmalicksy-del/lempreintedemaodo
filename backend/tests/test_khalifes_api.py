"""
Test suite for Khalifes API endpoints
Tests P0 and P1 requirements:
- P0: Site name and copyright verification (via API)
- P1: GET /api/khalifes returns 11 khalifes with multilingual data
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://tivaouane-tariqa.preview.emergentagent.com')


class TestKhalifesAPI:
    """Test khalifes CRUD endpoints"""
    
    def test_get_khalifes_returns_11_entries(self):
        """P1: API GET /api/khalifes returns list of 11 khalifes"""
        response = requests.get(f"{BASE_URL}/api/khalifes")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert "khalifes" in data, "Response should contain 'khalifes' key"
        assert "count" in data, "Response should contain 'count' key"
        assert data["count"] == 11, f"Expected 11 khalifes, got {data['count']}"
        assert len(data["khalifes"]) == 11, f"Expected 11 khalifes in list, got {len(data['khalifes'])}"
    
    def test_khalifes_have_required_fields(self):
        """P1: Each khalife has required fields"""
        response = requests.get(f"{BASE_URL}/api/khalifes")
        assert response.status_code == 200
        
        data = response.json()
        required_fields = ["id", "name", "title", "period", "description", "contributions", "image", "order"]
        
        for khalife in data["khalifes"]:
            for field in required_fields:
                assert field in khalife, f"Khalife missing required field: {field}"
    
    def test_khalifes_multilingual_french(self):
        """P1: Khalifes have French translations"""
        response = requests.get(f"{BASE_URL}/api/khalifes")
        assert response.status_code == 200
        
        data = response.json()
        khalife = data["khalifes"][0]  # First khalife
        
        # Check French content exists
        assert "fr" in khalife["title"], "Title should have French translation"
        assert "fr" in khalife["description"], "Description should have French translation"
        assert "fr" in khalife["contributions"], "Contributions should have French translation"
        
        # Verify French content is not empty
        assert len(khalife["title"]["fr"]) > 0, "French title should not be empty"
        assert len(khalife["description"]["fr"]) > 0, "French description should not be empty"
    
    def test_khalifes_multilingual_english(self):
        """P1: Khalifes have English translations"""
        response = requests.get(f"{BASE_URL}/api/khalifes")
        assert response.status_code == 200
        
        data = response.json()
        khalife = data["khalifes"][0]  # First khalife
        
        # Check English content exists
        assert "en" in khalife["title"], "Title should have English translation"
        assert "en" in khalife["description"], "Description should have English translation"
        assert "en" in khalife["contributions"], "Contributions should have English translation"
        
        # Verify English content is not empty
        assert len(khalife["title"]["en"]) > 0, "English title should not be empty"
        assert len(khalife["description"]["en"]) > 0, "English description should not be empty"
    
    def test_khalifes_ordered_correctly(self):
        """P1: Khalifes are returned in correct order"""
        response = requests.get(f"{BASE_URL}/api/khalifes")
        assert response.status_code == 200
        
        data = response.json()
        orders = [k["order"] for k in data["khalifes"]]
        
        # Verify orders are sequential
        assert orders == sorted(orders), "Khalifes should be ordered by 'order' field"
    
    def test_current_khalife_endpoint(self):
        """P1: GET /api/khalifes/current returns the current khalife"""
        response = requests.get(f"{BASE_URL}/api/khalifes/current")
        assert response.status_code == 200
        
        data = response.json()
        assert data["current"] == True, "Current khalife should have current=True"
        assert "Serigne Babacar Sy Mansour" in data["name"], "Current khalife should be Serigne Babacar Sy Mansour"
    
    def test_get_single_khalife(self):
        """P1: GET /api/khalifes/{id} returns a single khalife"""
        # First get all khalifes to get an ID
        response = requests.get(f"{BASE_URL}/api/khalifes")
        assert response.status_code == 200
        
        khalife_id = response.json()["khalifes"][0]["id"]
        
        # Get single khalife
        response = requests.get(f"{BASE_URL}/api/khalifes/{khalife_id}")
        assert response.status_code == 200
        
        data = response.json()
        assert data["id"] == khalife_id, "Returned khalife should match requested ID"


class TestAPIHealth:
    """Test API health and basic endpoints"""
    
    def test_api_root(self):
        """API root endpoint returns welcome message"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        
        data = response.json()
        assert "message" in data, "Root should return a message"
    
    def test_videos_endpoint(self):
        """Videos endpoint is accessible"""
        response = requests.get(f"{BASE_URL}/api/videos")
        assert response.status_code == 200
    
    def test_events_endpoint(self):
        """Events endpoint is accessible"""
        response = requests.get(f"{BASE_URL}/api/events")
        assert response.status_code == 200
        
        data = response.json()
        assert "events" in data, "Response should contain 'events' key"
    
    def test_quotes_daily_endpoint(self):
        """Daily quote endpoint is accessible"""
        response = requests.get(f"{BASE_URL}/api/quotes/daily")
        # Can be 200 or None if no quotes
        assert response.status_code == 200


class TestExistingPages:
    """Test that existing pages still work"""
    
    def test_home_page_loads(self):
        """Home page loads successfully"""
        response = requests.get(f"{BASE_URL}/")
        assert response.status_code == 200
    
    def test_about_page_loads(self):
        """About page loads successfully"""
        response = requests.get(f"{BASE_URL}/about")
        assert response.status_code == 200
    
    def test_contact_page_loads(self):
        """Contact page loads successfully"""
        response = requests.get(f"{BASE_URL}/contact")
        assert response.status_code == 200
    
    def test_khalifes_page_loads(self):
        """Khalifes page loads successfully"""
        response = requests.get(f"{BASE_URL}/histoire/khalifes")
        assert response.status_code == 200


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
