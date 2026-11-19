// بيانات المنتجات
const productsData = [
    { id: 1, name: "تيشيرت رجالي أبيض", price: 120, gender: "men", type: "top", img: "img/t-shirt white men.webp" },
    { id: 2, name: "جينز رجالي أزرق", price: 250, gender: "men", type: "pants", img: "img/jeans men.webp" },
    { id: 3, name: "سبرديلة رجالية رياضية", price: 350, gender: "men", type: "shoes_adult", img: "img/sbrdila rijaliya riyadiya ka7la.jpg" },
    { id: 4, name: "كيطمة رجالية سوداء", price: 399, gender: "men", type: "top", img: "img/survita ka7la rijaliya.jpg" },


    { id: 5, name: "تيشيرت نسائي فستقي", price: 130, gender: "women", type: "top", img: "img/triko nisa2i fosto9i.jpg" },
    { id: 6, name: "جينز نسائي Baggy jeans", price: 270, gender: "women", type: "pants", img: "img/jean baggy nisa2i.jpg" },
    { id: 7, name: "حذاء نسائي أنيق", price: 299, gender: "women", type: "shoes_adult", img: "img/7ida2 nisa2i ani9.jpg" },
    { id: 8, name: "كيطمة نسائية رمادية", price: 340, gender: "women", type: "top", img: "img/kitma gris nisa2iya.jpg" },
    { id: 9, name: "سبرديلة نسائية رياضية", price: 340, gender: "women", type: "top", img: "img/sbrdila nisa2iya.jpg" },
    { id: 10, name: "صاك نسائي أنيق", price: 340, gender: "women", type: "top", img: "img/sac women.jpg" },


    { id: 11, name: "تيشيرت أطفال قطن", price: 90, gender: "kids", type: "top", img: "img/t-shirt coton drari sghar.jpg" },
    { id: 12, name: "جينز أطفال مريح", price: 150, gender: "kids", type: "pants_kids", img: "img/jean atfal.jpg" },
    { id: 13, name: "سبرديلة أطفال ملونة", price: 199, gender: "kids", type: "shoes_kids", img: "img/sbrdila atfal.jpg" },
    { id: 14, name: "جاكيت أطفال شتوي", price: 250, gender: "kids", type: "top", img: "img/jakit atfal.jpg" }
];

let currentCategory = 'all';

function getSizesOptions(type, gender) {
    let sizes = [];
    if (type === "top") sizes = ["S", "M", "L", "XL", "XXL", "3XL"];
    else if (type === "pants") sizes = [38, 40, 42, 44, 46, 48, 50];
    else if (type === "shoes_adult" && gender === "men") sizes = [40, 41, 42, 43, 44];
    else if (type === "shoes_adult" && gender === "women") sizes = [36, 37, 38, 39, 40, 41];
    else if (type === "pants_kids") sizes = ["4 سنوات", "6 سنوات", "8 سنوات", "10 سنوات", "12 سنة"];
    else if (type === "shoes_kids") sizes = [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35];

    let options = '<option value="" disabled selected>اختيار المقاس</option>';
    sizes.forEach(s => options += `<option value="${s}">${s}</option>`);
    return options;
}

const productsContainer = document.getElementById('products-container');
function renderProducts(productsList) {
    productsContainer.innerHTML = ""; 
    if(productsList.length === 0) {
        productsContainer.innerHTML = "<h3 style='grid-column: 1/-1; text-align:center;'>لم يتم العثور على منتجات.</h3>";
        return;
    }
    productsList.forEach(prod => {
        productsContainer.innerHTML += `
            <div class="product-card">
                <div class="img-container">
                    <img src="${prod.img}" alt="${prod.name}">
                </div>
                <div class="product-info">
                    <h3>${prod.name}</h3>
                    <div class="price">${prod.price} درهم</div>
                    <select id="size-${prod.id}" class="size-select">
                        ${getSizesOptions(prod.type, prod.gender)}
                    </select>
                    <button class="add-to-cart" onclick="addToCart(${prod.id}, '${prod.name}', ${prod.price})">أضف إلى السلة</button>
                </div>
            </div>
        `;
    });
}

renderProducts(productsData);

function filterCategory(category, element) {
    currentCategory = category;
    document.querySelectorAll('#category-nav a').forEach(a => a.classList.remove('active'));
    element.classList.add('active');
    
    let filtered = category !== 'all' ? productsData.filter(p => p.gender === category) : productsData;
    let query = document.getElementById('search-input').value.toLowerCase();
    if(query) filtered = filtered.filter(p => p.name.toLowerCase().includes(query));
    
    renderProducts(filtered);
}

function searchProducts() {
    let query = document.getElementById('search-input').value.toLowerCase();
    let filtered = currentCategory !== 'all' ? productsData.filter(p => p.gender === currentCategory) : productsData;
    filtered = filtered.filter(p => p.name.toLowerCase().includes(query));
    renderProducts(filtered);
}

let cart = [];
function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    if(sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        overlay.style.display = "none";
    } else {
        sidebar.classList.add('open');
        overlay.style.display = "block";
    }
}

function addToCart(id, name, price) {
    let sizeInput = document.getElementById(`size-${id}`);
    let size = sizeInput.value;
    if(!size) {
        sizeInput.style.border = "1px solid red";
        alert("المرجو اختيار المقاس!");
        return;
    }
    sizeInput.style.border = "1px solid var(--df-gray-border)";
    
    cart.push({ id, name, price, size });
    updateCartUI();
    
    const sidebar = document.getElementById('cart-sidebar');
    if(!sidebar.classList.contains('open')) toggleCart();
}

function updateCartUI() {
    document.getElementById('cart-count').innerText = cart.length;
    let cartContainer = document.getElementById('cart-items-container');
    let total = 0;
    
    if(cart.length === 0) {
        cartContainer.innerHTML = '<p style="text-align:center; color:#777;">السلة فارغة حالياً</p>';
    } else {
        cartContainer.innerHTML = '';
        cart.forEach((item, index) => {
            total += item.price;
            cartContainer.innerHTML += `
                <div class="cart-item-row">
                    <div>
                        <strong>${item.name}</strong> <br> 
                        <small>مقاس: ${item.size}</small>
                    </div>
                    <div>
                        <span>${item.price} درهم</span>
                        <i class="fa fa-trash" style="color:red; cursor:pointer; margin-right:10px;" onclick="removeFromCart(${index})"></i>
                    </div>
                </div>
            `;
        });
    }
    document.getElementById('cart-total-price').innerText = total;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

// تسجيل الدخول
const loginModal = document.getElementById('login-modal');
function toggleLogin() {
    loginModal.style.display = loginModal.style.display === "block" ? "none" : "block";
    if(loginModal.style.display === "block") document.getElementById('login-email').focus();
}

function executeLogin() {
    let email = document.getElementById('login-email').value;
    let pass = document.getElementById('login-pass').value;
    if(email.includes('@') && pass.length >= 4) {
        document.getElementById('user-name-display').innerText = email.split('@')[0];
        toggleLogin();
        alert("مرحباً بك " + email.split('@')[0]);
    } else {
        document.getElementById('login-error').style.display = "block";
    }
}

// ----------------------------------------
// نظام الدفع (Checkout & MasterCard/Visa)
// ----------------------------------------
const checkoutModal = document.getElementById('checkout-modal');

function openCheckout() {
    if(cart.length === 0) {
        alert("سلة المشتريات فارغة! المرجو إضافة منتجات أولاً.");
        return;
    }
    toggleCart(); // إغلاق السلة الجانبية
    document.getElementById('checkout-total').innerText = document.getElementById('cart-total-price').innerText;
    checkoutModal.style.display = "block";
}

function toggleCheckout() {
    checkoutModal.style.display = "none";
}

function selectPayment(method, element) {
    // إزالة اللون من كل الاختيارات
    document.querySelectorAll('.pay-method').forEach(el => el.classList.remove('active'));
    // إضافة اللون للاختيار الحالي
    element.classList.add('active');

    const cardForm = document.getElementById('card-form');
    // إخفاء أو إظهار نموذج البطاقة حسب الاختيار
    if (method === 'card') {
        cardForm.style.display = 'block';
    } else {
        cardForm.style.display = 'none';
    }
}

function processPayment() {
    const payBtn = document.getElementById('pay-button');
    
    // تأثير التحميل (Loading)
    payBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> جاري معالجة الدفع...';
    payBtn.style.background = "#555";
    
    setTimeout(() => {
        alert("✅ تمت عملية الدفع بنجاح! شكراً لتسوقك من BR.HATIM.");
        // إفراغ السلة بعد الدفع
        cart = [];
        updateCartUI();
        toggleCheckout();
        
        // إرجاع الزر لشكله الطبيعي
        payBtn.innerHTML = `تأكيد الدفع (<span id="checkout-total">0</span> درهم) <i class="fa fa-lock"></i>`;
        payBtn.style.background = "#27ae60";
    }, 2500); // الانتظار ثانيتين ونصف لمحاكاة الدفع الحقيقي
}