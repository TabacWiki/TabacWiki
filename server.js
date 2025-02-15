require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

console.log('Token from env:', process.env.GITHUB_TOKEN);

app.post('/api/issues', async (req, res) => {
    try {
        const { title, body, labels } = req.body;
        
        const response = await fetch('https://api.github.com/repos/TabacWiki/TabacWiki/issues', {
            method: 'POST',
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': `token ${process.env.GITHUB_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, body, labels })
        });
        
        if (!response.ok) {
            const error = await response.json();
            console.error('GitHub API Error:', error);
            return res.status(response.status).json(error);
        }
        
        const issue = await response.json();
        res.json(issue);
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
