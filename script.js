let cart = []

const cartButton = document.getElementById("cartButton")
const cartModal = document.getElementById("cartModal")
const cartItems = document.getElementById("cartItems")
const cartTotal = document.getElementById("cartTotal")
const closeCartButton = document.getElementById("closeCartButton")
const addToCartButtons = document.querySelectorAll('.add-to-cart-button');

const checkoutButton = document.getElementById('checkoutButton');
const orderModal = document.getElementById('orderModal');
const closeOrderModal = document.getElementById('closeOrderModal');
const orderForm = document.getElementById('orderForm');
const orderSuccess = document.getElementById('orderSuccess');

document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    updateCartCount();
});

addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.dataset.id;
            const name = this.dataset.name;
            const price = parseInt(this.dataset.price);
            addToCart(id, name, price);
        });
    });

cartButton.addEventListener('click', function() {
        renderCart();
        cartModal.classList.add('active');
    });
closeCartButton.addEventListener('click', function() {
        cartModal.classList.remove('active');
    });

function renderCart() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">The Cart Is Empty</p>';
        cartTotal.textContent = '0';
        return;
    }
    
    let html = '';
    let total = 0;

    cart.forEach(item => {
        const itemPriceTotal = item.price * item.quantity;
        total += itemPriceTotal;
        
        html += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${item.price} $ x ${item.quantity} = ${itemPriceTotal} $</div>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-button" onclick="changeQuantity('${item.id}', -1)">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-button" onclick="changeQuantity('${item.id}', 1)">+</button>
                    <button class="remove-button" onclick="removeFromCart('${item.id}')">Remove</button>
                </div>
            </div>
        `;
    });

    cartItems.innerHTML = html;
    cartTotal.textContent = total;
}

function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartCount();
    renderCart();
}

function changeQuantity(id, delta) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            saveCart();
            updateCartCount();
            renderCart();
        }
    }
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartButton.textContent = totalItems;
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

checkoutButton.addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Cart is empty!');
            return;
        }
        cartModal.classList.remove('active');
        orderModal.classList.add('active');
    });

closeOrderModal.addEventListener('click', function() {
        orderModal.classList.remove('active');
        orderForm.style.display = 'block';
        orderSuccess.style.display = 'none';
        orderForm.reset();
    });
    
orderModal.addEventListener('click', function(e) {
        if (e.target === orderModal) {
            orderModal.classList.remove('active');
            orderForm.style.display = 'block';
            orderSuccess.style.display = 'none';
            orderForm.reset();
        }
    });

orderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const address = document.getElementById('address').value.trim();
        const phone = document.getElementById('phone').value.trim();
        
        // Validate form
        if (!firstName || !lastName || !address || !phone) {
            alert('Пожалуйста, заполните все поля!');
            return;
        }
        
        // Validate phone format (basic validation)
        const phoneRegex = /^[\d\+\-\(\)\s]+$/;
        if (!phoneRegex.test(phone)) {
            alert('Please input a correct phone number!');
            return;
        }
        
        // Show success message
        orderForm.style.display = 'none';
        orderSuccess.style.display = 'block';
        
        // Clear cart
        cart = [];
        saveCart();
        updateCartCount();
        
        // Close modal after 2 seconds
        setTimeout(function() {
            orderModal.classList.remove('active');
            orderForm.style.display = 'block';
            orderSuccess.style.display = 'none';
            orderForm.reset();
        }, 2000);
    });