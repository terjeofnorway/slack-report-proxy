import express from 'express';
import bodyParser from 'body-parser';

import { sendToSlack } from './helpers';

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendStatus(404);
});

app.post('/lighthouse-report', (req, res) => {
  const { version } = req.body;

  if (!version) {
    res.sendStatus(400);
    return;
  }

  sendToSlack({ version });
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
