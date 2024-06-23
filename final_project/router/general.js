const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.json({books: books});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  
    const book_list = books.filter((book) => {
        return book.isbn == req.params.isbn
    })  

    let book = {}

    if (book_list.length > 0){
        book = book_list[0]
    }

    return res.status(300).json(book);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const book_list = books.filter((book) => {
        return book.author == req.params.author
    })  

    let book = {}

    if (book_list.length > 0){
        book = book_list[0]
    }

    return res.status(300).json(book);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const book_list = books.filter((book) => {
        return book.isbn == req.params.review
    })  

    let book = {}

    if (book_list.length > 0){
        book = book_list[0]
    }

    return res.status(300).json(book);
 });

module.exports.general = public_users;
