"""
Test enriched content sections for Maodo, Gamou, and Ecole pages.
Tests the /api/content/enrich endpoint results.
"""
import pytest
import requests
import json
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestMaodoEnrichedContent:
    """Tests for Maodo page enriched content (7 sections)"""
    
    def test_maodo_has_7_sections(self):
        """Maodo should have 7 sections: hero, biography, quote, timeline, contributions, oeuvres, legacy"""
        response = requests.get(f"{BASE_URL}/api/content/maodo")
        assert response.status_code == 200
        
        data = response.json()
        sections = list(data.get('sections', {}).keys())
        
        assert len(sections) == 7, f"Expected 7 sections, got {len(sections)}: {sections}"
        
        expected_sections = ['hero', 'biography', 'quote', 'timeline', 'contributions', 'oeuvres', 'legacy']
        for section in expected_sections:
            assert section in sections, f"Missing section: {section}"
    
    def test_maodo_timeline_has_dates(self):
        """Timeline section should have events with years"""
        response = requests.get(f"{BASE_URL}/api/content/maodo/timeline")
        assert response.status_code == 200
        
        data = response.json()
        text = data.get('text', '')
        items = json.loads(text)
        
        assert len(items) >= 5, f"Expected at least 5 timeline items, got {len(items)}"
        
        # Check first item has year and event
        assert 'year' in items[0], "Timeline item missing 'year' field"
        assert 'event' in items[0], "Timeline item missing 'event' field"
        
        # Verify specific dates exist
        years = [item['year'] for item in items]
        assert '1855' in years, "Missing birth year 1855"
        assert '1922' in years, "Missing death year 1922"
    
    def test_maodo_contributions_has_items(self):
        """Contributions section should have founder, school builder, etc."""
        response = requests.get(f"{BASE_URL}/api/content/maodo/contributions")
        assert response.status_code == 200
        
        data = response.json()
        text = data.get('text', '')
        items = json.loads(text)
        
        assert len(items) >= 4, f"Expected at least 4 contributions, got {len(items)}"
        
        # Check structure
        assert 'title' in items[0], "Contribution missing 'title' field"
        assert 'description' in items[0], "Contribution missing 'description' field"
        
        # Verify specific contributions
        titles = [item['title'] for item in items]
        assert any('Gamou' in t for t in titles), "Missing 'Fondateur du Gamou' contribution"
    
    def test_maodo_oeuvres_has_literary_works(self):
        """Oeuvres section should have literary works"""
        response = requests.get(f"{BASE_URL}/api/content/maodo/oeuvres")
        assert response.status_code == 200
        
        data = response.json()
        text = data.get('text', '')
        items = json.loads(text)
        
        assert len(items) >= 3, f"Expected at least 3 oeuvres, got {len(items)}"
        
        # Check structure
        assert 'title' in items[0], "Oeuvre missing 'title' field"
        assert 'description' in items[0], "Oeuvre missing 'description' field"
        
        # Verify specific work
        titles = [item['title'] for item in items]
        assert any('Khilâçu' in t for t in titles), "Missing 'Khilâçu-Dhahab' work"


class TestGamouEnrichedContent:
    """Tests for Gamou page enriched content (5 sections)"""
    
    def test_gamou_has_5_sections(self):
        """Gamou should have 5 sections: hero, intro, date_2025, program, advice"""
        response = requests.get(f"{BASE_URL}/api/content/gamou")
        assert response.status_code == 200
        
        data = response.json()
        sections = list(data.get('sections', {}).keys())
        
        assert len(sections) == 5, f"Expected 5 sections, got {len(sections)}: {sections}"
        
        expected_sections = ['hero', 'intro', 'date_2025', 'program', 'advice']
        for section in expected_sections:
            assert section in sections, f"Missing section: {section}"
    
    def test_gamou_program_has_4_phases(self):
        """Program section should have 4 phases"""
        response = requests.get(f"{BASE_URL}/api/content/gamou/program")
        assert response.status_code == 200
        
        data = response.json()
        text = data.get('text', '')
        items = json.loads(text)
        
        assert len(items) == 4, f"Expected 4 program phases, got {len(items)}"
        
        # Check structure
        assert 'phase' in items[0], "Program item missing 'phase' field"
        assert 'description' in items[0], "Program item missing 'description' field"
        
        # Verify specific phases
        phases = [item['phase'] for item in items]
        assert any('Bourde' in p for p in phases), "Missing 'Bourde' phase"
        assert any('Mawlid' in p for p in phases), "Missing 'Mawlid' phase"
    
    def test_gamou_advice_has_before_and_during(self):
        """Advice section should have before and during advice"""
        response = requests.get(f"{BASE_URL}/api/content/gamou/advice")
        assert response.status_code == 200
        
        data = response.json()
        text = data.get('text', '')
        advice = json.loads(text)
        
        assert 'before' in advice, "Advice missing 'before' field"
        assert 'during' in advice, "Advice missing 'during' field"
        
        assert len(advice['before']) >= 2, "Expected at least 2 'before' advice items"
        assert len(advice['during']) >= 2, "Expected at least 2 'during' advice items"


class TestEcoleEnrichedContent:
    """Tests for Ecole page enriched content (4 sections)"""
    
    def test_ecole_has_4_sections(self):
        """Ecole should have 4 sections: hero, intro, cycles, methods"""
        response = requests.get(f"{BASE_URL}/api/content/ecole")
        assert response.status_code == 200
        
        data = response.json()
        sections = list(data.get('sections', {}).keys())
        
        assert len(sections) == 4, f"Expected 4 sections, got {len(sections)}: {sections}"
        
        expected_sections = ['hero', 'intro', 'cycles', 'methods']
        for section in expected_sections:
            assert section in sections, f"Missing section: {section}"
    
    def test_ecole_cycles_has_3_levels(self):
        """Cycles section should have 3 teaching levels"""
        response = requests.get(f"{BASE_URL}/api/content/ecole/cycles")
        assert response.status_code == 200
        
        data = response.json()
        text = data.get('text', '')
        items = json.loads(text)
        
        assert len(items) == 3, f"Expected 3 cycles, got {len(items)}"
        
        # Check structure
        assert 'name' in items[0], "Cycle missing 'name' field"
        assert 'duration' in items[0], "Cycle missing 'duration' field"
        assert 'content' in items[0], "Cycle missing 'content' field"
        
        # Verify specific cycles
        names = [item['name'] for item in items]
        assert any('élémentaire' in n.lower() for n in names), "Missing elementary cycle"
        assert any('moyen' in n.lower() for n in names), "Missing middle cycle"
        assert any('supérieur' in n.lower() for n in names), "Missing advanced cycle"
    
    def test_ecole_methods_has_pedagogical_approaches(self):
        """Methods section should have pedagogical approaches"""
        response = requests.get(f"{BASE_URL}/api/content/ecole/methods")
        assert response.status_code == 200
        
        data = response.json()
        text = data.get('text', '')
        items = json.loads(text)
        
        assert len(items) >= 2, f"Expected at least 2 methods, got {len(items)}"
        
        # Check structure
        assert 'title' in items[0], "Method missing 'title' field"
        assert 'description' in items[0], "Method missing 'description' field"


class TestTotalContentCount:
    """Test total content count in admin panel"""
    
    def test_total_16_sections(self):
        """Total content should be 16 sections (7 maodo + 5 gamou + 4 ecole)"""
        response = requests.get(f"{BASE_URL}/api/content")
        assert response.status_code == 200
        
        data = response.json()
        count = data.get('count', 0)
        
        assert count == 16, f"Expected 16 total sections, got {count}"


class TestMultiLanguageSupport:
    """Test that enriched content supports multiple languages"""
    
    def test_timeline_english_content(self):
        """Timeline should have English content"""
        response = requests.get(f"{BASE_URL}/api/content/maodo/timeline?lang=en")
        assert response.status_code == 200
        
        data = response.json()
        text = data.get('text', '')
        items = json.loads(text)
        
        # English content should have "Birth" instead of "Naissance"
        first_event = items[0]['event']
        assert 'Birth' in first_event or 'born' in first_event.lower(), f"Expected English content, got: {first_event}"
    
    def test_program_arabic_content(self):
        """Program should have Arabic content"""
        response = requests.get(f"{BASE_URL}/api/content/gamou/program?lang=ar")
        assert response.status_code == 200
        
        data = response.json()
        text = data.get('text', '')
        items = json.loads(text)
        
        # Arabic content should have Arabic characters
        first_phase = items[0]['phase']
        assert any('\u0600' <= c <= '\u06FF' for c in first_phase), f"Expected Arabic content, got: {first_phase}"
