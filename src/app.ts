// src/app.ts (Express Server)

import express from 'express';
import cors from 'cors';
import { scrapeData } from './scaper';

const app = express();
const port = 3000;

// Configure CORS to allow requests from only http://localhost:5173
const corsOptions = {
    origin: ['http://localhost:5173', 'https://web-scraper-ui-react-vite-ts-bootstra.netlify.app'],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.get('/scrape', async (req, res) => {
    const url = req.query.url as string; // Get URL from query parameter

    if (!url) {
        return res.status(400).json({ error: 'Missing URL query parameter' });
    }

    try {
        const data = await scrapeData(url);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Scraping failed', msg: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
