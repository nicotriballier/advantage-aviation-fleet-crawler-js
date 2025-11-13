/**
 * Advantage Aviation Fleet Crawler - JavaScript Implementation
 * Scrapes Cessna 172 G-1000 aircraft details from Advantage Aviation website
 */

import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

/**
 * Fetch HTML content from a URL
 * @param {string} url - The URL to fetch
 * @returns {Promise<string|null>} HTML content or null if error
 */
export async function fetchPage(url) {
    try {
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        };
        
        const response = await fetch(url, { 
            headers, 
            timeout: 30000 
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.text();
    } catch (error) {
        console.error(`Error fetching ${url}:`, error.message);
        return null;
    }
}

/**
 * Extract all Cessna 172 G-1000 aircraft links from the main page
 * @param {string} html - HTML content of the main page
 * @param {string} baseUrl - Base URL for relative links
 * @returns {Array<Object>} Array of aircraft objects with tail_number and url
 */
export function extractCessna172G1000Links(html, baseUrl) {
    const $ = cheerio.load(html);
    const aircraftMap = new Map(); // Use Map to avoid duplicates

    // Find all links that match aircraft tail number pattern (N followed by alphanumeric)
    $('a[href]').each((_, element) => {
        const $link = $(element);
        const href = $link.attr('href') || '';
        const text = $link.text().trim();

        // Match tail number pattern (N followed by 3-6 alphanumeric characters)
        if (/^N[A-Z0-9]{3,6}$/.test(text)) {
            // Check if this link is in the Cessna 172SP G-1000 section
            const $parentSection = $link.closest('div');
            if ($parentSection.length) {
                const sectionText = $parentSection.text();
                if (sectionText.includes('Cessna Skyhawk 172SP G-1000') || 
                    sectionText.includes('172SP G-1000')) {
                    const fullUrl = href.startsWith('http') ? href : baseUrl + href;
                    // Use tail number as key to avoid duplicates
                    aircraftMap.set(text, {
                        tail_number: text,
                        url: fullUrl
                    });
                }
            }
        }
    });

    return Array.from(aircraftMap.values());
}

/**
 * Extract aircraft details from individual aircraft page
 * @param {string} html - HTML content of the aircraft page
 * @param {string} tailNumber - Aircraft tail number
 * @returns {Object} Aircraft details object
 */
export function extractAircraftDetails(html, tailNumber) {
    const $ = cheerio.load(html);
    const details = {};

    // Get full text content for searching
    const textContent = $.text();
    const textContentLower = textContent.toLowerCase();

    // Extract price/rate information
    const ratePatterns = [
        /\$(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:\/|per)\s*hour/i,
        /Rate[:\s]+\$(\d+(?:,\d{3})*(?:\.\d{2})?)/i,
        /Hourly Rate[:\s]+\$(\d+(?:,\d{3})*(?:\.\d{2})?)/i,
        /\$(\d+(?:,\d{3})*(?:\.\d{2})?)\s*\/\s*hr/i,
    ];

    let price = null;
    for (const pattern of ratePatterns) {
        const match = textContent.match(pattern);
        if (match) {
            const rateStr = match[1].replace(/,/g, '');
            price = Math.floor(parseFloat(rateStr)); // Convert to int for cleaner output
            break;
        }
    }

    // Try to find rate in meta tags if not found
    if (price === null) {
        const priceMeta = $('meta[property="product:price:amount"]');
        if (priceMeta.length) {
            const content = priceMeta.attr('content');
            if (content) {
                price = Math.floor(parseFloat(content));
            }
        }
    }

    // Add price to details
    if (price) {
        details.price = `$${price}`;
    }

    // Extract year - look for 4-digit year patterns
    const yearPatterns = [
        /Year[:\s]+(\d{4})/i,
        /Model Year[:\s]+(\d{4})/i,
        /\b(19\d{2}|20\d{2})\b/g, // Any year from 1900-2099
    ];

    let year = null;
    for (const pattern of yearPatterns) {
        const matches = textContent.match(pattern);
        if (matches) {
            // Filter for reasonable aircraft years (1950-2030)
            for (const match of matches) {
                const yearInt = parseInt(match);
                if (yearInt >= 1950 && yearInt <= 2030) {
                    year = yearInt.toString();
                    break;
                }
            }
            if (year) break;
        }
    }

    // Add year if found
    if (year) {
        details.year = year;
    }

    // Check if description contains "nxi" or "NXi"
    if (textContentLower.includes('nxi')) {
        details.type = 'nxi';
    }

    return details;
}

/**
 * Sleep for specified milliseconds
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Main function to scrape all Cessna 172 G-1000 aircraft
 * @returns {Promise<Object>} Object with aircraft details keyed by tail number
 */
export async function scrapeFleet() {
    const baseUrl = 'https://advantage-aviation.com';
    const mainPageUrl = 'https://advantage-aviation.com/rental-aircraft/#tab4';

    console.log('Fetching main page...');
    const html = await fetchPage(mainPageUrl);

    if (!html) {
        throw new Error('Failed to fetch main page');
    }

    console.log('Extracting Cessna 172 G-1000 aircraft links...');
    const aircraftLinks = extractCessna172G1000Links(html, baseUrl);

    console.log(`Found ${aircraftLinks.length} Cessna 172 G-1000 aircraft`);

    // Use object with tail numbers as keys
    const allAircraftDetails = {};

    for (let i = 0; i < aircraftLinks.length; i++) {
        const aircraft = aircraftLinks[i];
        const tailNumber = aircraft.tail_number;

        console.log(`\nProcessing ${i + 1}/${aircraftLinks.length}: ${tailNumber}`);
        console.log(`  URL: ${aircraft.url}`);

        // Fetch individual aircraft page
        const aircraftHtml = await fetchPage(aircraft.url);

        if (aircraftHtml) {
            const details = extractAircraftDetails(aircraftHtml, tailNumber);
            allAircraftDetails[tailNumber] = details;

            // Print extracted info
            const infoParts = [];
            if (details.price) {
                infoParts.push(`Price: ${details.price}/hour`);
            }
            if (details.year) {
                infoParts.push(`Year: ${details.year}`);
            }
            if (details.type) {
                infoParts.push(`Type: ${details.type}`);
            }

            if (infoParts.length > 0) {
                console.log(`  ${infoParts.join(', ')}`);
            } else {
                console.log(`  No details extracted`);
            }
        } else {
            console.log(`  Failed to fetch details`);
        }

        // Be polite - add a small delay between requests
        await sleep(1000);
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`Scraping complete!`);
    console.log(`Total aircraft processed: ${Object.keys(allAircraftDetails).length}`);
    console.log(`${'='.repeat(60)}\n`);

    return allAircraftDetails;
}
