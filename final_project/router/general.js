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
    const getBooks = new Promise((resolve, reject) => {
        resolve(books);
    })

    getBooks.then((bookData) => {
        return res.status(200).send(JSON.stringify(bookData, null, 4));
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const bookByISBN = new Promise ((resolve, reject) => {
        const id = req.params.isbn;

        if (books[id]) {
            resolve (books[id]);
        } else {
            reject ("Book not found");
        }
    })

    bookByISBN.then((book) => {
        return res.status(200).send(JSON.stringify(book, null, 4));
    })
    .catch((error) => {
        return res.status(404).json({message: error});
    })
 });

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const bookByAuthor = new Promise ((resolve, reject) => {
        let matchingAuthor = [];

        let keys = Object.keys(books);
      
        keys.forEach((key) => {
          if (books[key].author === req.params.author){
              matchingAuthor.push(books[key]);
          }
        });

        if (matchingAuthor.length > 0) {
            resolve(matchingAuthor);
        } else {
            reject("Author not found");
        }
    })
    bookByAuthor.then((book) => {
        return res.status(200).send(JSON.stringify(book, null, 4));
    })
    .catch((error) => {
        return res.status(404).json({meesage: error});
    })
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
