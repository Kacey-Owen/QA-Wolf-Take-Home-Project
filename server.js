const express = require('express');
const { sortHackerNewsArticles } = require('./index');
const app = express();
const port = 3000;

app.use(express.static(__dirname));

app.get('/run-script', async (req, res) => {
    try {
        const result = await sortHackerNewsArticles();
        res.json(result);
    } catch(err) {
        res.json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`✅ Server is running at http://localhost:${port}`);
});