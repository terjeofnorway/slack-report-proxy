import express from 'express';
import bodyParser from 'body-parser';

import { calculateTotalRequest, sendToSlack } from './helpers';

const app = express();
const port = 3006;

app.use(bodyParser.json({ limit: '2mb' }));

app.get('/', (req, res) => {
    res.sendStatus(404);
});

app.post('/lighthouse-report', (req, res) => {
    const { audits } = req.body;
    const networkRequests = audits['network-requests'].details.items;

    const firstContentfulPaint = audits['first-contentful-paint'].displayValue;
    const timeToInteractive = audits['speed-index'].interactive;
    const speedIndex = audits['speed-index'].displayValue;
    const version = '1.2.3';

    const { totalResourceSize, totalTransferSize } = calculateTotalRequest(networkRequests);

    console.log(firstContentfulPaint);

    sendToSlack({ version, firstContentfulPaint, speedIndex, timeToInteractive, totalResourceSize, totalTransferSize });
    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

export default app;
