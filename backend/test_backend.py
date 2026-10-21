"""
Test script to verify all FastAPI endpoints locally
"""
import sys
from fastapi.testclient import TestClient
from main import app

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

client = TestClient(app)

def test_all():
    print("Testing GET /health...")
    r = client.get("/health")
    assert r.status_code == 200, f"Health check failed: {r.status_code}"
    print("Health response:", r.json())

    print("\nTesting GET /api/cameras/status...")
    r = client.get("/api/cameras/status")
    assert r.status_code == 200
    print("Cameras status:", r.json()["summary"])

    print("\nTesting GET /api/cameras/snapshot/1 (Dahua CGI snapshot)...")
    r = client.get("/api/cameras/snapshot/1")
    assert r.status_code == 200
    assert r.headers["content-type"] == "image/jpeg"
    print(f"Snapshot received: {len(r.content)} bytes, Content-Type: {r.headers['content-type']}")

    print("\nTesting POST /api/detect/intruder (Night 23:45)...")
    r = client.post("/api/detect/intruder", json={"channel": 1, "simulated_time": "23:45", "motion_score": 0.95})
    assert r.status_code == 200
    res = r.json()
    print("Intruder test result:", res["alert_triggered"], res["alert_details"]["title"])

    print("\nTesting POST /api/detect/shutter (Early close 21:25)...")
    r = client.post("/api/detect/shutter", json={"channel": 1, "simulated_time": "21:25", "shutter_closed_percentage": 90.0})
    assert r.status_code == 200
    res = r.json()
    print("Shutter test result:", res["alert_triggered"], res["alert_details"]["title"])

    print("\nAll Backend tests passed successfully!")

if __name__ == "__main__":
    test_all()
