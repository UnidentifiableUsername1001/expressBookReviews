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
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
