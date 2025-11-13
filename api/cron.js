/**
 * Vercel Cron Job endpoint for updating fleet data
 * This endpoint is called by Vercel's cron scheduler
 * Updates the public JSON file at /crawler/cessna_172_g1000_fleet.json
 */

import { scrapeFleet } from '../lib/scraper.js';
import { writeFile } from 'fs/promises';
import { join } from 'path';

const FLEET_DATA_PATH = join(process.cwd(), 'public', 'cessna_172_g1000_fleet.json');

export default async function handler(req, res) {
    // Verify this is a cron request (Vercel adds this header)
    const cronSecret = req.headers['authorization'];
    
    // In production, you might want to verify the cron secret
    // For now, we'll just log the request
    console.log('Cron job triggered at:', new Date().toISOString());
    
    try {
        console.log('Starting scheduled fleet data update...');
        
        // Run the scraper
        const fleetData = await scrapeFleet();
        
        // Save the updated data
        await writeFile(FLEET_DATA_PATH, JSON.stringify(fleetData, null, 2));
        
        const response = {
            success: true,
            timestamp: new Date().toISOString(),
            count: Object.keys(fleetData).length,
            message: 'Fleet data updated successfully via cron job'
        };

        console.log('Cron job completed successfully:', response);
        res.status(200).json(response);
        
    } catch (error) {
        console.error('Cron job failed:', error);
        
        const errorResponse = {
            success: false,
            error: 'Cron job failed',
            message: error.message,
            timestamp: new Date().toISOString()
        };

        res.status(500).json(errorResponse);
    }
}
