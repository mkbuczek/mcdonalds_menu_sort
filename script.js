let menuContainer = document.getElementById("menuContainer");

let menuData = [];
let productNames = [];
let productPPC = [];
let productPPD = [];

fetchMenuData();

//fetch json and send to variable
async function fetchMenuData() {
    try{
        let response = await fetch("menu_data.json");
        if (!response.ok) throw new Error(`Error, Status: ${response.status}`);
        //menu data loaded from json
        menuData = await response.json();
        console.log("Menu Data loaded.");

        loadMenuData();

    } catch (error) {
        console.error("Error loading JSON: ", error);
    }
}

//load the menu items in default categorical order on page load
function loadMenuData() {
    let allProducts = menuData.categories.flatMap(category => category.products);

    allProducts.forEach(product => {
        let productDiv = document.createElement("div");
        productDiv.classList.add("menuItem");

        let productInfo = document.createElement("div");
        productInfo.classList.add("productInfo");

        let productImgContainer = document.createElement("div");
        productImgContainer.classList.add("productImgContainer");

        let ppd = (product.protein / product.price).toFixed(2);
        let ppc = (product.protein / product.calories).toFixed(2);

        productInfo.innerHTML = `
            <div class="productText">${product.name}</div>
            <div class="priceText">$${product.price}</div>
            <div class="calorieText">Calories: ${product.calories}</div>
            <div class="proteinText">Protein: ${product.protein}g</div>
            <div class="carbText">Carbs: ${product.carbs}g</div>
            <div class="fatText">Fat: ${product.fat}g</div>
            <div class="ppcText">PPC: ${ppc}g/cal.</div>
            <div class="ppdText">PPD: ${ppd}g/$</div>
        `;

        let productImg = document.createElement("img");
        productImg.classList.add("productImg");
        productImg.src = product.imgUrl;
        productImg.alt = product.name;

        productImgContainer.appendChild(productImg);

        productDiv.appendChild(productInfo);
        productDiv.appendChild(productImgContainer);
        menuContainer.appendChild(productDiv);
    });
}

//sort button logic
function sort(key) {
    let allProducts = menuData.categories.flatMap(category => category.products);
    menuContainer.innerHTML = '';

    allProducts.sort((a, b) => {
        let aValue, bValue;

        if (key === "ppc") {
            aValue = a.protein / a.calories;
            bValue = b.protein / b.calories;
        } else if (key === "ppd") {
            aValue = a.protein / a.price;
            bValue = b.protein / b.price;
        } else {
            aValue = a[key];
            bValue = b[key];
        }

        return bValue - aValue;
    });

    //display current sorting
    document.querySelectorAll('.sortButton').forEach(button => {
        button.classList.remove('active');

        if (button.dataset.key === key) {
            button.classList.add('active');
        }
    });

    allProducts.sort((a, b) => b[key] - a[key]);

    allProducts.forEach((product, i) => {
        let productDiv = document.createElement("div");
        productDiv.classList.add("menuItem");

        let productInfo = document.createElement("div");
        productInfo.classList.add("productInfo");

        let productImgContainer = document.createElement("div");
        productImgContainer.classList.add("productImgContainer");

        let ppd = (product.protein / product.price).toFixed(2);
        let ppc = (product.protein / product.calories).toFixed(2);

        productInfo.innerHTML = `
            <div class="productText">#${i+1} | ${product.name}</div>
            <div class="priceText">$${product.price}</div>
            <div class="calorieText">Calories: ${product.calories}</div>
            <div class="proteinText">Protein: ${product.protein}g</div>
            <div class="carbText">Carbs: ${product.carbs}g</div>
            <div class="fatText">Fat: ${product.fat}g</div>
            <div class="ppcText">PPC: ${ppc}g/cal.</div>
            <div class="ppdText">PPD: ${ppd}g/$</div>
        `;

        let productImg = document.createElement("img");
        productImg.classList.add("productImg");
        productImg.src = product.imgUrl;
        productImg.alt = product.name;

        productImgContainer.appendChild(productImg);

        productDiv.appendChild(productInfo);
        productDiv.appendChild(productImgContainer);
        menuContainer.appendChild(productDiv);
    });
}
