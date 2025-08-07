const authinfo = require('../authinfo');
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, '../../build')));

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});

app.get('/esh', async (req, res) => {
    const url = `${authinfo.ESH_API_URL}&start=${req.query.start}&end=${req.query.end}`;
    const requestOptions = {
      method: 'GET',
      headers: {
        referer: authinfo.ESH_URL
      },
      redirect: 'follow'
    };
    const resp = await fetch(url, requestOptions)
      .then((response) => response.json())
      .catch((error) => console.error(error));
    res.json(resp);
});
