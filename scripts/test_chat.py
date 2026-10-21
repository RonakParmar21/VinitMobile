import sys
import urllib.request
import json

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

queries = [
    "क्या V01 शॉप का कैमरा ऑन है?",
    "V01 की लाइव फोटो भेजो",
    "कौन से कैमरे ऑफलाइन हैं?",
    "शटर की क्या स्थिति है?",
    "नमस्ते",
    "चैनल 2 बिलिंग काउंटर की फोटो दिखाओ",
    "रात का अलर्ट दिखाओ"
]

print("=== VERIFYING WHATSAPP HINDI AI BOT RESPONSES ===")
for q in queries:
    req = urllib.request.Request("http://localhost:3005/api/chat", method="POST")
    req.add_header("Content-Type", "application/json")
    body = json.dumps({"message": q}).encode("utf-8")
    with urllib.request.urlopen(req, data=body) as res:
        resp = json.loads(res.read().decode("utf-8"))
        has_card = "snapshotCard" in resp and resp["snapshotCard"] is not None
        card_info = f" [ATTACHED CARD: {resp['snapshotCard']['title']}]" if has_card else ""
        print(f"QUERY: \"{q}\"")
        print(f"STATUS: HTTP {res.status} OK")
        print(f"REPLY: {resp['reply'][:100]}...{card_info}")
        print("-" * 60)
