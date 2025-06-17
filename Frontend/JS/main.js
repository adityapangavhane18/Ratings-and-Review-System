// const API_BASE = 'http://localhost:5000/products';

// async function fetchProducts() {
//     const res = await fetch(API_BASE);
//     const products = await res.json();
//     const container = document.getElementById('product-list');

//     products.forEach(product => {
//         const div = document.createElement('div');
//         div.className = 'product';

//         div.innerHTML = `
//       <h3>${product.name}</h3>
//       <p>${product.description}</p>
//       <form class="review-form" onsubmit="submitReview(event, ${product.id})">
//         <input type="email" name="email" placeholder="Your Email" required />
//         <input type="number" name="rating" min="1" max="5" placeholder="Rating (1-5)" />
//         <textarea name="review" placeholder="Your Review"></textarea>
//         <button type="submit">Submit Review</button>
//       </form>
//       <div class="review-block" id="review-${product.id}">Loading reviews...</div>
//     `;

//         container.appendChild(div);
//         fetchReviews(product.id);
//     });
// }

// async function fetchReviews(productId) {
//     const res = await fetch(`${API_BASE}/${productId}`);
//     const data = await res.json();

//     const reviewBlock = document.getElementById(`review-${productId}`);
//     reviewBlock.innerHTML = `
//         <strong>Avg Rating:</strong> ${data.average_rating} ⭐<br/>
//         <strong>Top Tags:</strong> ${data.tags.join(', ') || 'No tags yet'}<br/>
//         <strong>Reviews:</strong>
//         <ul>
//             ${data.reviews.map(r => `<li><b>${r.email}:</b> ${r.review || '(No comment)'} - ${r.rating || 'No rating'}⭐</li>`).join('')}
//         </ul>
// `;

// }

// async function submitReview(event, productId) {
//   event.preventDefault();
//   const form = event.target;
//   const email = form.email.value;
//   const rating = form.rating.value;
//   const review = form.review.value;

//   const res = await fetch(`${API_BASE}/${productId}/review`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ email, rating, review }),
//   });

//   const result = await res.json();
//   alert(result.message || result.error);

//   fetchReviews(productId);
//   form.reset();
// }

// window.onload = fetchProducts;


const API_BASE = 'http://localhost:5000/products';

// Fetch and display all products
async function fetchProducts() {
    const res = await fetch(API_BASE);
    const products = await res.json();
    const container = document.getElementById('product-list');
    container.innerHTML = '';

    products.forEach(product => {
        const div = document.createElement('div');
        div.className = 'product';

        div.innerHTML = `
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <form class="review-form" onsubmit="submitReview(event, ${product.id})" enctype="multipart/form-data">
                <input type="email" name="email" placeholder="Your Email" required />
                <input type="number" name="rating" min="1" max="5" placeholder="Rating (1-5)" />
                <textarea name="review" placeholder="Your Review"></textarea>
                <input type="file" name="photo" accept="image/*" />
                <button type="submit">Submit Review</button>
            </form>
            <div class="review-block" id="review-${product.id}">Loading reviews...</div>
        `;

        container.appendChild(div);
        fetchReviews(product.id);
    });
}

// Fetch reviews for a specific product
async function fetchReviews(productId) {
    const res = await fetch(`${API_BASE}/${productId}`);
    const data = await res.json();

    const reviewBlock = document.getElementById(`review-${productId}`);
    reviewBlock.innerHTML = `
        <strong>Avg Rating:</strong> ${data.average_rating} ⭐<br/>
        <strong>Top Tags:</strong> ${data.tags.join(', ') || 'No tags yet'}<br/>
        <strong>Reviews:</strong>
        <ul>
            ${data.reviews.map(r => `
                <li>
                    <b>${r.email}:</b> ${r.review || '(No comment)'} - ${r.rating || 'No rating'}⭐
                    ${r.photo ? `<br/><img src="http://localhost:5000/uploads/${r.photo}" alt="Review photo" style="width:100px;height:auto;margin-top:5px;" />` : ''}
                </li>
            `).join('')}
        </ul>
    `;
}

// Submit a review for a product
async function submitReview(event, productId) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    try {
        const res = await fetch(`${API_BASE}/${productId}/review`, {
            method: 'POST',
            body: formData
        });

        const result = await res.json();
        alert(result.message || result.error);

        fetchReviews(productId);
        form.reset();
    } catch (err) {
        alert('Error submitting review. Please try again.');
        console.error(err);
    }
}

window.onload = fetchProducts;