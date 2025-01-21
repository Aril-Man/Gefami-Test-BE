const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const morgan = require('morgan');

const app = express();
app.use(bodyParser.json());
app.use(morgan('dev'))

// Temporary database
const users = [];
const books = [
  { id: 1, title: "Book One", borrowedBy: null, dueDate: null },
  { id: 2, title: "Book Two", borrowedBy: null, dueDate: null },
];

function isValidEmail(email) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

function isValidPassword(password) {
  const regex = /^(?=.*[A-Z])(?=.*[a-zA-Z0-9])[A-Za-z0-9]{8,}$/;
  return regex.test(password);
}

app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }

  if (!isValidPassword(password)) {
    return res.status(400).json({
      message: 'Password must be at least 8 characters long, contain at least one uppercase letter, and no special characters.',
    });
  }

  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'Email is already registered.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ id: uuidv4(), email, password: hashedPassword });

  res.status(201).json({ message: 'User registered successfully.' });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = users.find((user) => user.email === email);
  if (!user) {
    return res.status(400).json({ message: 'Invalid email or password.' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: 'Invalid email or password.' });
  }

  res.status(200).json({ message: 'Login successful.' });
});

app.get('/books', (req, res) => {
  res.status(200).json(books);
});

app.post('/borrow', (req, res) => {
  const { userId, bookId } = req.body;

  const user = users.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  const borrowedBook = books.find((b) => b.borrowedBy === userId);
  if (borrowedBook) {
    return res.status(400).json({ message: 'You must return the borrowed book before borrowing another.' });
  }

  const book = books.find((b) => b.id === bookId);
  if (!book) {
    return res.status(404).json({ message: 'Book not found.' });
  }

  if (book.borrowedBy) {
    return res.status(400).json({ message: 'Book is already borrowed.' });
  }

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 7); // 7 days borrowing period

  book.borrowedBy = userId;
  book.dueDate = dueDate;

  res.status(200).json({ message: 'Book borrowed successfully.', dueDate });
});

app.post('/return', (req, res) => {
  const { userId, bookId } = req.body;

  const book = books.find((b) => b.id === bookId && b.borrowedBy === userId);
  if (!book) {
    return res.status(404).json({ message: 'Book not found or not borrowed by this user.' });
  }

  book.borrowedBy = null;
  book.dueDate = null;

  res.status(200).json({ message: 'Book returned successfully.' });
});

app.get('/admin/overdue', (req, res) => {
  const overdueBooks = books.filter(
    (b) => b.dueDate && new Date(b.dueDate) < new Date()
  );

  res.status(200).json(overdueBooks);
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});