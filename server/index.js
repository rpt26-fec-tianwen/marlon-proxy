const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const axios = require('axios');

const app = express();
const port = 8000;

const services = {
  card: 'http://localhost:8001/',
  details: 'http://localhost:8002/',
  related: 'http://localhost:8003/',
  reviews: 'http://localhost:8004/',
  recieved: false
};

app.use(cors());
app.use(express.static(path.resolve('public')));

app.get('/:id', (req, res) => {
  if (req.params.id === 'favicon.ico') {
    res.end();
    return;
  }

  if (services.recieved) {
    console.log('Services have been written, sending...');
    res.sendFile(path.resolve(__dirname + '/../public/index.html'));

  } else {
    return axios.get(`${services.card}${req.params.id}`, {params: {proxy: true}})
      .then((result) => {
        const cardBundle = result.data;
        fs.writeFile(path.resolve(__dirname + '/../public/dist/cardBundle.js'), cardBundle, (error) => {
          if (error) {
            throw(error);
          };
        });
      })
      .catch((error) => {
        console.log(error);
      })
      .then(() => {
        return axios.get(`${services.details}${req.params.id}`, {params: {proxy: true}})
          .then((result) => {
            const detailsBundle = result.data;
            fs.writeFile(path.resolve(__dirname + '/../public/dist/detailsBundle.js'), detailsBundle, (error) => {
              if (error) {
                throw(error);
              };
            });
          });
      })
      .catch((error) => {
        console.log(error);
      })
      .then(() => {
        return axios.get(`${services.related}${req.params.id}`, {params: {proxy: true}})
          .then((result) => {
            const relatedBundle = result.data;
            fs.writeFile(path.resolve(__dirname + '/../public/dist/relatedBundle.js'), relatedBundle, (error) => {
              if (error) {
                throw(error);
              };
            });
          });
      })
      .catch((error) => {
        console.log(error);
      })
      .then(() => {
        return axios.get(`${services.reviews}bundle`, {params: {proxy: true}})
          .then((result) => {
            const reviewsBundle = result.data;
            fs.writeFile(path.resolve(__dirname + '/../public/dist/reviewsBundle.js'), reviewsBundle, (error) => {
              if (error) {
                throw(error);
              };
            });
          })
      })
      .catch((error) => {
        console.log(error);
      })
      .then(() => {
        services.recieved = true;
        console.log('Successfully wrote services...');
        res.sendFile(path.resolve(__dirname + '/../public/index.html'));
      });
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
      const response = result.data.activity;
      res.status(200).send(response);
    })
    .catch((error) => {
      console.log('PROXY GET /activity/:id', error);
    });
});

app.get('/details/:id', (req, res) => {
  const {service, indicator} = req.query;
  const route = `${services.details}${req.params.id}`;

  return axios.get(route, {params: {service, indicator}})
    .then((result) => {
      const response = JSON.stringify(result.data);
      res.status(200).send(response);
    })
    .catch((error) => {
      console.log('PROXY GET /details/:id', error);
    });
});

app.get('/related-products/:id', (req, res) => {
  const id = req.params.id;
  const route = `${services.related}related-products/${req.params.id}`;

  return axios.get(route)
    .then((result) => {
      const response = JSON.stringify(result.data);
      res.status(200).send(response);
    })
    .catch((error) => {
      console.log('PROXY GET /related-products/:id', error);
    });
});

app.get('/reviews/:id', (req, res) => {
  const {host, port, path, productId} = req.query;
  const route = `http://${host}:${port}${path}${productId}`;

  return axios.post(route)
  .then((result) => {
    const response = JSON.stringify(result.data.product_overall_rating);
    res.send(response);
  })
  .catch((error) => {
    console.log('PROXY POST /:id', error);
  });
})

app.post('/:id', function (req, res) {
  const id = req.params.id
  const route = `${services.reviews}${id}`;

  return axios.post(route)
  .then((data) => {
    res.send(data.data)
  })
  .catch((error) => {
    console.log('PROXY POST /:id', error);
  });
});

app.listen(port, () => {
  console.log( `Listening To Port:${port}`);
});
