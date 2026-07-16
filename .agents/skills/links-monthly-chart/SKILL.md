---
name: links-monthly-chart
description: Query PostgreSQL using DATABASE_URL from a local .env file and generate a bar chart PNG showing monthly link counts for the last 12 months. Use this skill whenever the user asks for monthly link trends, link creation analytics, or a chart/image export from the links table.
---

# Links Monthly Chart

Generate a monthly bar chart for links created in the last 12 months and export it as a PNG image.

## When To Use

Use this skill when the user asks to:
- query links created over recent months
- visualize monthly counts in a chart
- export analytics as a PNG

## What This Skill Produces

- A PNG bar chart where:
- X axis: each month in the last 12 months (current month included)
- Y axis: total links created during that month

Default output path:
- `tmp/links_created_last_12_months.png`

## Implementation Files

- Script: `scripts/plot_links_by_month.py`
- Dependencies: `requirements.txt`

## Run Steps

1. Install Python dependencies:
```bash
python -m pip install -r .agents/skills/links-monthly-chart/requirements.txt
```

2. Run chart generation from project root (expects `.env` with `DATABASE_URL`):
```bash
python .agents/skills/links-monthly-chart/scripts/plot_links_by_month.py
```

3. Optional custom output path:
```bash
python .agents/skills/links-monthly-chart/scripts/plot_links_by_month.py --output tmp/my_monthly_links.png
```

## Notes

- The script loads `.env` automatically via `python-dotenv`.
- The query uses a generated month series and left join so months with zero links are shown as zero.
- Override table/column if needed:
```bash
python .agents/skills/links-monthly-chart/scripts/plot_links_by_month.py --table links --timestamp-column created_at
```
