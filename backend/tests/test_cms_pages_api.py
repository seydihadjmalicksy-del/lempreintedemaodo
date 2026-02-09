"""
Test CMS Pages API - CRUD operations for page content management
Tests: GET /api/pages, POST /api/content, PUT /api/content/{id}, DELETE /api/content/{id}
"""
import pytest
import requests
import os
import hashlib

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Admin credentials
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "tivaouane2025"


class TestCMSPagesAPI:
    """Test CMS Pages API endpoints"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup test fixtures"""
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})
        self.admin_token = None
        self.created_content_ids = []
    
    def get_admin_token(self):
        """Get admin authentication token"""
        if self.admin_token:
            return self.admin_token
        
        response = self.session.post(f"{BASE_URL}/api/admin/login", json={
            "username": ADMIN_USERNAME,
            "password": ADMIN_PASSWORD
        })
        
        if response.status_code == 200:
            self.admin_token = response.json().get("token")
            return self.admin_token
        return None
    
    def get_auth_headers(self):
        """Get headers with admin token"""
        token = self.get_admin_token()
        return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    
    # ===== GET /api/pages Tests =====
    
    def test_get_pages_returns_200(self):
        """Test GET /api/pages returns 200 status"""
        response = self.session.get(f"{BASE_URL}/api/pages")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        print(f"✓ GET /api/pages returns 200")
    
    def test_get_pages_returns_list(self):
        """Test GET /api/pages returns pages list with count"""
        response = self.session.get(f"{BASE_URL}/api/pages")
        assert response.status_code == 200
        
        data = response.json()
        assert "pages" in data, "Response should contain 'pages' key"
        assert "count" in data, "Response should contain 'count' key"
        assert isinstance(data["pages"], list), "Pages should be a list"
        print(f"✓ GET /api/pages returns {data['count']} pages")
    
    def test_get_pages_structure(self):
        """Test each page has required fields: slug, sections, section_count"""
        response = self.session.get(f"{BASE_URL}/api/pages")
        assert response.status_code == 200
        
        data = response.json()
        if data["count"] > 0:
            page = data["pages"][0]
            assert "slug" in page, "Page should have 'slug'"
            assert "sections" in page, "Page should have 'sections'"
            assert "section_count" in page, "Page should have 'section_count'"
            print(f"✓ Page structure valid: slug={page['slug']}, sections={page['section_count']}")
        else:
            print("⚠ No pages found to validate structure")
    
    def test_get_pages_sections_structure(self):
        """Test each section has required fields"""
        response = self.session.get(f"{BASE_URL}/api/pages")
        assert response.status_code == 200
        
        data = response.json()
        if data["count"] > 0 and len(data["pages"][0]["sections"]) > 0:
            section = data["pages"][0]["sections"][0]
            assert "id" in section, "Section should have 'id'"
            assert "section" in section, "Section should have 'section' name"
            assert "order" in section, "Section should have 'order'"
            print(f"✓ Section structure valid: {section['section']}")
        else:
            print("⚠ No sections found to validate structure")
    
    # ===== GET /api/content Tests =====
    
    def test_get_all_content_returns_200(self):
        """Test GET /api/content returns 200"""
        response = self.session.get(f"{BASE_URL}/api/content")
        assert response.status_code == 200
        
        data = response.json()
        assert "content" in data
        assert "count" in data
        print(f"✓ GET /api/content returns {data['count']} content items")
    
    def test_get_content_by_slug(self):
        """Test GET /api/content?slug=<slug> filters correctly"""
        # First get all pages
        pages_response = self.session.get(f"{BASE_URL}/api/pages")
        if pages_response.status_code == 200 and pages_response.json()["count"] > 0:
            slug = pages_response.json()["pages"][0]["slug"]
            
            response = self.session.get(f"{BASE_URL}/api/content?slug={slug}")
            assert response.status_code == 200
            
            data = response.json()
            for item in data["content"]:
                assert item["slug"] == slug, f"All content should have slug={slug}"
            print(f"✓ GET /api/content?slug={slug} filters correctly")
        else:
            print("⚠ No pages to test slug filter")
    
    # ===== POST /api/content Tests =====
    
    def test_create_content_requires_auth(self):
        """Test POST /api/content requires authentication"""
        new_content = {
            "slug": "test-page",
            "section": "test-section",
            "content": {"fr": "Test FR", "en": "Test EN", "ar": "", "wo": ""},
            "order": 0,
            "active": True
        }
        
        response = self.session.post(f"{BASE_URL}/api/content", json=new_content)
        assert response.status_code == 401, f"Expected 401 without auth, got {response.status_code}"
        print("✓ POST /api/content requires authentication")
    
    def test_create_content_success(self):
        """Test POST /api/content creates new section"""
        headers = self.get_auth_headers()
        
        new_content = {
            "slug": "test-cms-page",
            "section": "test-section-create",
            "content": {
                "fr": "Contenu de test en français",
                "en": "Test content in English",
                "ar": "محتوى الاختبار",
                "wo": "Test ci Wolof"
            },
            "metadata": {"type": "text"},
            "order": 99,
            "active": True
        }
        
        response = self.session.post(f"{BASE_URL}/api/content", json=new_content, headers=headers)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "id" in data, "Response should contain 'id'"
        assert "message" in data, "Response should contain 'message'"
        
        # Store for cleanup
        self.created_content_ids.append(data["id"])
        print(f"✓ POST /api/content created section with id={data['id']}")
        
        # Verify creation by GET
        verify_response = self.session.get(f"{BASE_URL}/api/content?slug=test-cms-page")
        assert verify_response.status_code == 200
        content_list = verify_response.json()["content"]
        created_item = next((c for c in content_list if c["id"] == data["id"]), None)
        assert created_item is not None, "Created content should be retrievable"
        assert created_item["content"]["fr"] == new_content["content"]["fr"]
        print("✓ Created content verified via GET")
    
    def test_create_duplicate_section_fails(self):
        """Test POST /api/content fails for duplicate slug+section"""
        headers = self.get_auth_headers()
        
        # Create first
        content1 = {
            "slug": "test-duplicate-page",
            "section": "duplicate-section",
            "content": {"fr": "First", "en": "First", "ar": "", "wo": ""},
            "order": 0,
            "active": True
        }
        
        response1 = self.session.post(f"{BASE_URL}/api/content", json=content1, headers=headers)
        if response1.status_code == 200:
            self.created_content_ids.append(response1.json()["id"])
        
        # Try to create duplicate
        response2 = self.session.post(f"{BASE_URL}/api/content", json=content1, headers=headers)
        assert response2.status_code == 400, f"Expected 400 for duplicate, got {response2.status_code}"
        print("✓ POST /api/content rejects duplicate slug+section")
    
    # ===== PUT /api/content/{id} Tests =====
    
    def test_update_content_requires_auth(self):
        """Test PUT /api/content/{id} requires authentication"""
        # First create content to update
        headers = self.get_auth_headers()
        new_content = {
            "slug": "test-update-page",
            "section": "update-test-section",
            "content": {"fr": "Original", "en": "Original", "ar": "", "wo": ""},
            "order": 0,
            "active": True
        }
        
        create_response = self.session.post(f"{BASE_URL}/api/content", json=new_content, headers=headers)
        if create_response.status_code == 200:
            content_id = create_response.json()["id"]
            self.created_content_ids.append(content_id)
            
            # Try update without auth
            update_response = self.session.put(f"{BASE_URL}/api/content/{content_id}", json={"content": {"fr": "Updated"}})
            assert update_response.status_code == 401, f"Expected 401 without auth, got {update_response.status_code}"
            print("✓ PUT /api/content/{id} requires authentication")
        else:
            pytest.skip("Could not create content for update test")
    
    def test_update_content_success(self):
        """Test PUT /api/content/{id} updates content"""
        headers = self.get_auth_headers()
        
        # Create content
        new_content = {
            "slug": "test-update-success",
            "section": "update-success-section",
            "content": {"fr": "Original FR", "en": "Original EN", "ar": "", "wo": ""},
            "order": 0,
            "active": True
        }
        
        create_response = self.session.post(f"{BASE_URL}/api/content", json=new_content, headers=headers)
        assert create_response.status_code == 200
        content_id = create_response.json()["id"]
        self.created_content_ids.append(content_id)
        
        # Update content
        update_data = {
            "content": {
                "fr": "Mis à jour FR",
                "en": "Updated EN",
                "ar": "تم التحديث",
                "wo": "Soppaliku"
            },
            "order": 5
        }
        
        update_response = self.session.put(f"{BASE_URL}/api/content/{content_id}", json=update_data, headers=headers)
        assert update_response.status_code == 200, f"Expected 200, got {update_response.status_code}"
        
        data = update_response.json()
        assert "content" in data, "Response should contain updated content"
        assert data["content"]["content"]["fr"] == "Mis à jour FR"
        print(f"✓ PUT /api/content/{content_id} updated successfully")
        
        # Verify update persisted
        verify_response = self.session.get(f"{BASE_URL}/api/content?slug=test-update-success")
        assert verify_response.status_code == 200
        updated_item = next((c for c in verify_response.json()["content"] if c["id"] == content_id), None)
        assert updated_item is not None
        assert updated_item["content"]["fr"] == "Mis à jour FR"
        assert updated_item["order"] == 5
        print("✓ Update verified via GET")
    
    def test_update_nonexistent_content_fails(self):
        """Test PUT /api/content/{id} fails for non-existent id"""
        headers = self.get_auth_headers()
        
        fake_id = "nonexistent-id-12345"
        response = self.session.put(f"{BASE_URL}/api/content/{fake_id}", json={"content": {"fr": "Test"}}, headers=headers)
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"
        print("✓ PUT /api/content/{id} returns 404 for non-existent id")
    
    # ===== DELETE /api/content/{id} Tests =====
    
    def test_delete_content_requires_auth(self):
        """Test DELETE /api/content/{id} requires authentication"""
        headers = self.get_auth_headers()
        
        # Create content to delete
        new_content = {
            "slug": "test-delete-auth",
            "section": "delete-auth-section",
            "content": {"fr": "To delete", "en": "To delete", "ar": "", "wo": ""},
            "order": 0,
            "active": True
        }
        
        create_response = self.session.post(f"{BASE_URL}/api/content", json=new_content, headers=headers)
        if create_response.status_code == 200:
            content_id = create_response.json()["id"]
            self.created_content_ids.append(content_id)
            
            # Try delete without auth
            delete_response = self.session.delete(f"{BASE_URL}/api/content/{content_id}")
            assert delete_response.status_code == 401, f"Expected 401 without auth, got {delete_response.status_code}"
            print("✓ DELETE /api/content/{id} requires authentication")
        else:
            pytest.skip("Could not create content for delete test")
    
    def test_delete_content_success(self):
        """Test DELETE /api/content/{id} deletes content"""
        headers = self.get_auth_headers()
        
        # Create content
        new_content = {
            "slug": "test-delete-success",
            "section": "delete-success-section",
            "content": {"fr": "To be deleted", "en": "To be deleted", "ar": "", "wo": ""},
            "order": 0,
            "active": True
        }
        
        create_response = self.session.post(f"{BASE_URL}/api/content", json=new_content, headers=headers)
        assert create_response.status_code == 200
        content_id = create_response.json()["id"]
        
        # Delete content
        delete_response = self.session.delete(f"{BASE_URL}/api/content/{content_id}", headers=headers)
        assert delete_response.status_code == 200, f"Expected 200, got {delete_response.status_code}"
        print(f"✓ DELETE /api/content/{content_id} successful")
        
        # Verify deletion
        verify_response = self.session.get(f"{BASE_URL}/api/content?slug=test-delete-success")
        assert verify_response.status_code == 200
        deleted_item = next((c for c in verify_response.json()["content"] if c["id"] == content_id), None)
        assert deleted_item is None, "Deleted content should not be retrievable"
        print("✓ Deletion verified - content no longer exists")
    
    def test_delete_nonexistent_content_fails(self):
        """Test DELETE /api/content/{id} fails for non-existent id"""
        headers = self.get_auth_headers()
        
        fake_id = "nonexistent-delete-id-12345"
        response = self.session.delete(f"{BASE_URL}/api/content/{fake_id}", headers=headers)
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"
        print("✓ DELETE /api/content/{id} returns 404 for non-existent id")
    
    # ===== Multilingual Content Tests =====
    
    def test_content_multilingual_support(self):
        """Test content supports all 4 languages: fr, en, ar, wo"""
        headers = self.get_auth_headers()
        
        multilingual_content = {
            "slug": "test-multilingual",
            "section": "multilingual-section",
            "content": {
                "fr": "Contenu en français",
                "en": "Content in English",
                "ar": "المحتوى بالعربية",
                "wo": "Contenu ci Wolof"
            },
            "metadata": {"type": "text"},
            "order": 0,
            "active": True
        }
        
        response = self.session.post(f"{BASE_URL}/api/content", json=multilingual_content, headers=headers)
        assert response.status_code == 200
        content_id = response.json()["id"]
        self.created_content_ids.append(content_id)
        
        # Verify all languages stored
        verify_response = self.session.get(f"{BASE_URL}/api/content?slug=test-multilingual")
        assert verify_response.status_code == 200
        
        content_item = next((c for c in verify_response.json()["content"] if c["id"] == content_id), None)
        assert content_item is not None
        assert content_item["content"]["fr"] == "Contenu en français"
        assert content_item["content"]["en"] == "Content in English"
        assert content_item["content"]["ar"] == "المحتوى بالعربية"
        assert content_item["content"]["wo"] == "Contenu ci Wolof"
        print("✓ Multilingual content (fr, en, ar, wo) stored correctly")
    
    # ===== Cleanup =====
    
    def teardown_method(self, method):
        """Cleanup created test content"""
        headers = self.get_auth_headers()
        for content_id in self.created_content_ids:
            try:
                self.session.delete(f"{BASE_URL}/api/content/{content_id}", headers=headers)
            except:
                pass


class TestExistingPagesContent:
    """Test existing pages have content"""
    
    def test_existing_pages_list(self):
        """Test that existing pages are returned"""
        response = requests.get(f"{BASE_URL}/api/pages")
        assert response.status_code == 200
        
        data = response.json()
        print(f"Found {data['count']} existing pages:")
        for page in data["pages"]:
            print(f"  - {page['slug']}: {page['section_count']} sections")
        
        # Expected pages based on context
        expected_slugs = ["ecole", "gamou", "geographie", "maodo", "origines", "ziarra"]
        found_slugs = [p["slug"] for p in data["pages"]]
        
        for slug in expected_slugs:
            if slug in found_slugs:
                print(f"✓ Page '{slug}' exists")
            else:
                print(f"⚠ Page '{slug}' not found")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
