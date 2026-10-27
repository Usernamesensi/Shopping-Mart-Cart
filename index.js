var products = [
    { id: 1, name: "Gaming Mouse", category: "Electronics", price: 899, image: "mouse.jpg" },
    { id: 2, name: "Wireless Earbuds", category: "Electronics", price: 1499, image: "earbuds.jpg" },
    { id: 3, name: "Mechanical Keyboard", category: "Electronics", price: 2499, image: "keyboard.jpg" },
    { id: 4, name: "Gaming Headset", category: "Electronics", price: 1999, image: "headset.jpg" },
    { id: 5, name: "Bluetooth Speaker", category: "Electronics", price: 1299, image: "speaker.jpg" },
    { id: 6, name: "Smart Watch", category: "Electronics", price: 1799, image: "watch.jpg" },
    { id: 7, name: "Notebook Set", category: "Stationery", price: 199, image: "notebook.jpg" },
    { id: 8, name: "Pen Pack", category: "Stationery", price: 149, image: "pen.jpg" },
    { id: 9, name: "Scientific Calculator", category: "Stationery", price: 799, image: "calculator.jpg" },
    { id: 10, name: "Travel Backpack", category: "Bags", price: 1299, image: "backpack.jpg" },
    { id: 11, name: "Laptop Bag", category: "Bags", price: 899, image: "laptop-bag.jpg" },
    { id: 12, name: "Sports Water Bottle", category: "Accessories", price: 399, image: "bottle.jpg" }
];

var cart = [];
var couponCode = "";


function showProducts() {
    var searchText = document.getElementById("search").value.toLowerCase();
    var category = document.getElementById("category").value;
    var sortType = document.getElementById("sort").value;

    var result = [];

    for (var i = 0; i < products.length; i++) {
        var p = products[i];

        var matchName = p.name.toLowerCase().includes(searchText);
        var matchCategory = category == "all" || p.category == category;

        if (matchName && matchCategory) {
            result.push(p);
        }
    }

    if (sortType == "low") {
        result.sort(function (a, b) {
            return a.price - b.price;
        });
    } else if (sortType == "high") {
        result.sort(function (a, b) {
            return b.price - a.price;
        });
    } else if (sortType == "name") {
        result.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });
    }

    var html = "";

    for (var i = 0; i < result.length; i++) {
        var p = result[i];

        html += "<div class='product'>" +
            "<img src='images/" + p.image + "' alt='" + p.name + "'>" +
            "<h3>" + p.name + "</h3>" +
            "<p>₹" + p.price + "</p>" +
            "<button onclick='addToCart(" + p.id + ")'>Add to Cart</button>" +
            "</div>";
    }

    if (result.length == 0) {
        html = "<p>No products found.</p>";
    }

    document.getElementById("productList").innerHTML = html;
}


function addToCart(id) {
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].id == id) {
            cart[i].qty++;
            showCart();
            return;
        }
    }

    for (var i = 0; i < products.length; i++) {
        if (products[i].id == id) {
            cart.push({
                id: products[i].id,
                name: products[i].name,
                price: products[i].price,
                qty: 1
            });

            break;
        }
    }

    showCart();
}


function removeFromCart(index) {
    cart.splice(index, 1);
    showCart();
}


function changeQty(index, change) {
    cart[index].qty += change;

    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }

    showCart();
}


function showCart() {
    var html = "";
    var subtotal = 0;
    var itemCount = 0;

    for (var i = 0; i < cart.length; i++) {
        var item = cart[i];
        var itemTotal = item.price * item.qty;

        subtotal += itemTotal;
        itemCount += item.qty;

        html += "<div class='cart-item'>" +
            "<b>" + item.name + "</b><br>" +
            "Price: ₹" + item.price + "<br>" +
            "<button onclick='changeQty(" + i + ", -1)'>-</button> " +
            item.qty + " " +
            "<button onclick='changeQty(" + i + ", 1)'>+</button><br>" +
            "Item Total: ₹" + itemTotal + "<br>" +
            "<button class='remove-btn' onclick='removeFromCart(" + i + ")'>Remove</button>" +
            "</div>";
    }

    if (cart.length == 0) {
        html = "<p>Your cart is empty.</p>";
        couponCode = "";
        document.getElementById("couponMsg").innerText = "";
    }

    document.getElementById("cartList").innerHTML = html;

    var discount = 0;

    if (couponCode == "SAVE10") {
        discount = subtotal * 10 / 100;
    } else if (couponCode == "FLAT100" && subtotal >= 1000) {
        discount = 100;
    }

    var total = subtotal - discount;

    document.getElementById("subtotal").innerText = subtotal;
    document.getElementById("discount").innerText = discount;
    document.getElementById("total").innerText = total;
}


function applyCoupon() {
    var code = document.getElementById("couponInput").value.trim().toUpperCase();
    var msg = document.getElementById("couponMsg");

    var subtotal = 0;

    for (var i = 0; i < cart.length; i++) {
        subtotal += cart[i].price * cart[i].qty;
    }

    if (cart.length == 0) {
        couponCode = "";
        msg.innerText = "Add products to your cart first.";
    } else if (code == "SAVE10") {
        couponCode = code;
        msg.innerText = "Success! 10% discount applied.";
    } else if (code == "FLAT100" && subtotal >= 1000) {
        couponCode = code;
        msg.innerText = "Success! ₹100 discount applied.";
    } else if (code == "FLAT100") {
        couponCode = "";
        msg.innerText = "FLAT100 requires a subtotal of at least ₹1000.";
    } else {
        couponCode = "";
        msg.innerText = "Invalid coupon code.";
    }

    showCart();
}


function openCheckout() {
    if (cart.length == 0) {
        alert("Your cart is empty!");
        return;
    }

    document.getElementById("payAmount").innerText =
        document.getElementById("total").innerText;

    document.getElementById("checkoutBox").style.display = "block";
}


function closeCheckout() {
    document.getElementById("checkoutBox").style.display = "none";
}


function placeOrder(event) {
    event.preventDefault();

    var name = document.getElementById("name").value.trim();
    var address = document.getElementById("address").value.trim();
    var phone = document.getElementById("phone").value.trim();

    if (name == "" || address == "" || phone == "") {
        alert("Please fill in all the details.");
        return;
    }

    alert(
        "Thank you, " + name + "!\n" +
        "Your order has been placed.\n" +
        "Total Amount: ₹" + document.getElementById("total").innerText
    );

    cart = [];
    couponCode = "";

    document.getElementById("couponInput").value = "";
    document.getElementById("couponMsg").innerText = "";
    document.getElementById("name").value = "";
    document.getElementById("address").value = "";
    document.getElementById("phone").value = "";

    closeCheckout();
    showCart();
}


showProducts();
showCart();