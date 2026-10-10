"""Shared location for collected exam originals (outside the served app)."""
from pathlib import Path

REPOSITORY_ROOT = Path(__file__).resolve().parents[4]
PAPERS_DIR = REPOSITORY_ROOT / "references" / "exams" / "csat-math" / "papers"
