// Shop Page JavaScript

let currentView = 'grid';
let currentSort = 'popularity';
let currentFilters = {
    category: [],
    material: [],
    collection: []
};
let currentPage = 1;
const productsPerPage = 12;

document.addEventListener('DOMContentLoaded', () => {
    // initBreadcrumbs();
    loadProducts();
    initFilters();
    initMobileFilter();
    
    // Initialize Feather icons
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
});

// initBreadcrumbs removed

function initMobileFilter() {
    const filterToggleBtn = document.getElementById('filterToggleBtn');
    const filterCloseBtn = document.getElementById('filterCloseBtn');
    const filterSection = document.getElementById('filterSection');
    const filterOverlay = document.getElementById('filterModalOverlay');

    if (!filterSection) {
        console.warn('Filter section not found');
        return;
    }

    // Store original parent for restoration
    let originalParent = filterSection.parentElement;

    function openFilter() {
        console.log('Opening filter');
        // Only move to body on mobile
        if (window.innerWidth <= 768) {
            if (filterSection.parentElement !== document.body) {
                originalParent = filterSection.parentElement;
                document.body.appendChild(filterSection);
            }
        }
        filterSection.classList.add('active');
        if (filterOverlay) {
            filterOverlay.classList.add('active');
        }
        document.body.style.overflow = 'hidden';
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }

    function closeFilter() {
        console.log('Closing filter');
        filterSection.classList.remove('active');
        if (filterOverlay) {
            filterOverlay.classList.remove('active');
        }
        document.body.style.overflow = '';
        // Move filter section back to original parent
        if (filterSection.parentElement === document.body && originalParent) {
            originalParent.appendChild(filterSection);
        }
    }

    // Only set up mobile filter button on mobile
    if (window.innerWidth <= 768 && filterToggleBtn) {
        filterToggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openFilter();
        });
    } else {
        // On desktop, ensure filter section is in sidebar
        const sidebar = document.querySelector('.shop-sidebar');
        if (sidebar && filterSection.parentElement === document.body) {
            sidebar.appendChild(filterSection);
        }
    }
    
    if (filterCloseBtn) {
        filterCloseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeFilter();
        });
    }

    if (filterOverlay) {
        filterOverlay.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeFilter();
        });
    }

    // Close filter when Apply Filters is clicked on mobile
    const applyBtn = document.querySelector('#filterSection .btn-primary');
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            setTimeout(() => {
                if (window.innerWidth <= 768) {
                    closeFilter();
                }
            }, 200);
        });
    }

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768) {
                // Desktop: close filter and move back to sidebar
                closeFilter();
                const sidebar = document.querySelector('.shop-sidebar');
                if (sidebar && filterSection.parentElement === document.body) {
                    sidebar.appendChild(filterSection);
                }
            } else {
                // Mobile: ensure filter button is set up
                if (filterToggleBtn && !filterToggleBtn.hasAttribute('data-listener-added')) {
                    filterToggleBtn.setAttribute('data-listener-added', 'true');
                    filterToggleBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openFilter();
                    });
                }
            }
        }, 250);
    });
}

function initFilters() {
    // Category filters
    document.querySelectorAll('.category-filter').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            updateCategoryFilters();
        });
    });

    // Material filters
    document.querySelectorAll('.material-filter').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            updateMaterialFilters();
        });
    });

    // Collection filters
    document.querySelectorAll('.collection-filter').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            updateCollectionFilters();
        });
    });
}

function updateCategoryFilters() {
    currentFilters.category = Array.from(document.querySelectorAll('.category-filter:checked'))
        .map(cb => cb.value);
}

function updateMaterialFilters() {
    currentFilters.material = Array.from(document.querySelectorAll('.material-filter:checked'))
        .map(cb => cb.value);
}

function updateCollectionFilters() {
    currentFilters.collection = Array.from(document.querySelectorAll('.collection-filter:checked'))
        .map(cb => cb.value);
}

function applyFilters() {
    updateCategoryFilters();
    updateMaterialFilters();
    updateCollectionFilters();

    currentPage = 1;
    loadProducts();
    Toast.show('Filters applied', 'success');
}

function clearFilters() {
    // Reset checkboxes
    document.querySelectorAll('.category-filter, .material-filter, .collection-filter').forEach(cb => {
        cb.checked = false;
    });

    // Reset filters
    currentFilters = {
        category: [],
        material: [],
        collection: []
    };

    currentPage = 1;
    loadProducts();
    Toast.show('Filters cleared', 'info');
}

function filterProducts(products) {
    return products.filter(product => {
        // Category filter
        if (currentFilters.category.length > 0 && !currentFilters.category.includes(product.category)) {
            return false;
        }

        // Collection filter
        if (currentFilters.collection.length > 0 && !currentFilters.collection.includes(product.collection)) {
            return false;
        }

        // Material filter
        if (currentFilters.material.length > 0) {
            const productMaterial = product.material.toLowerCase();
            const matches = currentFilters.material.some(filter =>
                productMaterial.includes(filter.toLowerCase())
            );
            if (!matches) return false;
        }

        return true;
    });
}

function sortProducts() {
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        currentSort = sortSelect.value;
        loadProducts();
    }
}

function getSortedProducts(products) {
    const sorted = [...products];

    switch (currentSort) {
        case 'popularity':
            return sorted.sort((a, b) => {
                const aScore = (a.featured ? 10 : 0) + (a.trending ? 5 : 0);
                const bScore = (b.featured ? 10 : 0) + (b.trending ? 5 : 0);
                return bScore - aScore;
            });
        case 'latest':
            return sorted.sort((a, b) => b.id - a.id);
        case 'name':
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        default:
            return sorted;
    }
}

function setView(view) {
    currentView = view;
    const grid = document.getElementById('productsGrid');
    if (grid) {
        grid.className = `products-grid ${view === 'list' ? 'list-view' : 'grid-4'}`;
    }

    // Update button states
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });
}

function loadProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    // Show loading
    grid.innerHTML = '<div class="spinner" style="margin: 2rem auto;"></div>';

    setTimeout(() => {
        // Filter products
        let filtered = filterProducts(productsData);
        
        // Exclude specific products
        filtered = filtered.filter(product => 
            product.name !== "Rose Gold Dangle Earrings" && 
            product.name !== "Rose Gold Choker"
        );

        // Sort products
        filtered = getSortedProducts(filtered);

        // Update count
        const countEl = document.getElementById('productCount');
        if (countEl) {
            countEl.textContent = `${filtered.length} product${filtered.length !== 1 ? 's' : ''}`;
        }

        // Paginate
        const totalPages = Math.ceil(filtered.length / productsPerPage);
        const start = (currentPage - 1) * productsPerPage;
        const end = start + productsPerPage;
        const paginated = filtered.slice(start, end);

        // Render products
        grid.innerHTML = '';
        if (paginated.length === 0) {
            grid.innerHTML = '<div class="no-products"><p>No products found matching your criteria.</p></div>';
        } else {
            paginated.forEach(product => {
                const card = createProductCard(product);
                grid.appendChild(card);
            });
            // Update wishlist button states after rendering
            setTimeout(() => {
                if (typeof window.updateAllWishlistButtons !== 'undefined') {
                    window.updateAllWishlistButtons();
                }
            }, 100);
        }

        // Render pagination
        if (totalPages > 1) {
            const paginationContainer = document.getElementById('paginationContainer');
            if (paginationContainer) {
                paginationContainer.innerHTML = '';
                const pagination = createPagination(currentPage, totalPages, 'shop.html');
                paginationContainer.appendChild(pagination);
            }
        } else {
            const paginationContainer = document.getElementById('paginationContainer');
            if (paginationContainer) {
                paginationContainer.innerHTML = '';
            }
        }
    }, 300);
}

// Handle pagination clicks
document.addEventListener('click', (e) => {
    if (e.target.closest('.pagination-number')) {
        e.preventDefault();
        const page = parseInt(e.target.textContent);
        if (page && page !== currentPage) {
            currentPage = page;
            loadProducts();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    if (e.target.closest('.pagination-btn:not(.disabled)')) {
        e.preventDefault();
        const href = e.target.closest('.pagination-btn').getAttribute('href');
        if (href && href !== '#') {
            const match = href.match(/page=(\d+)/);
            if (match) {
                currentPage = parseInt(match[1]);
                loadProducts();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    }
});

// Initialize with all products
loadProducts();

