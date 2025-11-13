#!/usr/bin/env node

/**
 * Standalone script to run the Cessna 172 G-1000 fleet scraper
 * Usage: node crawler/scrape.js
 */

import { scrapeFleet } from '../lib/scraper.js';
import { writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
    try {
        console.log('Starting Cessna 172 G-1000 fleet scraper...\n');
        
        // Run the scraper
        const fleetData = await scrapeFleet();
        
        // Save results to JSON file
        const outputFile = join(__dirname, '..', 'public', 'cessna_172_g1000_fleet.json');
        await writeFile(outputFile, JSON.stringify(fleetData, null, 2));
        
        console.log(`Results saved to: ${outputFile}`);
        
        // Also print to console
        console.log('\nFleet Data:');
        console.log(JSON.stringify(fleetData, null, 2));
        
    } catch (error) {
        console.error('Error running scraper:', error);
        process.exit(1);
    }
}

// Run the script if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}
