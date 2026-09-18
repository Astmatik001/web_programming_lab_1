let cart = []

const cartButton = document.getElementById("cartButton")
const cartModal = document.getElementById("cartModal")
const cartItems = document.getElementById("cartItems")
const cartTotal = document.getElementById("cartTotal")
const closeCartModal = document.getElementById("closeCartModal")

cartButton.addEventListener('click', function() {
        renderCart();
        cartModal.classList.add('active');
    });
closeCartModal.addEventListener('click', function() {
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
    
    cartItems.innerHTML = html;
    cartTotal.textContent = total;
}