#!/usr/bin/env node

/**
 * Test script to run the cron job locally
 * Usage: node test-cron.js
 */

import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Import the cron handler
import cronHandler from './api/cron.js';

// Mock request and response objects
const req = {
    method: 'POST',
    headers: {
        'authorization': 'Bearer test-token'
    }
};

const res = {
    statusCode: 200,
    headers: {},
    setHeader(key, value) {
        this.headers[key] = value;
    },
    status(code) {
        this.statusCode = code;
        return this;
    },
    json(data) {
        console.log('\n🎉 Cron job response:');
        console.log(JSON.stringify(data, null, 2));
        console.log(`\n📊 Status: ${this.statusCode}`);
    },
    end() {
        console.log('Response ended');
    }
};

console.log('🚀 Testing cron job locally...');
console.log(`📝 BLOB_READ_WRITE_TOKEN: ${process.env.BLOB_READ_WRITE_TOKEN ? '✅ Set' : '❌ Not set'}`);
console.log('');

// Run the cron handler
cronHandler(req, res).catch(error => {
    console.error('❌ Test failed:', error);
    process.exit(1);
});
