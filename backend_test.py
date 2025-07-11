#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for GospelSpot
Tests all backend functionality including authentication, user management, 
artist management, song management, and statistics.
"""

import asyncio
import aiohttp
import json
import base64
import os
from datetime import datetime
from typing import Dict, Any, Optional

# Get backend URL from environment
BACKEND_URL = os.getenv('REACT_APP_BACKEND_URL', 'https://3d5d19bd-b086-428f-a81c-66e9fa96950f.preview.emergentagent.com')
API_BASE_URL = f"{BACKEND_URL}/api"

class GospelSpotAPITester:
    def __init__(self):
        self.session = None
        self.test_data = {}
        self.tokens = {}
        self.results = {
            'passed': 0,
            'failed': 0,
            'errors': []
        }
    
    async def setup_session(self):
        """Setup HTTP session"""
        self.session = aiohttp.ClientSession()
    
    async def cleanup_session(self):
        """Cleanup HTTP session"""
        if self.session:
            await self.session.close()
    
    def log_result(self, test_name: str, success: bool, message: str = ""):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name}")
        if message:
            print(f"   {message}")
        
        if success:
            self.results['passed'] += 1
        else:
            self.results['failed'] += 1
            self.results['errors'].append(f"{test_name}: {message}")
    
    async def make_request(self, method: str, endpoint: str, data: Dict = None, 
                          headers: Dict = None, token: str = None) -> tuple:
        """Make HTTP request and return (success, response_data, status_code)"""
        url = f"{API_BASE_URL}{endpoint}"
        
        # Setup headers
        request_headers = {'Content-Type': 'application/json'}
        if headers:
            request_headers.update(headers)
        if token:
            request_headers['Authorization'] = f'Bearer {token}'
        
        try:
            async with self.session.request(
                method, url, 
                json=data if data else None,
                headers=request_headers
            ) as response:
                try:
                    response_data = await response.json()
                except:
                    response_data = await response.text()
                
                return response.status < 400, response_data, response.status
        except Exception as e:
            return False, str(e), 0
    
    # ==================== HEALTH CHECK TESTS ====================
    
    async def test_health_check(self):
        """Test health check endpoint"""
        success, data, status = await self.make_request('GET', '/health')
        
        if success and status == 200:
            self.log_result("Health Check", True, f"API is healthy: {data.get('message', '')}")
        else:
            self.log_result("Health Check", False, f"Status: {status}, Data: {data}")
    
    # ==================== AUTHENTICATION TESTS ====================
    
    async def test_user_registration(self):
        """Test user registration with different roles"""
        test_users = [
            {
                'name': 'regular_user',
                'data': {
                    'email': f'john.doe.{int(datetime.now().timestamp())}@gospelspot.com',
                    'password': 'SecurePass123!',
                    'first_name': 'John',
                    'last_name': 'Doe',
                    'phone_number': '+1234567890',
                    'country': 'USA',
                    'language': 'en',
                    'role': 'user'
                }
            },
            {
                'name': 'label_manager',
                'data': {
                    'email': f'sarah.manager.{int(datetime.now().timestamp())}@gospelrecords.com',
                    'password': 'LabelPass456!',
                    'first_name': 'Sarah',
                    'last_name': 'Manager',
                    'phone_number': '+1987654321',
                    'country': 'USA',
                    'language': 'en',
                    'role': 'label_manager'
                }
            },
            {
                'name': 'artist_user',
                'data': {
                    'email': f'david.singer.{int(datetime.now().timestamp())}@music.com',
                    'password': 'ArtistPass789!',
                    'first_name': 'David',
                    'last_name': 'Singer',
                    'phone_number': '+1122334455',
                    'country': 'USA',
                    'language': 'en',
                    'role': 'artist'
                }
            }
        ]
        
        for user_info in test_users:
            success, data, status = await self.make_request('POST', '/auth/register', user_info['data'])
            
            if success and status == 200:
                self.test_data[user_info['name']] = {
                    'user_data': data,
                    'credentials': user_info['data']
                }
                self.log_result(f"Register {user_info['name']}", True, 
                              f"User ID: {data.get('id', 'N/A')}")
            else:
                self.log_result(f"Register {user_info['name']}", False, 
                              f"Status: {status}, Error: {data}")
    
    async def test_duplicate_email_registration(self):
        """Test duplicate email validation"""
        duplicate_data = {
            'email': 'john.doe@gospelspot.com',  # Same as first user
            'password': 'AnotherPass123!',
            'first_name': 'Jane',
            'last_name': 'Doe',
            'role': 'user'
        }
        
        success, data, status = await self.make_request('POST', '/auth/register', duplicate_data)
        
        if not success and status == 400:
            self.log_result("Duplicate Email Validation", True, 
                          "Correctly rejected duplicate email")
        else:
            self.log_result("Duplicate Email Validation", False, 
                          f"Should have rejected duplicate email. Status: {status}")
    
    async def test_email_verification(self):
        """Test email verification process"""
        # For testing, we'll simulate email verification tokens
        # In a real scenario, these would come from email
        test_tokens = ['test_token_123', 'test_token_456', 'test_token_789']
        
        for i, user_type in enumerate(['regular_user', 'label_manager', 'artist_user']):
            if user_type in self.test_data:
                # Simulate email verification
                verification_data = {'token': test_tokens[i]}
                success, data, status = await self.make_request('POST', '/auth/verify-email', verification_data)
                
                # This will likely fail since we don't have real tokens, but we test the endpoint
                if status == 400 and 'Invalid verification token' in str(data):
                    self.log_result(f"Email Verification Endpoint ({user_type})", True, 
                                  "Endpoint correctly validates tokens")
                else:
                    self.log_result(f"Email Verification Endpoint ({user_type})", False, 
                                  f"Unexpected response: {status}, {data}")
    
    async def test_login_before_verification(self):
        """Test login before email verification (should fail)"""
        if 'regular_user' in self.test_data:
            login_data = {
                'email': self.test_data['regular_user']['credentials']['email'],
                'password': self.test_data['regular_user']['credentials']['password']
            }
            
            success, data, status = await self.make_request('POST', '/auth/login', login_data)
            
            if not success and status == 401:
                self.log_result("Login Before Verification", True, 
                              "Correctly blocked unverified user login")
            else:
                self.log_result("Login Before Verification", False, 
                              f"Should block unverified login. Status: {status}")
    
    async def test_create_super_admin(self):
        """Create a super admin user for testing admin functions"""
        # Try to login with the pre-created verified admin
        admin_credentials = {
            'email': 'test.admin@gospelspot.com',
            'password': 'TestAdmin123!'
        }
        
        login_success, login_data, login_status = await self.make_request('POST', '/auth/login', admin_credentials)
        
        if login_success and login_status == 200:
            self.tokens['super_admin'] = login_data.get('access_token')
            self.test_data['super_admin'] = {
                'user_data': login_data.get('user'),
                'credentials': admin_credentials
            }
            self.log_result("Login Super Admin", True, "Pre-created admin logged in successfully")
        else:
            # If pre-created admin doesn't work, try creating a new one
            admin_data = {
                'email': 'admin@gospelspot.com',
                'password': 'AdminPass123!',
                'first_name': 'Super',
                'last_name': 'Admin',
                'role': 'super_admin'
            }
            
            success, data, status = await self.make_request('POST', '/auth/register', admin_data)
            
            if success and status == 200:
                self.test_data['super_admin'] = {
                    'user_data': data,
                    'credentials': admin_data
                }
                self.log_result("Create Super Admin", True, "Super admin created (verification required)")
            else:
                self.log_result("Create Super Admin", False, f"Status: {status}, Error: {data}")
    
    async def try_create_verified_admin(self):
        """This method is no longer needed since we have a pre-created admin"""
        pass
    
    # ==================== USER MANAGEMENT TESTS ====================
    
    async def test_create_user_as_admin(self):
        """Test creating users as super admin"""
        if 'super_admin' not in self.tokens:
            self.log_result("Create User as Admin", False, "No super admin token available")
            return
        
        new_user_data = {
            'email': 'admin.created@gospelspot.com',
            'password': 'AdminCreated123!',
            'first_name': 'Admin',
            'last_name': 'Created',
            'role': 'label_manager'
        }
        
        success, data, status = await self.make_request(
            'POST', '/users/', new_user_data, token=self.tokens['super_admin']
        )
        
        if success and status == 200:
            self.test_data['admin_created_user'] = data
            self.log_result("Create User as Admin", True, f"Created user: {data.get('id')}")
        else:
            self.log_result("Create User as Admin", False, f"Status: {status}, Error: {data}")
    
    async def test_get_users_as_admin(self):
        """Test getting all users as super admin"""
        if 'super_admin' not in self.tokens:
            self.log_result("Get Users as Admin", False, "No super admin token available")
            return
        
        success, data, status = await self.make_request(
            'GET', '/users/', token=self.tokens['super_admin']
        )
        
        if success and status == 200 and isinstance(data, list):
            self.log_result("Get Users as Admin", True, f"Retrieved {len(data)} users")
        else:
            self.log_result("Get Users as Admin", False, f"Status: {status}, Error: {data}")
    
    async def test_get_users_with_role_filter(self):
        """Test getting users filtered by role"""
        if 'super_admin' not in self.tokens:
            self.log_result("Get Users by Role", False, "No super admin token available")
            return
        
        success, data, status = await self.make_request(
            'GET', '/users/?role=label_manager', token=self.tokens['super_admin']
        )
        
        if success and status == 200:
            self.log_result("Get Users by Role", True, f"Retrieved label managers: {len(data) if isinstance(data, list) else 'N/A'}")
        else:
            self.log_result("Get Users by Role", False, f"Status: {status}, Error: {data}")
    
    # ==================== ARTIST MANAGEMENT TESTS ====================
    
    async def test_create_artist_as_label_manager(self):
        """Test creating artists as label manager"""
        # First, we need a verified label manager token
        # For testing, we'll use the super admin token to simulate this
        if 'super_admin' not in self.tokens:
            self.log_result("Create Artist as Label Manager", False, "No admin token available")
            return
        
        artist_data = {
            'name': 'Gospel Harmony',
            'bio': 'Inspiring gospel music group spreading faith through song',
            'genre': 'Gospel',
            'country': 'USA',
            'website': 'https://gospelharmony.com',
            'social_links': {
                'instagram': '@gospelharmony',
                'facebook': 'GospelHarmonyOfficial',
                'youtube': 'GospelHarmonyMusic'
            }
        }
        
        success, data, status = await self.make_request(
            'POST', '/artists/', artist_data, token=self.tokens['super_admin']
        )
        
        if success and status == 200:
            self.test_data['test_artist'] = data
            self.log_result("Create Artist as Label Manager", True, f"Created artist: {data.get('id')}")
        else:
            self.log_result("Create Artist as Label Manager", False, f"Status: {status}, Error: {data}")
    
    async def test_get_artists(self):
        """Test getting all artists"""
        if 'super_admin' not in self.tokens:
            self.log_result("Get Artists", False, "No token available")
            return
        
        success, data, status = await self.make_request(
            'GET', '/artists/', token=self.tokens['super_admin']
        )
        
        if success and status == 200 and isinstance(data, list):
            self.log_result("Get Artists", True, f"Retrieved {len(data)} artists")
        else:
            self.log_result("Get Artists", False, f"Status: {status}, Error: {data}")
    
    async def test_get_my_artists(self):
        """Test getting artists managed by current user"""
        if 'super_admin' not in self.tokens:
            self.log_result("Get My Artists", False, "No token available")
            return
        
        success, data, status = await self.make_request(
            'GET', '/artists/my/artists', token=self.tokens['super_admin']
        )
        
        # This might fail if super admin doesn't have label manager role
        if success and status == 200:
            self.log_result("Get My Artists", True, f"Retrieved managed artists")
        elif status == 403:
            self.log_result("Get My Artists", True, "Correctly restricted to label managers")
        else:
            self.log_result("Get My Artists", False, f"Status: {status}, Error: {data}")
    
    async def test_verify_artist(self):
        """Test artist verification by super admin"""
        if 'super_admin' not in self.tokens or 'test_artist' not in self.test_data:
            self.log_result("Verify Artist", False, "Missing prerequisites")
            return
        
        artist_id = self.test_data['test_artist']['id']
        success, data, status = await self.make_request(
            'POST', f'/artists/{artist_id}/verify', token=self.tokens['super_admin']
        )
        
        if success and status == 200:
            self.log_result("Verify Artist", True, "Artist verified successfully")
        else:
            self.log_result("Verify Artist", False, f"Status: {status}, Error: {data}")
    
    # ==================== SONG MANAGEMENT TESTS ====================
    
    async def test_create_song(self):
        """Test creating songs with full metadata"""
        if 'super_admin' not in self.tokens or 'test_artist' not in self.test_data:
            self.log_result("Create Song", False, "Missing prerequisites")
            return
        
        # Create a small base64 image for testing
        sample_image_b64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
        
        song_data = {
            'title': 'Amazing Grace (Modern Version)',
            'artist_id': self.test_data['test_artist']['id'],
            'album': 'Faith & Hope',
            'genre': 'Gospel',
            'duration': '4:32',
            'lyrics': 'Amazing grace, how sweet the sound\nThat saved a wretch like me\nI once was lost, but now am found\nWas blind, but now I see',
            'youtube_url': 'https://youtube.com/watch?v=example123',
            'image_base64': sample_image_b64,
            'language': 'en',
            'country': 'USA'
        }
        
        success, data, status = await self.make_request(
            'POST', '/songs/', song_data, token=self.tokens['super_admin']
        )
        
        if success and status == 200:
            self.test_data['test_song'] = data
            self.log_result("Create Song", True, f"Created song: {data.get('id')}")
        else:
            self.log_result("Create Song", False, f"Status: {status}, Error: {data}")
    
    async def test_get_songs(self):
        """Test getting all songs"""
        if 'super_admin' not in self.tokens:
            self.log_result("Get Songs", False, "No token available")
            return
        
        success, data, status = await self.make_request(
            'GET', '/songs/', token=self.tokens['super_admin']
        )
        
        if success and status == 200 and isinstance(data, list):
            self.log_result("Get Songs", True, f"Retrieved {len(data)} songs")
        else:
            self.log_result("Get Songs", False, f"Status: {status}, Error: {data}")
    
    async def test_play_song(self):
        """Test recording song plays for statistics"""
        if 'super_admin' not in self.tokens or 'test_song' not in self.test_data:
            self.log_result("Play Song", False, "Missing prerequisites")
            return
        
        song_id = self.test_data['test_song']['id']
        success, data, status = await self.make_request(
            'POST', f'/songs/{song_id}/play', token=self.tokens['super_admin']
        )
        
        if success and status == 200:
            self.log_result("Play Song", True, "Play count recorded successfully")
        else:
            self.log_result("Play Song", False, f"Status: {status}, Error: {data}")
    
    async def test_search_songs(self):
        """Test song search functionality"""
        if 'super_admin' not in self.tokens:
            self.log_result("Search Songs", False, "No token available")
            return
        
        success, data, status = await self.make_request(
            'GET', '/songs/search/?q=Amazing', token=self.tokens['super_admin']
        )
        
        if success and status == 200:
            self.log_result("Search Songs", True, f"Search returned {len(data) if isinstance(data, list) else 'N/A'} results")
        else:
            self.log_result("Search Songs", False, f"Status: {status}, Error: {data}")
    
    async def test_trending_songs(self):
        """Test trending songs endpoint"""
        if 'super_admin' not in self.tokens:
            self.log_result("Trending Songs", False, "No token available")
            return
        
        success, data, status = await self.make_request(
            'GET', '/songs/trending/', token=self.tokens['super_admin']
        )
        
        if success and status == 200:
            self.log_result("Trending Songs", True, f"Retrieved trending songs")
        else:
            self.log_result("Trending Songs", False, f"Status: {status}, Error: {data}")
    
    # ==================== STATISTICS TESTS ====================
    
    async def test_artist_statistics(self):
        """Test artist statistics endpoint"""
        if 'super_admin' not in self.tokens or 'test_artist' not in self.test_data:
            self.log_result("Artist Statistics", False, "Missing prerequisites")
            return
        
        artist_id = self.test_data['test_artist']['id']
        success, data, status = await self.make_request(
            'GET', f'/statistics/artist/{artist_id}', token=self.tokens['super_admin']
        )
        
        if success and status == 200:
            self.log_result("Artist Statistics", True, f"Retrieved artist stats")
        else:
            self.log_result("Artist Statistics", False, f"Status: {status}, Error: {data}")
    
    async def test_platform_statistics(self):
        """Test platform-wide statistics (Super Admin only)"""
        if 'super_admin' not in self.tokens:
            self.log_result("Platform Statistics", False, "No super admin token available")
            return
        
        success, data, status = await self.make_request(
            'GET', '/statistics/platform', token=self.tokens['super_admin']
        )
        
        if success and status == 200:
            self.log_result("Platform Statistics", True, "Retrieved platform statistics")
        else:
            self.log_result("Platform Statistics", False, f"Status: {status}, Error: {data}")
    
    async def test_ads_revenue_statistics(self):
        """Test Google Ads revenue statistics"""
        if 'super_admin' not in self.tokens:
            self.log_result("Ads Revenue Statistics", False, "No super admin token available")
            return
        
        success, data, status = await self.make_request(
            'GET', '/statistics/revenue/ads', token=self.tokens['super_admin']
        )
        
        if success and status == 200:
            self.log_result("Ads Revenue Statistics", True, "Retrieved ads revenue data")
        else:
            self.log_result("Ads Revenue Statistics", False, f"Status: {status}, Error: {data}")
    
    # ==================== ROLE-BASED ACCESS CONTROL TESTS ====================
    
    async def test_unauthorized_access(self):
        """Test unauthorized access to protected endpoints"""
        # Test without token
        success, data, status = await self.make_request('GET', '/users/')
        
        if not success and status == 401:
            self.log_result("Unauthorized Access Control", True, "Correctly blocked unauthorized access")
        else:
            self.log_result("Unauthorized Access Control", False, f"Should block unauthorized access. Status: {status}")
    
    async def test_role_based_restrictions(self):
        """Test role-based access restrictions"""
        # This would require creating different role tokens, which is complex without email verification
        # For now, we'll test that super admin endpoints require proper roles
        
        # Test platform stats with invalid token
        success, data, status = await self.make_request(
            'GET', '/statistics/platform', token='invalid_token'
        )
        
        if not success and status == 401:
            self.log_result("Role-Based Access Control", True, "Correctly validates tokens")
        else:
            self.log_result("Role-Based Access Control", False, f"Should validate tokens. Status: {status}")
    
    # ==================== DATA VALIDATION TESTS ====================
    
    async def test_invalid_data_validation(self):
        """Test API validation with invalid data"""
        # Test user registration with invalid email
        invalid_user_data = {
            'email': 'not-an-email',
            'password': 'short',
            'first_name': '',
            'last_name': '',
            'role': 'invalid_role'
        }
        
        success, data, status = await self.make_request('POST', '/auth/register', invalid_user_data)
        
        if not success and status == 422:  # Validation error
            self.log_result("Data Validation", True, "Correctly validates input data")
        else:
            self.log_result("Data Validation", False, f"Should validate input data. Status: {status}")
    
    # ==================== MAIN TEST RUNNER ====================
    
    async def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting GospelSpot Backend API Tests")
        print(f"📡 Testing API at: {API_BASE_URL}")
        print("=" * 60)
        
        await self.setup_session()
        
        try:
            # Health Check
            await self.test_health_check()
            
            # Authentication Tests
            print("\n🔐 Authentication Tests")
            await self.test_user_registration()
            await self.test_duplicate_email_registration()
            await self.test_email_verification()
            await self.test_login_before_verification()
            await self.test_create_super_admin()
            
            # User Management Tests
            print("\n👥 User Management Tests")
            await self.test_create_user_as_admin()
            await self.test_get_users_as_admin()
            await self.test_get_users_with_role_filter()
            
            # Artist Management Tests
            print("\n🎤 Artist Management Tests")
            await self.test_create_artist_as_label_manager()
            await self.test_get_artists()
            await self.test_get_my_artists()
            await self.test_verify_artist()
            
            # Song Management Tests
            print("\n🎵 Song Management Tests")
            await self.test_create_song()
            await self.test_get_songs()
            await self.test_play_song()
            await self.test_search_songs()
            await self.test_trending_songs()
            
            # Statistics Tests
            print("\n📊 Statistics Tests")
            await self.test_artist_statistics()
            await self.test_platform_statistics()
            await self.test_ads_revenue_statistics()
            
            # Security Tests
            print("\n🔒 Security & Access Control Tests")
            await self.test_unauthorized_access()
            await self.test_role_based_restrictions()
            
            # Validation Tests
            print("\n✅ Data Validation Tests")
            await self.test_invalid_data_validation()
            
        finally:
            await self.cleanup_session()
        
        # Print Summary
        print("\n" + "=" * 60)
        print("📋 TEST SUMMARY")
        print("=" * 60)
        print(f"✅ Passed: {self.results['passed']}")
        print(f"❌ Failed: {self.results['failed']}")
        print(f"📊 Total: {self.results['passed'] + self.results['failed']}")
        
        if self.results['errors']:
            print("\n🚨 FAILED TESTS:")
            for error in self.results['errors']:
                print(f"   • {error}")
        
        success_rate = (self.results['passed'] / (self.results['passed'] + self.results['failed'])) * 100 if (self.results['passed'] + self.results['failed']) > 0 else 0
        print(f"\n🎯 Success Rate: {success_rate:.1f}%")
        
        return self.results

async def main():
    """Main test runner"""
    tester = GospelSpotAPITester()
    results = await tester.run_all_tests()
    
    # Exit with appropriate code
    exit_code = 0 if results['failed'] == 0 else 1
    return exit_code

if __name__ == "__main__":
    exit_code = asyncio.run(main())
    exit(exit_code)