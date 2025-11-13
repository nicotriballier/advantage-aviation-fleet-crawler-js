/**
 * Vercel Cron Job endpoint for updating fleet data
 * This endpoint is called by Vercel's cron scheduler
 * Updates both the local JSON file and Vercel Blob storage
 */

import { scrapeFleet } from '../lib/scraper.js';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { put } from '@vercel/blob';

const FLEET_DATA_PATH = join(process.cwd(), 'public', 'cessna_172_g1000_fleet.json');
const BLOB_FILENAME = 'cessna_172_g1000_fleet.json';

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
        const jsonData = JSON.stringify(fleetData, null, 2);

        // Save the updated data locally (for backup/debugging)
        await writeFile(FLEET_DATA_PATH, jsonData);
        console.log('Local file updated successfully');

        // Upload to Vercel Blob storage
        const blob = await put(BLOB_FILENAME, jsonData, {
            access: 'public',
            contentType: 'application/json',
            allowOverwrite: true,
        });

        console.log('Blob storage updated successfully:', blob.url);

        const response = {
            success: true,
            timestamp: new Date().toISOString(),
            count: Object.keys(fleetData).length,
            message: 'Fleet data updated successfully via cron job',
            blobUrl: blob.url,
            localPath: FLEET_DATA_PATH
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
