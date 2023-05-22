const express = require('express');
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const multer = require('multer');
const { updateItems } = require('./updateItems');
require('dotenv').config();
const app = express();
const helmet = require('helmet');


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public', { extensions: ['css'] }));

// Use Helmet middleware with CSP configuration
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", 'blob:'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://cdn.jsdelivr.net'],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        'https://ajax.googleapis.com',
        'https://code.jquery.com',
        'https://unpkg.com',
      ],
      imgSrc: ["'self'", 'data:', 'https://modelviewer.dev'],
    },
  })
);


// Set up session middleware
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
  })
);



// Use body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to check authentication for protected routes
function requireAuth(req, res, next) {
  if (req.session && req.session.authenticated) {
    return next();
  } else {
    res.redirect('/login');
  }
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/assetts/shop');
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const filename = Date.now() + extension; // Generate a unique filename
    cb(null, filename);
  },
});

// Create the multer upload middleware
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed.'));
    }
  },
  onError: (err, next) => {
    console.error(err);
    next(err); // Pass the error to the next middleware
  }
});


// Public Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.use('/data', express.static('data'));

app.get('/shop', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'items.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading JSON file');
      return;
    }

    const items = JSON.parse(data);
    res.render('shop', { items });
  });
});

app.get('/customs', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'customs.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading JSON file');
      return;
    }

    const items = JSON.parse(data);
    res.render('customs', { items });
  });
});

app.get('/gallery', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'gallery.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading JSON file');
      return;
    }

    const items = JSON.parse(data);
    res.render('gallery', { items });
  });
});

// Display items route
app.get('/dashboard', requireAuth, (req, res) => {
  const filePath = path.join(__dirname, 'data', 'items.json');
  const itemsData = fs.readFileSync(filePath, 'utf8');
  const items = JSON.parse(itemsData);
  res.render('dashboard', { items });
});


// Login route
app.get('/login', (req, res) => {
  res.render('login');
});

// Use body-parser middleware for parsing URL-encoded form data
app.post('/authenticate', (req, res) => {
  const { username, password } = req.body;
  if (
    (username === process.env.USERNAME1 && password === process.env.PASSWORD1) ||
    (username === process.env.USERNAME2 && password === process.env.PASSWORD2)
  ) {
    // Successful login
    req.session.authenticated = true;
    res.redirect('dashboard');
  } else {
    // Failed login
    res.redirect('/login');
  }

});

// Logout route
app.get('/logout', (req, res) => {
  req.session.authenticated = false;
  res.redirect('/login');
});

// Add item route
app.post('/dashboard/add-item', requireAuth, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'measure', maxCount: 1 },
]), (req, res) => {
  // Retrieve the item details from the request body
  const { id, title, description, price, size, type } = req.body;

  // Retrieve the filenames of the uploaded files
  console.log('req.files:', req.files);
  const image = req.files['image'][0].filename;
  const measure = req.files['measure'][0].filename;

  // Create the new item object
  const newItem = {
    id,
    title,
    description,
    price,
    size,
    image: `assetts/shop/${image}`,
    measure: `assetts/shop/${measure}`,
    type,
  };

  // Call the updateItems function to update the items.json file
  updateItems(newItem);

  res.redirect('/dashboard');
});

// Edit item route
app.get('/dashboard/edit-item/:id', requireAuth, (req, res) => {
  const itemId = req.params.id;
  const filePath = path.join(__dirname, 'data', 'items.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading JSON file');
      return;
    }

    const items = JSON.parse(data);
    const item = items.find((item) => item.id === itemId);
    if (!item) {
      res.status(404).send('Item not found');
      return;
    }

    res.render('edit-item', { item });
  });
});

app.post('/dashboard/edit-item', requireAuth, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'measure', maxCount: 1 },
]), (req, res) => {
  // Retrieve the item details from the request body
  const { id, title, description, price, size, type } = req.body;

  // Retrieve the filenames of the uploaded files
  const imageFile = req.files['image'] ? req.files['image'][0].filename : null;
  const measureFile = req.files['measure'] ? req.files['measure'][0].filename : null;

  // Read the JSON file
  const filePath = path.join(__dirname, 'data', 'items.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading JSON file');
      return;
    }

    // Parse the JSON data
    const items = JSON.parse(data);

    // Find the item to edit based on the ID
    const itemIndex = items.findIndex(item => item.id === id);
    const editItem = items[itemIndex];

    if (!editItem) {
      res.status(404).send('Item not found');
      return;
    }




    // Get the existing item
    const existingItem = items[itemIndex];

    // Update the properties if the corresponding form input is provided
    if (title.trim() !== '') {
      existingItem.title = title;
    }

    if (description.trim() !== '') {
      existingItem.description = description;
    }

    if (size.trim() !== '') {
      existingItem.size = size;
    }

    if (price.trim() !== '') {
      existingItem.price = price;
    }

    // Check if any image file is uploaded
    if (imageFile) {
      existingItem.image = `assetts/shop/${imageFile}`;
    } else {
      // No file uploaded, retain the original image if existingItem and existingItem.image are defined
      if (existingItem && existingItem.image) {
        existingItem.image = `assetts/shop/${existingItem.image}`;
      }
    }

    // Write the updated JSON data back to the file
    fs.writeFile(filePath, JSON.stringify(items, null, 2), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error writing JSON file');
        return;
      }

      res.redirect('/dashboard');
    });
  });
});




// Remove item route
app.post('/dashboard/remove-item/', requireAuth, (req, res) => {
  const itemId = req.body.id;
  console.log('Received itemId:', itemId);
  console.log('Received req.body.id:', req.body.id);
  const filePath = path.join(__dirname, 'data', 'items.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading JSON file');
      return;
    }

    const items = JSON.parse(data);

    // Find the index of the item in the array based on the provided itemId
    const itemIndex = items.findIndex(item => item.id === itemId);
    console.log('Item index:', itemIndex);

    // Check if the item exists
    if (itemIndex === -1) {
      console.error('Item not found:', itemId);
      res.status(404).send('Item not found');
      return;
    }

    // Remove the item from the array
    items.splice(itemIndex, 1);

    // Write the updated JSON data back to the file
    fs.writeFile(filePath, JSON.stringify(items, null, 2), 'utf8', (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error writing to JSON file');
        return;
      }

      console.log('Item removed successfully.');
      res.redirect('/dashboard');
    });
  });
});




app.listen(3000, () => {
  console.log('Server started on port 3000');
});

