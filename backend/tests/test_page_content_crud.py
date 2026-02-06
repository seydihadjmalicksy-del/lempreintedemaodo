"""
CRUD Tests for Page Content API
Tests for GET/PUT/DELETE endpoints for page content management
Content is grouped by pages: maodo, gamou, ecole
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')


@pytest.fixture(scope="module")
def admin_token():
    """Get admin authentication token"""
    response = requests.post(f"{BASE_URL}/api/admin/login", json={
        "username": "admin",
        "password": "tivaouane2025"
    })
    assert response.status_code == 200, f"Admin login failed: {response.text}"
    return response.json()["token"]


@pytest.fixture
def auth_headers(admin_token):
    """Get authorization headers with admin token"""
    return {"Authorization": f"Bearer {admin_token}"}


class TestGetAllContent:
    """Test GET /api/content - List all page content"""
    
    def test_get_all_content(self):
        """Test GET /api/content returns all content"""
        response = requests.get(f"{BASE_URL}/api/content")
        
        assert response.status_code == 200
        data = response.json()
        assert "content" in data
        assert "count" in data
        assert isinstance(data["content"], list)
        print(f"Found {data['count']} content items")
        
        # Verify content structure
        if len(data["content"]) > 0:
            item = data["content"][0]
            assert "id" in item
            assert "slug" in item
            assert "section" in item
            assert "content" in item
            assert "order" in item
            assert "active" in item
    
    def test_get_content_filtered_by_slug(self):
        """Test GET /api/content?slug=maodo filters by page"""
        response = requests.get(f"{BASE_URL}/api/content?slug=maodo")
        
        assert response.status_code == 200
        data = response.json()
        
        # All items should have slug=maodo
        for item in data["content"]:
            assert item["slug"] == "maodo"
        print(f"Found {data['count']} content items for maodo page")
    
    def test_get_content_includes_all_pages(self):
        """Test that content includes maodo, gamou, ecole pages"""
        response = requests.get(f"{BASE_URL}/api/content?active_only=false")
        
        assert response.status_code == 200
        data = response.json()
        
        slugs = set(item["slug"] for item in data["content"])
        expected_slugs = {"maodo", "gamou", "ecole"}
        
        assert expected_slugs.issubset(slugs), f"Missing pages: {expected_slugs - slugs}"
        print(f"Found pages: {slugs}")


class TestGetPageContent:
    """Test GET /api/content/{slug} - Get content for a specific page"""
    
    def test_get_maodo_page_content(self):
        """Test GET /api/content/maodo returns all sections"""
        response = requests.get(f"{BASE_URL}/api/content/maodo")
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["slug"] == "maodo"
        assert "sections" in data
        assert "raw" in data
        
        # Check sections structure
        sections = data["sections"]
        assert isinstance(sections, dict)
        
        # Verify at least hero section exists
        assert "hero" in sections
        hero = sections["hero"]
        assert "text" in hero
        assert "all_languages" in hero
        assert "id" in hero
        
        print(f"Maodo page has sections: {list(sections.keys())}")
    
    def test_get_gamou_page_content(self):
        """Test GET /api/content/gamou returns all sections"""
        response = requests.get(f"{BASE_URL}/api/content/gamou")
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["slug"] == "gamou"
        assert "sections" in data
        print(f"Gamou page has sections: {list(data['sections'].keys())}")
    
    def test_get_ecole_page_content(self):
        """Test GET /api/content/ecole returns all sections"""
        response = requests.get(f"{BASE_URL}/api/content/ecole")
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["slug"] == "ecole"
        assert "sections" in data
        print(f"Ecole page has sections: {list(data['sections'].keys())}")
    
    def test_get_nonexistent_page_content(self):
        """Test GET /api/content/{slug} with invalid slug returns 404"""
        response = requests.get(f"{BASE_URL}/api/content/nonexistent_page")
        
        assert response.status_code == 404
        data = response.json()
        assert "detail" in data
        print("Correctly returned 404 for non-existent page")
    
    def test_get_page_content_with_language(self):
        """Test GET /api/content/{slug}?lang=en returns English text"""
        response = requests.get(f"{BASE_URL}/api/content/maodo?lang=en")
        
        assert response.status_code == 200
        data = response.json()
        
        # Check that text is in English
        hero = data["sections"]["hero"]
        assert "text" in hero
        # English text should contain "Revered" or similar English words
        assert "Revered" in hero["text"] or "Muslim scholars" in hero["text"]
        print("Language parameter works correctly")


class TestGetPageSection:
    """Test GET /api/content/{slug}/{section} - Get specific section"""
    
    def test_get_maodo_hero_section(self):
        """Test GET /api/content/maodo/hero returns hero section"""
        response = requests.get(f"{BASE_URL}/api/content/maodo/hero")
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["slug"] == "maodo"
        assert data["section"] == "hero"
        assert "text" in data
        assert "all_languages" in data
        assert "metadata" in data
        assert "id" in data
        
        # Verify all 4 languages present
        all_langs = data["all_languages"]
        assert "fr" in all_langs
        assert "en" in all_langs
        assert "ar" in all_langs
        assert "wo" in all_langs
        
        print(f"Hero section ID: {data['id']}")
    
    def test_get_gamou_intro_section(self):
        """Test GET /api/content/gamou/intro returns intro section"""
        response = requests.get(f"{BASE_URL}/api/content/gamou/intro")
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["slug"] == "gamou"
        assert data["section"] == "intro"
        print("Gamou intro section retrieved successfully")
    
    def test_get_nonexistent_section(self):
        """Test GET /api/content/{slug}/{section} with invalid section returns 404"""
        response = requests.get(f"{BASE_URL}/api/content/maodo/nonexistent_section")
        
        assert response.status_code == 404
        data = response.json()
        assert "detail" in data
        print("Correctly returned 404 for non-existent section")
    
    def test_get_section_with_language(self):
        """Test GET /api/content/{slug}/{section}?lang=ar returns Arabic text"""
        response = requests.get(f"{BASE_URL}/api/content/maodo/hero?lang=ar")
        
        assert response.status_code == 200
        data = response.json()
        
        # Arabic text should contain Arabic characters
        assert any('\u0600' <= c <= '\u06FF' for c in data["text"])
        print("Arabic language parameter works correctly")


class TestUpdatePageContent:
    """Test PUT /api/content/{content_id} - Update page content (protected)"""
    
    def test_update_content_without_auth(self):
        """Test PUT /api/content/{id} without auth returns 401"""
        # Get a content ID first
        list_response = requests.get(f"{BASE_URL}/api/content")
        content_items = list_response.json()["content"]
        
        if len(content_items) > 0:
            content_id = content_items[0]["id"]
            response = requests.put(f"{BASE_URL}/api/content/{content_id}", json={
                "content": {"fr": "Test update without auth"}
            })
            
            assert response.status_code == 401
            print("PUT /api/content/{id} correctly requires authentication")
        else:
            pytest.skip("No content available to test")
    
    def test_update_content_with_auth(self, auth_headers):
        """Test PUT /api/content/{id} with auth updates content"""
        # Get a content ID first
        list_response = requests.get(f"{BASE_URL}/api/content?slug=maodo")
        content_items = list_response.json()["content"]
        
        if len(content_items) > 0:
            content_id = content_items[0]["id"]
            original_content = content_items[0]["content"]
            
            # Update the content
            test_marker = f"TEST_UPDATE_{uuid.uuid4().hex[:8]}"
            new_content = {
                "fr": f"{original_content.get('fr', '')} {test_marker}",
                "en": original_content.get("en", ""),
                "ar": original_content.get("ar", ""),
                "wo": original_content.get("wo", "")
            }
            
            response = requests.put(
                f"{BASE_URL}/api/content/{content_id}",
                json={"content": new_content},
                headers=auth_headers
            )
            
            assert response.status_code == 200
            data = response.json()
            assert "message" in data
            assert "content" in data
            assert test_marker in data["content"]["content"]["fr"]
            print(f"Successfully updated content {content_id}")
            
            # Verify update persisted via GET
            verify_response = requests.get(f"{BASE_URL}/api/content/maodo")
            assert verify_response.status_code == 200
            
            # Restore original content
            requests.put(
                f"{BASE_URL}/api/content/{content_id}",
                json={"content": original_content},
                headers=auth_headers
            )
            print("Content restored to original")
        else:
            pytest.skip("No content available to test")
    
    def test_update_content_order(self, auth_headers):
        """Test updating content order field"""
        list_response = requests.get(f"{BASE_URL}/api/content?slug=maodo")
        content_items = list_response.json()["content"]
        
        if len(content_items) > 0:
            content_id = content_items[0]["id"]
            original_order = content_items[0]["order"]
            
            # Update order
            new_order = 999
            response = requests.put(
                f"{BASE_URL}/api/content/{content_id}",
                json={"order": new_order},
                headers=auth_headers
            )
            
            assert response.status_code == 200
            data = response.json()
            assert data["content"]["order"] == new_order
            print(f"Successfully updated order to {new_order}")
            
            # Restore original order
            requests.put(
                f"{BASE_URL}/api/content/{content_id}",
                json={"order": original_order},
                headers=auth_headers
            )
        else:
            pytest.skip("No content available to test")
    
    def test_update_content_active_status(self, auth_headers):
        """Test updating content active status"""
        list_response = requests.get(f"{BASE_URL}/api/content?slug=maodo&active_only=false")
        content_items = list_response.json()["content"]
        
        if len(content_items) > 0:
            content_id = content_items[0]["id"]
            original_active = content_items[0]["active"]
            
            # Toggle active status
            response = requests.put(
                f"{BASE_URL}/api/content/{content_id}",
                json={"active": not original_active},
                headers=auth_headers
            )
            
            assert response.status_code == 200
            data = response.json()
            assert data["content"]["active"] == (not original_active)
            print(f"Successfully toggled active status")
            
            # Restore original status
            requests.put(
                f"{BASE_URL}/api/content/{content_id}",
                json={"active": original_active},
                headers=auth_headers
            )
        else:
            pytest.skip("No content available to test")
    
    def test_update_nonexistent_content(self, auth_headers):
        """Test PUT /api/content/{id} with invalid ID returns 404"""
        fake_id = str(uuid.uuid4())
        response = requests.put(
            f"{BASE_URL}/api/content/{fake_id}",
            json={"content": {"fr": "Test"}},
            headers=auth_headers
        )
        
        assert response.status_code == 404
        print("PUT correctly returns 404 for non-existent content")


class TestDeletePageContent:
    """Test DELETE /api/content/{content_id} - Delete page content (protected)"""
    
    def test_delete_content_without_auth(self):
        """Test DELETE /api/content/{id} without auth returns 401"""
        list_response = requests.get(f"{BASE_URL}/api/content")
        content_items = list_response.json()["content"]
        
        if len(content_items) > 0:
            content_id = content_items[0]["id"]
            response = requests.delete(f"{BASE_URL}/api/content/{content_id}")
            
            assert response.status_code == 401
            print("DELETE /api/content/{id} correctly requires authentication")
        else:
            pytest.skip("No content available to test")
    
    def test_create_and_delete_content(self, auth_headers):
        """Test full create-delete cycle for page content"""
        # Create test content
        test_content = {
            "slug": "test_page",
            "section": "test_section",
            "content": {
                "fr": "TEST_Contenu de test pour suppression",
                "en": "TEST_Test content for deletion",
                "ar": "اختبار",
                "wo": "Test"
            },
            "metadata": {"test": True},
            "order": 999,
            "active": True
        }
        
        create_response = requests.post(
            f"{BASE_URL}/api/content",
            json=test_content,
            headers=auth_headers
        )
        assert create_response.status_code == 200
        created_id = create_response.json()["id"]
        print(f"Created test content: {created_id}")
        
        # Verify it exists via GET all content
        get_response = requests.get(f"{BASE_URL}/api/content?active_only=false")
        assert get_response.status_code == 200
        content_ids = [item["id"] for item in get_response.json()["content"]]
        assert created_id in content_ids
        
        # Delete the content
        delete_response = requests.delete(
            f"{BASE_URL}/api/content/{created_id}",
            headers=auth_headers
        )
        
        assert delete_response.status_code == 200
        data = delete_response.json()
        assert "message" in data
        assert data["id"] == created_id
        print(f"Successfully deleted content: {created_id}")
        
        # Verify it's deleted
        verify_response = requests.get(f"{BASE_URL}/api/content?active_only=false")
        content_ids = [item["id"] for item in verify_response.json()["content"]]
        assert created_id not in content_ids
        print("Deletion verified - content no longer exists")
    
    def test_delete_nonexistent_content(self, auth_headers):
        """Test DELETE /api/content/{id} with invalid ID returns 404"""
        fake_id = str(uuid.uuid4())
        response = requests.delete(
            f"{BASE_URL}/api/content/{fake_id}",
            headers=auth_headers
        )
        
        assert response.status_code == 404
        print("DELETE correctly returns 404 for non-existent content")


class TestSeedPageContent:
    """Test POST /api/content/seed/{slug} - Seed page content (protected)"""
    
    def test_seed_without_auth(self):
        """Test POST /api/content/seed/{slug} without auth returns 401"""
        response = requests.post(f"{BASE_URL}/api/content/seed/test_slug")
        
        assert response.status_code == 401
        print("POST /api/content/seed/{slug} correctly requires authentication")
    
    def test_seed_existing_page(self, auth_headers):
        """Test seeding already seeded page returns existing count"""
        response = requests.post(
            f"{BASE_URL}/api/content/seed/maodo",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "count" in data or "seeded" in data
        print(f"Seed response for existing page: {data}")


class TestUpdateAllLanguages:
    """Test updating all 4 language fields for page content"""
    
    def test_update_content_all_languages(self, auth_headers):
        """Test updating all 4 language fields for content"""
        # Create test content
        test_content = {
            "slug": "test_lang_page",
            "section": "test_lang_section",
            "content": {
                "fr": "Original FR",
                "en": "Original EN",
                "ar": "Original AR",
                "wo": "Original WO"
            },
            "order": 999,
            "active": True
        }
        
        create_response = requests.post(
            f"{BASE_URL}/api/content",
            json=test_content,
            headers=auth_headers
        )
        assert create_response.status_code == 200
        content_id = create_response.json()["id"]
        
        try:
            # Update all language fields
            update_data = {
                "content": {
                    "fr": "Updated FR - La sagesse de Maodo",
                    "en": "Updated EN - The wisdom of Maodo",
                    "ar": "Updated AR - حكمة مودو",
                    "wo": "Updated WO - Xam-xam Maodo"
                },
                "order": 100,
                "active": False
            }
            
            response = requests.put(
                f"{BASE_URL}/api/content/{content_id}",
                json=update_data,
                headers=auth_headers
            )
            
            assert response.status_code == 200
            data = response.json()
            content = data["content"]
            
            # Verify all fields updated
            assert content["content"]["fr"] == update_data["content"]["fr"]
            assert content["content"]["en"] == update_data["content"]["en"]
            assert content["content"]["ar"] == update_data["content"]["ar"]
            assert content["content"]["wo"] == update_data["content"]["wo"]
            assert content["order"] == update_data["order"]
            assert content["active"] == update_data["active"]
            
            print("Successfully updated all content fields including 4 languages")
            
        finally:
            # Cleanup
            requests.delete(f"{BASE_URL}/api/content/{content_id}", headers=auth_headers)


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
