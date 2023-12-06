const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });

  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in." });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({ data: password }, "access", {
      expiresIn: 60 * 60,
    });

    req.session.authorization = { accessToken, username };

    return res.status(200).json("User successfully logged in");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid login. Check username and password." });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const ISBN = req.params.isbn;
  const review = req.body.review;
  const user = req.session.authorization.username;

  let reviews = books[ISBN]["reviews"];
  let usernames = Object.keys(reviews);

  if (usernames.includes(user)) {
    reviews[user] = review;

    res
      .status(200)
      .json({
        updated_value: books[ISBN],
        message: "Review modified successfully",
      });
  } else {
    reviews[user] = review;
    res
      .status(200)
      .json({
        updated_value: books[ISBN],
        message: "Review added successfully",
      });
  }
});

// delete review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const ISBN = req.params.isbn;
  let user = req.session.authorization.username;
  let reviews = books[ISBN]["reviews"];

  if(reviews[user]){
    delete reviews[user];
    res.send(`The review of the ${user} is deleted.`);
  }else{
    res.send(`No reviews by the ${user}`);
  }

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
