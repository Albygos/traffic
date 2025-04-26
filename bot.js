const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');
const path = require('path');

puppeteer.use(StealthPlugin());

const userAgents = require('./useragents.json'); // <-- this file should be an array of strings
const logFile = path.join(__dirname, 'visit-log.json');

async function visitSite(url, index) {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',  // For better security and performance in some environments
            '--disable-setuid-sandbox'
        ]
    });

    const page = await browser.newPage();
    const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)]; // Select a random user agent
    await page.setUserAgent(userAgent);

    try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
        console.log(`✅ Visited: ${url} (${index + 1})`);

        const log = {
            timestamp: new Date().toISOString(),
            url,
            userAgent,
            result: 'Success'
        };

        fs.appendFileSync(logFile, JSON.stringify(log) + '\n');
    } catch (error) {
        console.error(`❌ Error visiting ${url}:`, error.message);

        const log = {
            timestamp: new Date().toISOString(),
            url,
            userAgent,
            result: 'Error',
            error: error.message
        };

        fs.appendFileSync(logFile, JSON.stringify(log) + '\n');
    } finally {
        await browser.close();
    }
}

async function runVisits(url, times) {
    for (let i = 0; i < times; i++) {
        try {
            console.log(`\n🔁 [${i + 1}/${times}] Visiting site with a new user agent...`);
            await new Promise(resolve => setTimeout(resolve, 5000)); // wait 5 seconds before visiting
            await visitSite(url, i);
        } catch (err) {
            console.error('🚨 Error visiting site:', err);
        }
    }
}

module.exports = runVisits;
