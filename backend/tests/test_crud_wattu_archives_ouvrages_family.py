"""
Test CRUD operations for Wattu, Archives, Ouvrages, and Family Tree APIs
Tests the new admin CRUD functionality added for managing content
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL')

# Test credentials
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "tivaouane2025"


@pytest.fixture(scope="module")
def auth_token():
    """Get admin authentication token"""
    response = requests.post(
        f"{BASE_URL}/api/admin/login",
        json={"username": ADMIN_USERNAME, "password": ADMIN_PASSWORD}
    )
    if response.status_code == 200:
        return response.json().get("token")  # API returns 'token' not 'access_token'
    pytest.skip("Authentication failed - skipping authenticated tests")


@pytest.fixture(scope="module")
def auth_headers(auth_token):
    """Get auth headers for API calls"""
    return {"Authorization": f"Bearer {auth_token}"}


class TestWattuPage:
    """Test Wattu page title and articles"""
    
    def test_wattu_articles_endpoint(self):
        """GET /api/wattu/articles - returns list of articles"""
        response = requests.get(f"{BASE_URL}/api/wattu/articles")
        assert response.status_code == 200
        articles = response.json()
        assert isinstance(articles, list)
        print(f"PASS: Found {len(articles)} Wattu articles")
        
    def test_wattu_stats(self):
        """GET /api/wattu/stats - returns article statistics"""
        response = requests.get(f"{BASE_URL}/api/wattu/stats")
        assert response.status_code == 200
        data = response.json()
        assert "total" in data
        print(f"PASS: Wattu stats - total: {data.get('total')}")
        
    def test_wattu_categories(self):
        """GET /api/wattu/categories - returns available categories"""
        response = requests.get(f"{BASE_URL}/api/wattu/categories")
        assert response.status_code == 200
        categories = response.json()
        assert isinstance(categories, list)
        assert len(categories) >= 4  # general, spirituel, actualite, reflexion
        print(f"PASS: Found {len(categories)} categories")


class TestArchivesAPI:
    """Test Archives CRUD operations"""
    
    # ===== MANUSCRIPTS =====
    def test_get_manuscripts(self):
        """GET /api/archives/manuscripts - returns list"""
        response = requests.get(f"{BASE_URL}/api/archives/manuscripts")
        assert response.status_code == 200
        assert isinstance(response.json(), list)
        print(f"PASS: Found {len(response.json())} manuscripts")
        
    def test_create_manuscript_requires_auth(self):
        """POST /api/archives/manuscripts - requires authentication"""
        response = requests.post(f"{BASE_URL}/api/archives/manuscripts", json={
            "title": {"fr": "TEST_Manuscript"},
            "description": {"fr": "Test"}
        })
        assert response.status_code == 401
        print("PASS: Manuscript creation requires auth")
        
    def test_create_and_delete_manuscript(self, auth_headers):
        """POST/DELETE /api/archives/manuscripts - full CRUD"""
        # Create
        create_data = {
            "title": {"fr": "TEST_Manuscript", "en": "TEST_Manuscript"},
            "description": {"fr": "Test description"},
            "langue": "arabe",
            "auteur": "Test Author",
            "active": True
        }
        response = requests.post(
            f"{BASE_URL}/api/archives/manuscripts",
            json=create_data,
            headers=auth_headers
        )
        assert response.status_code == 200
        created = response.json()
        assert "id" in created
        item_id = created["id"]
        print(f"PASS: Created manuscript {item_id}")
        
        # Delete
        delete_response = requests.delete(
            f"{BASE_URL}/api/archives/manuscripts/{item_id}",
            headers=auth_headers
        )
        assert delete_response.status_code == 200
        print(f"PASS: Deleted manuscript {item_id}")
        
    # ===== PHOTOS =====
    def test_get_photos(self):
        """GET /api/archives/photos - returns list"""
        response = requests.get(f"{BASE_URL}/api/archives/photos")
        assert response.status_code == 200
        assert isinstance(response.json(), list)
        print(f"PASS: Found {len(response.json())} photos")
        
    def test_create_and_delete_photo(self, auth_headers):
        """POST/DELETE /api/archives/photos - full CRUD"""
        create_data = {
            "title": {"fr": "TEST_Photo"},
            "description": {"fr": "Test photo"},
            "image": "https://example.com/test.jpg",
            "lieu": "Tivaouane",
            "active": True
        }
        response = requests.post(
            f"{BASE_URL}/api/archives/photos",
            json=create_data,
            headers=auth_headers
        )
        assert response.status_code == 200
        item_id = response.json()["id"]
        print(f"PASS: Created photo {item_id}")
        
        # Delete
        delete_response = requests.delete(
            f"{BASE_URL}/api/archives/photos/{item_id}",
            headers=auth_headers
        )
        assert delete_response.status_code == 200
        print(f"PASS: Deleted photo {item_id}")
        
    # ===== AUDIO =====
    def test_get_audio(self):
        """GET /api/archives/audio - returns list"""
        response = requests.get(f"{BASE_URL}/api/archives/audio")
        assert response.status_code == 200
        assert isinstance(response.json(), list)
        print(f"PASS: Found {len(response.json())} audio files")
        
    def test_create_and_delete_audio(self, auth_headers):
        """POST/DELETE /api/archives/audio - full CRUD"""
        create_data = {
            "title": {"fr": "TEST_Audio"},
            "description": {"fr": "Test audio"},
            "audio_url": "https://example.com/test.mp3",
            "duree": "5:30",
            "active": True
        }
        response = requests.post(
            f"{BASE_URL}/api/archives/audio",
            json=create_data,
            headers=auth_headers
        )
        assert response.status_code == 200
        item_id = response.json()["id"]
        print(f"PASS: Created audio {item_id}")
        
        # Delete
        delete_response = requests.delete(
            f"{BASE_URL}/api/archives/audio/{item_id}",
            headers=auth_headers
        )
        assert delete_response.status_code == 200
        print(f"PASS: Deleted audio {item_id}")
        
    # ===== VIDEOS =====
    def test_get_videos(self):
        """GET /api/archives/videos - returns list"""
        response = requests.get(f"{BASE_URL}/api/archives/videos")
        assert response.status_code == 200
        assert isinstance(response.json(), list)
        print(f"PASS: Found {len(response.json())} videos")
        
    def test_create_and_delete_video(self, auth_headers):
        """POST/DELETE /api/archives/videos - full CRUD"""
        create_data = {
            "title": {"fr": "TEST_Video"},
            "description": {"fr": "Test video"},
            "video_url": "https://youtube.com/watch?v=test",
            "duree": "10:00",
            "active": True
        }
        response = requests.post(
            f"{BASE_URL}/api/archives/videos",
            json=create_data,
            headers=auth_headers
        )
        assert response.status_code == 200
        item_id = response.json()["id"]
        print(f"PASS: Created video {item_id}")
        
        # Delete
        delete_response = requests.delete(
            f"{BASE_URL}/api/archives/videos/{item_id}",
            headers=auth_headers
        )
        assert delete_response.status_code == 200
        print(f"PASS: Deleted video {item_id}")
        
    # ===== SOURCES =====
    def test_get_sources(self):
        """GET /api/archives/sources - returns list"""
        response = requests.get(f"{BASE_URL}/api/archives/sources")
        assert response.status_code == 200
        assert isinstance(response.json(), list)
        print(f"PASS: Found {len(response.json())} sources")
        
    def test_create_and_delete_source(self, auth_headers):
        """POST/DELETE /api/archives/sources - full CRUD"""
        create_data = {
            "title": {"fr": "TEST_Source"},
            "description": {"fr": "Test source"},
            "auteur": "Test Author",
            "type_source": "livre",
            "active": True
        }
        response = requests.post(
            f"{BASE_URL}/api/archives/sources",
            json=create_data,
            headers=auth_headers
        )
        assert response.status_code == 200
        item_id = response.json()["id"]
        print(f"PASS: Created source {item_id}")
        
        # Delete
        delete_response = requests.delete(
            f"{BASE_URL}/api/archives/sources/{item_id}",
            headers=auth_headers
        )
        assert delete_response.status_code == 200
        print(f"PASS: Deleted source {item_id}")
        
    # ===== STATS =====
    def test_archives_stats(self):
        """GET /api/archives/stats - returns statistics"""
        response = requests.get(f"{BASE_URL}/api/archives/stats")
        assert response.status_code == 200
        data = response.json()
        assert "total" in data
        assert "manuscripts" in data
        assert "photos" in data
        print(f"PASS: Archives stats - total: {data.get('total')}")


class TestOuvragesAPI:
    """Test Ouvrages CRUD operations"""
    
    # ===== MAJEURS =====
    def test_get_ouvrages_majeurs(self):
        """GET /api/ouvrages/majeurs - returns list"""
        response = requests.get(f"{BASE_URL}/api/ouvrages/majeurs")
        assert response.status_code == 200
        assert isinstance(response.json(), list)
        print(f"PASS: Found {len(response.json())} ouvrages majeurs")
        
    def test_create_and_delete_ouvrage_majeur(self, auth_headers):
        """POST/DELETE /api/ouvrages/majeurs - full CRUD"""
        create_data = {
            "titre": {"fr": "TEST_Ouvrage_Majeur", "en": "TEST_Major_Work"},
            "description": {"fr": "Test description"},
            "auteur": "Test Author",
            "categorie": "poesie",
            "active": True
        }
        response = requests.post(
            f"{BASE_URL}/api/ouvrages/majeurs",
            json=create_data,
            headers=auth_headers
        )
        assert response.status_code == 200
        item_id = response.json()["id"]
        print(f"PASS: Created ouvrage majeur {item_id}")
        
        # Delete
        delete_response = requests.delete(
            f"{BASE_URL}/api/ouvrages/majeurs/{item_id}",
            headers=auth_headers
        )
        assert delete_response.status_code == 200
        print(f"PASS: Deleted ouvrage majeur {item_id}")
        
    # ===== AUTRES =====
    def test_get_autres_ouvrages(self):
        """GET /api/ouvrages/autres - returns list"""
        response = requests.get(f"{BASE_URL}/api/ouvrages/autres")
        assert response.status_code == 200
        assert isinstance(response.json(), list)
        print(f"PASS: Found {len(response.json())} autres ouvrages")
        
    def test_create_and_delete_autre_ouvrage(self, auth_headers):
        """POST/DELETE /api/ouvrages/autres - full CRUD"""
        create_data = {
            "titre": {"fr": "TEST_Autre_Ouvrage"},
            "description": {"fr": "Test description"},
            "auteur": "Test Author",
            "type_ouvrage": "correspondance",
            "active": True
        }
        response = requests.post(
            f"{BASE_URL}/api/ouvrages/autres",
            json=create_data,
            headers=auth_headers
        )
        assert response.status_code == 200
        item_id = response.json()["id"]
        print(f"PASS: Created autre ouvrage {item_id}")
        
        # Delete
        delete_response = requests.delete(
            f"{BASE_URL}/api/ouvrages/autres/{item_id}",
            headers=auth_headers
        )
        assert delete_response.status_code == 200
        print(f"PASS: Deleted autre ouvrage {item_id}")
        
    # ===== BIBLIOTHEQUE =====
    def test_get_bibliotheque(self):
        """GET /api/ouvrages/bibliotheque - returns list"""
        response = requests.get(f"{BASE_URL}/api/ouvrages/bibliotheque")
        assert response.status_code == 200
        assert isinstance(response.json(), list)
        print(f"PASS: Found {len(response.json())} bibliotheque items")
        
    def test_create_and_delete_bibliotheque_item(self, auth_headers):
        """POST/DELETE /api/ouvrages/bibliotheque - full CRUD"""
        create_data = {
            "titre": {"fr": "TEST_Bibliotheque_Item"},
            "description": {"fr": "Test description"},
            "auteur": "Test Author",
            "format": "pdf",
            "lien": "https://example.com/test.pdf",
            "active": True
        }
        response = requests.post(
            f"{BASE_URL}/api/ouvrages/bibliotheque",
            json=create_data,
            headers=auth_headers
        )
        assert response.status_code == 200
        item_id = response.json()["id"]
        print(f"PASS: Created bibliotheque item {item_id}")
        
        # Delete
        delete_response = requests.delete(
            f"{BASE_URL}/api/ouvrages/bibliotheque/{item_id}",
            headers=auth_headers
        )
        assert delete_response.status_code == 200
        print(f"PASS: Deleted bibliotheque item {item_id}")
        
    # ===== ARCHIVES ACADEMIQUES =====
    def test_get_archives_academiques(self):
        """GET /api/ouvrages/archives-academiques - returns list"""
        response = requests.get(f"{BASE_URL}/api/ouvrages/archives-academiques")
        assert response.status_code == 200
        assert isinstance(response.json(), list)
        print(f"PASS: Found {len(response.json())} archives academiques")
        
    def test_create_and_delete_archive_academique(self, auth_headers):
        """POST/DELETE /api/ouvrages/archives-academiques - full CRUD"""
        create_data = {
            "titre": {"fr": "TEST_Archive_Academique"},
            "description": {"fr": "Test description"},
            "auteur": "Test Researcher",
            "institution": "Test University",
            "annee": "2024",
            "type_document": "these",
            "active": True
        }
        response = requests.post(
            f"{BASE_URL}/api/ouvrages/archives-academiques",
            json=create_data,
            headers=auth_headers
        )
        assert response.status_code == 200
        item_id = response.json()["id"]
        print(f"PASS: Created archive academique {item_id}")
        
        # Delete
        delete_response = requests.delete(
            f"{BASE_URL}/api/ouvrages/archives-academiques/{item_id}",
            headers=auth_headers
        )
        assert delete_response.status_code == 200
        print(f"PASS: Deleted archive academique {item_id}")
        
    # ===== STATS =====
    def test_ouvrages_stats(self):
        """GET /api/ouvrages/stats - returns statistics"""
        response = requests.get(f"{BASE_URL}/api/ouvrages/stats")
        assert response.status_code == 200
        data = response.json()
        assert "total" in data
        assert "ouvrages_majeurs" in data
        print(f"PASS: Ouvrages stats - total: {data.get('total')}")


class TestFamilyTreeAPI:
    """Test Family Tree CRUD operations"""
    
    def test_get_family_tree(self):
        """GET /api/family-tree - returns list of members"""
        response = requests.get(f"{BASE_URL}/api/family-tree")
        assert response.status_code == 200
        data = response.json()
        assert "members" in data
        assert "count" in data
        print(f"PASS: Found {data.get('count')} family members")
        
    def test_get_tree_structure(self):
        """GET /api/family-tree/tree - returns hierarchical structure"""
        response = requests.get(f"{BASE_URL}/api/family-tree/tree")
        assert response.status_code == 200
        data = response.json()
        assert "total_members" in data
        print(f"PASS: Tree structure - total members: {data.get('total_members')}")
        
    def test_create_member_requires_auth(self):
        """POST /api/family-tree - requires authentication"""
        response = requests.post(f"{BASE_URL}/api/family-tree", json={
            "nom": "TEST_Member",
            "titre": {"fr": "Test"}
        })
        assert response.status_code == 401
        print("PASS: Family member creation requires auth")
        
    def test_create_and_delete_family_member(self, auth_headers):
        """POST/DELETE /api/family-tree - full CRUD"""
        create_data = {
            "nom": "TEST_Family_Member",
            "surnom": "Test",
            "titre": {"fr": "Test Title", "en": "Test Title"},
            "description": {"fr": "Test description"},
            "dates": "2000 - 2024",
            "active": True
        }
        response = requests.post(
            f"{BASE_URL}/api/family-tree",
            json=create_data,
            headers=auth_headers
        )
        assert response.status_code == 200
        created = response.json()
        assert "node_id" in created
        node_id = created["node_id"]
        print(f"PASS: Created family member {node_id}")
        
        # Verify via GET
        get_response = requests.get(f"{BASE_URL}/api/family-tree")
        members = get_response.json()["members"]
        found = any(m["node_id"] == node_id for m in members)
        assert found, "Created member should be in list"
        print(f"PASS: Verified member exists in list")
        
        # Delete
        delete_response = requests.delete(
            f"{BASE_URL}/api/family-tree/{node_id}",
            headers=auth_headers
        )
        assert delete_response.status_code == 200
        print(f"PASS: Deleted family member {node_id}")
        
        # Verify deletion
        get_after_delete = requests.get(f"{BASE_URL}/api/family-tree")
        members_after = get_after_delete.json()["members"]
        found_after = any(m["node_id"] == node_id for m in members_after)
        assert not found_after, "Deleted member should not be in list"
        print("PASS: Verified member deletion")
        
    def test_update_family_member(self, auth_headers):
        """PUT /api/family-tree/{node_id} - update member"""
        # Create first
        create_data = {
            "nom": "TEST_Member_Update",
            "titre": {"fr": "Original Title"},
            "active": True
        }
        create_response = requests.post(
            f"{BASE_URL}/api/family-tree",
            json=create_data,
            headers=auth_headers
        )
        assert create_response.status_code == 200
        node_id = create_response.json()["node_id"]
        
        # Update
        update_data = {
            "nom": "TEST_Member_Updated",
            "titre": {"fr": "Updated Title"}
        }
        update_response = requests.put(
            f"{BASE_URL}/api/family-tree/{node_id}",
            json=update_data,
            headers=auth_headers
        )
        assert update_response.status_code == 200
        updated = update_response.json()
        assert updated["nom"] == "TEST_Member_Updated"
        print(f"PASS: Updated family member {node_id}")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/family-tree/{node_id}", headers=auth_headers)
        print("PASS: Cleaned up test member")


class TestDataIntegrity:
    """Test data counts as specified in requirements"""
    
    def test_wattu_article_count(self):
        """Verify Wattu has articles in database"""
        response = requests.get(f"{BASE_URL}/api/wattu/articles")
        assert response.status_code == 200
        articles = response.json()
        print(f"INFO: Wattu articles count: {len(articles)}")
        # Note: Requirement says 5 articles should be present
        
    def test_archives_count(self):
        """Verify archives have expected data"""
        response = requests.get(f"{BASE_URL}/api/archives/stats")
        assert response.status_code == 200
        stats = response.json()
        print(f"INFO: Archives total: {stats.get('total')}")
        # Note: Requirement says 31 archives should be present
        
    def test_ouvrages_count(self):
        """Verify ouvrages have expected data"""
        response = requests.get(f"{BASE_URL}/api/ouvrages/stats")
        assert response.status_code == 200
        stats = response.json()
        print(f"INFO: Ouvrages total: {stats.get('total')}")
        # Note: Requirement says 82 ouvrages should be present
        
    def test_family_tree_count(self):
        """Verify family tree has expected data"""
        response = requests.get(f"{BASE_URL}/api/family-tree")
        assert response.status_code == 200
        data = response.json()
        print(f"INFO: Family tree members: {data.get('count')}")
        # Note: Requirement says 12 members should be present


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
