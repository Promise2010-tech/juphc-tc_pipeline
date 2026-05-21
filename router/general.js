const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Register New user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required fields" });
    }
    if (isValid(username)) {
        return res.status(409).json({ message: "Username already exists!" });
    }

    users.push({ "username": username, "password": password });
    return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Task 1 & 10: Get the book list available in the shop (Using Promise logic)
public_users.get('/', function (req, res) {
    new Promise((resolve, reject) => {
        if (books) resolve(books);
        else reject("Unable to load book collection database");
    })
    .then((booksData) => res.status(200).send(JSON.stringify(booksData, null, 4)))
    .catch((err) => res.status(500).json({ message: err }));
});

// Task 2 & 11: Get book details based on ISBN (Using Promises)
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    
    new Promise((resolve, reject) => {
        if (books[isbn]) resolve(books[isbn]);
        else reject(`Book with ISBN ${isbn} could not be located.`);
    })
    .then((book) => res.status(200).json(book))
    .catch((err) => res.status(404).json({ message: err }));
});
  
// Task 3 & 12: Get book details based on Author (Using Promises)
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    
    new Promise((resolve, reject) => {
        let results = {};
        Object.keys(books).forEach(key => {
            if (books[key].author.toLowerCase() === author.toLowerCase()) {
                results[key] = books[key];
            }
        });
        if (Object.keys(results).length > 0) resolve(results);
        else reject(`No books found written by author: ${author}`);
    })
    .then((matchedBooks) => res.status(200).json(matchedBooks))
    .catch((err) => res.status(404).json({ message: err }));
});

// Task 4 & 13: Get all books based on Title (Using Promises)
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;

    new Promise((resolve, reject) => {
        let results = {};
        Object.keys(books).forEach(key => {
            if (books[key].title.toLowerCase() === title.toLowerCase()) {
                results[key] = books[key];
            }
        });
        if (Object.keys(results).length > 0) resolve(results);
        else reject(`No books found with the title: ${title}`);
    })
    .then((matchedBooks) => res.status(200).json(matchedBooks))
    .catch((err) => res.status(404).json({ message: err }));
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    } else {
        return res.status(404).json({ message: "Book matching that ISBN number does not exist" });
    }
});

module.exports.isValid = public_users;