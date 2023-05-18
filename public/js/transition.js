
  
  function transitionOut() {
    var nav = document.querySelector(".nav-wrapper");
    var logo = document.querySelector(".logo");
    var buttons = document.querySelectorAll(".btn");
    var wrapper = document.querySelector(".shop-wrapper");

    logo.addEventListener("click", function() {
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