const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const upload = require('../middleware/upload'); // ✅ multer middleware

router.post('/:id/review', upload.single('photo'), reviewController.submitReview);

module.exports = router;