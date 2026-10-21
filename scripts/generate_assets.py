import os
import math
from PIL import Image, ImageDraw, ImageFont

os.makedirs("public/snapshots/staff", exist_ok=True)

def draw_dahua_osd(draw, width, height, ch_name, model, timestamp="2026-10-21 21:45:12 WED", status="REC [●]"):
    # Header Dahua text
    draw.rectangle([0, 0, width, 36], fill=(0, 0, 0, 160))
    draw.text((15, 10), f"DAHUA TECHNOLOGY | {model}", fill=(200, 220, 240))
    draw.text((width - 240, 10), ch_name, fill=(0, 255, 128))

    # Bottom bar
    draw.rectangle([0, height - 36, width, height], fill=(0, 0, 0, 160))
    draw.text((15, height - 26), f"{status} 25.0 FPS | 4096 Kbps | H.265+", fill=(255, 60, 60) if "REC" in status else (180, 180, 180))
    draw.text((width - 250, height - 26), timestamp, fill=(255, 255, 255))
    
    # Corner brackets (CCTV viewfinder)
    bracket_len = 30
    c_color = (0, 255, 150, 140)
    # TL
    draw.line([(30, 50), (30 + bracket_len, 50)], fill=c_color, width=2)
    draw.line([(30, 50), (30, 50 + bracket_len)], fill=c_color, width=2)
    # TR
    draw.line([(width - 30 - bracket_len, 50), (width - 30, 50)], fill=c_color, width=2)
    draw.line([(width - 30, 50), (width - 30, 50 + bracket_len)], fill=c_color, width=2)
    # BL
    draw.line([(30, height - 50), (30 + bracket_len, height - 50)], fill=c_color, width=2)
    draw.line([(30, height - 50), (30, height - 50 - bracket_len)], fill=c_color, width=2)
    # BR
    draw.line([(width - 30 - bracket_len, height - 50), (width - 30, height - 50)], fill=c_color, width=2)
    draw.line([(width - 30, height - 50), (width - 30, height - 50 - bracket_len)], fill=c_color, width=2)


def generate_cam1():
    # Channel 1: Store Entrance & Shutter
    width, height = 960, 540
    img = Image.new("RGB", (width, height), (16, 22, 34))
    draw = ImageDraw.Draw(img, "RGBA")

    # Background shop interior perspective
    # Floor tiles
    for y in range(300, height, 25):
        alpha = int(40 + (y - 300) * 0.4)
        draw.line([(0, y), (width, y)], fill=(40, 55, 80, alpha), width=1)
    for x in range(0, width + 100, 80):
        draw.line([(width//2, 220), (x, height)], fill=(40, 55, 80, 50), width=1)

    # Shutter roll-down guide rails on sides
    draw.rectangle([60, 40, 110, height - 50], fill=(28, 38, 54), outline=(50, 70, 95))
    draw.rectangle([width - 110, 40, width - 60, height - 50], fill=(28, 38, 54), outline=(50, 70, 95))

    # Top Shutter Box (Metal rolled shutter drum)
    draw.rectangle([60, 40, width - 60, 120], fill=(22, 30, 45), outline=(65, 88, 120), width=2)
    draw.text((width//2 - 120, 70), "VINIT MOBILE - SURAT V01", fill=(255, 195, 0))
    draw.text((width//2 - 95, 95), "MAIN ENTRANCE SHUTTER GATE", fill=(140, 170, 200))

    # Glass entrance door outline
    draw.rectangle([130, 125, width - 130, height - 60], outline=(70, 110, 160, 180), width=3)
    draw.line([(width//2, 125), (width//2, height - 60)], fill=(70, 110, 160, 180), width=2)

    # Mobile showcase displays inside store
    draw.rectangle([180, 260, 360, 430], fill=(20, 28, 48), outline=(0, 200, 255, 180), width=2)
    draw.text((200, 275), "[SMARTPHONE SHOWCASE A]", fill=(0, 220, 255))
    draw.rectangle([210, 310, 245, 370], fill=(10, 15, 25), outline=(0, 255, 180))
    draw.rectangle([260, 310, 295, 370], fill=(10, 15, 25), outline=(0, 255, 180))
    draw.rectangle([310, 310, 345, 370], fill=(10, 15, 25), outline=(0, 255, 180))

    draw.rectangle([width - 360, 260, width - 180, 430], fill=(20, 28, 48), outline=(255, 140, 0, 180), width=2)
    draw.text((width - 340, 275), "[ACCESSORIES & AUDIO B]", fill=(255, 160, 50))
    draw.rectangle([width - 340, 310, width - 290, 360], fill=(10, 15, 25), outline=(255, 180, 70))
    draw.rectangle([width - 270, 310, width - 220, 360], fill=(10, 15, 25), outline=(255, 180, 70))

    # Shutter status indicator overlay
    draw.rectangle([width//2 - 130, 160, width//2 + 130, 200], fill=(0, 50, 30, 220), outline=(0, 255, 140), width=2)
    draw.text((width//2 - 110, 172), "SHUTTER: FULLY OPEN (NORMAL)", fill=(0, 255, 150))

    # Subtle scanlines
    for y in range(0, height, 4):
        draw.line([(0, y), (width, y)], fill=(0, 0, 0, 35))

    draw_dahua_osd(draw, width, height, "CH01 - STORE ENTRANCE", "IPC-HFW2431S-S2 (SURAT-V01)")
    img.save("public/snapshots/v01_cam1.jpg", "JPEG", quality=92)
    print("Created public/snapshots/v01_cam1.jpg")


def generate_cam2():
    # Channel 2: Billing Counter
    width, height = 960, 540
    img = Image.new("RGB", (width, height), (18, 20, 32))
    draw = ImageDraw.Draw(img, "RGBA")

    # Desk perspective
    draw.polygon([(80, 300), (width - 80, 300), (width - 40, height - 40), (40, height - 40)], fill=(24, 32, 50), outline=(60, 80, 110))

    # POS Computer monitor
    draw.rectangle([200, 170, 420, 320], fill=(12, 16, 26), outline=(0, 220, 255), width=2)
    draw.rectangle([210, 180, 410, 310], fill=(6, 12, 22))
    draw.text((225, 195), "VINIT BILLING ERP v4.2", fill=(0, 255, 180))
    draw.text((225, 220), "Invoice #: INV-SRT-8821", fill=(180, 210, 255))
    draw.text((225, 245), "Items: OnePlus 12 5G x1", fill=(180, 210, 255))
    draw.text((225, 270), "Total: Rs 64,999.00 PAID", fill=(0, 255, 120))
    draw.rectangle([290, 320, 330, 345], fill=(30, 40, 60))
    draw.rectangle([260, 345, 360, 352], fill=(40, 50, 75))

    # Barcode scanner & Thermal Printer
    draw.rectangle([460, 270, 540, 335], fill=(30, 36, 52), outline=(100, 120, 160))
    draw.text((470, 285), "RECEIPT", fill=(220, 220, 220))
    draw.line([(480, 310), (520, 310)], fill=(0, 255, 100), width=2)

    # Cash drawer / Secure Safe
    draw.rectangle([600, 260, 840, 340], fill=(22, 28, 42), outline=(255, 180, 0), width=2)
    draw.text((640, 275), "CASH TILL - LOCKED", fill=(255, 200, 50))
    draw.text((640, 305), "CCTV OVERHEAD VERIFIED", fill=(120, 200, 160))

    # Staff Presence detection box
    draw.rectangle([160, 120, 460, 420], outline=(0, 255, 120, 160), width=2)
    draw.text((170, 130), "STAFF ATTENDANCE: PRIYA SHARMA (ID #102)", fill=(0, 255, 160))

    for y in range(0, height, 4):
        draw.line([(0, y), (width, y)], fill=(0, 0, 0, 35))

    draw_dahua_osd(draw, width, height, "CH02 - BILLING COUNTER", "IPC-HDW2431T-AS (SURAT-V01)")
    img.save("public/snapshots/v01_cam2.jpg", "JPEG", quality=92)
    print("Created public/snapshots/v01_cam2.jpg")


def generate_cam3():
    # Channel 3: Inventory Room - Offline
    width, height = 960, 540
    img = Image.new("RGB", (width, height), (12, 12, 18))
    draw = ImageDraw.Draw(img, "RGBA")

    # Static noise grid
    for x in range(0, width, 40):
        for y in range(0, height, 40):
            draw.point((x + 10, y + 10), fill=(50, 50, 70))

    # Red offline warning box
    draw.rectangle([width//2 - 250, height//2 - 90, width//2 + 250, height//2 + 90], fill=(35, 15, 20, 230), outline=(255, 50, 50), width=3)
    draw.text((width//2 - 190, height//2 - 65), "[!] CAMERA OFFLINE - NO SIGNAL", fill=(255, 80, 80))
    draw.text((width//2 - 220, height//2 - 30), "DAHUA IPC-HFW1230S-S5 (INVENTORY RM)", fill=(255, 200, 200))
    draw.text((width//2 - 200, height//2 + 5), "IP: 192.168.1.103 | PORT: 554 RTSP", fill=(180, 180, 180))
    draw.text((width//2 - 210, height//2 + 40), "STATUS: RECONNECTING (PINGS FAILED: 14)", fill=(255, 160, 50))

    draw_dahua_osd(draw, width, height, "CH03 - INVENTORY (OFFLINE)", "IPC-HFW1230S-S5 (SURAT-V01)", status="LOSS [x]")
    img.save("public/snapshots/v01_cam3.jpg", "JPEG", quality=92)
    print("Created public/snapshots/v01_cam3.jpg")


def generate_intruder():
    # Night intruder alert frame
    width, height = 960, 540
    # Monochrome night IR mode (greenish-grey)
    img = Image.new("RGB", (width, height), (10, 18, 14))
    draw = ImageDraw.Draw(img, "RGBA")

    # Floor grid in IR night mode
    for y in range(280, height, 20):
        draw.line([(0, y), (width, y)], fill=(20, 45, 30), width=1)

    # Intruder bounding box (RED neon)
    draw.rectangle([380, 140, 580, 480], outline=(255, 30, 30), width=3)
    draw.rectangle([380, 105, 580, 140], fill=(255, 30, 30))
    draw.text((390, 112), "PERSON: 96.4% CONF", fill=(255, 255, 255))
    draw.text((390, 126), "ZONE: RESTRICTED NIGHT", fill=(255, 240, 240))

    # Target reticle
    draw.line([(480, 130), (480, 155)], fill=(255, 50, 50), width=2)
    draw.line([(480, 465), (480, 490)], fill=(255, 50, 50), width=2)
    draw.line([(370, 310), (395, 310)], fill=(255, 50, 50), width=2)
    draw.line([(565, 310), (590, 310)], fill=(255, 50, 50), width=2)

    # Security Alert Banner
    draw.rectangle([40, 50, width - 40, 95], fill=(50, 0, 0, 220), outline=(255, 50, 50), width=2)
    draw.text((60, 65), "CRITICAL ALERT: UNAUTHORIZED NIGHT ENTRY DETECTED (23:45:10)", fill=(255, 80, 80))

    for y in range(0, height, 4):
        draw.line([(0, y), (width, y)], fill=(0, 0, 0, 40))

    draw_dahua_osd(draw, width, height, "CH01 - ENTRANCE (NIGHT IR)", "IPC-HFW2431S-S2", timestamp="2026-10-21 23:45:10 WED", status="ALARM [!]")
    img.save("public/snapshots/intruder_sample.jpg", "JPEG", quality=92)
    print("Created public/snapshots/intruder_sample.jpg")


def generate_staff_avatars():
    staff_members = [
        ("amit_patel.jpg", "Amit Patel", "Store Manager", (20, 60, 120), "AP"),
        ("priya_sharma.jpg", "Priya Sharma", "Sales Exec", (120, 30, 80), "PS"),
        ("rahul_deshmukh.jpg", "Rahul Deshmukh", "Billing Specialist", (30, 100, 60), "RD"),
        ("neha_singh.jpg", "Neha Singh", "Inventory Lead", (100, 70, 20), "NS"),
    ]

    for filename, name, role, bg_color, initials in staff_members:
        size = 200
        img = Image.new("RGB", (size, size), bg_color)
        draw = ImageDraw.Draw(img)
        
        # Circle avatar background
        draw.ellipse([20, 20, size - 20, size - 20], fill=(bg_color[0]+30, bg_color[1]+30, bg_color[2]+30), outline=(255, 255, 255), width=3)
        # Face silhouette
        draw.ellipse([70, 45, 130, 105], fill=(235, 200, 175))
        draw.ellipse([45, 110, 155, 185], fill=(45, 60, 80))
        
        # Initials badge
        draw.rectangle([10, size - 40, size - 10, size - 10], fill=(0, 0, 0, 200))
        draw.text((25, size - 32), name[:16], fill=(255, 255, 255))
        
        img.save(f"public/snapshots/staff/{filename}", "JPEG", quality=95)
        print(f"Created public/snapshots/staff/{filename}")

if __name__ == "__main__":
    generate_cam1()
    generate_cam2()
    generate_cam3()
    generate_intruder()
    generate_staff_avatars()
    print("All mock snapshot assets generated successfully!")
