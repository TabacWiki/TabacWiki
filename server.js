const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static('.'));

// Proxy endpoint for creating GitHub issues
app.post('/api/create-issue', async (req, res) => {
    try {
        const { body: problemText } = req.body;
        
        const response = await fetch('https://api.github.com/repos/TabacWiki/TabacWiki/issues', {
            method: 'POST',
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': `token ${process.env.GITHUB_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: 'User Reported Issue',
                body: problemText,
                labels: ['user-reported']
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Failed to create issue');
        }

        res.json(data);
    } catch (error) {
        console.error('Error creating issue:', error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
