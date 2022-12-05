
const express = require('express')
const app = express()
const port = 3001

const product_test = require('./test');

app.use(express.json())
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
  next();
});

app.get('/products', (req, res) => {
  product_test.getProduct()
  
  .then(response => {
    
    res.status(200).send(response);
  })
  .catch(error => {
    console.log(error);
    res.status(500).send(error);
  })
})
app.post('/orders', (req, res) => {
  product_test.addOrder(req.body)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    console.log(error);
    res.status(500).send(error);
  })  
})
app.get('/get_orders', (req, res) => {
  product_test.getOrders()
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    console.log(error);
    res.status(500).send(error);
  })
})

app.post('/translate', (req, res) => {
  product_test.translateText(req, res)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    console.log(error);
    res.status(500).send(error);
  })
})

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})


// app.post('/merchants', (req, res) => {
//   merchant_model.createMerchant(req.body)
//   .then(response => {
//     res.status(200).send(response);
//   })
//   .catch(error => {
//     res.status(500).send(error);
//   })
// })

// app.delete('/merchants/:id', (req, res) => {
//   merchant_model.deleteMerchant(req.params.id)
//   .then(response => {
//     res.status(200).send(response);
//   })
//   .catch(error => {
//     res.status(500).send(error);
//   })
// })
// app.listen(port, () => {
//   console.log(`App running on port ${port}.`)
// })