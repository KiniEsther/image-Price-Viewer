document.addEventListener('DOMContentLoaded', () => {

    const content = document.getElementById('content');

    const productId = new URLSearchParams(window.location.search).get('id');

    const searchInput = document.getElementById('search-input');

    // Check if productId exists to decide whether to fetch a single product or the product list
    if (productId) {
        fetchProductDetails(productId);
    } else {
        fetchProductList();
    }

    // Function to fetch product list from the server

    function fetchProductList() {

        fetch('https://imge-back-end.vercel.app/products')

            .then(response => {

                if (!response.ok) {

                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(products => {
                renderProductList(products);
                setupSearch(products); // Setup search functionality
            })
            .catch(error => {
                console.error('Error fetching product list:', error);
                content.innerHTML = '<p class="error">Failed to load products. Please try again later.</p>';
            });
    }

    // Function to render the product list
    function renderProductList(products) {
        content.innerHTML = '<div class="product-list"></div>';
        const productList = document.querySelector('.product-list');

        products.forEach(product => {
            const productItem = document.createElement('div');
            productItem.className = 'product-item';
            productItem.innerHTML = `
                <div class="product-box">
                    <a href="#" class="product-card">
                        <button class="wishlist-button">
                            <span class="sr-only">Wishlist</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="wishlist-icon">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>
                            </svg>
                        </button>
                        <img alt="${product.title}" src="${product.images[0]}" class="product-image">
                        <div class="product-details-2">
                            <span class="product-badge">New</span>
                            <h3 class="product-title">${product.title}</h3>
                            <p class="availability">${product.isAvailable ? 'Available' : 'Out of Stock'}</p>
                            <p class="price">${product.price}</p>
                            <form>
                                <a href="item.html?id=${product.id}" class="add-to-cart-button">Shop now</a>
                            </form>
                        </div>
                    </a>
                </div>
            `;
            productList.appendChild(productItem);
            productItem.querySelector('.add-to-cart-button').addEventListener('click', (event) => {
                event.preventDefault();
                window.location.search = `?id=${product.id}`;
            });
        });
    }

    // Function to fetch and render product details based on ID
    function fetchProductDetails(id) {
        fetch(`https://imge-back-end.vercel.app/products/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(product => {
                renderProductDetails(product);
            })
            .catch(error => {
                console.error('Error fetching product details:', error);
                content.innerHTML = '<p class="error">Failed to load product details. Please try again later.</p>';
            });
    }

    // Function to render the product details
    function renderProductDetails(product) {
        content.innerHTML = `
            <div class="product-details">
                <div class="image-view">
                    <div class="image-slider">
                        <img src="${product.images[0]}" alt="${product.title}">
                    </div>
                    <div class="image-image">
                        ${product.images.map((image, index) => `<img src="${image}" alt="image ${index + 1}" class="image" data-index="${index}">`).join('')}
                    </div>
                    <div class="image-slider-controls">
                        <button id="prev-image">Prev</button>
                        <button id="next-image">Next</button>
                    </div>
                </div>
                <div class="product-info">
                    <p class="availability">${product.isAvailable ? 'Available' : 'Out of Stock'}</p>
                    <div class="quantity">
                        <button id="decrease">-</button>
                        <span id="quantity">1</span>
                        <button id="increase">+</button>
                    </div>
                    <h1>${product.title}</h1>
                    <p>${product.description}</p>
                    <p class="price">${product.price}</p>
                </div>
                <button id="back">Back to Products</button>
            </div>
        `;

        // Initialize quantity and add event listeners
        const quantityElement = document.getElementById('quantity');
        let quantity = 1;

        document.getElementById('increase').addEventListener('click', () => {
            quantity++;
            quantityElement.textContent = quantity;
        });

        document.getElementById('decrease').addEventListener('click', () => {
            if (quantity > 1) {
                quantity--;
                quantityElement.textContent = quantity;
            }
        });

        document.getElementById('back').addEventListener('click', () => {
            window.location.search = '';
        });

        // Image slider functionality
        const imageSlider = document.querySelector('.image-slider');
        const image = document.querySelectorAll('.image');
        let currentIndex = 0;

        image[currentIndex].classList.add('active');

        document.getElementById('prev-image').addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + product.images.length) % product.images.length;
            updateImageSlider(currentIndex);
        });

        document.getElementById('next-image').addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % product.images.length;
            updateImageSlider(currentIndex);
        });

        image.forEach(image => {
            image.addEventListener('click', (event) => {
                const index = parseInt(event.target.getAttribute('data-index'));
                currentIndex = index;
                updateImageSlider(currentIndex);
            });
        });

        function updateImageSlider(index) {
            imageSlider.innerHTML = `<img src="${product.images[index]}" alt="${product.title}">`;
            image.forEach(image => image.classList.remove('active'));
            image[index].classList.add('active');
        }
    }

    // Function to setup search functionality
    function setupSearch(products) {
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.trim().toLowerCase();
            const filteredProducts = products.filter(product =>
                product.title.toLowerCase().includes(searchTerm)
            );
            renderProductList(filteredProducts);
        });
    }
});