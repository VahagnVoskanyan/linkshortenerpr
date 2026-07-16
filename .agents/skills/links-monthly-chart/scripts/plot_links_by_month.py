#!/usr/bin/env python3
"""Generate a PNG bar chart of monthly link counts for the last 12 months.

The script reads DATABASE_URL from a .env file in the current working directory
(or from the process environment), queries PostgreSQL, and exports a PNG chart.
"""

from __future__ import annotations

import argparse
import os
from pathlib import Path

import matplotlib.pyplot as plt
import psycopg
from dotenv import load_dotenv


DEFAULT_OUTPUT = Path("tmp") / "links_created_last_12_months.png"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Query monthly link counts for the past 12 months and save a PNG bar chart."
        )
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=DEFAULT_OUTPUT,
        help="Output PNG path (default: tmp/links_created_last_12_months.png)",
    )
    parser.add_argument(
        "--table",
        default="links",
        help="Links table name (default: links)",
    )
    parser.add_argument(
        "--timestamp-column",
        default="created_at",
        help="Timestamp column name for creation date (default: created_at)",
    )
    return parser.parse_args()


def build_query(table: str, timestamp_column: str) -> str:
    safe_table = table.replace('"', '""')
    safe_column = timestamp_column.replace('"', '""')

    return f"""
WITH months AS (
  SELECT generate_series(
    date_trunc('month', CURRENT_DATE) - INTERVAL '11 months',
    date_trunc('month', CURRENT_DATE),
    INTERVAL '1 month'
  ) AS month_start
)
SELECT
  to_char(months.month_start, 'Mon YYYY') AS month_label,
  COALESCE(COUNT(l.*), 0)::int AS total_links
FROM months
LEFT JOIN \"{safe_table}\" l
  ON l.\"{safe_column}\" >= months.month_start
  AND l.\"{safe_column}\" < months.month_start + INTERVAL '1 month'
GROUP BY months.month_start
ORDER BY months.month_start;
"""


def fetch_monthly_counts(database_url: str, table: str, timestamp_column: str) -> tuple[list[str], list[int]]:
    query = build_query(table, timestamp_column)

    with psycopg.connect(database_url) as connection:
        with connection.cursor() as cursor:
            cursor.execute(query)
            rows = cursor.fetchall()

    labels = [str(row[0]) for row in rows]
    values = [int(row[1]) for row in rows]
    return labels, values


def create_chart(labels: list[str], values: list[int], output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)

    plt.style.use("ggplot")
    fig, ax = plt.subplots(figsize=(12, 6))

    bars = ax.bar(labels, values)
    ax.set_title("Links Created Per Month (Last 12 Months)")
    ax.set_xlabel("Month")
    ax.set_ylabel("Total Links")
    ax.set_xticks(range(len(labels)), labels, rotation=45, ha="right")

    for bar, value in zip(bars, values):
        ax.text(
            bar.get_x() + bar.get_width() / 2,
            bar.get_height(),
            str(value),
            ha="center",
            va="bottom",
            fontsize=9,
        )

    fig.tight_layout()
    fig.savefig(output_path, format="png", dpi=160)
    plt.close(fig)


def main() -> int:
    load_dotenv()
    args = parse_args()

    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        raise RuntimeError("DATABASE_URL is not set. Add it to .env or environment variables.")

    labels, values = fetch_monthly_counts(
        database_url=database_url,
        table=args.table,
        timestamp_column=args.timestamp_column,
    )

    create_chart(labels=labels, values=values, output_path=args.output)
    print(f"Chart saved to: {args.output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
