const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middleware/upload');


router.post('/:id/review', upload.single('photo'), productController.submitReview);
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductDetails);

module.exports = router;