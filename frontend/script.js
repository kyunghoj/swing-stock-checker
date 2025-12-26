document.addEventListener('DOMContentLoaded', () => {
    const productContainer = document.getElementById('product-container');
    const loadingIndicator = document.getElementById('loading');
    const lastUpdatedElement = document.getElementById('last-updated-time');
    const API_URL = 'http://127.0.0.1:8000/api/products';

    // --- State Management ---
    let allProducts = [];
    let previousProductUrls = new Set();
    let currentFilter = 'all'; // 'all', 'guitar', 'bass'
    let currentSort = 'recent'; // 'recent', 'price_asc'
    let isFirstLoad = true;

    // --- UI Elements ---
    const filterButtons = document.querySelectorAll('.filter-group button');
    const sortSelect = document.getElementById('sort-select');

    // --- Event Listeners ---
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentFilter = button.dataset.filter;
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            renderProducts();
        });
    });

    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderProducts();
    });

    // --- Core Functions ---
    function renderProducts() {
        productContainer.innerHTML = '';

        let productsToRender = [...allProducts];

        // 1. Filter
        if (currentFilter !== 'all') {
            productsToRender = productsToRender.filter(p => p.product_type === currentFilter);
        }

        // 2. Sort
        if (currentSort === 'price_asc') {
            productsToRender.sort((a, b) => a.price_numeric - b.price_numeric);
        }
        // 'recent' is the default order from the API, so no sorting needed for that.

        if (productsToRender.length === 0) {
            productContainer.innerHTML = '<p>표시할 상품이 없습니다.</p>';
            return;
        }

        // 3. Render
        productsToRender.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';

            const link = document.createElement('a');
            link.href = product.product_url;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';

            // 4. Highlight New Items
            if (!isFirstLoad && !previousProductUrls.has(product.product_url)) {
                const newBadge = document.createElement('span');
                newBadge.className = 'new-badge';
                newBadge.textContent = 'New';
                link.appendChild(newBadge);
            }

            const image = document.createElement('img');
            image.src = product.image_url;
            image.alt = product.name;
            image.className = 'product-image';

            const info = document.createElement('div');
            info.className = 'product-info';

            const name = document.createElement('h2');
            name.textContent = product.name;

            const price = document.createElement('p');
            price.className = 'price';
            price.textContent = product.price;

            info.appendChild(name);
            info.appendChild(price);
            link.appendChild(image);
            link.appendChild(info);
            card.appendChild(link);

            productContainer.appendChild(card);
        });
    }

    function fetchAndDisplayProducts() {
        loadingIndicator.style.display = 'block';

        fetch(API_URL)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(products => {
                loadingIndicator.style.display = 'none';
                const now = new Date();
                lastUpdatedElement.textContent = now.toLocaleTimeString('ko-KR');
                
                // Update the set of previous URLs before replacing the main list
                if (!isFirstLoad) {
                    previousProductUrls = new Set(allProducts.map(p => p.product_url));
                }

                allProducts = products;
                renderProducts();

                if (isFirstLoad) {
                    previousProductUrls = new Set(allProducts.map(p => p.product_url));
                    isFirstLoad = false;
                }
            })
            .catch(error => {
                loadingIndicator.style.display = 'none';
                const now = new Date();
                lastUpdatedElement.textContent = `${now.toLocaleTimeString('ko-KR')} (오류 발생)`;
                productContainer.innerHTML = `<p style="color: red;">데이터를 불러오는 데 실패했습니다. 백엔드 서버가 실행 중인지 확인해주세요.</p><p style="color: #666;">오류: ${error.message}</p>`;
                console.error('Error fetching products:', error);
            });
    }

    // --- Initial Load and Interval ---
    fetchAndDisplayProducts();
    setInterval(fetchAndDisplayProducts, 3600000); // Every hour
});