const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connection = require('./db');

const productRoutes = require('./routes/productRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();
const PORT = 5000;


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// for image
const path = require('path');

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/products', productRoutes);
app.use('/products', reviewRoutes);

app.get('/', (req, res) => {
    res.send('Product Review API is running.');
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});