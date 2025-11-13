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

# Test cron job locally (requires .env.local with BLOB_READ_WRITE_TOKEN)
npm run test-cron
```

## 🔧 How it works

1. **Web Scraping**: Uses Puppeteer to navigate the Advantage Aviation website
2. **Data Extraction**: Extracts aircraft details including tail numbers, prices, and years
3. **Local Storage**: Saves results to `public/cessna_172_g1000_fleet.json`
4. **Blob Upload**: Uploads the JSON file to Vercel Blob storage at `https://54cbtlnmz1w1zpur.public.blob.vercel-storage.com/cessna_172_g1000_fleet.json`
5. **Automated Updates**: Vercel cron job runs daily at 6 AM UTC to update both local and blob storage

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Environment Variables

You need to set the following environment variable in your Vercel project:

- **`BLOB_READ_WRITE_TOKEN`** - Your Vercel Blob storage token for uploading files

Set this in your Vercel dashboard under Project Settings → Environment Variables.

### Local Testing with Blob Storage

To test the Blob storage upload locally:

1. **Create `.env.local` file** (already created for you):
   ```bash
   BLOB_READ_WRITE_TOKEN=your_actual_token_here
   ```

2. **Get your Blob token** from Vercel dashboard:
   - Go to your project → Settings → Storage → Blob
   - Copy the read/write token

3. **Test the cron job**:
   ```bash
   npm run test-cron
   ```

4. **Test the scraper**:
   ```bash
   npm start
   ```

Both commands will upload to your Blob storage if the token is configured correctly.

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

## Note about the Vercel deployment

This is a function only, with no output. To avoid a Vercel deployment issue, make sure you use that build command:

```bash
mkdir public && echo '<!DOCTYPE html><html><body>API Only</body></html>' > public/index.html
```

## 📝 License

This project is for educational and personal use only...
