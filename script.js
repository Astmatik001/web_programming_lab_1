let cart = []

const FALLBACK_PRODUCTS = [
  {"id": "1", "name": "Apples", "description": "Fresh red apples", "price": 1.50},
  {"id": "2", "name": "Bananas", "description": "Ripe yellow bananas", "price": 0.99},
  {"id": "3", "name": "Oranges", "description": "Juicy sweet oranges", "price": 1.25},
  {"id": "4", "name": "Carrots", "description": "Crisp fresh carrots", "price": 0.89},
  {"id": "5", "name": "Lettuce", "description": "Green crisp lettuce", "price": 1.10},
  {"id": "6", "name": "Tomatoes", "description": "Vine-ripened tomatoes", "price": 1.75},
  {"id": "7", "name": "Potatoes", "description": "Farm-fresh potatoes", "price": 0.75},
  {"id": "8", "name": "Onions", "description": "Yellow cooking onions", "price": 0.85},
  {"id": "9", "name": "Broccoli", "description": "Fresh green broccoli", "price": 1.95},
  {"id": "10", "name": "Cucumber", "description": "Cool crisp cucumber", "price": 0.90},
  {"id": "11", "name": "Bell Pepper", "description": "Sweet red bell pepper", "price": 1.60},
  {"id": "12", "name": "Strawberries", "description": "Sweet fresh strawberries", "price": 2.25},
  {"id": "13", "name": "Blueberries", "description": "Plump fresh blueberries", "price": 2.50},
  {"id": "14", "name": "Grapes", "description": "Sweet seedless grapes", "price": 2.00},
  {"id": "15", "name": "Avocado", "description": "Creamy ripe avocado", "price": 1.80},
  {"id": "16", "name": "Lemons", "description": "Bright fresh lemons", "price": 0.65}
]

const cartButton = document.getElementById("cartButton")
const cartModal = document.getElementById("cartModal")
const cartItems = document.getElementById("cartItems")
const cartTotal = document.getElementById("cartTotal")
const closeCartButton = document.getElementById("closeCartButton")

const checkoutButton = document.getElementById("checkoutButton")
const orderModal = document.getElementById("orderModal")
const closeOrderModal = document.getElementById("closeOrderModal")
const orderForm = document.getElementById("orderForm")
const orderSuccess = document.getElementById("orderSuccess")

document.addEventListener("DOMContentLoaded", function () {
  loadCart()
  updateCartCount()
  loadProducts()
})

async function loadProducts() {
  let products = null
  try {
    const res = await fetch("./products.json")
    if (res.ok) {
      products = await res.json()
    }
  } catch (e) {
    console.warn("Failed to load products from JSON, using fallback", e)
  }
  if (!products) {
    products = FALLBACK_PRODUCTS
  }
  const grid = document.querySelector(".produce-grid")
  if (!grid) return
  grid.innerHTML = products
    .map(
      (p) => `
      <article class="product-card">
        <h3>${escapeHtml(p.name)}</h3>
        <p class="description">${escapeHtml(p.description)}</p>
        <p class="price">${p.price} $</p>
        <button class="add-to-cart-button" data-id="${p.id}" data-name="${escapeHtml(p.name)}" data-price="${p.price}">Add To Cart</button>
      </article>
    `
    )
    .join("")
}

function escapeHtml(text) {
  if (text == null) return ""
  const div = document.createElement("div")
  div.textContent = text
  return div.innerHTML
}

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("add-to-cart-button")) {
    const btn = e.target
    addToCart(btn.dataset.id, btn.dataset.name, parseFloat(btn.dataset.price) || 0)
  }
})

cartButton.addEventListener("click", function () {
  renderCart()
  cartModal.classList.add("active")
})
closeCartButton.addEventListener("click", function () {
  cartModal.classList.remove("active")
})
function renderCart() {
  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">The Cart Is Empty</p>'
    cartTotal.textContent = '0'
    return
  }

  let html = ''
  let total = 0

  cart.forEach((item) => {
    const itemPriceTotal = item.price * item.quantity
    total += itemPriceTotal

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
        `
  })

  cartItems.innerHTML = html
  cartTotal.textContent = total
}

function addToCart(id, name, price) {
  const existingItem = cart.find((item) => item.id === id)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({
      id: id,
      name: name,
      price: price,
      quantity: 1
    })
  }

  saveCart()
  updateCartCount()
}

function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id)
  saveCart()
  updateCartCount()
  renderCart()
}

function changeQuantity(id, delta) {
  const item = cart.find((item) => item.id === id)
  if (item) {
    item.quantity += delta
    if (item.quantity <= 0) {
      removeFromCart(id)
    } else {
      saveCart()
      updateCartCount()
      renderCart()
    }
  }
}

function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  cartButton.textContent = totalItems
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart))
}

function loadCart() {
  const savedCart = localStorage.getItem("cart")
  if (savedCart) {
    cart = JSON.parse(savedCart)
  }
}

checkoutButton.addEventListener("click", function () {
  if (cart.length === 0) {
    alert("Cart is empty!")
    return
  }
  cartModal.classList.remove("active")
  orderModal.classList.add("active")
})

closeOrderModal.addEventListener("click", function () {
  orderModal.classList.remove("active")
  orderForm.style.display = "block"
  orderSuccess.style.display = "none"
  orderForm.reset()
})

orderModal.addEventListener("click", function (e) {
  if (e.target === orderModal) {
    orderModal.classList.remove("active")
    orderForm.style.display = "block"
    orderSuccess.style.display = "none"
    orderForm.reset()
  }
})

orderForm.addEventListener("submit", function (e) {
  e.preventDefault()

  const firstName = document.getElementById("firstName").value.trim()
  const lastName = document.getElementById("lastName").value.trim()
  const address = document.getElementById("address").value.trim()
  const phone = document.getElementById("phone").value.trim()

  if (!firstName || !lastName || !address || !phone) {
    alert("Please fill in all required fields!")
    return
  }

  const phoneRegex = /^[\d\+\-\(\)\s]+$/
  if (!phoneRegex.test(phone)) {
    alert("Please input a correct phone number!")
    return
  }

  orderForm.style.display = "none"
  orderSuccess.style.display = "block"

  cart = []
  saveCart()
  updateCartCount()

  setTimeout(function () {
    orderModal.classList.remove("active")
    orderForm.style.display = "block"
    orderSuccess.style.display = "none"
    orderForm.reset()
  }, 2000)
})

