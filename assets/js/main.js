document.addEventListener("DOMContentLoaded", () => {
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
});
