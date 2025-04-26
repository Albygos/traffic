const express = require('express');
const runVisits = require('./bot');
const app = express();
const port = 3000;

app.use(express.json());

app.post('/run', async (req, res) => {
    const { url, times } = req.body;
    if (!url || !times) {
        return res.status(400).send('Missing url or times');
    }

    res.send(`Started ${times} visits to ${url}`);
    runVisits(url, times);
});

app.listen(port, () => {
    console.log(`Traffic bot server running on port ${port}`);
});
