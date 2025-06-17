const db = require('../db');
exports.submitReview = (req, res) => {
    const productId = req.params.id;
    const { email, rating, review } = req.body;

    if (!email || (!rating && !review)) {
        return res.status(400).json({ error: 'Email and at least one of rating/review is required' });
    }

    // First, insert or get user
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, userResult) => {
        if (err) return res.status(500).json({ error: err });

        const insertOrUpdateReview = (userId) => {
            // Check if user already reviewed 
            db.query(
                'SELECT * FROM reviews WHERE user_id = ? AND product_id = ?', [userId, productId],
                (err, existingReview) => {
                    if (err) return res.status(500).json({ error: err });

                    if (existingReview.length > 0) {
                        return res.status(400).json({ error: 'You have already reviewed this product.' });
                    }

                    // Insert new record
                    const sql = `
            INSERT INTO reviews (user_id, product_id, rating, review)
            VALUES (?, ?, ?, ?)`;
                    db.query(sql, [userId, productId, rating || null, review || null], (err, result) => {
                        if (err) return res.status(500).json({ error: err });
                        res.json({ message: 'Review submitted successfully!' });
                    });
                }
            );
        };

        if (userResult.length === 0) {
            db.query('INSERT INTO users (email) VALUES (?)', [email], (err, result) => {
                if (err) return res.status(500).json({ error: err });
                insertOrUpdateReview(result.insertId);
            });
        } else {
            insertOrUpdateReview(userResult[0].id);
        }
    });
};