const db = require('../db');
const { extractTagsFromReviews } = require('../utils/tagExtractor');

// Get all products
exports.getAllProducts = (req, res) => {
    const sql = 'SELECT * FROM products';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
};

// Get product by ID with average rating and reviews
exports.getProductDetails = (req, res) => {
    const productId = req.params.id;

    const productQuery = 'SELECT * FROM products WHERE id = ?';
    const reviewsQuery = `
    SELECT r.*, u.email 
    FROM reviews r 
    JOIN users u ON r.user_id = u.id 
    WHERE r.product_id = ?`;

    const ratingQuery = `
    SELECT AVG(rating) AS avg_rating 
    FROM reviews 
    WHERE product_id = ?`;

    db.query(productQuery, [productId], (err, productResult) => {
        if (err || productResult.length === 0)
            return res.status(404).json({ error: 'Product not found' });

        db.query(reviewsQuery, [productId], (err, reviews) => {
            if (err) return res.status(500).json({ error: err });

            db.query(ratingQuery, [productId], (err, ratingResult) => {
                if (err) return res.status(500).json({ error: err });

                const avg_rating = parseFloat(ratingResult[0].avg_rating) || 0;

                const tags = extractTagsFromReviews(reviews);

                res.json({
                    product: productResult[0],
                    reviews,
                    average_rating: avg_rating.toFixed(1),
                    tags
                });

            });
        });
    });
};

exports.submitReview = (req, res) => {
    const productId = req.params.id;
    const { email, rating, review } = req.body;
    const photo = req.file ? req.file.filename : null;

    const findUserQuery = 'SELECT id FROM users WHERE email = ?';
    db.query(findUserQuery, [email], (err, userResult) => {
        if (err) return res.status(500).json({ error: err });

        let userId;
        if (userResult.length > 0) {
            userId = userResult[0].id;
            insertReview();
        } else {
            const createUserQuery = 'INSERT INTO users (email) VALUES (?)';
            db.query(createUserQuery, [email], (err, result) => {
                if (err) return res.status(500).json({ error: err });
                userId = result.insertId;
                insertReview();
            });
        }

        function insertReview() {
            const checkReviewQuery = 'SELECT * FROM reviews WHERE product_id = ? AND user_id = ?';
            db.query(checkReviewQuery, [productId, userId], (err, existing) => {
                if (err) return res.status(500).json({ error: err });

                if (existing.length > 0) {
                    return res.status(400).json({ error: 'You have already reviewed this product.' });
                }

                const insertReviewQuery = 'INSERT INTO reviews (product_id, user_id, rating, review, photo) VALUES (?, ?, ?, ?, ?)';
                db.query(insertReviewQuery, [productId, userId, rating || null, review || null, photo], (err) => {
                    if (err) return res.status(500).json({ error: err });
                    res.status(201).json({ message: 'Review submitted successfully!' });
                });
            });
        }
    });
};

exports.submitReview = (req, res) => {
    const productId = req.params.id;
    const { email, rating, review } = req.body;
    const photo = req.file ? req.file.filename : null;

    // Find or create user
    const findUser = 'SELECT id FROM users WHERE email = ?';
    db.query(findUser, [email], (err, userResult) => {
        if (err) return res.status(500).json({ error: err });

        let userId;
        if (userResult.length > 0) {
            userId = userResult[0].id;
            insertReview();
        } else {
            const createUser = 'INSERT INTO users (email) VALUES (?)';
            db.query(createUser, [email], (err, result) => {
                if (err) return res.status(500).json({ error: err });
                userId = result.insertId;
                insertReview();
            });
        }

        function insertReview() {
            const checkDuplicate = 'SELECT * FROM reviews WHERE product_id = ? AND user_id = ?';
            db.query(checkDuplicate, [productId, userId], (err, result) => {
                if (err) return res.status(500).json({ error: err });

                if (result.length > 0) {
                    return res.status(400).json({ error: 'You have already reviewed this product.' });
                }

                const insertQuery = 'INSERT INTO reviews (product_id, user_id, rating, review, photo) VALUES (?, ?, ?, ?, ?)';
                db.query(insertQuery, [productId, userId, rating || null, review || null, photo], (err) => {
                    if (err) return res.status(500).json({ error: err });
                    res.status(201).json({ message: 'Review submitted successfully!' });
                });
            });
        }
    });
};