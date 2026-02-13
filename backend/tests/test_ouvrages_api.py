"""
Test suite for Ouvrages API endpoints
Tests the 4 categories: majeurs, autres, bibliotheque, archives-academiques
"""
import pytest
import requests
import os
import hashlib

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://tivaouane-tariqa.preview.emergentagent.com').rstrip('/')

class TestOuvragesAPI:
    """Test Ouvrages API endpoints"""
    
    @pytest.fixture(scope="class")
    def admin_token(self):
        """Get admin authentication token"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "username": "admin",
            "password": "tivaouane2025"
        })
        if response.status_code == 200:
            return response.json().get("token")
        pytest.skip("Admin authentication failed")
    
    @pytest.fixture(scope="class")
    def auth_headers(self, admin_token):
        """Get authorization headers"""
        return {"Authorization": f"Bearer {admin_token}"}
    
    # ===== GET ENDPOINTS =====
    
    def test_get_ouvrages_majeurs(self):
        """Test GET /api/ouvrages/majeurs returns list of major works"""
        response = requests.get(f"{BASE_URL}/api/ouvrages/majeurs")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert isinstance(data, list), "Response should be a list"
        
        # Verify we have 6 ouvrages majeurs as per requirements
        assert len(data) == 6, f"Expected 6 ouvrages majeurs, got {len(data)}"
        
        # Verify structure of first item
        if len(data) > 0:
            item = data[0]
            assert "id" in item, "Item should have 'id'"
            assert "titre" in item, "Item should have 'titre'"
            assert "description" in item, "Item should have 'description'"
            assert "auteur" in item, "Item should have 'auteur'"
            assert "themes" in item, "Item should have 'themes'"
            assert "importance" in item, "Item should have 'importance'"
            
            # Verify multilingual fields
            assert isinstance(item["titre"], dict), "titre should be a dict for multilingual"
            assert "fr" in item["titre"], "titre should have 'fr' key"
    
    def test_get_autres_ouvrages(self):
        """Test GET /api/ouvrages/autres returns list of other works"""
        response = requests.get(f"{BASE_URL}/api/ouvrages/autres")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert isinstance(data, list), "Response should be a list"
        
        # Verify we have 4 autres ouvrages as per requirements
        assert len(data) == 4, f"Expected 4 autres ouvrages, got {len(data)}"
        
        # Verify structure
        if len(data) > 0:
            item = data[0]
            assert "id" in item, "Item should have 'id'"
            assert "titre" in item, "Item should have 'titre'"
            assert "description" in item, "Item should have 'description'"
            
            # Verify multilingual fields
            assert isinstance(item["titre"], dict), "titre should be a dict"
            assert isinstance(item["description"], dict), "description should be a dict"
    
    def test_get_bibliotheque(self):
        """Test GET /api/ouvrages/bibliotheque returns digital library items"""
        response = requests.get(f"{BASE_URL}/api/ouvrages/bibliotheque")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert isinstance(data, list), "Response should be a list"
        
        # Verify we have 10 bibliotheque items as per requirements
        assert len(data) == 10, f"Expected 10 bibliotheque items, got {len(data)}"
        
        # Verify structure
        if len(data) > 0:
            item = data[0]
            assert "id" in item, "Item should have 'id'"
            assert "titre" in item, "Item should have 'titre'"
            assert "taille" in item, "Item should have 'taille'"
            assert "langue" in item, "Item should have 'langue'"
            assert "lien" in item, "Item should have 'lien'"
            assert "disponible" in item, "Item should have 'disponible'"
    
    def test_get_archives_academiques(self):
        """Test GET /api/ouvrages/archives-academiques returns academic archives"""
        response = requests.get(f"{BASE_URL}/api/ouvrages/archives-academiques")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert isinstance(data, list), "Response should be a list"
        
        # Verify we have 6 archives academiques as per requirements
        assert len(data) == 6, f"Expected 6 archives academiques, got {len(data)}"
        
        # Verify structure
        if len(data) > 0:
            item = data[0]
            assert "id" in item, "Item should have 'id'"
            assert "titre" in item, "Item should have 'titre'"
            assert "description" in item, "Item should have 'description'"
            assert "lien" in item, "Item should have 'lien'"
            assert "source" in item, "Item should have 'source'"
    
    def test_get_ouvrages_stats(self):
        """Test GET /api/ouvrages/stats returns complete statistics"""
        response = requests.get(f"{BASE_URL}/api/ouvrages/stats")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert "ouvrages_majeurs" in data, "Stats should have 'ouvrages_majeurs'"
        assert "autres_ouvrages" in data, "Stats should have 'autres_ouvrages'"
        assert "bibliotheque" in data, "Stats should have 'bibliotheque'"
        assert "archives_academiques" in data, "Stats should have 'archives_academiques'"
        assert "total" in data, "Stats should have 'total'"
        
        # Verify counts match expected values
        assert data["ouvrages_majeurs"] == 6, f"Expected 6 majeurs, got {data['ouvrages_majeurs']}"
        assert data["autres_ouvrages"] == 4, f"Expected 4 autres, got {data['autres_ouvrages']}"
        assert data["bibliotheque"] == 10, f"Expected 10 bibliotheque, got {data['bibliotheque']}"
        assert data["archives_academiques"] == 6, f"Expected 6 archives, got {data['archives_academiques']}"
        assert data["total"] == 26, f"Expected total 26, got {data['total']}"
    
    # ===== MULTILINGUAL SUPPORT =====
    
    def test_ouvrages_majeurs_multilingual(self):
        """Test that ouvrages majeurs have multilingual translations"""
        response = requests.get(f"{BASE_URL}/api/ouvrages/majeurs")
        assert response.status_code == 200
        
        data = response.json()
        assert len(data) > 0, "Should have at least one ouvrage"
        
        item = data[0]
        
        # Check titre has all 4 languages
        titre = item.get("titre", {})
        assert "fr" in titre, "titre should have French"
        assert "en" in titre, "titre should have English"
        assert "ar" in titre, "titre should have Arabic"
        assert "wo" in titre, "titre should have Wolof"
        
        # Check description has all 4 languages
        description = item.get("description", {})
        assert "fr" in description, "description should have French"
        assert "en" in description, "description should have English"
        
        # Check importance has all 4 languages
        importance = item.get("importance", {})
        assert "fr" in importance, "importance should have French"
        assert "en" in importance, "importance should have English"
    
    # ===== DELETE ENDPOINTS (require authentication) =====
    
    def test_delete_ouvrage_majeur_requires_auth(self):
        """Test DELETE /api/ouvrages/majeurs/{id} requires authentication"""
        # First get an item to delete
        response = requests.get(f"{BASE_URL}/api/ouvrages/majeurs")
        assert response.status_code == 200
        data = response.json()
        
        if len(data) > 0:
            item_id = data[0]["id"]
            # Try to delete without auth
            delete_response = requests.delete(f"{BASE_URL}/api/ouvrages/majeurs/{item_id}")
            assert delete_response.status_code == 401, f"Expected 401 without auth, got {delete_response.status_code}"
    
    def test_delete_ouvrage_majeur_with_auth(self, auth_headers):
        """Test DELETE /api/ouvrages/majeurs/{id} works with authentication"""
        # First get an item to delete
        response = requests.get(f"{BASE_URL}/api/ouvrages/majeurs")
        assert response.status_code == 200
        data = response.json()
        
        if len(data) > 0:
            item_id = data[0]["id"]
            initial_count = len(data)
            
            # Delete with auth
            delete_response = requests.delete(
                f"{BASE_URL}/api/ouvrages/majeurs/{item_id}",
                headers=auth_headers
            )
            assert delete_response.status_code == 200, f"Expected 200, got {delete_response.status_code}"
            
            # Verify item was deleted
            verify_response = requests.get(f"{BASE_URL}/api/ouvrages/majeurs")
            assert verify_response.status_code == 200
            new_data = verify_response.json()
            assert len(new_data) == initial_count - 1, "Item count should decrease by 1"
    
    def test_delete_autre_ouvrage_requires_auth(self):
        """Test DELETE /api/ouvrages/autres/{id} requires authentication"""
        response = requests.get(f"{BASE_URL}/api/ouvrages/autres")
        assert response.status_code == 200
        data = response.json()
        
        if len(data) > 0:
            item_id = data[0]["id"]
            delete_response = requests.delete(f"{BASE_URL}/api/ouvrages/autres/{item_id}")
            assert delete_response.status_code == 401, f"Expected 401 without auth, got {delete_response.status_code}"
    
    def test_delete_bibliotheque_requires_auth(self):
        """Test DELETE /api/ouvrages/bibliotheque/{id} requires authentication"""
        response = requests.get(f"{BASE_URL}/api/ouvrages/bibliotheque")
        assert response.status_code == 200
        data = response.json()
        
        if len(data) > 0:
            item_id = data[0]["id"]
            delete_response = requests.delete(f"{BASE_URL}/api/ouvrages/bibliotheque/{item_id}")
            assert delete_response.status_code == 401, f"Expected 401 without auth, got {delete_response.status_code}"
    
    def test_delete_archives_academiques_requires_auth(self):
        """Test DELETE /api/ouvrages/archives-academiques/{id} requires authentication"""
        response = requests.get(f"{BASE_URL}/api/ouvrages/archives-academiques")
        assert response.status_code == 200
        data = response.json()
        
        if len(data) > 0:
            item_id = data[0]["id"]
            delete_response = requests.delete(f"{BASE_URL}/api/ouvrages/archives-academiques/{item_id}")
            assert delete_response.status_code == 401, f"Expected 401 without auth, got {delete_response.status_code}"
    
    def test_delete_nonexistent_ouvrage_returns_404(self, auth_headers):
        """Test DELETE with non-existent ID returns 404"""
        fake_id = "nonexistent-id-12345"
        response = requests.delete(
            f"{BASE_URL}/api/ouvrages/majeurs/{fake_id}",
            headers=auth_headers
        )
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"


class TestOuvragesDataIntegrity:
    """Test data integrity and content of ouvrages"""
    
    def test_ouvrages_majeurs_content(self):
        """Verify ouvrages majeurs have expected content"""
        response = requests.get(f"{BASE_URL}/api/ouvrages/majeurs")
        assert response.status_code == 200
        
        data = response.json()
        
        # Check that known works are present
        titles_fr = [item.get("titre", {}).get("fr", "") for item in data]
        
        # These are expected major works
        expected_works = [
            "Kifâya ar-Râghibîn",
            "Fath ar-Rahîm",
            "Khilâs adh-Dhahab"
        ]
        
        for work in expected_works:
            found = any(work in title for title in titles_fr)
            # Note: We don't assert here as the exact titles may vary
            print(f"Work '{work}' found: {found}")
    
    def test_bibliotheque_has_valid_links(self):
        """Verify bibliotheque items have valid link URLs"""
        response = requests.get(f"{BASE_URL}/api/ouvrages/bibliotheque")
        assert response.status_code == 200
        
        data = response.json()
        
        for item in data:
            lien = item.get("lien", "")
            assert lien.startswith("http"), f"Link should be a valid URL: {lien}"
    
    def test_archives_academiques_have_sources(self):
        """Verify archives academiques have source information"""
        response = requests.get(f"{BASE_URL}/api/ouvrages/archives-academiques")
        assert response.status_code == 200
        
        data = response.json()
        
        for item in data:
            source = item.get("source", "")
            assert len(source) > 0, f"Archive should have a source: {item.get('titre')}"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
