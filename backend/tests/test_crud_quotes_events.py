"""
CRUD Tests for Quotes and Events API
Tests for PUT/DELETE endpoints (protected by admin authentication)
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


class TestQuotesCRUD:
    """Test Quotes CRUD operations (PUT/DELETE require auth)"""
    
    def test_get_all_quotes(self):
        """Test GET /api/quotes returns quotes list"""
        response = requests.get(f"{BASE_URL}/api/quotes?active_only=false")
        
        assert response.status_code == 200
        data = response.json()
        assert "quotes" in data
        assert "count" in data
        assert isinstance(data["quotes"], list)
        print(f"Found {data['count']} quotes")
    
    def test_get_single_quote(self):
        """Test GET /api/quotes/{id} returns single quote"""
        # First get list of quotes
        list_response = requests.get(f"{BASE_URL}/api/quotes?active_only=false")
        assert list_response.status_code == 200
        quotes = list_response.json()["quotes"]
        
        if len(quotes) > 0:
            quote_id = quotes[0]["id"]
            response = requests.get(f"{BASE_URL}/api/quotes/{quote_id}")
            
            assert response.status_code == 200
            data = response.json()
            assert data["id"] == quote_id
            assert "text_fr" in data
            assert "text_en" in data
            assert "text_ar" in data
            assert "text_wo" in data
            print(f"Successfully retrieved quote: {quote_id}")
        else:
            pytest.skip("No quotes available to test")
    
    def test_get_nonexistent_quote(self):
        """Test GET /api/quotes/{id} with invalid ID returns 404"""
        fake_id = str(uuid.uuid4())
        response = requests.get(f"{BASE_URL}/api/quotes/{fake_id}")
        
        assert response.status_code == 404
        data = response.json()
        assert "detail" in data
        print(f"Correctly returned 404 for non-existent quote")
    
    def test_update_quote_without_auth(self):
        """Test PUT /api/quotes/{id} without auth returns 401"""
        # Get a quote ID first
        list_response = requests.get(f"{BASE_URL}/api/quotes?active_only=false")
        quotes = list_response.json()["quotes"]
        
        if len(quotes) > 0:
            quote_id = quotes[0]["id"]
            response = requests.put(f"{BASE_URL}/api/quotes/{quote_id}", json={
                "text_fr": "Test update without auth"
            })
            
            assert response.status_code == 401
            print("PUT /api/quotes/{id} correctly requires authentication")
        else:
            pytest.skip("No quotes available to test")
    
    def test_update_quote_with_auth(self, auth_headers):
        """Test PUT /api/quotes/{id} with auth updates quote"""
        # Get a quote ID first
        list_response = requests.get(f"{BASE_URL}/api/quotes?active_only=false")
        quotes = list_response.json()["quotes"]
        
        if len(quotes) > 0:
            quote_id = quotes[0]["id"]
            original_context = quotes[0].get("context_fr", "")
            
            # Update the quote
            new_context = f"TEST_Updated context {uuid.uuid4().hex[:8]}"
            response = requests.put(
                f"{BASE_URL}/api/quotes/{quote_id}",
                json={"context_fr": new_context},
                headers=auth_headers
            )
            
            assert response.status_code == 200
            data = response.json()
            assert "message" in data
            assert "quote" in data
            assert data["quote"]["context_fr"] == new_context
            print(f"Successfully updated quote {quote_id}")
            
            # Verify update persisted via GET
            verify_response = requests.get(f"{BASE_URL}/api/quotes/{quote_id}")
            assert verify_response.status_code == 200
            assert verify_response.json()["context_fr"] == new_context
            print("Update verified via GET request")
            
            # Restore original value
            requests.put(
                f"{BASE_URL}/api/quotes/{quote_id}",
                json={"context_fr": original_context or "Sur l'importance de l'action"},
                headers=auth_headers
            )
        else:
            pytest.skip("No quotes available to test")
    
    def test_update_nonexistent_quote(self, auth_headers):
        """Test PUT /api/quotes/{id} with invalid ID returns 404"""
        fake_id = str(uuid.uuid4())
        response = requests.put(
            f"{BASE_URL}/api/quotes/{fake_id}",
            json={"text_fr": "Test"},
            headers=auth_headers
        )
        
        assert response.status_code == 404
        print("PUT correctly returns 404 for non-existent quote")
    
    def test_delete_quote_without_auth(self):
        """Test DELETE /api/quotes/{id} without auth returns 401"""
        # Get a quote ID first
        list_response = requests.get(f"{BASE_URL}/api/quotes?active_only=false")
        quotes = list_response.json()["quotes"]
        
        if len(quotes) > 0:
            quote_id = quotes[0]["id"]
            response = requests.delete(f"{BASE_URL}/api/quotes/{quote_id}")
            
            assert response.status_code == 401
            print("DELETE /api/quotes/{id} correctly requires authentication")
        else:
            pytest.skip("No quotes available to test")
    
    def test_create_and_delete_quote(self, auth_headers):
        """Test full create-delete cycle for quotes"""
        # Create a test quote
        test_quote = {
            "id": str(uuid.uuid4()),
            "text_fr": "TEST_Citation de test pour suppression",
            "text_en": "TEST_Test quote for deletion",
            "text_ar": "اختبار",
            "text_wo": "Test",
            "author": "Test Author",
            "context_fr": "Test context",
            "active": True,
            "order": 999
        }
        
        create_response = requests.post(f"{BASE_URL}/api/quotes", json=test_quote)
        assert create_response.status_code == 200
        created_id = create_response.json()["id"]
        print(f"Created test quote: {created_id}")
        
        # Verify it exists
        get_response = requests.get(f"{BASE_URL}/api/quotes/{created_id}")
        assert get_response.status_code == 200
        
        # Delete the quote
        delete_response = requests.delete(
            f"{BASE_URL}/api/quotes/{created_id}",
            headers=auth_headers
        )
        
        assert delete_response.status_code == 200
        data = delete_response.json()
        assert "message" in data
        assert data["id"] == created_id
        print(f"Successfully deleted quote: {created_id}")
        
        # Verify it's deleted
        verify_response = requests.get(f"{BASE_URL}/api/quotes/{created_id}")
        assert verify_response.status_code == 404
        print("Deletion verified - quote no longer exists")
    
    def test_delete_nonexistent_quote(self, auth_headers):
        """Test DELETE /api/quotes/{id} with invalid ID returns 404"""
        fake_id = str(uuid.uuid4())
        response = requests.delete(
            f"{BASE_URL}/api/quotes/{fake_id}",
            headers=auth_headers
        )
        
        assert response.status_code == 404
        print("DELETE correctly returns 404 for non-existent quote")


class TestEventsCRUD:
    """Test Events CRUD operations (PUT/DELETE require auth)"""
    
    def test_get_all_events(self):
        """Test GET /api/events returns events list"""
        response = requests.get(f"{BASE_URL}/api/events?upcoming_only=false")
        
        assert response.status_code == 200
        data = response.json()
        assert "events" in data
        assert "count" in data
        assert isinstance(data["events"], list)
        print(f"Found {data['count']} events")
    
    def test_get_single_event(self):
        """Test GET /api/events/{id} returns single event"""
        # First get list of events
        list_response = requests.get(f"{BASE_URL}/api/events?upcoming_only=false")
        assert list_response.status_code == 200
        events = list_response.json()["events"]
        
        if len(events) > 0:
            event_id = events[0]["id"]
            response = requests.get(f"{BASE_URL}/api/events/{event_id}")
            
            assert response.status_code == 200
            data = response.json()
            assert data["id"] == event_id
            assert "name_fr" in data
            assert "name_en" in data
            assert "name_ar" in data
            assert "name_wo" in data
            assert "date" in data
            assert "event_type" in data
            print(f"Successfully retrieved event: {event_id}")
        else:
            pytest.skip("No events available to test")
    
    def test_get_nonexistent_event(self):
        """Test GET /api/events/{id} with invalid ID returns 404"""
        fake_id = str(uuid.uuid4())
        response = requests.get(f"{BASE_URL}/api/events/{fake_id}")
        
        assert response.status_code == 404
        data = response.json()
        assert "detail" in data
        print("Correctly returned 404 for non-existent event")
    
    def test_update_event_without_auth(self):
        """Test PUT /api/events/{id} without auth returns 401"""
        # Get an event ID first
        list_response = requests.get(f"{BASE_URL}/api/events?upcoming_only=false")
        events = list_response.json()["events"]
        
        if len(events) > 0:
            event_id = events[0]["id"]
            response = requests.put(f"{BASE_URL}/api/events/{event_id}", json={
                "name_fr": "Test update without auth"
            })
            
            assert response.status_code == 401
            print("PUT /api/events/{id} correctly requires authentication")
        else:
            pytest.skip("No events available to test")
    
    def test_update_event_with_auth(self, auth_headers):
        """Test PUT /api/events/{id} with auth updates event"""
        # Get an event ID first
        list_response = requests.get(f"{BASE_URL}/api/events?upcoming_only=false")
        events = list_response.json()["events"]
        
        if len(events) > 0:
            event_id = events[0]["id"]
            original_location = events[0].get("location", "")
            
            # Update the event
            new_location = f"TEST_Location {uuid.uuid4().hex[:8]}"
            response = requests.put(
                f"{BASE_URL}/api/events/{event_id}",
                json={"location": new_location},
                headers=auth_headers
            )
            
            assert response.status_code == 200
            data = response.json()
            assert "message" in data
            assert "event" in data
            assert data["event"]["location"] == new_location
            print(f"Successfully updated event {event_id}")
            
            # Verify update persisted via GET
            verify_response = requests.get(f"{BASE_URL}/api/events/{event_id}")
            assert verify_response.status_code == 200
            assert verify_response.json()["location"] == new_location
            print("Update verified via GET request")
            
            # Restore original value
            requests.put(
                f"{BASE_URL}/api/events/{event_id}",
                json={"location": original_location or "Tivaouane"},
                headers=auth_headers
            )
        else:
            pytest.skip("No events available to test")
    
    def test_update_nonexistent_event(self, auth_headers):
        """Test PUT /api/events/{id} with invalid ID returns 404"""
        fake_id = str(uuid.uuid4())
        response = requests.put(
            f"{BASE_URL}/api/events/{fake_id}",
            json={"name_fr": "Test"},
            headers=auth_headers
        )
        
        assert response.status_code == 404
        print("PUT correctly returns 404 for non-existent event")
    
    def test_delete_event_without_auth(self):
        """Test DELETE /api/events/{id} without auth returns 401"""
        # Get an event ID first
        list_response = requests.get(f"{BASE_URL}/api/events?upcoming_only=false")
        events = list_response.json()["events"]
        
        if len(events) > 0:
            event_id = events[0]["id"]
            response = requests.delete(f"{BASE_URL}/api/events/{event_id}")
            
            assert response.status_code == 401
            print("DELETE /api/events/{id} correctly requires authentication")
        else:
            pytest.skip("No events available to test")
    
    def test_create_and_delete_event(self, auth_headers):
        """Test full create-delete cycle for events"""
        # Create a test event
        test_event = {
            "id": str(uuid.uuid4()),
            "name_fr": "TEST_Événement de test pour suppression",
            "name_en": "TEST_Test event for deletion",
            "name_ar": "اختبار",
            "name_wo": "Test",
            "description_fr": "Description de test",
            "description_en": "Test description",
            "date": "2099-12-31",
            "location": "Test Location",
            "event_type": "other",
            "recurring": False,
            "active": True
        }
        
        create_response = requests.post(f"{BASE_URL}/api/events", json=test_event)
        assert create_response.status_code == 200
        created_id = create_response.json()["id"]
        print(f"Created test event: {created_id}")
        
        # Verify it exists
        get_response = requests.get(f"{BASE_URL}/api/events/{created_id}")
        assert get_response.status_code == 200
        
        # Delete the event
        delete_response = requests.delete(
            f"{BASE_URL}/api/events/{created_id}",
            headers=auth_headers
        )
        
        assert delete_response.status_code == 200
        data = delete_response.json()
        assert "message" in data
        assert data["id"] == created_id
        print(f"Successfully deleted event: {created_id}")
        
        # Verify it's deleted
        verify_response = requests.get(f"{BASE_URL}/api/events/{created_id}")
        assert verify_response.status_code == 404
        print("Deletion verified - event no longer exists")
    
    def test_delete_nonexistent_event(self, auth_headers):
        """Test DELETE /api/events/{id} with invalid ID returns 404"""
        fake_id = str(uuid.uuid4())
        response = requests.delete(
            f"{BASE_URL}/api/events/{fake_id}",
            headers=auth_headers
        )
        
        assert response.status_code == 404
        print("DELETE correctly returns 404 for non-existent event")


class TestUpdateAllFields:
    """Test updating all fields for quotes and events"""
    
    def test_update_quote_all_languages(self, auth_headers):
        """Test updating all 4 language fields for a quote"""
        # Create a test quote
        test_quote = {
            "id": str(uuid.uuid4()),
            "text_fr": "Original FR",
            "text_en": "Original EN",
            "text_ar": "Original AR",
            "text_wo": "Original WO",
            "author": "Original Author",
            "active": True,
            "order": 999
        }
        
        create_response = requests.post(f"{BASE_URL}/api/quotes", json=test_quote)
        assert create_response.status_code == 200
        quote_id = create_response.json()["id"]
        
        try:
            # Update all language fields
            update_data = {
                "text_fr": "Updated FR - La sagesse",
                "text_en": "Updated EN - Wisdom",
                "text_ar": "Updated AR - الحكمة",
                "text_wo": "Updated WO - Xam-xam",
                "author": "Updated Author",
                "context_fr": "Updated context FR",
                "context_en": "Updated context EN",
                "active": False,
                "order": 100
            }
            
            response = requests.put(
                f"{BASE_URL}/api/quotes/{quote_id}",
                json=update_data,
                headers=auth_headers
            )
            
            assert response.status_code == 200
            data = response.json()
            quote = data["quote"]
            
            # Verify all fields updated
            assert quote["text_fr"] == update_data["text_fr"]
            assert quote["text_en"] == update_data["text_en"]
            assert quote["text_ar"] == update_data["text_ar"]
            assert quote["text_wo"] == update_data["text_wo"]
            assert quote["author"] == update_data["author"]
            assert quote["context_fr"] == update_data["context_fr"]
            assert quote["context_en"] == update_data["context_en"]
            assert quote["active"] == update_data["active"]
            assert quote["order"] == update_data["order"]
            
            print("Successfully updated all quote fields including 4 languages")
            
        finally:
            # Cleanup
            requests.delete(f"{BASE_URL}/api/quotes/{quote_id}", headers=auth_headers)
    
    def test_update_event_all_fields(self, auth_headers):
        """Test updating all fields for an event"""
        # Create a test event
        test_event = {
            "id": str(uuid.uuid4()),
            "name_fr": "Original FR",
            "name_en": "Original EN",
            "name_ar": "Original AR",
            "name_wo": "Original WO",
            "description_fr": "Original desc FR",
            "date": "2099-01-01",
            "location": "Original Location",
            "event_type": "gamou",
            "recurring": False,
            "active": True
        }
        
        create_response = requests.post(f"{BASE_URL}/api/events", json=test_event)
        assert create_response.status_code == 200
        event_id = create_response.json()["id"]
        
        try:
            # Update all fields
            update_data = {
                "name_fr": "Updated FR - Gamou",
                "name_en": "Updated EN - Gamou",
                "name_ar": "Updated AR - المولد",
                "name_wo": "Updated WO - Gamou",
                "description_fr": "Updated desc FR",
                "description_en": "Updated desc EN",
                "description_ar": "Updated desc AR",
                "description_wo": "Updated desc WO",
                "date": "2099-12-31",
                "location": "Updated Location",
                "event_type": "ziarra",
                "recurring": True,
                "recurrence_pattern": "annual",
                "active": False
            }
            
            response = requests.put(
                f"{BASE_URL}/api/events/{event_id}",
                json=update_data,
                headers=auth_headers
            )
            
            assert response.status_code == 200
            data = response.json()
            event = data["event"]
            
            # Verify all fields updated
            assert event["name_fr"] == update_data["name_fr"]
            assert event["name_en"] == update_data["name_en"]
            assert event["name_ar"] == update_data["name_ar"]
            assert event["name_wo"] == update_data["name_wo"]
            assert event["description_fr"] == update_data["description_fr"]
            assert event["description_en"] == update_data["description_en"]
            assert event["date"] == update_data["date"]
            assert event["location"] == update_data["location"]
            assert event["event_type"] == update_data["event_type"]
            assert event["recurring"] == update_data["recurring"]
            assert event["recurrence_pattern"] == update_data["recurrence_pattern"]
            assert event["active"] == update_data["active"]
            
            print("Successfully updated all event fields including 4 languages")
            
        finally:
            # Cleanup
            requests.delete(f"{BASE_URL}/api/events/{event_id}", headers=auth_headers)


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
