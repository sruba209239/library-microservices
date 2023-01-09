// load express

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");

app.use(bodyParser.json());

// model
require("./model/book");
const Book = mongoose.model("Book");

// connect
mongoose.connect("mongodb://localhost:27017/booksservice", () => {
  console.log("MongoDb connected to booksservice!");
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

//modify a book data
app.put("/book/:id", (req, res) => {
  Book.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, doc) => {
    console.log("err: ", err, "doc: ", doc);
    if (err) {
      res.status(404).send("No record found to update!");
    }
    res.status(200).json(doc);
  });
});

app.delete("/book/:id", (req, res) => {
  Book.findByIdAndDelete(req.params.id)
    .then((book) => {
      console.log(book);
      if (!book) {
        res
          .status(404)
          .send(`No record with id ${req.params.id} found to delete`);
      }
      res.status(204).end();
    })
    .catch((err) => {
      if (err) throw err;
    });
});

app.listen(4545, () => {
  console.log("Started books service!");
});
