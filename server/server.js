const express = require('express');
const bodyParser = require('body-parser');
const { setupWebhook } = require('./telegram-bot');
const messageRoute = require('./messageRoute');
const cors = require('cors');

const app = express();
app.use(cors());
const port = 3005;

app.use(bodyParser.json());
app.use('/', messageRoute);


setupWebhook(app);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
