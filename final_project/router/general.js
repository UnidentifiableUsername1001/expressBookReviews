const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const currUser = req.body.username;
    const currPword = req.body.password;

    if (!currUser || !currPword) {
        return res.status(400).json({message: "Username or Password not present!"});
    } if (isValid(currUser)) {
        return res.status(404).json({message: "Username already exists. Please choose another!"});
    } else {
        users.push({username: currUser, password: currPword});

        return res.status(200).json({message: "Customer registered successfully. Now you can login"})
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    const payload = books;
  return res.status(200).send(JSON.stringify(payload, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const id = req.params.isbn;

  const specificBook = books[id];

  return res.status(200).send(JSON.stringify(specificBook, null, 4))
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let matchingAuthor = [];

  let keys = Object.keys(books);

  keys.forEach((key) => {
    if (books[key].author === req.params.author){
        matchingAuthor.push(books[key]);
    }
  });
  return res.status(200).send(JSON.stringify(matchingAuthor, null, 4))
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let matchingTitle = [];

  let keys = Object.keys(books);

  keys.forEach((key) => {
    if (books[key].title === req.params.title){
        matchingTitle.push(books[key]);
    }
  });
  return res.status(200).send(JSON.stringify(matchingTitle, null, 4))
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const id = req.params.isbn;
    return res.status(200).send(JSON.stringify(books[id].reviews, null, 4));
});

module.exports.general = public_users;
