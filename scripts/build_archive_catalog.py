# 보관고(명화·지도) → 상품 라인 카탈로그 생성 (2026-08-25 홈페이지 통합 P2)
# 원천: 시스템-외부보관\명화-보관\_원장.jsonl · 지도-보관\_원장.jsonl (+ 각 _썸네일\)
# 산출: public/archive/{art,maps}/<id>.<ext> (썸네일 복사) + src/data/{artworks,maps}.json
# 규칙: NGII 세계지도 4종은 판매 제외(자사용 — NGII 고지), 나머지 전부 카탈로그.
import json, pathlib, shutil, sys, unicodedata

ROOT = pathlib.Path(__file__).resolve().parents[1]
ART_SRC = pathlib.Path(r"C:\Users\user\Desktop\시스템-외부보관\명화-보관")
MAP_SRC = pathlib.Path(r"C:\Users\user\Desktop\시스템-외부보관\지도-보관")
ART_OUT = ROOT / "public" / "archive" / "art"
MAP_OUT = ROOT / "public" / "archive" / "maps"
DATA = ROOT / "src" / "data"

def nfc(s): return unicodedata.normalize("NFC", s)

def thumb_index(src):
    idx = {}
    for p in (src / "_썸네일").iterdir():
        if p.is_file():
            idx[nfc(p.stem)] = p
    return idx

def print_width_mm(w, h, dpi_at_1200=None):
    """폭 1200mm 기준 dpi (긴 변을 폭으로 본다 — 롤 출력은 회전 가능)"""
    px = max(w or 0, h or 0)
    if not px: return None
    return round(px / (1200 / 25.4))  # px / (1200mm in inch) = dpi

def build_art():
    ART_OUT.mkdir(parents=True, exist_ok=True)
    thumbs = thumb_index(ART_SRC)
    items, missing = [], []
    for line in (ART_SRC / "_원장.jsonl").read_text(encoding="utf-8").splitlines():
        if not line.strip(): continue
        r = json.loads(line)
        stem = nfc(pathlib.Path(r["file"]).stem)
        t = thumbs.get(stem)
        if not t:
            missing.append(stem); continue
        ext = t.suffix.lower()
        dest = ART_OUT / f"{r['objectID']}{ext}"
        if not dest.exists(): shutil.copy2(t, dest)
        items.append({
            "id": str(r["objectID"]),
            "title": r.get("ko") or r["title"],
            "titleEn": r["title"],
            "artist": r.get("artist", ""),
            "year": r.get("date", ""),
            "institution": r.get("institution", ""),
            "license": r.get("license", ""),
            "grade": r.get("grade", "B"),
            "w": r.get("width"), "h": r.get("height"),
            "dpi1200": print_width_mm(r.get("width"), r.get("height")),
            "thumb": f"/archive/art/{r['objectID']}{ext}",
        })
    # 등급 A → 민화(국박) → B 순, 같은 등급 안에서 작가명순
    order = {"A": 0, "B": 2, "B-": 3}
    items.sort(key=lambda x: (order.get(x["grade"], 2), x["artist"], x["title"]))
    (DATA / "artworks.json").write_text(json.dumps(items, ensure_ascii=False, indent=1), encoding="utf-8")
    return len(items), missing

def build_maps():
    MAP_OUT.mkdir(parents=True, exist_ok=True)
    thumbs = thumb_index(MAP_SRC)
    items, missing, excluded = [], [], []
    for line in (MAP_SRC / "_원장.jsonl").read_text(encoding="utf-8").splitlines():
        if not line.strip(): continue
        r = json.loads(line)
        # NGII 세계지도 = 판매 제외(자사 공간용만 — 2026-08-24 NGII 고지)
        if r.get("source") == "ngii" and r.get("type") == "world":
            excluded.append(r["id"]); continue
        stem = nfc(pathlib.Path(r["file"]).stem)
        t = thumbs.get(stem)
        if not t:
            missing.append(stem); continue
        ext = t.suffix.lower()
        safe_id = nfc(r["id"])
        dest = MAP_OUT / f"{safe_id}{ext}"
        if not dest.exists(): shutil.copy2(t, dest)
        items.append({
            "id": safe_id,
            "title": r.get("title", ""),
            "type": r.get("type", ""),      # korea·vicinity·world·historic·region…
            "kind": r.get("종류") or "",
            "year": r.get("year", ""),
            "institution": r.get("institution", ""),
            "license": r.get("license", ""),
            "vector": bool(r.get("vector_file")),
            "w": r.get("width"), "h": r.get("height"),
            "dpi1200": print_width_mm(r.get("width"), r.get("height")),
            "thumb": f"/archive/maps/{safe_id}{ext}",
        })
    (DATA / "maps.json").write_text(json.dumps(items, ensure_ascii=False, indent=1), encoding="utf-8")
    return len(items), missing, excluded

if __name__ == "__main__":
    n_art, miss_a = build_art()
    n_map, miss_m, excl = build_maps()
    print(f"명화 {n_art}점 (썸네일 누락 {len(miss_a)}) · 지도 {n_map}건 (누락 {len(miss_m)} · 판매제외 {len(excl)}: {', '.join(excl)})")
    if miss_a: print("  명화 누락:", miss_a[:5])
    if miss_m: print("  지도 누락:", miss_m[:5])
