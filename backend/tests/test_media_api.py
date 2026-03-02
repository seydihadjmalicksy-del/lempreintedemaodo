"""
Media Management API Tests
Tests for the /api/media endpoints - file upload, tags, associations
"""
import pytest
import requests
import os
import io
import tempfile

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://maodo-shrine.preview.emergentagent.com').rstrip('/')
API_URL = f"{BASE_URL}/api"


class TestMediaStatsAPI:
    """Tests for /api/media/stats endpoint"""
    
    def test_get_media_stats(self):
        """GET /api/media/stats - should return statistics"""
        response = requests.get(f"{API_URL}/media/stats")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert "total" in data, "Response should have 'total' field"
        assert "by_type" in data, "Response should have 'by_type' field"
        assert "total_size_bytes" in data, "Response should have 'total_size_bytes' field"
        assert "total_size_mb" in data, "Response should have 'total_size_mb' field"
        assert "associations" in data, "Response should have 'associations' field"
        assert "tags" in data, "Response should have 'tags' field"
        
        # Verify by_type structure
        by_type = data["by_type"]
        assert "pdf" in by_type
        assert "image" in by_type
        assert "audio" in by_type
        assert "video" in by_type
        print(f"✓ Media stats: {data['total']} files, {data['tags']} tags")


class TestMediaPagesAPI:
    """Tests for /api/media/pages endpoint"""
    
    def test_get_available_pages(self):
        """GET /api/media/pages - should return list of available pages"""
        response = requests.get(f"{API_URL}/media/pages")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert isinstance(data, list), "Response should be a list"
        assert len(data) > 0, "Should have at least one available page"
        
        # Verify page structure
        first_page = data[0]
        assert "slug" in first_page, "Page should have 'slug' field"
        assert "name" in first_page, "Page should have 'name' field"
        
        # Check for expected pages
        slugs = [page["slug"] for page in data]
        assert "accueil" in slugs, "Should include 'accueil' page"
        assert "heritiers" in slugs, "Should include 'heritiers' page"
        assert "archives" in slugs, "Should include 'archives' page"
        print(f"✓ Available pages: {len(data)} pages returned")


class TestMediaTagsAPI:
    """Tests for /api/media/tags CRUD endpoints"""
    
    @pytest.fixture
    def auth_headers(self):
        """Get authentication token"""
        response = requests.post(f"{API_URL}/admin/login", json={
            "username": "admin",
            "password": "tivaouane2025"
        })
        if response.status_code != 200:
            pytest.skip("Authentication failed")
        token = response.json().get("token")
        return {"Authorization": f"Bearer {token}"}
    
    def test_get_tags(self):
        """GET /api/media/tags - should return list of tags"""
        response = requests.get(f"{API_URL}/media/tags")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert isinstance(data, list), "Response should be a list"
        
        if len(data) > 0:
            first_tag = data[0]
            assert "id" in first_tag, "Tag should have 'id' field"
            assert "name" in first_tag, "Tag should have 'name' field"
            assert "color" in first_tag, "Tag should have 'color' field"
        print(f"✓ Tags retrieved: {len(data)} tags")
    
    def test_create_tag_unauthenticated(self):
        """POST /api/media/tags - should require authentication"""
        response = requests.post(f"{API_URL}/media/tags", json={
            "name": "Test Tag",
            "color": "#FF0000"
        })
        assert response.status_code in [401, 403], f"Expected 401/403, got {response.status_code}"
        print("✓ Tag creation requires authentication")
    
    def test_create_and_delete_tag(self, auth_headers):
        """POST/DELETE /api/media/tags - full CRUD test"""
        # Create tag
        create_response = requests.post(f"{API_URL}/media/tags", 
            json={
                "name": "TEST_PyTestTag",
                "color": "#FF5733",
                "description": "Test tag for pytest"
            },
            headers=auth_headers
        )
        assert create_response.status_code == 200, f"Create failed: {create_response.status_code} - {create_response.text}"
        
        tag_data = create_response.json()
        assert tag_data["name"] == "TEST_PyTestTag"
        assert tag_data["color"] == "#FF5733"
        tag_id = tag_data["id"]
        print(f"✓ Tag created with id: {tag_id}")
        
        # Delete tag
        delete_response = requests.delete(f"{API_URL}/media/tags/{tag_id}", headers=auth_headers)
        assert delete_response.status_code == 200, f"Delete failed: {delete_response.status_code}"
        print(f"✓ Tag deleted successfully")
    
    def test_create_duplicate_tag_fails(self, auth_headers):
        """POST /api/media/tags - should fail for duplicate name"""
        # Get existing tags
        tags_response = requests.get(f"{API_URL}/media/tags")
        tags = tags_response.json()
        
        if len(tags) > 0:
            existing_name = tags[0]["name"]
            response = requests.post(f"{API_URL}/media/tags",
                json={"name": existing_name, "color": "#000000"},
                headers=auth_headers
            )
            assert response.status_code == 400, f"Should fail for duplicate, got {response.status_code}"
            print(f"✓ Duplicate tag creation correctly rejected")


class TestMediaFilesAPI:
    """Tests for /api/media/files endpoints"""
    
    @pytest.fixture
    def auth_headers(self):
        """Get authentication token"""
        response = requests.post(f"{API_URL}/admin/login", json={
            "username": "admin",
            "password": "tivaouane2025"
        })
        if response.status_code != 200:
            pytest.skip("Authentication failed")
        token = response.json().get("token")
        return {"Authorization": f"Bearer {token}"}
    
    def test_get_files_list(self):
        """GET /api/media/files - should return paginated files list"""
        response = requests.get(f"{API_URL}/media/files")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert "files" in data, "Response should have 'files' field"
        assert "total" in data, "Response should have 'total' field"
        assert "limit" in data, "Response should have 'limit' field"
        assert "skip" in data, "Response should have 'skip' field"
        
        assert isinstance(data["files"], list), "files should be a list"
        print(f"✓ Files list: {data['total']} total files")
    
    def test_get_files_with_type_filter(self):
        """GET /api/media/files?file_type=image - should filter by type"""
        response = requests.get(f"{API_URL}/media/files", params={"file_type": "image"})
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        for file in data["files"]:
            assert file["file_type"] == "image", f"Expected image type, got {file['file_type']}"
        print(f"✓ Type filter works: {len(data['files'])} images")
    
    def test_get_files_with_search(self):
        """GET /api/media/files?search=test - should filter by search"""
        response = requests.get(f"{API_URL}/media/files", params={"search": "test"})
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        print(f"✓ Search filter works")
    
    def test_upload_file_unauthenticated(self):
        """POST /api/media/upload - should require authentication"""
        # Create a simple test file
        files = {'file': ('test.txt', b'test content', 'text/plain')}
        response = requests.post(f"{API_URL}/media/upload", files=files)
        assert response.status_code in [401, 403], f"Expected 401/403, got {response.status_code}"
        print("✓ Upload requires authentication")
    
    def test_upload_and_delete_file(self, auth_headers):
        """POST /api/media/upload - upload and cleanup test file"""
        # Create a small PNG file (1x1 pixel transparent)
        png_data = bytes([
            0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,  # PNG signature
            0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,  # IHDR chunk
            0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
            0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4,
            0x89, 0x00, 0x00, 0x00, 0x0A, 0x49, 0x44, 0x41,
            0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
            0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00,
            0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE,
            0x42, 0x60, 0x82
        ])
        
        files = {'file': ('TEST_pytest_image.png', png_data, 'image/png')}
        data = {
            'title_fr': 'Test Image FR',
            'title_en': 'Test Image EN',
            'description_fr': 'Description FR',
            'description_en': 'Description EN',
            'tags': 'test,pytest'
        }
        
        # Upload
        response = requests.post(f"{API_URL}/media/upload", 
            files=files, 
            data=data,
            headers=auth_headers
        )
        assert response.status_code == 200, f"Upload failed: {response.status_code} - {response.text}"
        
        file_data = response.json()
        assert "id" in file_data
        assert "file_url" in file_data
        assert file_data["file_type"] == "image"
        file_id = file_data["id"]
        print(f"✓ File uploaded: {file_id}")
        
        # Get the file
        get_response = requests.get(f"{API_URL}/media/files/{file_id}")
        assert get_response.status_code == 200
        print(f"✓ File retrieved successfully")
        
        # Delete the file
        delete_response = requests.delete(f"{API_URL}/media/files/{file_id}", headers=auth_headers)
        assert delete_response.status_code == 200, f"Delete failed: {delete_response.status_code}"
        print(f"✓ File deleted successfully")
        
        # Verify deletion
        verify_response = requests.get(f"{API_URL}/media/files/{file_id}")
        assert verify_response.status_code == 404
        print(f"✓ File confirmed deleted")
    
    def test_upload_file_too_large(self, auth_headers):
        """POST /api/media/upload - should reject files > 10MB"""
        # Create file > 10MB (just test the headers say it's too large)
        large_data = b'x' * (11 * 1024 * 1024)  # 11 MB
        files = {'file': ('large.jpg', large_data, 'image/jpeg')}
        
        response = requests.post(f"{API_URL}/media/upload", 
            files=files, 
            headers=auth_headers
        )
        assert response.status_code == 400, f"Should reject large files, got {response.status_code}"
        print("✓ Large file correctly rejected")
    
    def test_upload_unsupported_file_type(self, auth_headers):
        """POST /api/media/upload - should reject unsupported file types"""
        files = {'file': ('test.exe', b'fake executable', 'application/x-msdownload')}
        
        response = requests.post(f"{API_URL}/media/upload", 
            files=files, 
            headers=auth_headers
        )
        assert response.status_code == 400, f"Should reject .exe files, got {response.status_code}"
        print("✓ Unsupported file type correctly rejected")


class TestMediaAssociationsAPI:
    """Tests for /api/media/associations endpoints"""
    
    @pytest.fixture
    def auth_headers(self):
        """Get authentication token"""
        response = requests.post(f"{API_URL}/admin/login", json={
            "username": "admin",
            "password": "tivaouane2025"
        })
        if response.status_code != 200:
            pytest.skip("Authentication failed")
        token = response.json().get("token")
        return {"Authorization": f"Bearer {token}"}
    
    @pytest.fixture
    def test_file(self, auth_headers):
        """Create a test file for association tests"""
        png_data = bytes([
            0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
            0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
            0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
            0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4,
            0x89, 0x00, 0x00, 0x00, 0x0A, 0x49, 0x44, 0x41,
            0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
            0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00,
            0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE,
            0x42, 0x60, 0x82
        ])
        
        files = {'file': ('TEST_assoc_image.png', png_data, 'image/png')}
        response = requests.post(f"{API_URL}/media/upload", 
            files=files, 
            headers=auth_headers
        )
        file_data = response.json()
        yield file_data
        
        # Cleanup
        requests.delete(f"{API_URL}/media/files/{file_data['id']}", headers=auth_headers)
    
    def test_create_association_unauthenticated(self):
        """POST /api/media/associations - should require auth"""
        response = requests.post(f"{API_URL}/media/associations", json={
            "media_id": "fake-id",
            "page_slug": "accueil"
        })
        assert response.status_code in [401, 403], f"Expected 401/403, got {response.status_code}"
        print("✓ Association creation requires authentication")
    
    def test_create_and_delete_association(self, auth_headers, test_file):
        """POST/DELETE /api/media/associations - full CRUD"""
        # Create association
        create_response = requests.post(f"{API_URL}/media/associations",
            json={
                "media_id": test_file["id"],
                "page_slug": "accueil",
                "section": "hero",
                "display_order": 0
            },
            headers=auth_headers
        )
        assert create_response.status_code == 200, f"Create failed: {create_response.status_code} - {create_response.text}"
        
        assoc_data = create_response.json()
        assert assoc_data["media_id"] == test_file["id"]
        assert assoc_data["page_slug"] == "accueil"
        assoc_id = assoc_data["id"]
        print(f"✓ Association created: {assoc_id}")
        
        # Delete association
        delete_response = requests.delete(f"{API_URL}/media/associations/{assoc_id}", headers=auth_headers)
        assert delete_response.status_code == 200
        print(f"✓ Association deleted")
    
    def test_create_duplicate_association_fails(self, auth_headers, test_file):
        """POST /api/media/associations - should reject duplicate"""
        # Create first association
        first_response = requests.post(f"{API_URL}/media/associations",
            json={
                "media_id": test_file["id"],
                "page_slug": "archives",
                "display_order": 0
            },
            headers=auth_headers
        )
        assert first_response.status_code == 200
        assoc_id = first_response.json()["id"]
        
        # Try to create duplicate
        second_response = requests.post(f"{API_URL}/media/associations",
            json={
                "media_id": test_file["id"],
                "page_slug": "archives",
                "display_order": 1
            },
            headers=auth_headers
        )
        assert second_response.status_code == 400, f"Should reject duplicate, got {second_response.status_code}"
        print("✓ Duplicate association correctly rejected")
        
        # Cleanup
        requests.delete(f"{API_URL}/media/associations/{assoc_id}", headers=auth_headers)
    
    def test_get_page_media(self):
        """GET /api/media/associations/page/{slug} - should return page media"""
        response = requests.get(f"{API_URL}/media/associations/page/accueil")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert "page_slug" in data
        assert "media_files" in data
        assert data["page_slug"] == "accueil"
        print(f"✓ Page media retrieved: {len(data['media_files'])} files for 'accueil'")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
