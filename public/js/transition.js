animateShopRows();

function animateShopRows() {
    var rows = document.querySelectorAll('.shop-row');

    rows.forEach(function (row, index) {
        var animationClass = index % 2 === 0 ? 'shop-row-1' : 'shop-row-2'; // Find Index of Row and add correct animation

        // Apply the animation class to the row
        row.classList.add(animationClass);
    });
}

function transitionOut() {
    var nav = document.querySelector(".nav-wrapper");
    var logo = document.querySelector(".logo");
    var buttons = document.querySelectorAll(".btn");
    var wrapper = document.querySelector(".shop-wrapper");
    const navList = document.getElementById('nav-list');

    logo.addEventListener("click", function () {
        navList.classList.remove('open');
        // Add the animation class
        wrapper.classList.add("pagewipe");
        nav.classList.add("reverse-nav");
        // Wait for the animation to complete
        var animationDuration = 2000; // 2 seconds
        setTimeout(function () {
            // Redirect to the desired URL
            window.location.href = "/";
        }, animationDuration);
    });


    buttons.forEach(function (button) {
        button.addEventListener("click", function () {
            var redirectUrl = button.dataset.redirect;
            navList.classList.remove('open');
            // Add the animation class
            wrapper.classList.add("pagewipe");
            nav.classList.add("reverse-nav");

            // Wait for the animation to complete
            var animationDuration = 2000; // 2 seconds
            setTimeout(function () {
                // Redirect to the desired URL
                window.location.href = redirectUrl;
            }, animationDuration);
        });
    });
}

transitionOut();