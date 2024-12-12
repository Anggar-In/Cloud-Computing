const express = require('express');
const { Storage } = require('@google-cloud/storage');
const csv = require('csv-parser');

const app = express();
const port = process.env.PORT || 8080;

const BUCKET_NAME = 'anggarin_result_invest_bucket';

const storage = new Storage();

app.get('/result/:fileName', async (req, res) => {
    const fileName = req.params.fileName;

    const fullFileName = fileName.endsWith('.csv') ? fileName : `${fileName}.csv`;

    try {
        const results = [];
        const bucket = storage.bucket(BUCKET_NAME);
        const file = bucket.file(fullFileName);

        const readStream = file.createReadStream();

        readStream
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                res.json(results);
            })
            .on('error', (error) => {
                console.error('Error reading CSV file:', error);
                res.status(500).send('Error reading CSV file');
            });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});
