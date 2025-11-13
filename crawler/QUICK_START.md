# Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies
```bash
pip3 install -r requirements.txt
```

### 2. Run the Scraper
```bash
python3 scrape_cessna_172_g1000.py
```

### 3. View Results
```bash
python3 view_results.py
```

## 📊 What You Get

The scraper extracts data for all **Cessna 172SP G-1000** aircraft from Advantage Aviation and provides:

- ✅ **Tail numbers** for each aircraft
- ✅ **Hourly rental rates**
- ✅ **Direct links** to each aircraft page
- ✅ **JSON output** for easy integration

## 📁 Output Files

| File | Description |
|------|-------------|
| `cessna_172_g1000_fleet.json` | Raw JSON data with all aircraft details |
| `RESULTS_SUMMARY.md` | Human-readable summary with tables |

## 🔍 Example Output

```json
[
  {
    "tail_number": "N16894",
    "rate_per_hour": 200.0,
    "model": "Cessna 172SP G-1000",
    "additional_info": {}
  }
]
```

## 💡 Tips

- The scraper includes a 1-second delay between requests to be polite to the server
- Results are automatically deduplicated
- If the website structure changes, you may need to update the scraper

## 🔄 Re-running the Scraper

Simply run the scraper again to get fresh data:
```bash
python3 scrape_cessna_172_g1000.py
```

The JSON file will be overwritten with the latest data.

## 📞 Source

Data is scraped from: https://advantage-aviation.com/rental-aircraft/#tab4

---

**Note:** This tool is for informational purposes. Always verify rates and availability directly with Advantage Aviation before booking.

