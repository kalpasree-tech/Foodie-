let cart = [];
let total = 0;
let subtotal = 0;
let deliveryCharge = 40;
let discount = 0;

// Add item to cart
function addToCart(name, price) {

    let existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity++;
    } 
    else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

    calculateTotal();
    displayCart();
}


// Display cart
function displayCart() {

    let cartItems = document.getElementById("cart-items");

    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = "Your cart is empty.";
    }

    for (let i = 0; i < cart.length; i++) {

        cartItems.innerHTML += `
            <p>
                ${cart[i].name} - ₹${cart[i].price}

                <button onclick="decreaseQuantity(${i})">
                    −
                </button>

                ${cart[i].quantity}

                <button onclick="increaseQuantity(${i})">
                    +
                </button>

                <button onclick="removeFromCart(${i})">
                    Remove
                </button>
            </p>
        `;
    }

    document.getElementById("total").innerText = total;
}


// Increase quantity
function increaseQuantity(index) {

    cart[index].quantity++;

    calculateTotal();
    displayCart();
}


// Decrease quantity
function decreaseQuantity(index) {

    if (cart[index].quantity > 1) {
        cart[index].quantity--;
    } 
    else {
        cart.splice(index, 1);
    }

    calculateTotal();
    displayCart();
}


// Remove item completely
function removeFromCart(index) {

    cart.splice(index, 1);

    calculateTotal();
    displayCart();
}


// Calculate total
function calculateTotal() {

    subtotal = 0;

    for (let i = 0; i < cart.length; i++) {

        subtotal += cart[i].price * cart[i].quantity;
    }

    if (cart.length === 0) {
        deliveryCharge = 0;
    } else {
        deliveryCharge = 40;
    }

    total = subtotal + deliveryCharge;

    document.getElementById("subtotal").innerText = subtotal;
    document.getElementById("delivery").innerText = deliveryCharge;
    document.getElementById("total").innerText = total;
}


// Checkout
function checkout() {
if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    let name = document.getElementById("name").value;
    let phone = document.getElementById("phone").value;
    let address = document.getElementById("address").value;
    let city = document.getElementById("city").value;
    let pincode = document.getElementById("pincode").value;

    if (
        name === "" ||
        phone === "" ||
        address === "" ||
        city === "" ||
        pincode === ""
    ) {
        alert("Please fill in all delivery details!");
        return;
    }

    let paymentMethod = document.querySelector(
        'input[name="payment"]:checked'
    );

    if (!paymentMethod) {
        alert("Please select a payment method!");
        return;
    }

    let methodName;

    if (paymentMethod.value === "cod") {
        methodName = "Cash on Delivery";
    }
    else if (paymentMethod.value === "upi") {
        methodName = "UPI";
    }
    else {
        methodName = "Card";
    }

    // Send order to MySQL through Node.js
    fetch("http://localhost:3000/orders", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            name: name,
            phone: phone,
            address: address,
            city: city,
            pincode: pincode,

            paymentMethod: methodName,

            subtotal: subtotal,
            deliveryCharge: deliveryCharge,
            discount: discount,
            total: total

        })

    })

    .then(response => response.json())

    .then(data => {

        if (data.orderId) {

            let confirmation =
                document.getElementById("order-confirmation");

            confirmation.innerHTML = `
                <h2>🎉 Order Confirmed!</h2>
                <p><strong>Order ID:</strong> ${data.orderId}</p>
                <p><strong>Customer:</strong> ${name}</p>
                <p><strong>City:</strong> ${city}</p>
                <p><strong>Payment:</strong> ${methodName}</p>
                <p><strong>Subtotal:</strong> ₹${subtotal}</p>
                <p><strong>Delivery Charge:</strong> ₹${deliveryCharge}</p>
                <p><strong>Discount:</strong> -₹${discount}</p>
                <p><strong>Total:</strong> ₹${total}</p>
            `;

            confirmation.style.display = "block";

            cart = [];
            total = 0;
            subtotal = 0;
            discount = 0;

            displayCart();
            calculateTotal();

        }
        else {

            alert("❌ Order could not be saved.");
        }

    })

    .catch(error => {

        console.log(error);

        alert("❌ Could not connect to the server.");
    });
}

function searchFood() {

    let searchText = document.getElementById("search").value.toLowerCase();

    let foods = document.querySelectorAll(".food");

    for (let i = 0; i < foods.length; i++) {

        let foodName = foods[i].querySelector("h3").innerText.toLowerCase();

        if (foodName.includes(searchText)) {
            foods[i].style.display = "block";
        } 
        else {
            foods[i].style.display = "none";
        }
    }
}
function toggleFavorite(button) {

    if (button.innerText === "🤍") {
        button.innerText = "❤️";
    } 
    else {
        button.innerText = "🤍";
    }
}
function filterFood(category) {

    let foods = document.querySelectorAll(".food");

    for (let i = 0; i < foods.length; i++) {

        if (
            category === "all" ||
            foods[i].dataset.category === category
        ) {
            foods[i].style.display = "block";
        } 
        else {
            foods[i].style.display = "none";
        }
    }
}
function applyCoupon() {

    let coupon = document.getElementById("coupon").value.toUpperCase();
    let message = document.getElementById("coupon-message");

    if (coupon === "FOOD10") {

        discount = subtotal * 0.10;

        total = subtotal + deliveryCharge - discount;

        message.innerText = "🎉 10% discount applied!";

    } else {

        discount = 0;

        total = subtotal + deliveryCharge;

        message.innerText = "❌ Invalid coupon code.";

    }

    document.getElementById("total").innerText = total;
}
function openLogin() {

    document.getElementById("login-box").style.display = "flex";
}


function closeLogin() {

    document.getElementById("login-box").style.display = "none";
}
function login() {

    let username = document.getElementById("username").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let message = document.getElementById("login-message");

    if (username === "" || email === "" || password === "") {

        message.innerText = "Please fill all the details!";
        return;
    }

    localStorage.setItem("username", username);
    localStorage.setItem("email", email);
    localStorage.setItem("password", password);

    message.innerText = "✅ Account created successfully!";

}
window.onload = function() {

    let savedUsername = localStorage.getItem("username");
    let loginButton = document.querySelector("nav button");

    if (savedUsername) {
        loginButton.innerText = "Logout";
        loginButton.onclick = logout;
    }
};
function logout() {

    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("password");

    let loginButton = document.querySelector("nav button");

    loginButton.innerText = "Login / Signup";
    loginButton.onclick = openLogin;

    alert("You have been logged out.");
}