const multer = require('multer');
const path = require('path');

// File storage config
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'backend/uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

module.exports = upload;