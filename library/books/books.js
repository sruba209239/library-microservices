// load express

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");

// model
require("./model/book");
const Book = mongoose.model("Book");

app.use(bodyParser.json());

// connect
mongoose.connect("mongodb://localhost:27017", () => {
  console.log("MongoDb connected.");
});

app.get("/", (req, res) => {
  res.send("This is the books service!");
});

// Add a new book
app.post("/book", (req, res) => {
  const newBook = {
    title: req.body.title,
    author: req.body.author,
    numberOfPages: req.body.numberOfPages,
    publisher: req.body.publisher,
  };
  const book = new Book(newBook);

  book
    .save()
    .then(() => {
      console.log("New book created");
    })
    .catch((err) => {
      if (err) {
        throw err;
      }
    });

  res.status(201).send(newBook);
});

// Get all books
app.get("/books", (req, res) => {
  Book.find()
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((err) => {
      if (err) {
        throw err;
      }
    });
});

//Get a book by id
app.get("/book/:id", (req, res) => {
  Book.findById(req.params.id)
    .then((book) => {
      if (!book) {
        res.status(404, "No book found");
      }
      res.status(200).json(book);
    })
    .catch((error) => {
      if (error) {
        throw error;
      }
    });
});

app.listen(4545, () => {
  console.log("Started books service!");
});
