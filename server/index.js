const express = require('express');
const cors = require('cors');
const path = require('path');

const axios = require('axios');

const app = express();
const port = 8000;

app.use(cors());
app.use(express.static(path.resolve('public')));

app.get('/:id', (req, res) => {
  if (req.params.id === 'favicon.ico') {
    res.end();
    return;
  }

  if (req.params.id) {
    res.sendFile(path.resolve(__dirname + '/../public/index.html'));
  }
});

app.get('/card/:id', (req, res) => {
  const {host, port, path, productId} = req.query;
  const route = `http://${host}:${port}${path}${productId}`;

  return axios.get(route)
    .then((result) => {
      const response = JSON.stringify(result.data);
      res.status(200).send(response);
    })
    .catch((error)=> {
      console.log(error);
    });
});

app.get('/activity/:id', (req, res) => {
  const {host, port, path, productId, indicator} = req.query;
  const route = `http://${host}:${port}${path}${productId}`;

  return axios.get(route, {params: {indicator}})
    .then((result) => {
      console.log('PROXY GET /activity/:id', result);
      const response = result.data.activity;
      res.status(200).send(response);
    })
    .catch((error) => {
      console.log('PROXY GET /activity/:id', error);
    });
});

app.listen(port, () => {
  console.log( `Listening To Port:${port}`);
});
