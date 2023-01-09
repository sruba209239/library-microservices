const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");

app.use(bodyParser.json());

// app set up listening
app.listen(5555, () => {
  console.log("Started customers service!");
});

// use customer model
require("./model/Customer");
const Customer = mongoose.model("Customer");

// mongoose connection
mongoose.connect("mongodb://localhost:27017/customerservice", () => {
  console.log("MongoDb connected to customerservice !");
});

// routes
// create a customer
app.post("/customer", (req, res) => {
  const newCustomer = new Customer(req.body);
  newCustomer
    .save()
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((err) => {
      if (err) {
        throw err;
      }
    });
});

// get all customers
app.get("/customers", (req, res) => {
  Customer.find()
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((err) => {
      if (err) {
        throw err;
      }
    });
});

// get by id
app.get("/customer/:id", (req, res) => {
  Customer.findById(req.params.id)
    .then((customer) => {
      if (!customer) {
        res.status(404).send(`No customer found with id: ${req.params.id}`);
      }
      res.json(customer);
    })
    .catch((err) => {
      if (err) throw err;
    });
});

// update a record
app.put("/customer/:id", (req, res) => {
  Customer.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, record) => {
      if (err) {
        res
          .status(404)
          .send(`No customer found with id : ${req.params.id} to update!`);
      }
      res.json(record);
    }
  );
});

//delete a record
app.delete("/customer/:id", (req, res) => {
  Customer.findByIdAndDelete(req.params.id).then((customer) => {
    if (!customer) {
      res
        .status(404)
        .send(`No customer found with id : ${req.params.id} to delete!`);
    }
    res.status(204).end();
  });
});
