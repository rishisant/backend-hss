
const express = require('express')
const app = express()
const port = process.env.PORT || 3001

const product_test = require('./test');

app.use(express.json())
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
  next();
});
app.get('/get_employees', (req, res) => {
  product_test.getEmployees()
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    console.log(error);
    res.status(500).send(error);
  })
})

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
app.get('/get_inv', (req, res) => {
  product_test.getInv()
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    console.log(error);
    res.status(500).send(error);
  })
})
app.get('/get_menu', (req, res) => {
  product_test.getMenu()
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    console.log(error);
    res.status(500).send(error);
  })
})


app.delete('/delete_product', (req, res) => {
  product_test.deleteProduct(req.body)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    console.log(error);
    res.status(500).send(error);
  })
})

//update product
app.put('/put_product', (req, res) => {
  product_test.putProduct(req.body)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    console.log("put error");
    res.status(500).send(error);
  })
})
//add product
app.post('/post_product', (req, res) => {
  product_test.addProduct(req.body)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    console.log("post error");
    res.status(500).send(error);
  })
})

//post inv
app.post('/post_inv', (req, res) => {
  product_test.addInv(req.body)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    console.log("post error");
    res.status(500).send(error);
  })
})

//delete inv
app.delete('/delete_inv', (req, res) => {
  product_test.deleteInv(req.body)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    console.log("delete error");
    res.status(500).send(error);
  })
})

//put inv
app.put('/put_inv', (req, res) => {
  product_test.putInv(req.body)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    console.log("put error");
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
