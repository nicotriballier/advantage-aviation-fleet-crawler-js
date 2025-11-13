# Advantage Aviation Fleet Crawler (JavaScript)

A modern JavaScript web scraper deployed on Vercel to extract Cessna 172 G-1000 aircraft details from the Advantage Aviation rental fleet website.

## 🚀 Live Deployment

Access the live data at: `https://your-vercel-domain.vercel.app/cessna_172_g1000_fleet.json`

## 📊 Public Endpoint

- **`/cessna_172_g1000_fleet.json`** - Public JSON file (updated daily via cron)

## ⚡ Quick Start

### Local Development

```bash
# Clone the repository
git clone <repository-url>
cd advantage-aviation-fleet-crawler-js

# Install dependencies
npm install

# Run the scraper locally
npm start

# Start development server
npm run dev
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

## 🔄 Automated Updates

The fleet data is automatically updated daily at 6 AM UTC using Vercel's cron jobs. No manual intervention required!

## 📁 Project Structure

```
├── api/
│   └── cron.js            # Scheduled update (cron job)
├── lib/
│   └── scraper.js         # Core scraping logic
├── public/
│   └── cessna_172_g1000_fleet.json  # Public data file
├── crawler/
│   ├── scrape.js          # Standalone script
│   └── README.md          # Detailed documentation
├── package.json
├── vercel.json            # Vercel configuration
└── README.md
```

## 🛠 Technology Stack

- **Runtime**: Node.js 18+
- **Web Scraping**: Cheerio + node-fetch
- **Deployment**: Vercel Serverless Functions
- **Scheduling**: Vercel Cron Jobs
- **Data Format**: JSON

## 📈 Features

- ✅ Serverless deployment on Vercel
- ✅ Automated daily updates via cron jobs
- ✅ Public static JSON file
- ✅ CORS enabled for cross-origin requests
- ✅ Error handling and logging
- ✅ Duplicate removal
- ✅ Rate limiting (1s delay between requests)

## 🔧 Configuration

The scraper is configured via `vercel.json`:
- **Cron Schedule**: Daily at 6 AM UTC (`0 6 * * *`)
- **Function Timeout**: 5 minutes for scraping functions
- **CORS**: Enabled for all API endpoints

## 📊 Sample Data

```json
{
  "N501SC": {
    "price": "$203",
    "year": "2005"
  },
  "N362Q": {
    "price": "$238",
    "year": "2018",
    "type": "nxi"
  }
}
```

## 🚀 Deployment

### Deploy to Vercel

1. Install Vercel CLI and deploy:
```bash
npm install -g vercel
vercel login
vercel
```

2. **Access Your Data**:
   - Public JSON: `https://your-domain.vercel.app/cessna_172_g1000_fleet.json`

3. **Automatic Updates**:
   - Cron job runs daily at 6 AM UTC
   - No manual intervention needed!

## 🔄 Migration from Python

This project was migrated from Python to JavaScript for better Vercel integration and serverless deployment capabilities.

## 📝 License

This project is for educational and personal use only.
