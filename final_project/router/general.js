const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username
  const password = req.body.password

  if(!username || !password){
      return res.status(201).json({message: "username or password not provided"});
  }

  const user = users.filter(user => {
    return user.username == username
  })

  if(user.length > 0){
    return res.status(400).json({message: "User already exists"});
  }

  users.push({
    "username": username, 
    "password": password    
  })

  return res.status(201).json({message: "User created"});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  res.json({books: books});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const book_list = books.filter((book) => {
        return book.isbn == req.params.isbn
    })  

    let book = {}

    if (book_list.length > 0){
        book = book_list[0]
    }

    res.status(300).json(book);
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
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
public_users.get('/review/:isbn', function (req, res) {
    const book_list = books.filter((book) => {
        return book.isbn == req.params.isbn
    })  

    let book = {}

    if (book_list.length > 0){
        book = book_list[0]
    }

    return res.status(300).json(book.reviews);
 });

 //  Get book title
public_users.get('/title/:title', async function (req, res) {
    const book_list = books.filter((book) => {
        return book.title == req.params.title
    })  

    let book = {}

    if (book_list.length > 0){
        book = book_list[0]
    }

    res.status(300).json(book);
 });


module.exports.general = public_users;
