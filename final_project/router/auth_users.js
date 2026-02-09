const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
    return users.some((user) => user.username === username);
}

const authenticatedUser = (username,password)=>{
    return users.some((user) => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const user = req.body.username;
    const pass = req.body.password;

    if (!user || !pass) {
        return res.status(404).json({message: "Error logging in"});
    }

    if (authenticatedUser(user, pass)) {
        let accessToken = jwt.sign({
            password: pass
        }, "JWT_Token", {expiresIn: 60 * 60});

        req.session.authorization = {
        accessToken, user
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({
            message: "Invalid Login. Check username and password"
        });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const user = req.session.authorization.username;

    if (!books[isbn] || !review) {
        return res.status(400).send("No book found or no review sent. Please check the ISBN and/or submit a review.")
    } else {
        books[isbn].reviews[user] = review;

        return res.status(200).send(`The review for the book with ISBN ${isbn} has been added. You wrote ${review}.`);
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const user = req.session.authorization.username;

    if (books[isbn] && books[isbn].reviews[user]) {
        delete books[isbn].reviews[user];
        return res.status(200).send(`Removed review for book with ISBN ${isbn}.`)
    } else {
        return res.status(400).send(`Book with ISBN ${isbn} not found or no review found for ${user}.`);
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
