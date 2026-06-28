"""
Tests for the External Library bug fix:
Unicode filenames (Arabic) in Content-Disposition headers should not raise
'latin-1' codec encoding errors.

Endpoints under test:
  GET /api/ouvrages/external-library
  GET /api/ouvrages/external-library/proxy/{file_id}
  GET /api/ouvrages/external-library/serve/{file_id}
  GET /api/ouvrages/external-library/download/{file_id}
"""
import os
import sys
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://static-assets-fix-2.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api/ouvrages"

# Known seeded files (provided by main agent)
TEST_FILE_IDS = [
    ("Risâla", "ea09d162-ad58-42de-b517-cd588b4c4a7a"),
    ("Qaṣīdat al-Burda", "ad993f92-cf1a-4f91-933b-29826427fab1"),
    ("Dou'a wa Wazîfa", "027608af-8ccb-4e02-a795-1a6bbc6262e0"),
]


# ----------- Unit-style test of the helper function -----------
class TestSafeFilenameHeader:
    """Direct unit tests for the get_safe_filename_header helper."""

    def setup_method(self):
        sys.path.insert(0, "/app/backend")
        from routers.ouvrages import get_safe_filename_header
        self.fn = get_safe_filename_header

    def test_ascii_filename(self):
        header = self.fn("document.pdf", "inline")
        assert header == 'inline; filename="document.pdf"'
        header.encode("latin-1")  # must not raise

    def test_arabic_filename(self):
        header = self.fn("الرسالة.pdf", "inline")
        assert "filename*=UTF-8''" in header
        assert "filename=" in header
        header.encode("latin-1")  # HTTP header must be latin-1 safe

    def test_mixed_unicode_filename(self):
        # Original bug filename: Arabic + accented Latin
        header = self.fn("Risâla - الرسالة.pdf", "attachment")
        assert header.startswith("attachment;")
        assert "filename*=UTF-8''" in header
        header.encode("latin-1")  # HTTP header must be latin-1 safe

    def test_empty_after_ascii_strip(self):
        # filename composed of only non-ASCII chars should fallback to document.pdf
        header = self.fn("الرسالة.pdf", "inline")
        assert 'filename="document.pdf"' in header


# ----------- HTTP integration tests against deployed API -----------
class TestExternalLibraryListing:
    def test_listing(self):
        r = requests.get(f"{API}/external-library", timeout=30)
        assert r.status_code == 200
        data = r.json()
        assert "files" in data
        ids = {f["id"] for f in data["files"]}
        for _, fid in TEST_FILE_IDS:
            assert fid in ids, f"Expected test file id {fid} not in listing"


@pytest.mark.parametrize("name,file_id", TEST_FILE_IDS)
class TestPdfEndpoints:
    """Hit proxy / serve / download with range request to avoid downloading full PDFs."""

    HEADERS = {"Range": "bytes=0-1023"}

    def _check(self, endpoint, file_id, expected_disposition):
        url = f"{API}/external-library/{endpoint}/{file_id}"
        # Use stream=True to be safe; only download a small slice via Range
        r = requests.get(url, headers=self.HEADERS, timeout=30, stream=True)
        try:
            # 200 (server ignored range) or 206 (partial content) both acceptable
            assert r.status_code in (200, 206), f"{endpoint} returned {r.status_code}: {r.text[:200]}"
            assert r.headers.get("Content-Type", "").startswith("application/pdf"), \
                f"{endpoint} content-type: {r.headers.get('Content-Type')}"
            cd = r.headers.get("Content-Disposition", "")
            assert cd, f"{endpoint} missing Content-Disposition header"
            # The header must be latin-1 safe (this was the original bug)
            cd.encode("latin-1")
            # Quick magic byte check on first chunk
            chunk = next(r.iter_content(chunk_size=512), b"")
            assert chunk.startswith(b"%PDF"), \
                f"{endpoint} did not return PDF magic bytes (got {chunk[:8]!r})"
        finally:
            r.close()

    def test_proxy(self, name, file_id):
        self._check("proxy", file_id, "inline")

    def test_serve(self, name, file_id):
        self._check("serve", file_id, "inline")

    def test_download(self, name, file_id):
        self._check("download", file_id, "attachment")


# ----------- Negative case -----------
class TestNotFound:
    def test_proxy_nonexistent(self):
        r = requests.get(f"{API}/external-library/proxy/does-not-exist", timeout=15)
        assert r.status_code == 404

    def test_serve_nonexistent(self):
        r = requests.get(f"{API}/external-library/serve/does-not-exist", timeout=15)
        assert r.status_code == 404

    def test_download_nonexistent(self):
        r = requests.get(f"{API}/external-library/download/does-not-exist", timeout=15)
        assert r.status_code == 404
