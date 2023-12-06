const express = require("express");
const axios = require("axios").default;
// let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. You can log now." });
    } else {
      res.status(404).json({ message: "User already exists!" });
    }
  } else {
    res.status(404).json({ message: "Unable to register user" });
  }
});

// Get the book list available in the shop
// task 10 : assuming data comming from API
public_users.get("/", async function (req, res) {
  try {
    let response = await axios.get(API_URL_BOOKS); // URL of the external database
    let books = response.data;
    res.send(JSON.stringify(books, null, 5));
  } catch (error) {
    console.log("Data fetching error", error);
    throw error;
  }
  // res.send(JSON.stringify(books, null, 5));
});

// Get book details based on ISBN
// task 11 : assuming data comming from API
public_users.get("/isbn/:isbn", async function (req, res) {
  const ISBN = req.params.isbn;

  try {
    let response = await axios.get(`API_URL_BOOKS/${ISBN}`);
    let book = response.data;
    res.send(book);
  } catch (error) {
    throw error;
  }
  // res.send(books[ISBN]);
});

// Get book details based on author
// task 12 : assuming data coming from API
public_users.get("/author/:author", async function (req, res) {
  const author = req.params.author;
  try {
    let response = await axios.get(`API_URL_BOOKS/${author}`);
    let books = response.data;

    let book_keys = Object.keys(books);
    let filtered_books = book_keys.reduce((acc, key) => {
      if (books[key]["author"] === author) {
        acc[key] = books[key];
      }
      return acc;
    }, {});

    res.send(filtered_books);
  } catch (error) {
    throw error;
  }

  // let book_keys = Object.keys(books);
  // let filtered_books = book_keys.reduce((acc, key) => {
  //   if (books[key]["author"] === author) {
  //     acc[key] = books[key];
  //   }
  //   return acc;
  // }, {});
  // res.send(filtered_books);
});

// Get all books based on title
// task 13 : assuming data coming from API
public_users.get("/title/:title", async function (req, res) {
  const title = req.params.title;

  try {
    let response = await axios.get(`API_URL_BOOKS/${title}`);
    let book = response.data; // assuming API will send a specific book related to the title
    res.send(book);
  } catch (error) {
    throw error;
  }

  // let books_keys = Object.keys(books);
  // let filtered_books = books_keys.reduce((acc, key) => {
  //   if (books[key]["title"] === title) {
  //     acc[key] = books[key];
  //   }
  //   return acc;
  // }, {});

  // res.send(filtered_books);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const ISBN = req.params.isbn;
  res.send(books[ISBN]["reviews"]);
});

module.exports.general = public_users;
