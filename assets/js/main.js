const SEARCH_INDEX = [
    { title: "Tumblers", url: "/categories/tumblers.html", keywords: ["tumbler", "tumblers", "cup", "cups"] },
    { title: "Quilts", url: "/categories/quilts.html", keywords: ["quilt", "quilts", "blanket"] },
    { title: "Dog Bandannas", url: "/categories/dog-bandannas.html", keywords: ["dog", "bandanna", "bandana", "pet"] },
    { title: "Keychains", url: "/categories/keychains.html", keywords: ["keychain", "keychains", "key"] },
    { title: "Pens", url: "/categories/pens.html", keywords: ["pen", "pens", "glitter pen"] },
    { title: "Ornaments", url: "/categories/ornaments.html", keywords: ["ornament", "ornaments", "christmas ornament"] },
    { title: "Door Hangers", url: "/categories/door-hangers.html", keywords: ["door hanger", "door hangers", "wreath"] },
    { title: "Shop by Category", url: "/categories/index.html", keywords: ["shop", "category", "categories", "products"] },
    { title: "Shop by Season", url: "/seasons/index.html", keywords: ["season", "seasons", "holiday", "holidays"] },
    { title: "Spring", url: "/seasons/spring.html", keywords: ["spring"] },
    { title: "Easter", url: "/seasons/spring/easter.html", keywords: ["easter"] },
    { title: "Mother's Day", url: "/seasons/spring/mothers-day.html", keywords: ["mother", "mom", "mothers day"] },
    { title: "St. Patrick's Day", url: "/seasons/spring/st-patricks-day.html", keywords: ["st patrick", "patricks", "irish", "shamrock"] },
    { title: "Cinco de Mayo", url: "/seasons/spring/cinco-de-mayo.html", keywords: ["cinco de mayo", "cinco"] },
    { title: "Summer", url: "/seasons/summer.html", keywords: ["summer"] },
    { title: "4th of July", url: "/seasons/summer/4th-of-july.html", keywords: ["4th of july", "july 4", "independence"] },
    { title: "Father's Day", url: "/seasons/summer/fathers-day.html", keywords: ["father", "dad", "fathers day"] },
    { title: "Beach Days", url: "/seasons/summer/beach-days.html", keywords: ["beach"] },
    { title: "Fall", url: "/seasons/fall.html", keywords: ["fall", "autumn"] },
    { title: "Halloween", url: "/seasons/fall/halloween.html", keywords: ["halloween", "spooky"] },
    { title: "Thanksgiving", url: "/seasons/fall/thanksgiving.html", keywords: ["thanksgiving", "turkey"] },
    { title: "Back to School", url: "/seasons/fall/back-to-school.html", keywords: ["school", "back to school"] },
    { title: "Winter", url: "/seasons/winter.html", keywords: ["winter"] },
    { title: "Christmas", url: "/seasons/winter/christmas.html", keywords: ["christmas", "xmas"] },
    { title: "Hanukkah", url: "/seasons/winter/hanukkah.html", keywords: ["hanukkah", "chanukah"] },
    { title: "New Year's", url: "/seasons/winter/new-years.html", keywords: ["new year"] },
    { title: "Valentine's Day", url: "/seasons/winter/valentines-day.html", keywords: ["valentine"] },
    { title: "Custom Orders", url: "/custom-orders.html", keywords: ["custom", "personalized", "request", "order"] },
    { title: "Our Story", url: "/our-story.html", keywords: ["about", "story", "ryin", "maker", "santana"] },
];

function findBestSearchMatch(query) {
    const q = query.trim().toLowerCase();
    if (!q) return null;

    let best = null;
    let bestScore = 0;

    SEARCH_INDEX.forEach((entry) => {
        let score = 0;
        const title = entry.title.toLowerCase();

        if (title === q) score = 100;
        else if (title.includes(q) || q.includes(title)) score = 60;

        entry.keywords.forEach((kw) => {
            if (kw === q) score = Math.max(score, 90);
            else if (kw.includes(q) || q.includes(kw)) score = Math.max(score, 50);
        });

        if (score > bestScore) {
            bestScore = score;
            best = entry;
        }
    });

    return bestScore > 0 ? best : null;
}

const HEART_SVG =
    '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.6z"></path></svg>';

function getFavorites() {
    try {
        return JSON.parse(localStorage.getItem("santana_favorites") || "[]");
    } catch (e) {
        return [];
    }
}

function saveFavorites(list) {
    localStorage.setItem("santana_favorites", JSON.stringify(list));
}

function toggleFavorite(data) {
    const favorites = getFavorites();
    const index = favorites.findIndex((item) => item.id === data.id);

    if (index === -1) {
        favorites.push(data);
    } else {
        favorites.splice(index, 1);
    }

    saveFavorites(favorites);
    renderFavoritesUI();
}

function attachFavoriteListeners(root) {
    root.querySelectorAll(".favorite-toggle").forEach((btn) => {
        btn.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            toggleFavorite({
                id: btn.dataset.id,
                name: btn.dataset.name,
                image: btn.dataset.image,
                category: btn.dataset.category,
            });
        });
    });
}

function renderFavoritesUI() {
    const favorites = getFavorites();

    document.querySelectorAll(".favorites-link .badge").forEach((badge) => {
        badge.textContent = favorites.length;
    });

    document.querySelectorAll(".favorite-toggle").forEach((btn) => {
        const isFav = favorites.some((item) => item.id === btn.dataset.id);
        btn.classList.toggle("is-favorited", isFav);
        btn.setAttribute("aria-pressed", isFav);
    });

    const list = document.querySelector("#favorites-list");
    const empty = document.querySelector("#favorites-empty");
    if (!list || !empty) return;

    if (favorites.length === 0) {
        list.innerHTML = "";
        empty.style.display = "";
        return;
    }

    empty.style.display = "none";
    list.innerHTML = favorites
        .map(
            (item) => `
            <article class="product-card">
                <div class="product-card-media">
                    <a href="${item.id}">
                        <img src="${item.image}" alt="${item.name}">
                    </a>
                    <button class="favorite-toggle is-favorited" type="button" aria-label="Remove from favorites"
                        data-id="${item.id}" data-name="${item.name}" data-image="${item.image}" data-category="${item.category}">
                        ${HEART_SVG}
                    </button>
                </div>
                <a href="${item.id}" class="product-card-body">
                    <h3>${item.name}</h3>
                    <p class="product-price">${item.category}</p>
                </a>
            </article>`
        )
        .join("");

    attachFavoriteListeners(list);
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".search-bar").forEach((form) => {
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            const input = form.querySelector("input[type='search']");
            const match = findBestSearchMatch(input.value);
            window.location.href = match ? match.url : "/categories/index.html";
        });
    });

    attachFavoriteListeners(document);
    renderFavoritesUI();

    const navToggle = document.querySelector(".nav-toggle");
    const mainNav = document.querySelector(".main-nav");

    navToggle.addEventListener("click", () => {
        const isOpen = mainNav.classList.toggle("open");
        navToggle.setAttribute("aria-expanded", isOpen);
    });

    const dropdowns = document.querySelectorAll(".dropdown");

    dropdowns.forEach((dropdown) => {
        const toggle = dropdown.querySelector(".dropdown-toggle");

        toggle.addEventListener("click", (event) => {
            event.stopPropagation();
            const isOpen = dropdown.classList.contains("open");

            dropdowns.forEach((other) => other.classList.remove("open"));

            if (!isOpen) {
                dropdown.classList.add("open");
            }
        });
    });

    document.addEventListener("click", () => {
        dropdowns.forEach((dropdown) => dropdown.classList.remove("open"));
    });

    document.querySelectorAll(".dropdown-menu a, .main-nav a").forEach((link) => {
        link.addEventListener("click", () => {
            dropdowns.forEach((dropdown) => dropdown.classList.remove("open"));
            mainNav.classList.remove("open");
        });
    });

    const orderForm = document.querySelector("#custom-order-form");

    if (orderForm) {
        orderForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const name = orderForm.name.value.trim();
            const email = orderForm.email.value.trim();
            const category = orderForm.category.value;
            const occasion = orderForm.occasion.value.trim();
            const details = orderForm.details.value.trim();

            const subject = `Custom Order Request from ${name}`;
            const bodyLines = [
                `Name: ${name}`,
                `Email: ${email}`,
                `Category: ${category}`,
                `Occasion/Season: ${occasion || "N/A"}`,
                "",
                "Details:",
                details,
            ];

            const mailtoUrl =
                `mailto:ryinbolt@yahoo.com?subject=${encodeURIComponent(subject)}` +
                `&body=${encodeURIComponent(bodyLines.join("\n"))}`;

            window.location.href = mailtoUrl;
        });
    }
});
