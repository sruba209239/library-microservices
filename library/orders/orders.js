const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const mongoose = require("mongoose");
const axios = require("axios");

//connect
mongoose.connect("mongodb://localhost:27017/ordersservice", () => {
  console.log("MongoDb connected to ordersservice");
});

//model
require("./model/Order");
const Order = mongoose.model("Order");

app.listen(6565, () => {
  console.log("Started orders service!");
});

// create new order
app.post("/order", (req, res) => {
  const newOrder = new Order({
    ...req.body,
    customerId: mongoose.Types.ObjectId(req.body.customerId),
    bookId: mongoose.Types.ObjectId(req.body.bookId),
  });
  newOrder
    .save()
    .then((order) => {
      res.status(201).json(order);
    })
    .catch((err) => {
      if (err) throw err;
    });
});

// get all orders
app.get("/orders", (req, res) => {
  Order.find().then((order) => {
    res.json(order);
  });
});

// get specific order
app.get("/order/:id", (req, res) => {
  Order.findById(req.params.id)
    .then((order) => {
      if (!order) {
        res.status(404).send(`No order with id: ${req.params.id} found !`);
      }
      const orderObj = {
        customerName: "",
        bookName: "",
      };

      Promise.all([
        axios.get(`http://localhost:5555/customer/${order.customerId}`),
        axios.get(`http://localhost:4545/book/${order.bookId}`),
      ])
        .then((responseArray) => {
          orderObj.customerName = responseArray[0].data.name;
          orderObj.bookName = responseArray[1].data.title;
          res.json(orderObj);
        })
        .catch((err) => {
          if (err) {
            throw err;
          }
        });
    })
    .catch((err) => {
      if (err) throw err;
    });
});
