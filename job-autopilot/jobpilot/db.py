"""SQLite job tracker — remembers every job seen so nothing is applied to twice."""

import sqlite3
from datetime import datetime, timezone

SCHEMA = """
CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source TEXT NOT NULL,
    external_id TEXT NOT NULL,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT DEFAULT '',
    url TEXT NOT NULL,
    apply_url TEXT DEFAULT '',
    score INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'new',
    notes TEXT DEFAULT '',
    first_seen TEXT NOT NULL,
    last_updated TEXT NOT NULL,
    UNIQUE(source, external_id)
);
"""

# status lifecycle:
#   new          → seen, scored below threshold or rejected by filters
#   matched      → passed filters, queued for application
#   applied      → application submitted
#   dry_run      → would have applied (apply.enabled was false)
#   needs_review → form has required questions the bot can't answer; apply manually
#   failed       → applier hit an error


def _now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


class JobDB:
    def __init__(self, path: str):
        self.conn = sqlite3.connect(path)
        self.conn.row_factory = sqlite3.Row
        self.conn.execute(SCHEMA)
        self.conn.commit()

    def upsert_job(self, job: dict, score: int, status: str) -> bool:
        """Insert a job if unseen. Returns True if it was new."""
        try:
            self.conn.execute(
                """INSERT INTO jobs (source, external_id, title, company, location,
                   url, apply_url, score, status, first_seen, last_updated)
                   VALUES (?,?,?,?,?,?,?,?,?,?,?)""",
                (
                    job["source"], str(job["external_id"]), job["title"], job["company"],
                    job.get("location", ""), job["url"], job.get("apply_url", ""),
                    score, status, _now(), _now(),
                ),
            )
            self.conn.commit()
            return True
        except sqlite3.IntegrityError:
            return False

    def set_status(self, source: str, external_id: str, status: str, notes: str = "") -> None:
        self.conn.execute(
            "UPDATE jobs SET status=?, notes=?, last_updated=? WHERE source=? AND external_id=?",
            (status, notes, _now(), source, str(external_id)),
        )
        self.conn.commit()

    def pending_applications(self, limit: int) -> list:
        rows = self.conn.execute(
            "SELECT * FROM jobs WHERE status='matched' ORDER BY score DESC, first_seen ASC LIMIT ?",
            (limit,),
        ).fetchall()
        return [dict(r) for r in rows]

    def summary(self) -> dict:
        rows = self.conn.execute(
            "SELECT status, COUNT(*) AS n FROM jobs GROUP BY status ORDER BY n DESC"
        ).fetchall()
        return {r["status"]: r["n"] for r in rows}

    def recent(self, limit: int = 20) -> list:
        rows = self.conn.execute(
            "SELECT * FROM jobs ORDER BY last_updated DESC LIMIT ?", (limit,)
        ).fetchall()
        return [dict(r) for r in rows]
