#!/usr/bin/env node

/**
 * Standalone script to run the Cessna 172 G-1000 fleet scraper
 * Usage: node crawler/scrape.js
 */

import dotenv from 'dotenv';
import { scrapeFleet } from '../lib/scraper.js';
import { writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { put } from '@vercel/blob';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
    try {
        console.log('Starting Cessna 172 G-1000 fleet scraper...\n');
        
        // Run the scraper
        const fleetData = await scrapeFleet();
        const jsonData = JSON.stringify(fleetData, null, 2);

        // Save results to JSON file
        const outputFile = join(__dirname, '..', 'public', 'cessna_172_g1000_fleet.json');
        await writeFile(outputFile, jsonData);
        console.log(`Results saved to: ${outputFile}`);

        // Upload to Vercel Blob storage (if BLOB_READ_WRITE_TOKEN is available)
        if (process.env.BLOB_READ_WRITE_TOKEN) {
            try {
                const blob = await put('cessna_172_g1000_fleet.json', jsonData, {
                    access: 'public',
                    contentType: 'application/json',
                    allowOverwrite: true,
                });
                console.log(`Results uploaded to Blob storage: ${blob.url}`);
            } catch (blobError) {
                console.warn('Failed to upload to Blob storage:', blobError.message);
            }
        } else {
            console.log('BLOB_READ_WRITE_TOKEN not found, skipping Blob storage upload');
        }

        // Also print to console
        console.log('\nFleet Data:');
        console.log(jsonData);
        
    } catch (error) {
        console.error('Error running scraper:', error);
        process.exit(1);
    }
}

// Run the script if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}
