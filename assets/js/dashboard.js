// Dashboard JavaScript - User and Admin Dashboard Functionality

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', () => {
    initUserDashboard();
    initAdminDashboard();
    initTabSwitching();
    initForms();
    loadDashboardData();
});

// Chart instances storage
let chartInstances = {
    revenue: null,
    orders: null,
    category: null
};

// User Dashboard Functions
function initUserDashboard() {
    const menuItems = document.querySelectorAll('.account-menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = item.getAttribute('data-tab');
            switchTab(tab);

            // Update active state
            menuItems.forEach(mi => mi.classList.remove('active'));
            item.classList.add('active');

            // Close sidebar on mobile after selecting menu item
            if (window.innerWidth <= 768) {
                const sidebar = document.getElementById('accountSidebar');
                const overlay = document.querySelector('.account-sidebar-overlay');
                if (sidebar) {
                    sidebar.classList.remove('active');
                }
                if (overlay) {
                    overlay.classList.remove('active');
                }
                document.body.style.overflow = '';
            }
        });
    });

    // Mobile menu toggle
    const menuToggle = document.getElementById('accountMenuToggle');
    const sidebar = document.getElementById('accountSidebar');
    const sidebarClose = document.getElementById('accountSidebarClose');

    // Create overlay if it doesn't exist
    let overlay = document.querySelector('.account-sidebar-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'account-sidebar-overlay';
        document.body.appendChild(overlay);
    }

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            if (overlay) {
                overlay.classList.toggle('active');
            }
            if (sidebar.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
            // Re-initialize Feather Icons
            if (typeof feather !== 'undefined') {
                feather.replace();
            }
        });
    }

    if (sidebarClose && sidebar) {
        sidebarClose.addEventListener('click', () => {
            sidebar.classList.remove('active');
            if (overlay) {
                overlay.classList.remove('active');
            }
            document.body.style.overflow = '';
            // Re-initialize Feather Icons
            if (typeof feather !== 'undefined') {
                feather.replace();
            }
        });
    }

    if (overlay && sidebar) {
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Close sidebar on window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768 && sidebar) {
                sidebar.classList.remove('active');
                if (overlay) {
                    overlay.classList.remove('active');
                }
                document.body.style.overflow = '';
            }
        }, 250);
    });
}

// Admin Dashboard Functions
function initAdminDashboard() {
    const menuItems = document.querySelectorAll('.admin-menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = item.getAttribute('href').substring(1);
            switchAdminTab(tab);

            // Update active state
            menuItems.forEach(mi => mi.classList.remove('active'));
            item.classList.add('active');

            // Close sidebar on mobile after selecting menu item
            if (window.innerWidth <= 768) {
                const sidebar = document.getElementById('adminSidebar');
                const overlay = document.querySelector('.admin-sidebar-overlay');
                if (sidebar) {
                    sidebar.classList.remove('active');
                }
                if (overlay) {
                    overlay.classList.remove('active');
                }
                document.body.style.overflow = '';
            }
        });
    });

    // Mobile menu toggle
    const menuToggle = document.getElementById('adminMenuToggle');
    const sidebar = document.getElementById('adminSidebar');
    const sidebarClose = document.getElementById('adminSidebarClose');

    // Create overlay if it doesn't exist
    let overlay = document.querySelector('.admin-sidebar-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'admin-sidebar-overlay';
        document.body.appendChild(overlay);
    }

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            if (overlay) {
                overlay.classList.toggle('active');
            }
            if (sidebar.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
            // Re-initialize Feather Icons
            if (typeof feather !== 'undefined') {
                feather.replace();
            }
        });
    }

    if (sidebarClose && sidebar) {
        sidebarClose.addEventListener('click', () => {
            sidebar.classList.remove('active');
            if (overlay) {
                overlay.classList.remove('active');
            }
            document.body.style.overflow = '';
            // Re-initialize Feather Icons
            if (typeof feather !== 'undefined') {
                feather.replace();
            }
        });
    }

    if (overlay && sidebar) {
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Close sidebar on window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768 && sidebar) {
                sidebar.classList.remove('active');
                if (overlay) {
                    overlay.classList.remove('active');
                }
                document.body.style.overflow = '';
            }
            // Destroy and recreate charts on resize for proper responsiveness
            if (window.innerWidth <= 768) {
                destroyCharts();
                setTimeout(() => {
                    if (document.getElementById('analytics').classList.contains('active')) {
                        initAnalyticsCharts();
                    }
                }, 300);
            } else {
                destroyCharts();
                setTimeout(() => {
                    if (document.getElementById('analytics').classList.contains('active')) {
                        initAnalyticsCharts();
                    }
                }, 300);
            }
        }, 250);
    });
}

// Tab Switching
function initTabSwitching() {
    // User dashboard tabs
    const userTabs = document.querySelectorAll('.dashboard-tab');
    function switchTab(tabName) {
        userTabs.forEach(tab => {
            tab.classList.remove('active');
        });
        const targetTab = document.getElementById(tabName);
        if (targetTab) {
            targetTab.classList.add('active');

            // Load orders when orders tab is opened
            if (tabName === 'orders' && typeof loadUserOrders === 'function') {
                setTimeout(() => {
                    loadUserOrders();
                }, 100);
            }
        }
    }
    window.switchTab = switchTab;

    // Admin dashboard tabs
    function switchAdminTab(tabName) {
        const adminTabs = document.querySelectorAll('.admin-tab');
        adminTabs.forEach(tab => {
            tab.classList.remove('active');
        });
        const targetTab = document.getElementById(tabName);
        if (targetTab) {
            targetTab.classList.add('active');

            // Initialize charts when switching to analytics tab
            if (tabName === 'analytics') {
                setTimeout(() => {
                    initAnalyticsCharts();
                }, 100);
            }
        }
    }
    window.switchAdminTab = switchAdminTab;
}

// Sample Orders Data
const sampleOrders = [
    {
        id: 'ORD-2024-001',
        customer: 'John Doe',
        customerEmail: 'john.doe@example.com',
        products: [
            {
                name: 'Elegant Gold Chain Necklace',
                quantity: 1,
                price: 1299.99,
                image: 'https://images.unsplash.com/photo-1758995115518-26f90aa61b97?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bmVja2xhY2UlMjBqZXdlbHJ5JTIwYWVzdGhldGljfGVufDB8fDB8fHww'
            }
        ],
        total: 1299.99,
        status: 'processing',
        date: '2024-03-20',
        paymentMethod: 'Credit Card'
    },
    {
        id: 'ORD-2024-002',
        customer: 'Sarah Johnson',
        customerEmail: 'sarah.j@example.com',
        products: [
            {
                name: 'Diamond Stud Earrings',
                quantity: 1,
                price: 899.99,
                image: 'https://media.istockphoto.com/id/508118945/photo/gold-stud-diamond-earrings.webp?a=1&b=1&s=612x612&w=0&k=20&c=r50mwGfkQnQcIb8gN2E0jMlUbHw6Ayipr-UN2StdR_o='
            },
            {
                name: 'Rose Gold Choker',
                quantity: 1,
                price: 699.99,
                image: 'https://images.unsplash.com/photo-1721807644923-df3186074d89?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fFJvc2UlMjBHb2xkJTIwQ2hva2VyJTIwTmVja2xhY2V8ZW58MHx8MHx8fDA%3D'
            }
        ],
        total: 1599.98,
        status: 'delivered',
        date: '2024-03-19',
        paymentMethod: 'PayPal'
    },
    {
        id: 'ORD-2024-003',
        customer: 'Michael Chen',
        customerEmail: 'michael.c@example.com',
        products: [
            {
                name: 'Platinum Wedding Ring',
                quantity: 1,
                price: 1999.99,
                image: 'https://media.istockphoto.com/id/1216928531/photo/pair-of-silver-wedding-rings-isolated-on-white-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=71FbDv2pd485enX3Yly14Yi8ntvM3m2fDcaM089uEaw='
            }
        ],
        total: 1999.99,
        status: 'pending',
        date: '2024-03-21',
        paymentMethod: 'Credit Card'
    },
    {
        id: 'ORD-2024-004',
        customer: 'Emily Davis',
        customerEmail: 'emily.d@example.com',
        products: [
            {
                name: 'Pearl Strand Necklace',
                quantity: 1,
                price: 899.99,
                image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&h=800&fit=crop&auto=format&q=80'
            },
            {
                name: 'Diamond Pendant Necklace',
                quantity: 1,
                price: 2499.99,
                image: 'https://images.unsplash.com/photo-1708220084863-5c249297dd64?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fERpYW1vbmQlMjBQZW5kYW50JTIwTmVja2xhY2V8ZW58MHx8MHx8fDA%3D'
            }
        ],
        total: 3399.98,
        status: 'delivered',
        date: '2024-03-18',
        paymentMethod: 'Credit Card'
    },
    {
        id: 'ORD-2024-005',
        customer: 'Robert Wilson',
        customerEmail: 'robert.w@example.com',
        products: [
            {
                name: 'Gold Tennis Bracelet',
                quantity: 1,
                price: 1499.99,
                image: 'https://images.unsplash.com/photo-1767921777873-81818b812a4d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8VGVubmlzJTIwQnJhY2VsZXR8ZW58MHx8MHx8fDA%3D'
            }
        ],
        total: 1499.99,
        status: 'cancelled',
        date: '2024-03-20',
        paymentMethod: 'Debit Card'
    },
    {
        id: 'ORD-2024-006',
        customer: 'Lisa Anderson',
        customerEmail: 'lisa.a@example.com',
        products: [
            {
                name: 'Silver Hoop Earrings',
                quantity: 2,
                price: 299.99,
                image: 'https://media.istockphoto.com/id/1474786177/photo/elegant-jewelry-set-jewellery-set-with-gemstones-jewelry-accessories-collage-product-still.jpg?s=612x612&w=0&k=20&c=KnFFzwVKdgxOCO2OSN09SPDRg63OgnkbWySMu_nv8kk='
            }
        ],
        total: 599.98,
        status: 'cancelled',
        date: '2024-03-17',
        paymentMethod: 'Credit Card'
    },
    {
        id: 'ORD-2024-007',
        customer: 'David Brown',
        customerEmail: 'david.b@example.com',
        products: [
            {
                name: 'Diamond Engagement Ring',
                quantity: 1,
                price: 3499.99,
                image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop&auto=format&q=80'
            }
        ],
        total: 3499.99,
        status: 'delivered',
        date: '2024-03-16',
        paymentMethod: 'Credit Card'
    },
    {
        id: 'ORD-2024-008',
        customer: 'Jennifer Martinez',
        customerEmail: 'jennifer.m@example.com',
        products: [
            {
                name: 'Rose Gold Choker',
                quantity: 1,
                price: 699.99,
                image: 'https://images.unsplash.com/photo-1721807644923-df3186074d89?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fFJvc2UlMjBHb2xkJTIwQ2hva2VyJTIwTmVja2xhY2V8ZW58MHx8MHx8fDA%3D'
            },
            {
                name: 'Diamond Stud Earrings',
                quantity: 1,
                price: 899.99,
                image: 'https://media.istockphoto.com/id/508118945/photo/gold-stud-diamond-earrings.webp?a=1&b=1&s=612x612&w=0&k=20&c=r50mwGfkQnQcIb8gN2E0jMlUbHw6Ayipr-UN2StdR_o='
            }
        ],
        total: 1599.98,
        status: 'pending',
        date: '2024-03-21',
        paymentMethod: 'PayPal'
    }
];

// Load Admin Orders
function loadAdminOrders() {
    // Load recent orders in overview tab
    const recentOrdersTable = document.getElementById('recentOrdersTable');
    if (recentOrdersTable) {
        // Get recent 5 orders
        const recentOrders = sampleOrders.slice(0, 5);
        recentOrdersTable.innerHTML = recentOrders.map(order => {
            const statusClass = order.status;
            const statusText = order.status.charAt(0).toUpperCase() + order.status.slice(1);
            const mainProduct = order.products[0];
            const date = new Date(order.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });

            return `
                <tr>
                    <td><strong>${order.id}</strong></td>
                    <td>
                        <div>
                            <strong>${order.customer}</strong><br>
                            <small style="color: var(--text-secondary);">${order.customerEmail}</small>
                        </div>
                    </td>
                    <td>
                        <div>
                            ${mainProduct.name}<br>
                            <small style="color: var(--text-secondary);">Qty: ${mainProduct.quantity}</small>
                        </div>
                    </td>
                    <td><strong>$${order.total.toFixed(2)}</strong></td>
                    <td>
                        <span class="status-badge ${statusClass}">${statusText}</span>
                    </td>
                    <td>${date}</td>
                    <td>
                        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                            <button class="btn btn-outline" style="padding: 0.375rem 0.75rem; font-size: 0.875rem; display: flex; align-items: center; gap: 0.375rem;" onclick="viewOrder('${order.id}')" title="View">
                                <i class="feather-eye"></i>
                                <span>View</span>
                            </button>
                            <button class="btn btn-primary" style="padding: 0.375rem 0.75rem; font-size: 0.875rem; display: flex; align-items: center; gap: 0.375rem;" onclick="editOrderStatus('${order.id}')" title="Edit">
                                <i class="feather-edit"></i>
                                <span>Edit</span>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // Load all orders in orders tab
    const ordersTable = document.getElementById('ordersTable');
    if (ordersTable) {
        ordersTable.innerHTML = sampleOrders.map(order => {
            const statusClass = order.status;
            const statusText = order.status.charAt(0).toUpperCase() + order.status.slice(1);
            const productsText = order.products.length === 1
                ? order.products[0].name
                : `${order.products[0].name} + ${order.products.length - 1} more`;
            const date = new Date(order.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });

            return `
                <tr>
                    <td><strong>${order.id}</strong></td>
                    <td>
                        <div>
                            <strong>${order.customer}</strong><br>
                            <small style="color: var(--text-secondary);">${order.customerEmail}</small>
                        </div>
                    </td>
                    <td>${productsText}</td>
                    <td><strong>$${order.total.toFixed(2)}</strong></td>
                    <td>
                        <span class="status-badge ${statusClass}">${statusText}</span>
                    </td>
                    <td>${date}</td>
                    <td>
                        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                            <button class="btn btn-outline" style="padding: 0.375rem 0.75rem; font-size: 0.875rem; display: flex; align-items: center; gap: 0.375rem;" onclick="viewOrder('${order.id}')" title="View">
                                <i class="feather-eye"></i>
                                <span>View</span>
                            </button>
                            <button class="btn btn-primary" style="padding: 0.375rem 0.75rem; font-size: 0.875rem; display: flex; align-items: center; gap: 0.375rem;" onclick="editOrderStatus('${order.id}')" title="Edit">
                                <i class="feather-edit"></i>
                                <span>Edit</span>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // Re-initialize Feather Icons
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
}

// View Order Details
function viewOrder(orderId) {
    const order = sampleOrders.find(o => o.id === orderId);
    if (!order) {
        Toast.show('Order not found', 'error');
        return;
    }

    const productsList = order.products.map(p =>
        `<li>${p.name} x${p.quantity} - $${p.price.toFixed(2)}</li>`
    ).join('');

    const modal = new Modal('orderDetailsModal');
    modal.create(`
        <h2>Order Details: ${order.id}</h2>
        <div style="margin-top: 1.5rem;">
            <h3>Customer Information</h3>
            <p><strong>Name:</strong> ${order.customer}</p>
            <p><strong>Email:</strong> ${order.customerEmail}</p>
        </div>
        <div style="margin-top: 1.5rem;">
            <h3>Order Items</h3>
            <ul style="list-style: none; padding: 0;">
                ${productsList}
            </ul>
        </div>
        <div style="margin-top: 1.5rem;">
            <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
            <p><strong>Status:</strong> <span class="status-badge ${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></p>
            <p><strong>Date:</strong> ${new Date(order.date).toLocaleDateString()}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
        </div>
    `);
}

// Edit Order Status
function editOrderStatus(orderId) {
    const order = sampleOrders.find(o => o.id === orderId);
    if (!order) {
        Toast.show('Order not found', 'error');
        return;
    }

    const modal = new Modal('editOrderModal');
    modal.create(`
        <h2>Edit Order Status: ${order.id}</h2>
        <div style="margin-top: 1.5rem;">
            <label style="display: block; margin-bottom: 0.5rem;"><strong>Status</strong></label>
            <select id="orderStatusSelect" class="form-control" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: var(--radius-md);">
                <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
                <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
            </select>
        </div>
        <div style="margin-top: 1.5rem; display: flex; gap: 0.5rem; justify-content: flex-end;">
            <button class="btn btn-outline" onclick="document.querySelector('#editOrderModal').querySelector('.modal').remove()">Cancel</button>
            <button class="btn btn-primary" onclick="saveOrderStatus('${orderId}')">Save Changes</button>
        </div>
    `);
}

// Save Order Status
function saveOrderStatus(orderId) {
    const select = document.getElementById('orderStatusSelect');
    if (!select) return;

    const newStatus = select.value;
    const order = sampleOrders.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;
        loadAdminOrders(); // Reload orders
        Toast.show('Order status updated successfully', 'success');
        document.querySelector('#editOrderModal .modal').remove();
    }
}

// Make functions available globally
window.viewOrder = viewOrder;
window.editOrderStatus = editOrderStatus;
window.saveOrderStatus = saveOrderStatus;
window.loadAdminOrders = loadAdminOrders;

// Stub functions for missing load functions
// Load User Orders
function loadUserOrders() {
    const ordersList = document.getElementById('ordersList');
    if (!ordersList) return;

    // Filter Buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    let currentFilter = 'all';

    // Render Orders Function
    function renderOrders(filter) {
        let filteredOrders = sampleOrders;
        if (filter !== 'all') {
            filteredOrders = sampleOrders.filter(order => order.status === filter);
        }

        if (filteredOrders.length === 0) {
            ordersList.innerHTML = `
                <div style="text-align: center; padding: 3rem; grid-column: 1 / -1;">
                    <i class="feather-shopping-bag" style="font-size: 3rem; color: var(--text-light); margin-bottom: 1rem;"></i>
                    <h3>No orders found</h3>
                    <p style="color: var(--text-secondary);">You haven't placed any orders yet.</p>
                    <button class="btn btn-primary" onclick="window.location.href='index.html#shop'" style="margin-top: 1rem;">Start Shopping</button>
                </div>
            `;
            return;
        }

        // Use createOrderCard for consistent design
        if (typeof createOrderCard === 'function') {
            ordersList.innerHTML = filteredOrders.map(order => createOrderCard(order)).join('');
        } else {
            console.error('createOrderCard function not found');
        }

        // Re-initialize Feather Icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }

    // Initial Filter Setup
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            renderOrders(filter);
        });
    });

    // Initial Render
    renderOrders('all');
}

function loadUserWishlist() {
    // Already populated with static content for now
}

function loadAdminProducts() {
    // Admin products loading - can be implemented later
}

function loadAdminCustomers() {
    // Admin customers loading - can be implemented later
}

function loadCategories() {
    // Categories loading - can be implemented later
}

function loadReviews() {
    // Reviews loading - can be implemented later
}

// Helper to create order card HTML (reusable)
// Helper to create order card HTML (reusable)
function createOrderCard(order, isCompact = false) {
    const statusClass = order.status;
    const statusText = order.status.charAt(0).toUpperCase() + order.status.slice(1);
    const date = new Date(order.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    const productsHtml = order.products.map(product => `
        <div class="product-summary-item" style="display: flex; gap: 1rem; align-items: center; padding: 0.5rem; background: var(--bg-light); border-radius: var(--radius-sm); margin-bottom: 0.5rem;">
            <div class="product-thumb" style="width: 40px; height: 40px; border-radius: var(--radius-sm); overflow: hidden; flex-shrink: 0;">
                ${product.image
            ? `<img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">`
            : `<i class="feather-package" style="color: var(--text-light);"></i>`
        }
            </div>
            <div class="product-info-compact" style="flex: 1; text-align: left;">
                <p style="margin: 0; font-size: 0.9rem; font-weight: 500; color: var(--text-primary); line-height: 1.2;">${product.name}</p>
                <p style="margin: 0; font-size: 0.8rem; color: var(--text-secondary);">Qty: ${product.quantity} • $${product.price.toFixed(2)}</p>
            </div>
        </div>
    `).join('');

    return `
        <div class="order-item centered-card" style="background: var(--white); border-radius: var(--radius-lg); padding: var(--spacing-lg); box-shadow: var(--shadow-sm); border: 1px solid var(--border-color); display: flex; flex-direction: column; align-items: center; text-align: center; height: 100%;">
            <div class="order-header-centered" style="margin-bottom: var(--spacing-md); width: 100%;">
                <h3 class="order-id" style="margin: 0 0 0.25rem 0; font-size: 1.1rem; color: var(--primary-color);">${order.id}</h3>
                <span class="order-date" style="display: block; color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 0.75rem;">Placed on ${date}</span>
                <span class="status-badge ${statusClass}" style="display: inline-block; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600;">${statusText}</span>
            </div>
            
            <div class="order-products-list" style="width: 100%; margin-bottom: var(--spacing-md); border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color); padding: 1rem 0;">
                ${productsHtml}
            </div>
            
            <div class="order-footer-centered" style="width: 100%; margin-top: auto;">
                <div class="total-row" style="margin-bottom: 1rem;">
                    <span style="color: var(--text-secondary); font-size: 0.9rem; font-weight: 600;">Total:</span>
                    <strong style="font-size: 1.2rem; color: var(--primary-color); margin-left: 0.5rem;">$${order.total.toFixed(2)}</strong>
                </div>
                <div class="action-buttons" style="display: flex; flex-direction: column; gap: 0.5rem; width: 100%;">
                    <button class="btn btn-outline" style="width: 100%; padding: 0.5rem 1rem; color: var(--text-primary); border-color: var(--primary-color);" onclick="viewOrder('${order.id}')">View Details</button>
                    ${order.status === 'pending' || order.status === 'processing'
            ? `<button class="btn btn-outline" style="width: 100%; padding: 0.5rem 1rem; color: var(--error); border-color: var(--error);" onclick="alert('Cancel order ${order.id}')">Cancel Order</button>`
            : ''}
                </div>
            </div>
        </div>
    `;
}

// Function to load Recent Orders in User Dashboard Overview
function loadUserRecentOrders() {
    const recentOrdersContainer = document.getElementById('recentOrders');
    if (!recentOrdersContainer) {
        // Retry after a short delay if element not found
        setTimeout(() => {
            const retryContainer = document.getElementById('recentOrders');
            if (retryContainer) {
                loadUserRecentOrders();
            }
        }, 200);
        return;
    }

    // Clear any existing content
    recentOrdersContainer.innerHTML = '';

    // Check if sampleOrders is available
    if (typeof sampleOrders === 'undefined' || !sampleOrders || sampleOrders.length === 0) {
        recentOrdersContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <i class="feather-shopping-bag" style="font-size: 2.5rem; color: var(--text-light); margin-bottom: 1rem;"></i>
                <p style="color: var(--text-secondary);">No recent orders found.</p>
                <button class="btn btn-primary" onclick="window.location.href='shop.html'" style="margin-top: 1rem;">Start Shopping</button>
            </div>
        `;
        return;
    }

    // Get recent 5 orders (sorted by date, most recent first)
    const recentOrders = [...sampleOrders]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

    if (recentOrders.length === 0) {
        recentOrdersContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <i class="feather-shopping-bag" style="font-size: 2.5rem; color: var(--text-light); margin-bottom: 1rem;"></i>
                <p style="color: var(--text-secondary);">No recent orders found.</p>
                <button class="btn btn-primary" onclick="window.location.href='shop.html'" style="margin-top: 1rem;">Start Shopping</button>
            </div>
        `;
        return;
    }

    // Use createOrderCard if available, otherwise create inline
    try {
        if (typeof createOrderCard === 'function') {
            recentOrdersContainer.innerHTML = recentOrders.map(order => createOrderCard(order, true)).join('');
        } else {
            // Fallback: create order cards inline
            recentOrdersContainer.innerHTML = recentOrders.map(order => {
                const statusClass = order.status;
                const statusText = order.status.charAt(0).toUpperCase() + order.status.slice(1);
                const date = new Date(order.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });

                const productsHtml = order.products.map(product => `
                <div class="order-product-item" style="display: flex; gap: var(--spacing-md); align-items: center; margin-bottom: 0.5rem;">
                    <div class="order-product-image" style="width: 50px; height: 50px; min-width: 50px; background: #f5f5f5; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0;">
                        ${product.image ? `<img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover; display: block;">` : `<i class="feather-package" style="color: var(--text-light); width: 24px; height: 24px;"></i>`}
                    </div>
                    <div class="order-product-info">
                        <p class="order-product-name" style="margin: 0; font-weight: 500; font-size: 0.9rem">${product.name}</p>
                        <p class="order-product-price" style="margin: 0; color: var(--text-secondary); font-size: 0.85rem;">Qty: ${product.quantity} • $${product.price.toFixed(2)}</p>
                    </div>
                </div>
            `).join('');

                return `
                <div class="order-item" style="background: var(--white); border-radius: var(--radius-md); padding: var(--spacing-md); box-shadow: var(--shadow-sm); margin-bottom: var(--spacing-md);">
                    <div class="order-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--spacing-md); border-bottom: 1px solid var(--border-color); padding-bottom: var(--spacing-sm);">
                        <div>
                            <h3 class="order-id" style="margin: 0; font-size: 1.1rem;">${order.id}</h3>
                            <span class="order-date" style="color: var(--text-secondary); font-size: 0.85rem;">Placed on ${date}</span>
                        </div>
                        <span class="status-badge ${statusClass}">${statusText}</span>
                    </div>
                    <div class="order-products" style="margin-bottom: var(--spacing-md);">
                        ${productsHtml}
                    </div>
                    <div class="order-footer" style="display: flex; justify-content: space-between; align-items: center; padding-top: var(--spacing-sm); border-top: 1px solid var(--border-color);">
                        <div class="order-total">
                            <span style="color: var(--text-secondary); font-size: 0.9rem;">Total:</span>
                            <strong style="font-size: 1.1rem; color: var(--primary-color);">$${order.total.toFixed(2)}</strong>
                        </div>
                        <div class="order-actions" style="display: flex; gap: var(--spacing-sm);">
                            <button class="btn btn-outline" style="padding: 0.5rem 1rem;" onclick="if(typeof viewOrder === 'function') viewOrder('${order.id}')">View Details</button>
                            ${order.status === 'delivered' ? '<button class="btn btn-primary" style="padding: 0.5rem 1rem;">Write Review</button>' : ''}
                            ${order.status === 'pending' || order.status === 'processing' ? '<button class="btn btn-outline" style="padding: 0.5rem 1rem; color: var(--error); border-color: var(--error);">Cancel Order</button>' : ''}
                        </div>
                    </div>
                </div>
            `;
            }).join('');
        }
    } catch (error) {
        console.error('Error rendering recent orders:', error);
        recentOrdersContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <i class="feather-alert-circle" style="font-size: 2.5rem; color: var(--text-light); margin-bottom: 1rem;"></i>
                <p style="color: var(--text-secondary);">Unable to load recent orders. Please refresh the page.</p>
            </div>
        `;
    }

    // Re-initialize Feather Icons
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
}

// Make function globally available
window.loadUserRecentOrders = loadUserRecentOrders;

// Load Dashboard Data
function loadDashboardData() {
    try {
        // Load user dashboard data with delays to ensure DOM is ready
        if (typeof loadUserOrders === 'function') {
            setTimeout(() => loadUserOrders(), 100);
        }
        if (typeof loadUserRecentOrders === 'function') {
            // Load recent orders with a slight delay to ensure DOM is ready
            setTimeout(() => loadUserRecentOrders(), 150);
        }
        if (typeof loadUserWishlist === 'function') loadUserWishlist();

        // Load admin dashboard data
        loadAdminOrders(); // Always load admin orders
        if (typeof loadAdminProducts === 'function') loadAdminProducts();
        if (typeof loadAdminCustomers === 'function') loadAdminCustomers();
        if (typeof loadCategories === 'function') loadCategories();
        if (typeof loadReviews === 'function') loadReviews();
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Still try to load admin orders even if other functions fail
        loadAdminOrders();
        // Retry loading recent orders
        if (typeof loadUserRecentOrders === 'function') {
            setTimeout(() => loadUserRecentOrders(), 300);
        }
    }
    // Don't initialize charts here - wait for analytics tab to be active
}

// Destroy all charts
function destroyCharts() {
    if (chartInstances.revenue) {
        chartInstances.revenue.destroy();
        chartInstances.revenue = null;
    }
    if (chartInstances.orders) {
        chartInstances.orders.destroy();
        chartInstances.orders = null;
    }
    if (chartInstances.category) {
        chartInstances.category.destroy();
        chartInstances.category = null;
    }
}

// Initialize Analytics Charts
function initAnalyticsCharts() {
    // Destroy existing charts first
    destroyCharts();

    // Check if Chart.js is available
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded');
        return;
    }

    // Get responsive font sizes based on screen width
    const getResponsiveFontSize = (baseSize) => {
        if (window.innerWidth <= 768) {
            return baseSize * 0.7; // Mobile: 70% of base
        } else if (window.innerWidth <= 1024) {
            return baseSize * 0.85; // Tablet: 85% of base
        }
        return baseSize; // Desktop: full size
    };

    // Get chart height based on screen width
    const getChartHeight = (baseHeight) => {
        if (window.innerWidth <= 768) {
            return baseHeight * 0.6; // Mobile: 60% of base
        } else if (window.innerWidth <= 1024) {
            return baseHeight * 0.75; // Tablet: 75% of base
        }
        return baseHeight; // Desktop: full height
    };

    // Common chart options
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            intersect: false,
            mode: 'index'
        },
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    font: {
                        size: getResponsiveFontSize(12),
                        family: 'Inter, sans-serif'
                    },
                    padding: window.innerWidth <= 768 ? 8 : 12,
                    usePointStyle: true,
                    boxWidth: window.innerWidth <= 768 ? 8 : 10
                }
            },
            tooltip: {
                enabled: true,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: window.innerWidth <= 768 ? 8 : 12,
                titleFont: {
                    size: getResponsiveFontSize(13),
                    weight: 'bold'
                },
                bodyFont: {
                    size: getResponsiveFontSize(12)
                },
                cornerRadius: 8,
                displayColors: true
            }
        },
        scales: {
            x: {
                ticks: {
                    font: {
                        size: getResponsiveFontSize(11)
                    },
                    maxRotation: window.innerWidth <= 768 ? 45 : 0,
                    minRotation: window.innerWidth <= 768 ? 45 : 0
                },
                grid: {
                    display: true,
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            },
            y: {
                ticks: {
                    font: {
                        size: getResponsiveFontSize(11)
                    },
                    callback: function (value) {
                        return '$' + value.toLocaleString();
                    }
                },
                grid: {
                    display: true,
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            }
        }
    };

    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChartCanvas');
    if (revenueCtx) {
        const revenueWrapper = revenueCtx.closest('.chart-wrapper');
        if (revenueWrapper) {
            revenueWrapper.style.height = getChartHeight(400) + 'px';
        }

        chartInstances.revenue = new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Revenue',
                    data: [12000, 19000, 15000, 17000, 22000, 25000, 23000],
                    borderColor: 'rgb(102, 126, 234)',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: window.innerWidth <= 768 ? 4 : 6,
                    pointHoverRadius: window.innerWidth <= 768 ? 6 : 8,
                    pointBackgroundColor: 'rgb(102, 126, 234)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                ...commonOptions,
                scales: {
                    ...commonOptions.scales,
                    y: {
                        ...commonOptions.scales.y,
                        ticks: {
                            ...commonOptions.scales.y.ticks,
                            callback: function (value) {
                                if (window.innerWidth <= 768) {
                                    return value >= 1000 ? '$' + (value / 1000).toFixed(1) + 'k' : '$' + value;
                                }
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }

    // Orders Chart
    const ordersCtx = document.getElementById('ordersChartCanvas');
    if (ordersCtx) {
        const ordersWrapper = ordersCtx.closest('.chart-wrapper');
        if (ordersWrapper) {
            ordersWrapper.style.height = getChartHeight(300) + 'px';
        }

        chartInstances.orders = new Chart(ordersCtx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Orders',
                    data: [50, 70, 60, 65, 80, 90, 85],
                    backgroundColor: 'rgba(240, 147, 251, 0.8)',
                    borderColor: 'rgb(240, 147, 251)',
                    borderWidth: 2,
                    borderRadius: window.innerWidth <= 768 ? 4 : 6,
                    borderSkipped: false
                }]
            },
            options: commonOptions
        });
    }

    // Category Chart (Doughnut)
    const categoryCtx = document.getElementById('categoryChartCanvas');
    if (categoryCtx) {
        const categoryWrapper = categoryCtx.closest('.chart-wrapper');
        if (categoryWrapper) {
            categoryWrapper.style.height = getChartHeight(300) + 'px';
        }

        chartInstances.category = new Chart(categoryCtx, {
            type: 'doughnut',
            data: {
                labels: ['Necklaces', 'Earrings', 'Rings', 'Bracelets'],
                datasets: [{
                    data: [35, 25, 25, 15],
                    backgroundColor: [
                        'rgba(102, 126, 234, 0.8)',
                        'rgba(240, 147, 251, 0.8)',
                        'rgba(67, 233, 123, 0.8)',
                        'rgba(250, 112, 154, 0.8)'
                    ],
                    borderColor: [
                        'rgb(102, 126, 234)',
                        'rgb(240, 147, 251)',
                        'rgb(67, 233, 123)',
                        'rgb(250, 112, 154)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: window.innerWidth <= 768 ? 'bottom' : 'right',
                        labels: {
                            font: {
                                size: getResponsiveFontSize(12),
                                family: 'Inter, sans-serif'
                            },
                            padding: window.innerWidth <= 768 ? 8 : 12,
                            usePointStyle: true,
                            boxWidth: window.innerWidth <= 768 ? 8 : 10
                        }
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: window.innerWidth <= 768 ? 8 : 12,
                        titleFont: {
                            size: getResponsiveFontSize(13),
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: getResponsiveFontSize(12)
                        },
                        cornerRadius: 8,
                        callbacks: {
                            label: function (context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                }
            }
        });
    }
}

// Make initAnalyticsCharts available globally
window.initAnalyticsCharts = initAnalyticsCharts;