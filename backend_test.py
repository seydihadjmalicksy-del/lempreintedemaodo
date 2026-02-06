import requests
import sys
import json
from datetime import datetime

class TariqaTidianeAPITester:
    def __init__(self, base_url="https://maodo-heritage.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.created_video_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}" if endpoint else self.api_url
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if isinstance(response_data, list):
                        print(f"   Response: List with {len(response_data)} items")
                    elif isinstance(response_data, dict):
                        if 'message' in response_data:
                            print(f"   Message: {response_data['message']}")
                        elif 'id' in response_data:
                            print(f"   ID: {response_data['id']}")
                except:
                    print(f"   Response: {response.text[:100]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")

            return success, response.json() if response.text else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("Root Endpoint", "GET", "", 200)

    def test_init_data(self):
        """Test data initialization"""
        return self.run_test("Initialize Data", "POST", "init-data", 200)

    def test_get_videos(self):
        """Test getting all videos"""
        return self.run_test("Get All Videos", "GET", "videos", 200)

    def test_get_videos_with_search(self):
        """Test video search functionality"""
        return self.run_test(
            "Search Videos (Gamou)", 
            "GET", 
            "videos", 
            200, 
            params={"search": "Gamou"}
        )

    def test_get_videos_by_category(self):
        """Test filtering videos by category"""
        return self.run_test(
            "Filter Videos (conferences)", 
            "GET", 
            "videos", 
            200, 
            params={"category": "conferences"}
        )

    def test_get_featured_videos(self):
        """Test getting featured videos"""
        return self.run_test("Get Featured Videos", "GET", "videos/featured", 200)

    def test_get_categories(self):
        """Test getting categories"""
        return self.run_test("Get Categories", "GET", "categories", 200)

    def test_create_video(self):
        """Test creating a new video"""
        video_data = {
            "title": "Test Video - Enseignement Spirituel",
            "description": "Vidéo de test pour l'enseignement spirituel de la Tariqa Tidiane",
            "youtube_id": "dQw4w9WgXcQ",
            "category": "conferences",
            "duration": "30:00",
            "featured": False
        }
        
        success, response = self.run_test("Create Video", "POST", "videos", 201, data=video_data)
        if success and 'id' in response:
            self.created_video_id = response['id']
            print(f"   Created video ID: {self.created_video_id}")
        return success, response

    def test_get_single_video(self):
        """Test getting a single video by ID"""
        if not self.created_video_id:
            print("⚠️  Skipping single video test - no video ID available")
            return True, {}
        
        return self.run_test(
            f"Get Single Video ({self.created_video_id[:8]}...)", 
            "GET", 
            f"videos/{self.created_video_id}", 
            200
        )

    def test_update_video(self):
        """Test updating a video"""
        if not self.created_video_id:
            print("⚠️  Skipping video update test - no video ID available")
            return True, {}
        
        update_data = {
            "title": "Test Video - Enseignement Spirituel (Modifié)",
            "featured": True
        }
        
        return self.run_test(
            f"Update Video ({self.created_video_id[:8]}...)", 
            "PUT", 
            f"videos/{self.created_video_id}", 
            200, 
            data=update_data
        )

    def test_delete_video(self):
        """Test deleting a video"""
        if not self.created_video_id:
            print("⚠️  Skipping video deletion test - no video ID available")
            return True, {}
        
        return self.run_test(
            f"Delete Video ({self.created_video_id[:8]}...)", 
            "DELETE", 
            f"videos/{self.created_video_id}", 
            200
        )

    def test_get_nonexistent_video(self):
        """Test getting a non-existent video (should return 404)"""
        fake_id = "nonexistent-video-id-12345"
        return self.run_test(
            "Get Non-existent Video", 
            "GET", 
            f"videos/{fake_id}", 
            404
        )

def main():
    print("🕌 Testing Tariqa Tidiane API Endpoints")
    print("=" * 50)
    
    tester = TariqaTidianeAPITester()
    
    # Test sequence
    tests = [
        tester.test_root_endpoint,
        tester.test_init_data,
        tester.test_get_categories,
        tester.test_get_videos,
        tester.test_get_featured_videos,
        tester.test_get_videos_with_search,
        tester.test_get_videos_by_category,
        tester.test_create_video,
        tester.test_get_single_video,
        tester.test_update_video,
        tester.test_delete_video,
        tester.test_get_nonexistent_video,
    ]
    
    # Run all tests
    for test in tests:
        try:
            test()
        except Exception as e:
            print(f"❌ Test failed with exception: {str(e)}")
    
    # Print results
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print("⚠️  Some tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())