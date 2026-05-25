#!/usr/bin/env python3
"""Generate workflow builder contact sheet using PIL.
Renders 3 representative state tiles (empty / mid-gen / completed) + contact sheet.
Used because chromium headless hangs on this host's macOS 26 build.
The actual feature is live at the GitHub Pages URL — these are review tiles.
"""
from PIL import Image, ImageDraw, ImageFont
import os

OUT = os.path.expanduser("~/Projects/dioxai-v2-mockups/screenshots")
os.makedirs(OUT, exist_ok=True)

# Brand colors
NAVY = (10, 26, 58)
NAVY_DEEP = (5, 13, 32)
GOLD = (201, 169, 97)
GOLD_SOFT = (217, 189, 124)
IVORY = (244, 241, 232)
INK = (26, 26, 26)
MUTED = (107, 107, 107)
GREY_BG = (245, 245, 243)
GREY_BORDER = (216, 216, 212)
PAIN_RED = (162, 59, 59)

W, H = 1440, 900

def font(size, bold=False, serif=False):
    candidates = []
    if serif:
        candidates += ["/System/Library/Fonts/Supplemental/Georgia Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Georgia.ttf"]
    else:
        candidates += ["/System/Library/Fonts/Helvetica.ttc"]
    for c in candidates:
        try: return ImageFont.truetype(c, size)
        except Exception: pass
    return ImageFont.load_default()

def text(d, xy, s, f, fill, anchor=None):
    d.text(xy, s, font=f, fill=fill, anchor=anchor)

def draw_nav(d, img):
    d.rectangle([0, 0, W, 72], fill=NAVY)
    text(d, (32, 36), "Digital Oxygen", font(20, serif=True), IVORY, anchor="lm")
    # gold dot
    text(d, (32+165, 36), ".", font(22, serif=True), GOLD, anchor="lm")
    text(d, (32+172, 36), "AI", font(20, serif=True), IVORY, anchor="lm")
    text(d, (W-260, 36), "Industries", font(13), IVORY, anchor="lm")
    text(d, (W-160, 36), "Workflow Builder", font(13), GOLD, anchor="lm")
    d.rectangle([W-40-90, 22, W-32, 50], outline=GOLD, width=1)
    text(d, (W-40-45, 36), "Book a call", font(12), GOLD, anchor="mm")

def draw_hero_top(d, headline_y=180):
    d.rectangle([0, 72, W, 480], fill=NAVY)
    text(d, (W//2, 130), "LIVE WORKFLOW BUILDER", font(11), GOLD, anchor="mm")
    text(d, (W//2, headline_y), "Show me your workflow.", font(42, serif=True), IVORY, anchor="mm")
    text(d, (W//2, headline_y+50), "I'll show you what I'd automate.", font(42, serif=True), GOLD, anchor="mm")
    text(d, (W//2, headline_y+110), "Describe what's eating your time. Watch your current process — and the version I'd build —", font(15), (200, 197, 184), anchor="mm")
    text(d, (W//2, headline_y+135), "render side by side in 10 seconds.", font(15), (200, 197, 184), anchor="mm")

# ----- 1. EMPTY STATE -----
def render_empty():
    img = Image.new("RGB", (W, H), IVORY)
    d = ImageDraw.Draw(img)
    draw_nav(d, img)
    draw_hero_top(d)
    # textarea
    x0, y0, x1, y1 = 220, 540, W-220, 740
    d.rounded_rectangle([x0, y0, x1, y1], radius=4, fill=(20, 38, 76), outline=GOLD, width=1)
    text(d, (x0+22, y0+30), "Tell me what's eating your time…", font(15), (160, 158, 148))
    text(d, (x0+22, y0+62), "e.g. 'Every time a lead fills out our contact form, my assistant has to copy it into the", font(13), (130, 128, 118))
    text(d, (x0+22, y0+84), "CRM, send a Slack ping, schedule a follow-up, and email the welcome packet — takes", font(13), (130, 128, 118))
    text(d, (x0+22, y0+106), "her 8 minutes per lead, 30 leads a day.'", font(13), (130, 128, 118))
    # examples
    ex_y = y1 + 28
    text(d, (x0, ex_y), "TRY ONE:", font(11), (160, 158, 148), anchor="lm")
    for i, lbl in enumerate(["Real estate lead", "Med spa DMs", "Law firm intake"]):
        bx = x0 + 88 + i*150
        d.rounded_rectangle([bx, ex_y-14, bx+135, ex_y+14], radius=2, outline=GOLD, width=1)
        text(d, (bx+67, ex_y), lbl, font(12), IVORY, anchor="mm")
    # submit
    d.rounded_rectangle([x1-260, ex_y-18, x1, ex_y+18], radius=2, fill=GOLD)
    text(d, (x1-130, ex_y), "Generate the comparison →", font(13), NAVY, anchor="mm")
    text(d, (x0, H-40), "3 generations per hour · powered by Gemini 3", font(11), (130, 128, 118), anchor="lm")
    img.save(f"{OUT}/wb_01_empty.png")
    return img

# ----- 2. MID-GENERATION -----
def render_loading():
    img = Image.new("RGB", (W, H), IVORY)
    d = ImageDraw.Draw(img)
    draw_nav(d, img)
    # Compressed hero
    d.rectangle([0, 72, W, 280], fill=NAVY)
    text(d, (W//2, 140), "LIVE WORKFLOW BUILDER", font(11), GOLD, anchor="mm")
    text(d, (W//2, 190), "Show me your workflow.", font(28, serif=True), IVORY, anchor="mm")
    # textarea minimized w/ user input
    d.rounded_rectangle([220, 230, W-220, 260], radius=4, fill=(20, 38, 76), outline=(80, 80, 100), width=1)
    text(d, (240, 245), "Every time a Zillow lead comes in my assistant has to look them up, draft a callback script, and ping me…", font(12), (200, 197, 184), anchor="lm")
    # Loading panel
    cx, cy = W//2, 540
    # spinner ring
    d.ellipse([cx-26, cy-72, cx+26, cy-20], outline=(220, 215, 200), width=3)
    # gold arc — fake top quadrant
    d.arc([cx-26, cy-72, cx+26, cy-20], start=270, end=30, fill=GOLD, width=4)
    text(d, (cx, cy+10), "Designing the automated version…", font(20, serif=True), NAVY, anchor="mm")
    text(d, (cx, cy+50), "Reading prompt · Mapping manual steps · ✓ Identifying pain points · Designing automation", font(11), MUTED, anchor="mm")
    # progress dots
    for i, on in enumerate([True, True, True, False, False]):
        col = GOLD if on else (220, 215, 200)
        d.ellipse([cx-100+i*44, cy+85, cx-100+i*44+12, cy+97], fill=col)
    img.save(f"{OUT}/wb_02_loading.png")
    return img

# ----- 3. COMPLETED -----
def draw_node(d, x, y, w, h, label, time_str, node_type, pain=None, is_auto=False):
    if is_auto:
        d.rounded_rectangle([x, y, x+w, y+h], radius=4, fill=(255, 255, 255), outline=(225, 225, 220), width=1)
        # gold left accent
        d.rectangle([x, y, x+3, y+h], fill=GOLD)
    else:
        d.rounded_rectangle([x, y, x+w, y+h], radius=4, fill=GREY_BG, outline=GREY_BORDER, width=1)
    # type tag
    type_colors = {
        "manual": ((221,221,221), (85,85,85)),
        "ai": (GOLD, NAVY),
        "notification": ((207,225,208), (46,90,54)),
        "integration": ((212,216,230), (53,64,117)),
    }
    bg, fg = type_colors.get(node_type, type_colors["manual"])
    tag_w = 6 * len(node_type) + 16
    d.rounded_rectangle([x+14, y+12, x+14+tag_w, y+28], radius=2, fill=bg)
    text(d, (x+14+tag_w/2, y+20), node_type.upper(), font(9, bold=True), fg, anchor="mm")
    # label
    text(d, (x+14+tag_w+10, y+20), label, font(13, bold=is_auto), INK, anchor="lm")
    # time
    time_color = GOLD if is_auto else MUTED
    text(d, (x+w-14, y+20), time_str, font(11, bold=is_auto), time_color, anchor="rm")
    # pain
    if pain:
        text(d, (x+14, y+44), f"⚠ {pain}", font(11), PAIN_RED, anchor="lm")

def draw_arrow(d, x, y, color):
    d.line([x, y, x, y+18], fill=color, width=2)
    d.polygon([(x-4, y+14), (x+4, y+14), (x, y+20)], fill=color)

def render_completed():
    img = Image.new("RGB", (W, H+700), IVORY)
    d = ImageDraw.Draw(img)
    draw_nav(d, img)
    d.rectangle([0, 72, W, 240], fill=NAVY)
    text(d, (W//2, 130), "RESULT", font(11), GOLD, anchor="mm")
    text(d, (W//2, 175), "Real estate agent · Zillow lead follow-up", font(24, serif=True), IVORY, anchor="mm")
    text(d, (W//2, 210), "Side-by-side comparison · what you do today vs. what Diox would build", font(13), (200, 197, 184), anchor="mm")

    panel_top = 280
    panel_w = (W - 80 - 60) // 2
    px1 = 40
    px2 = px1 + panel_w + 60

    # ---- MANUAL panel ----
    panel_h = 920
    d.rounded_rectangle([px1, panel_top, px1+panel_w, panel_top+panel_h], radius=6, fill="white", outline=(230,230,225), width=1)
    # header
    d.rounded_rectangle([px1+24, panel_top+24, px1+24+120, panel_top+50], radius=2, fill=(236,236,236))
    text(d, (px1+24+60, panel_top+37), "TODAY · MANUAL", font(9, bold=True), MUTED, anchor="mm")
    text(d, (px1+24, panel_top+78), "Your current workflow", font(22, serif=True), NAVY, anchor="lm")
    # stats
    stat_y = panel_top+118
    for i, (num, lbl) in enumerate([("67m","per execution"),("4","pain points"),("~14h","wasted / week")]):
        sx = px1+24 + i*150
        text(d, (sx, stat_y), num, font(22, serif=True), NAVY, anchor="lm")
        text(d, (sx, stat_y+24), lbl, font(9, bold=True), MUTED, anchor="lm")
    d.line([px1+24, panel_top+170, px1+panel_w-24, panel_top+170], fill=(230,230,225), width=1)
    # nodes
    nodes_m = [
        ("Zillow lead lands in inbox","instant","notification",None),
        ("Agent eventually notices the email","45 min","manual","Avg 45 min before anyone looks"),
        ("Pull up MLS, Zillow, social to research","12 min","manual","Tab-juggling, no consolidated view"),
        ("Draft talking points in notes app","6 min","manual",None),
        ("Call back — voicemail","4 min","manual","Competitor already called 90 min ago"),
        ("Lead goes cold","instant","manual","~70% ghost rate"),
    ]
    ny = panel_top+196
    for i, (lbl, t, ty, pain) in enumerate(nodes_m):
        h = 56 if pain else 40
        draw_node(d, px1+24, ny, panel_w-48, h, lbl, t, ty, pain=pain, is_auto=False)
        ny += h + 4
        if i < len(nodes_m)-1:
            draw_arrow(d, px1+24+(panel_w-48)//2, ny, (180,180,175))
            ny += 22

    # arrow between
    text(d, (W//2, panel_top + panel_h//2), "→", font(32, serif=True), GOLD, anchor="mm")

    # ---- AUTOMATED panel ----
    d.rounded_rectangle([px2, panel_top, px2+panel_w, panel_top+panel_h], radius=6, fill="white", outline=(230,230,225), width=1)
    d.rounded_rectangle([px2+24, panel_top+24, px2+24+140, panel_top+50], radius=2, fill=(238, 226, 192))
    text(d, (px2+24+70, panel_top+37), "WHAT DIOX BUILDS", font(9, bold=True), (138, 111, 46), anchor="mm")
    text(d, (px2+24, panel_top+78), "Automated", font(22, serif=True), NAVY, anchor="lm")
    stat_y = panel_top+118
    for i, (num, lbl) in enumerate([("5m","per execution"),("14h","reclaimed / week"),("$9,200","saved / month")]):
        sx = px2+24 + i*160
        text(d, (sx, stat_y), num, font(22, serif=True), GOLD, anchor="lm")
        text(d, (sx, stat_y+24), lbl, font(9, bold=True), MUTED, anchor="lm")
    d.line([px2+24, panel_top+170, px2+panel_w-24, panel_top+170], fill=(230,230,225), width=1)
    nodes_a = [
        ("Zillow lead hits webhook","instant","integration"),
        ("AI qualifier scores intent & budget fit","12s","ai"),
        ("Auto-enrich: comps, owner data, social","18s","ai"),
        ("Talking-points brief delivered to phone","6s","notification"),
        ("Agent calls back within 60 sec — armed","4 min","manual"),
    ]
    ny = panel_top+196
    for i, (lbl, t, ty) in enumerate(nodes_a):
        h = 40
        draw_node(d, px2+24, ny, panel_w-48, h, lbl, t, ty, is_auto=True)
        ny += h + 4
        if i < len(nodes_a)-1:
            draw_arrow(d, px2+24+(panel_w-48)//2, ny, GOLD)
            ny += 22

    # CTA
    cta_y = panel_top + panel_h + 50
    cta_w, cta_h = 460, 56
    d.rounded_rectangle([W//2-cta_w//2, cta_y, W//2+cta_w//2, cta_y+cta_h], radius=2, fill=NAVY)
    text(d, (W//2, cta_y+cta_h//2), "Schedule your consultation to build this →", font(16, bold=True), IVORY, anchor="mm")

    # Lead capture
    lead_y = cta_y + 100
    d.rounded_rectangle([120, lead_y, W-120, lead_y+110], radius=6, fill=NAVY)
    text(d, (160, lead_y+38), "Like what you see?", font(20, serif=True), IVORY, anchor="lm")
    text(d, (160, lead_y+68), "Get a written quote for this build. One email. No spam.", font(13), (200, 197, 184), anchor="lm")
    d.rounded_rectangle([W-560, lead_y+34, W-200, lead_y+74], radius=2, fill=(20,38,76), outline=(80,80,100), width=1)
    text(d, (W-548, lead_y+54), "you@yourcompany.com", font(13), (160,158,148), anchor="lm")
    d.rounded_rectangle([W-190, lead_y+34, W-145, lead_y+74], radius=2, fill=GOLD)
    text(d, (W-167, lead_y+54), "Send", font(13, bold=True), NAVY, anchor="mm")

    img.save(f"{OUT}/wb_03_completed.png")
    return img

# ----- CONTACT SHEET -----
def render_contact_sheet():
    pad = 30
    label_h = 60
    tile_w = 700
    tile_h = 440
    sheet_w = tile_w * 2 + pad * 3
    sheet_h = tile_h * 2 + label_h * 2 + pad * 4 + 100  # extra for header
    sheet = Image.new("RGB", (sheet_w, sheet_h), IVORY)
    d = ImageDraw.Draw(sheet)
    # Header bar
    d.rectangle([0, 0, sheet_w, 80], fill=NAVY)
    text(d, (pad, 40), "Digital Oxygen", font(20, serif=True), IVORY, anchor="lm")
    text(d, (pad+165, 40), ".", font(22, serif=True), GOLD, anchor="lm")
    text(d, (pad+172, 40), "AI · Workflow Builder · v2 mockup", font(16, serif=True), IVORY, anchor="lm")
    text(d, (sheet_w-pad, 40), "dioxai.github.io/dioxai-v2-mockups/workflow-builder/", font(11), GOLD, anchor="rm")

    tiles = [
        ("wb_01_empty.png", "1 · Empty state — visitor lands, sees the prompt"),
        ("wb_02_loading.png", "2 · Mid-generation — Gemini is mapping the workflow"),
        ("wb_03_completed.png", "3 · Result — side-by-side comparison + CTA"),
    ]
    # 2x2 layout, last tile spans full width
    positions = [
        (pad, 80+pad),
        (pad*2 + tile_w, 80+pad),
        (pad, 80+pad*2 + tile_h + label_h),
    ]
    # last tile wide
    for i, (fname, lbl) in enumerate(tiles):
        src = Image.open(f"{OUT}/{fname}")
        if i == 2:
            w = tile_w*2 + pad
            h = tile_h
        else:
            w = tile_w
            h = tile_h
        src.thumbnail((w, h*3), Image.LANCZOS)
        # paste centered horizontally in tile area
        x, y = positions[i]
        # draw frame
        d.rectangle([x-2, y-2, x+w+2, y+h+2], outline=(210, 207, 195), width=1)
        # crop/resize to fit
        src_resized = src.resize((w, h), Image.LANCZOS)
        sheet.paste(src_resized, (x, y))
        # label
        text(d, (x, y+h+18), lbl, font(13, bold=True), NAVY, anchor="lm")

    sheet.save(f"{OUT}/wb_contact_sheet.png")
    print("contact sheet:", f"{OUT}/wb_contact_sheet.png")

if __name__ == "__main__":
    render_empty()
    print("✓ empty")
    render_loading()
    print("✓ loading")
    render_completed()
    print("✓ completed")
    render_contact_sheet()
    print("✓ contact sheet")
