# 🛍️ Product Review App

A simple full-stack web application to submit and display ratings & reviews for listed products.

## 🧱 Project Structure

```
product-review-app/
│
├── backend/
│   ├── controllers/        – Core logic for products & reviews
│   ├── models/             – Database operations
│   ├── routes/             – API endpoints
│   ├── uploads/            – Uploaded images (created automatically)
│   ├── utils/              – Tag extractor helper
│   ├── middleware/         – File upload config 
│   ├── config.js           – DB credentials
│   ├── db.js               – MySQL DB connection
│   └── server.js           – App entry point
│
├── frontend/
│   ├── css/                – Styling of the System 
│   ├── js/app.js           – Main frontend script
│   └── index.html          – Main UI page
│
├── sql/schema.sql          – SQL to set up tables
├── .gitignore
└── package.json
```

## ⚙️ Setup Instructions

### Step 1: Clone the project
```bash
git clone https://github.com/your-username/product-review-app.git
```

### Step 2: Install dependencies
```bash
cd backend
npm install
```

### Step 3: Set up MySQL database
- Create a database: `product_reviews_db`
- Import the SQL schema:
```bash
mysql -u root -p product_reviews_db < sql/schema.sql
```

### Step 4: Configure database credentials
Edit `backend/config.js` with your MySQL username and password.

### Step 5: Start the server
```bash
npm run dev
```

### Step 6: Open the frontend
Open `frontend/index.html` in your browser.

## 🧪 Test the API

Use Postman or the frontend UI to test the following endpoints:

- `GET /products` – List all products
- `GET /products/:id` – Product details with reviews & tags
- `POST /products/:id/review` – Submit review (email, rating, review, image)
#
