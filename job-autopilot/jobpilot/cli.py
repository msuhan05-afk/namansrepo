"""Command-line interface.

  jobpilot init             write config.yaml from the bundled example
  jobpilot run              one fetch → match → apply pass
  jobpilot loop             run continuously on the configured interval
  jobpilot status           show the tracking database summary
"""

import argparse
import logging
import shutil
import sys
import time
from pathlib import Path

from jobpilot.config import load_config
from jobpilot.db import JobDB


def main(argv=None):
    parser = argparse.ArgumentParser(prog="jobpilot", description="Autonomous job application tool")
    parser.add_argument("-c", "--config", default="config.yaml", help="path to config file")
    parser.add_argument("-v", "--verbose", action="store_true")
    sub = parser.add_subparsers(dest="command", required=True)

    sub.add_parser("init", help="create config.yaml from the example")
    run_p = sub.add_parser("run", help="single pass: fetch, match, apply")
    run_p.add_argument("--apply", action="store_true",
                       help="override config and actually submit applications")
    loop_p = sub.add_parser("loop", help="run forever on the configured interval")
    loop_p.add_argument("--apply", action="store_true",
                        help="override config and actually submit applications")
    status_p = sub.add_parser("status", help="show tracking database summary")
    status_p.add_argument("-n", type=int, default=15, help="recent rows to show")

    args = parser.parse_args(argv)
    logging.basicConfig(
        level=logging.DEBUG if args.verbose else logging.INFO,
        format="%(asctime)s %(levelname)-7s %(name)s: %(message)s",
        datefmt="%H:%M:%S",
    )

    if args.command == "init":
        return cmd_init(args)

    cfg = load_config(args.config)
    if getattr(args, "apply", False):
        cfg.apply.enabled = True

    if args.command == "run":
        return cmd_run(cfg)
    if args.command == "loop":
        return cmd_loop(cfg)
    if args.command == "status":
        return cmd_status(cfg, args.n)


def cmd_init(args):
    dest = Path(args.config)
    if dest.exists():
        print(f"{dest} already exists — not overwriting", file=sys.stderr)
        return 1
    example = Path(__file__).parent.parent / "config.example.yaml"
    shutil.copy(example, dest)
    print(f"Wrote {dest}. Edit it with your profile, then run: jobpilot run")
    return 0


def cmd_run(cfg):
    from jobpilot.runner import run_once

    stats = run_once(cfg)
    print(
        f"\nfetched={stats['fetched']} new={stats['new']} matched={stats['matched']} "
        f"applied={stats['applied']} dry_run={stats['dry_run']} "
        f"needs_review={stats['needs_review']} failed={stats['failed']}"
    )
    return 0


def cmd_loop(cfg):
    from jobpilot.runner import run_once

    interval = cfg.loop_interval_minutes * 60
    print(f"Looping every {cfg.loop_interval_minutes} min "
          f"({'LIVE — applications will be submitted' if cfg.apply.enabled else 'dry run'}). Ctrl-C to stop.")
    while True:
        try:
            run_once(cfg)
        except KeyboardInterrupt:
            return 0
        except Exception:
            logging.getLogger("jobpilot").exception("run failed; will retry next interval")
        try:
            time.sleep(interval)
        except KeyboardInterrupt:
            return 0


def cmd_status(cfg, n):
    db = JobDB(str(cfg.resolve(cfg.database)))
    summary = db.summary()
    if not summary:
        print("Database is empty — run `jobpilot run` first.")
        return 0
    print("Status counts:")
    for status, count in summary.items():
        print(f"  {status:>13}: {count}")
    print(f"\nLast {n} updates:")
    for row in db.recent(n):
        print(f"  [{row['status']:>12}] ({row['score']:>2}) {row['title']} — "
              f"{row['company']}  {row['url']}")
        if row["notes"]:
            print(f"                 {row['notes']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
