const express = require('express');
const bodyParser = require('body-parser');
const { setupWebhook } = require('./telegram-bot');

const app = express();
const port = 3005;

app.use(bodyParser.json());

setupWebhook(app);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
