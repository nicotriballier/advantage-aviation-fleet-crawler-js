# Advantage Aviation Fleet Crawler

A JavaScript web scraper to extract Cessna 172 G-1000 aircraft details from the Advantage Aviation rental fleet website. Deployed on Vercel with automated cron jobs.

## Overview

This application scrapes the [Advantage Aviation rental aircraft page](https://advantage-aviation.com/rental-aircraft/#tab4) to extract information about all Cessna 172SP G-1000 aircraft in their fleet, including:
- Tail numbers (aircraft registration)
- Hourly rental rates
- Aircraft manufacturing year
- Avionics type (G1000 NXi detection)

## Features

- **JavaScript/Node.js**: Modern ES modules implementation
- **Vercel Deployment**: Serverless functions with automatic scaling
- **Automated Cron Jobs**: Daily updates at 6 AM UTC
- **Public API Endpoints**: Multiple ways to access the data
- **CORS Enabled**: Cross-origin requests supported

## Requirements

- Node.js 18+
- npm or yarn
- Vercel account (for deployment)

## Installation

1. Clone this repository
2. Install dependencies:
```bash
npm install
```

## Local Usage

Run the scraper locally:
```bash
npm start
# or
node crawler/scrape.js
```

Start local development server:
```bash
npm run dev
```

The scraper will:
1. Fetch the main rental aircraft page
2. Extract all Cessna 172SP G-1000 aircraft links
3. Visit each aircraft's detail page
4. Extract the tail number and hourly rate
5. Save results to `cessna_172_g1000_fleet.json`
6. Print the results to console

## Deployment on Vercel

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. The application will be available at your Vercel domain

### API Endpoints

Once deployed, the following endpoints are available:

- **`/api/cessna_172_g1000_fleet`** - Returns the raw fleet data (same as the JSON file)
- **`/cessna_172_g1000_fleet.json`** - Public endpoint for the JSON file (redirects to API)
- **`/api/fleet`** - Returns fleet data with metadata (GET) or updates data (POST)
- **`/api/scrape`** - Runs a fresh scrape and returns new data
- **`/api/cron`** - Internal endpoint for scheduled updates

### Cron Jobs

The application automatically updates the fleet data daily at 6 AM UTC using Vercel's cron functionality.

## Output

The scraper generates a JSON file (`cessna_172_g1000_fleet.json`) with the following structure:

```json
{
  "N501SC": {
    "price": "$203",
    "year": "2005"
  },
  "N16894": {
    "price": "$200",
    "year": "2007"
  },
  "N254EK": {
    "price": "$213",
    "year": "2011"
  },
  "N362Q": {
    "price": "$238",
    "year": "2018",
    "type": "nxi"
  },
  "N172AL": {
    "price": "$242",
    "year": "2023",
    "type": "nxi"
  }
}
```

### Data Fields

- **Tail Number** (key): Aircraft registration number (e.g., "N501SC")
- **price**: Hourly rental rate in USD (e.g., "$203")
- **year**: Aircraft manufacturing year (e.g., "2005")
- **type**: Avionics type - only present if aircraft has G1000 NXi (value: "nxi")

## Technical Features

- **Duplicate removal**: Automatically removes duplicate aircraft entries
- **Price extraction**: Uses multiple regex patterns to find hourly rates
- **Year detection**: Extracts aircraft manufacturing year from page content
- **NXi detection**: Automatically identifies G1000 NXi equipped aircraft
- **Dictionary format**: Uses tail numbers as keys for easy lookup
- **Polite scraping**: Includes 1-second delay between requests
- **Error handling**: Gracefully handles network errors and missing data
- **Progress tracking**: Shows real-time progress during scraping
- **Serverless**: Runs on Vercel's serverless platform
- **Auto-scaling**: Handles traffic spikes automatically

## Sample Results

As of the last run, the script found **16 unique Cessna 172SP G-1000 aircraft**:
- **Rates**: $200/hour to $242/hour
- **Years**: 2005 to 2024
- **NXi Models**: 8 aircraft (2018-2024)
- **Standard G1000**: 8 aircraft (2005-2014)

## Migration from Python

This project was migrated from Python to JavaScript for better Vercel integration:
- **Python version**: See `scrape_cessna_172_g1000.py` (legacy)
- **JavaScript version**: See `lib/scraper.js` and API endpoints
- **Dependencies**: Replaced `requests` + `beautifulsoup4` with `node-fetch` + `cheerio`

## Notes

- The scraper respects the website by adding delays between requests
- If the website structure changes, the scraper may need updates
- Uses a User-Agent header to identify itself as a browser
- Deployed on Vercel with automatic daily updates

## License

This project is for educational and personal use only.

