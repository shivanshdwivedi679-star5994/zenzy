// ==========================================
// 1. STATE MANAGEMENT (Mock Database)
// ==========================================
const inventory = [
    { id: 'Z01', name: "Zenzy Graphic T-Shirt", price: 599 },
    { id: 'Z02', name: "Classic Polo Shirt", price: 899 },
    { id: 'Z03', name: "Slim Fit Denim Jeans", price: 1499 },
    { id: 'Z04', name: "Cotton Chinos", price: 1299 },
    { id: 'Z05', name: "Winter Hoodie", price: 1999 },
    { id: 'Z06', name: "Formal White Shirt", price: 999 }
];

let cart = [];
// This array acts as your SQL Database table temporarily
let orderDatabase = []; 

// ==========================================
// 2. PAGE NAVIGATION LOGIC
// ==========================================
function switchPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active-page'));
    // Remove active class from all nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    
    // Show selected page and highlight nav button
    document.getElementById(pageId).classList.add('active-page');
    document.getElementById(`nav-${pageId}`).classList.add('active');

    // Render specific page content if needed
    if(pageId === 'products-page') renderProducts('full-catalog-grid', false);
    if(pageId === 'order-page') renderProducts('order-catalog-grid', true);
    if(pageId === 'database-page') renderDatabase();
}

// ==========================================
// 3. PRODUCTS & CATALOG LOGIC
// ==========================================
function renderProducts(containerId, isClickable) {
    const container = document.getElementById(containerId);
    container.innerHTML = inventory.map(product => `
        <div class="product-card" ${isClickable ? `onclick='addToCart("${product.id}")'` : ''}>
            <h4>${product.name}</h4>
            <span class="price">₹${product.price}</span>
            ${isClickable ? '<p style="font-size:0.8rem; color:#64748b; margin-top:5px;">Click to Add</p>' : ''}
        </div>
    `).join('');
}

// ==========================================
// 4. ORDER & CART LOGIC
// ==========================================
function addToCart(productId) {
    const product = inventory.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCartUI();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== productId); // Remove if qty is 0
        }
    }
    updateCartUI();
}

function updateCartUI() {
    const cartContainer = document.getElementById('cart-items');
    
    if (cart.length === 0) {
        cartContainer.innerHTML = '<div class="empty-cart">No clothes added to the order.</div>';
        document.getElementById('grand-total').textContent = '₹0.00';
        return;
    }

    cartContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div>
                <strong>${item.name}</strong><br>
                <span style="font-size:0.9rem; color:#64748b;">₹${item.price} each</span>
            </div>
            <div class="cart-item-controls">
                <button class="qty-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                <span>${item.quantity}</span>
                <button class="qty-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                <strong style="margin-left:10px;">₹${item.price * item.quantity}</strong>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('grand-total').textContent = `₹${total.toFixed(2)}`;
}

// ==========================================
// 5. GENERATE BILL & DATABASE LOGIC
// ==========================================
function generateBill() {
    const customerName = document.getElementById('customer-name').value.trim();
    const customerPhone = document.getElementById('customer-phone').value.trim();
    
    if (!customerName || !customerPhone) {
        return alert("Please enter Customer Name and Phone Number.");
    }
    if (cart.length === 0) {
        return alert("Cannot generate an empty bill.");
    }

    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Create Order Object (This is what will be sent to MySQL later)
    const newOrder = {
        orderId: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
        name: customerName,
        phone: customerPhone,
        itemsSummary: cart.map(i => `${i.name} (x${i.quantity})`).join(', '),
        total: totalAmount
    };

    // Save to our frontend database array
    orderDatabase.push(newOrder);

    alert(`Bill Generated Successfully for ${customerName}!\nTotal: ₹${totalAmount}\n\nOrder saved to Database.`);

    // Reset Form & Cart
    document.getElementById('customer-name').value = '';
    document.getElementById('customer-phone').value = '';
    cart = [];
    updateCartUI();
    
    // Automatically switch to database page to see the new entry
    switchPage('database-page');
}

function renderDatabase() {
    const tbody = document.getElementById('db-table-body');
    const totalOrdersEl = document.getElementById('total-orders-count');
    const totalSalesEl = document.getElementById('total-sales-amount');

    if (orderDatabase.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No past orders found in database.</td></tr>';
        totalOrdersEl.textContent = "0";
        totalSalesEl.textContent = "₹0.00";
        return;
    }

    // Populate Table
    tbody.innerHTML = orderDatabase.map(order => `
        <tr>
            <td><strong>${order.orderId}</strong></td>
            <td>${order.name}</td>
            <td>${order.phone}</td>
            <td style="font-size:0.9rem;">${order.itemsSummary}</td>
            <td style="color:#10b981; font-weight:bold;">₹${order.total.toFixed(2)}</td>
        </tr>
    `).join('');

    // Calculate Totals
    const totalSales = orderDatabase.reduce((sum, order) => sum + order.total, 0);
    
    totalOrdersEl.textContent = orderDatabase.length;
    totalSalesEl.textContent = `₹${totalSales.toFixed(2)}`;
}

// Initialize Home Page on load
window.onload = () => {
    switchPage('home-page');
};