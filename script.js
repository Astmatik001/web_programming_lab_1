let cart = []

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
  try {
    const res = await fetch("./products.json")
    const products = await res.json()
    const grid = document.querySelector(".produce-grid")
    if (!grid) return
    grid.innerHTML = products
      .map(
        (p) => `
      <article class="product-card">
        <h3>${escapeHtml(p.name)}</h3>
        <p class="description">${escapeHtml(p.description)}</p>
        <p class="price">${p.price}$</p>
        <button class="add-to-cart-button" data-id="${p.id}" data-name="${escapeHtml(p.name)}" data-price="${p.price}">Add To Cart</button>
      </article>
    `
      )
      .join("")
  } catch (e) {
    console.error("Failed to load products", e)
  }
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
  cartButton.textContent = "Cart " + totalItems
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
