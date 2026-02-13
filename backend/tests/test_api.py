"""
Backend API Tests for Tariqa Tidiane Website
Tests: Newsletter subscription, Contact form, Videos API
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://tivaouane-tariqa.preview.emergentagent.com')

class TestHealthCheck:
    """Basic API health check tests"""
    
    def test_api_root(self):
        """Test API root endpoint"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "Tariqa Tidiane" in data["message"]
        print(f"✓ API root working: {data['message']}")


class TestNewsletterAPI:
    """Newsletter subscription endpoint tests"""
    
    def test_newsletter_subscribe_success(self):
        """Test successful newsletter subscription"""
        unique_email = f"test_{uuid.uuid4().hex[:8]}@example.com"
        response = requests.post(
            f"{BASE_URL}/api/newsletter/subscribe",
            json={"email": unique_email, "language": "fr"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True or "already_subscribed" in data or "reactivated" in data
        assert "message" in data
        print(f"✓ Newsletter subscription successful for {unique_email}")
    
    def test_newsletter_subscribe_english(self):
        """Test newsletter subscription with English language"""
        unique_email = f"test_en_{uuid.uuid4().hex[:8]}@example.com"
        response = requests.post(
            f"{BASE_URL}/api/newsletter/subscribe",
            json={"email": unique_email, "language": "en"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        print(f"✓ Newsletter subscription (EN) successful for {unique_email}")
    
    def test_newsletter_subscribe_arabic(self):
        """Test newsletter subscription with Arabic language"""
        unique_email = f"test_ar_{uuid.uuid4().hex[:8]}@example.com"
        response = requests.post(
            f"{BASE_URL}/api/newsletter/subscribe",
            json={"email": unique_email, "language": "ar"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        print(f"✓ Newsletter subscription (AR) successful for {unique_email}")
    
    def test_newsletter_subscribe_wolof(self):
        """Test newsletter subscription with Wolof language"""
        unique_email = f"test_wo_{uuid.uuid4().hex[:8]}@example.com"
        response = requests.post(
            f"{BASE_URL}/api/newsletter/subscribe",
            json={"email": unique_email, "language": "wo"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        print(f"✓ Newsletter subscription (WO) successful for {unique_email}")
    
    def test_newsletter_subscribe_invalid_email(self):
        """Test newsletter subscription with invalid email"""
        response = requests.post(
            f"{BASE_URL}/api/newsletter/subscribe",
            json={"email": "invalid-email", "language": "fr"}
        )
        assert response.status_code == 400
        data = response.json()
        assert "detail" in data
        print(f"✓ Invalid email correctly rejected: {data['detail']}")
    
    def test_newsletter_subscribe_duplicate(self):
        """Test newsletter subscription with duplicate email"""
        email = f"test_dup_{uuid.uuid4().hex[:8]}@example.com"
        # First subscription
        response1 = requests.post(
            f"{BASE_URL}/api/newsletter/subscribe",
            json={"email": email, "language": "fr"}
        )
        assert response1.status_code == 200
        
        # Second subscription (duplicate)
        response2 = requests.post(
            f"{BASE_URL}/api/newsletter/subscribe",
            json={"email": email, "language": "fr"}
        )
        assert response2.status_code == 200
        data = response2.json()
        assert "already_subscribed" in data or "message" in data
        print(f"✓ Duplicate subscription handled correctly")
    
    def test_newsletter_subscribers_stats(self):
        """Test newsletter subscribers statistics endpoint"""
        response = requests.get(f"{BASE_URL}/api/newsletter/subscribers")
        assert response.status_code == 200
        data = response.json()
        assert "total_subscribers" in data
        assert "active_subscribers" in data
        print(f"✓ Newsletter stats: {data['total_subscribers']} total, {data['active_subscribers']} active")


class TestContactAPI:
    """Contact form endpoint tests"""
    
    def test_contact_submit_success(self):
        """Test successful contact form submission"""
        response = requests.post(
            f"{BASE_URL}/api/contact",
            json={
                "nom": "Test User",
                "email": f"test_{uuid.uuid4().hex[:8]}@example.com",
                "sujet": "Test Subject",
                "message": "This is a test message for the contact form. It has more than 10 characters."
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert "message" in data
        assert "id" in data
        print(f"✓ Contact form submitted successfully, ID: {data['id']}")
    
    def test_contact_submit_invalid_email(self):
        """Test contact form with invalid email"""
        response = requests.post(
            f"{BASE_URL}/api/contact",
            json={
                "nom": "Test User",
                "email": "invalid-email",
                "sujet": "Test Subject",
                "message": "This is a test message for the contact form."
            }
        )
        assert response.status_code == 400
        data = response.json()
        assert "detail" in data
        print(f"✓ Invalid email correctly rejected: {data['detail']}")
    
    def test_contact_submit_short_message(self):
        """Test contact form with message too short"""
        response = requests.post(
            f"{BASE_URL}/api/contact",
            json={
                "nom": "Test User",
                "email": "test@example.com",
                "sujet": "Test Subject",
                "message": "Short"
            }
        )
        assert response.status_code == 400
        data = response.json()
        assert "detail" in data
        print(f"✓ Short message correctly rejected: {data['detail']}")
    
    def test_contact_messages_list(self):
        """Test contact messages list endpoint"""
        response = requests.get(f"{BASE_URL}/api/contact/messages")
        assert response.status_code == 200
        data = response.json()
        assert "messages" in data
        assert "count" in data
        print(f"✓ Contact messages list: {data['count']} messages")


class TestVideosAPI:
    """Videos API endpoint tests"""
    
    def test_get_videos(self):
        """Test get all videos"""
        response = requests.get(f"{BASE_URL}/api/videos")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Videos list retrieved: {len(data)} videos")
    
    def test_get_featured_videos(self):
        """Test get featured videos"""
        response = requests.get(f"{BASE_URL}/api/videos/featured")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Featured videos retrieved: {len(data)} videos")
    
    def test_get_categories(self):
        """Test get video categories"""
        response = requests.get(f"{BASE_URL}/api/categories")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Categories retrieved: {len(data)} categories")
    
    def test_get_video_not_found(self):
        """Test get non-existent video"""
        response = requests.get(f"{BASE_URL}/api/videos/non-existent-id")
        assert response.status_code == 404
        print(f"✓ Non-existent video correctly returns 404")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
