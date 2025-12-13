const http = require('http');
const url = require('url');

// ==================== CONFIG =====================
const YOUR_API_KEYS = ["GOKU"];
// =================================================

const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    const parsedUrl = url.parse(req.url, true);
    const { num, key, api_key } = parsedUrl.query;

    // Parameter check
    if (!num) {
        return res.end(JSON.stringify({ 
            error: 'Missing number parameter',
            usage: '?num=9876543210&key=GOKU'
        }));
    }

    // API key check
    const userKey = key || api_key;
    if (userKey && !YOUR_API_KEYS.includes(userKey)) {
        return res.end(JSON.stringify({ error: 'Invalid API key' }));
    }

    try {
        const fetch = (await import('node-fetch')).default;
        const targetUrl = `https://numapi.anshapi.workers.dev/?num=${encodeURIComponent(num)}`;
        
        console.log(`🌐 Fetching data from: ${targetUrl}`);
        
        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json'
            },
            timeout: 10000
        });

        if (!response.ok) {
            throw new Error(`API failed with status: ${response.status}`);
        }

        const data = await response.json();

        // Enhance response
        const finalData = {
            ...data,
            credit_by: "goku",
            developer: "@gokuuuu_1",
            powered_by: "Goku Number Info API",
            source_api: "https://numapi.anshapi.workers.dev",
            query_number: num,
            timestamp: new Date().toISOString()
        };

        res.end(JSON.stringify(finalData));

    } catch (error) {
        console.error('❌ Error:', error.message);
        res.end(JSON.stringify({
            error: 'Request failed',
            details: error.message,
            credit_by: "goku",
            developer: "@gokuuuu_1",
            query_number: num
        }));
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Goku Number Info API running on port ${PORT}`);
    console.log(`📡 API Source: https://numapi.anshapi.workers.dev/?num={number}`);
    console.log(`📋 Usage: http://localhost:${PORT}/?num=9876543210`);
    console.log(`🔑 Optional API Key: ?num=9876543210&key=GOKU`);
});
