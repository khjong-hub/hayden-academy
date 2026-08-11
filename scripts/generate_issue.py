from __future__ import annotations
import json
import sys
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parents[1]
NOW = datetime.now(ZoneInfo("Asia/Seoul"))

KINDS = {
    "daily": {
        "dir": ROOT / "data" / "daily",
        "title": "TODAY",
        "subtitle": "세상을 읽고, 오늘의 시선을 남긴다.",
        "sections": ["오늘의 핵심 뉴스", "왜 Hayden에게 중요한가", "오늘의 한 문장", "5분 학습", "ONE QUESTION"],
    },
    "weekly": {
        "dir": ROOT / "data" / "weekly",
        "title": "WEEKLY",
        "subtitle": "이번 주의 정보에서 하나의 생각을 만든다.",
        "sections": ["THE SEED", "이번 주 핵심 뉴스 3", "전문성 수업", "현장 적용", "UDADA 연결점", "이번 주 질문"],
    },
    "monthly": {
        "dir": ROOT / "data" / "monthly",
        "title": "MONTHLY",
        "subtitle": "이번 달의 학습과 실행을 돌아보고 다음 선택을 만든다.",
        "sections": ["FIELD REVIEW", "Economy / Family Money", "Autism × Work / Ageing", "Faith / Teaching", "UDADA", "English", "다음 달의 한 가지 선택"],
    },
}

def next_issue_number(directory: Path) -> int:
    nums = []
    for p in directory.glob("*.md"):
        try:
            nums.append(int(p.stem))
        except ValueError:
            pass
    return max(nums, default=0) + 1

def render(kind: str, number: int) -> str:
    meta = KINDS[kind]
    lines = [
        f"# {meta['title']} · {number:03d}",
        "",
        f"> {meta['subtitle']}",
        "",
        f"**Generated:** {NOW.strftime('%Y-%m-%d %H:%M %Z')}",
        "",
        "## Editorial status",
        "",
        "v0.4 automation scaffold. 뉴스 수집과 AI 편집은 다음 단계에서 연결합니다.",
        "",
    ]
    for i, section in enumerate(meta["sections"], 1):
        lines += [
            f"## {i:02d} · {section}",
            "",
            "콘텐츠 슬롯 — 다음 자동화 단계에서 수집·분석된 자료가 들어갑니다.",
            "",
        ]
    return "\n".join(lines)

def main():
    if len(sys.argv) != 2 or sys.argv[1] not in KINDS:
        raise SystemExit("Usage: python scripts/generate_issue.py daily|weekly|monthly")

    kind = sys.argv[1]
    directory = KINDS[kind]["dir"]
    directory.mkdir(parents=True, exist_ok=True)
    number = next_issue_number(directory)
    path = directory / f"{number:03d}.md"
    path.write_text(render(kind, number), encoding="utf-8")

    status_path = ROOT / "automation" / "status.json"
    status = {}
    if status_path.exists():
        try:
            status = json.loads(status_path.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            pass

    status[kind] = {
        "last_generated": NOW.isoformat(),
        "issue": number,
        "file": str(path.relative_to(ROOT)).replace("\\", "/"),
        "mode": "scaffold",
    }
    status["last_run"] = NOW.isoformat()
    status["version"] = "0.4"

    status_path.write_text(json.dumps(status, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Generated {path}")

if __name__ == "__main__":
    main()
