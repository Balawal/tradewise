const axios = require('axios');

const options = {
  method: 'GET',
  headers: {accept: 'application/json', 'x-cg-pro-api-key': 'CG-tKA862uwVTVcwMWDD6qKWXoL'}
};

fetch('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=365')
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));