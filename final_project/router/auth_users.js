const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");

const regd_users = express.Router();

let users = [];


// Secret key for JWT
const JWT_SECRET = 'my1jwt1s3cr3t_k3y1111'; // Use a secure, randomly generated string

// Middleware to authenticate JWT token
const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).json({ error: 'Invalid token.' });
    }
};

const isValid = (username)=>{ //returns boolean
    const user = users.find(user => user.username === username)

    return user.length > 0
}

const authenticatedUser = (username,password)=>{ //returns boolean
    const user = users.find(user => user.username === username)

    if(user.length > 0){
        return users[0].password == password
    }

    return false
}

//only registered users can login
regd_users.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Simple validation
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find the user
    const user = users.find(user => user.username === username);
    if (!user) {
        return res.status(400).json({ error: 'Invalid username or password' });
    }

    // Compare the password
    const isPasswordValid = password === user.password

    if (!isPasswordValid) {
        return res.status(400).json({ error: 'Invalid username or password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ 
            id: user.id, 
            username: user.username 
        }, 
        JWT_SECRET, 
        { 
            expiresIn: '1h'
        }
    );

    // Respond with the token
    res.status(200).json({ token: token });
});


// Add a book review
regd_users.delete("/review/:isbn", authenticateJWT, (req, res) => {

    const book_list = books.filter((book) => {
        return book.isbn == req.params.isbn
    })  

    let book = {}

    if (book_list.length > 0){
        book = book_list[0]
    }

    if(!book){
        return res.status(400).json({'messege': 'Book not found'});
    }

    book.reviews = book.reviews.filter(book => book.username != req.user.username)
        
    return res.status(202).json(book.reviews); 
})

// Add a book review
regd_users.put("/review/:isbn", authenticateJWT, (req, res) => {

    const book_list = books.filter((book) => {
        return book.isbn == req.params.isbn
    })  

    let book = {}

    if (book_list.length > 0){
        book = book_list[0]
    }

    if(!book){
        return res.status(400).json({'messege': 'Book not found'});
    }
   
    const reviews = book.reviews.filter(
        review => {
            return review.username == req.user.username
        }
    )

    if(reviews.length > 0){
        reviews[0].text = req.body.text  
    }
    else{
        book.reviews.push({
            username: req.user.username,
            'text': req.body.text,
        })
    }
    

  return res.status(201).json(book.reviews);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
