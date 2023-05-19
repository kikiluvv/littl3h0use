document.addEventListener('DOMContentLoaded', function () {
  // Continue with the remaining code
  fetch('/data/items.json')
    .then(response => response.json())
    .then(data => {
      const items = data; // Assign the loaded JSON data to the "items" variable

      // Attach click event listener to shop items
      document.querySelectorAll('.child-img, .child-measure-img').forEach(function (item) {
        item.addEventListener('click', function (event) {
          event.stopPropagation(); // Stop event propagation to prevent closing the popup immediately

          const index = item.dataset.index;
          const itemData = items[index];

          // Check if the item is sold
          if (itemData.availability === 'sold') {
            return; // Exit the function, preventing the popup from opening
          }

          // Check if the item is a placeholder
          if (itemData.type === 'placeholder') {
            return; // Exit the function, preventing the popup from opening
          }

          // Populate the popup container with the retrieved data
          document.getElementById('popup-img').src = itemData.image;
          document.getElementById('popup-title').textContent = itemData.title;
          document.getElementById('popup-description').textContent = itemData.description;
          document.getElementById('popup-size').textContent = itemData.size;
          document.getElementById('popup-price').textContent = itemData.price;

          // Set the redirect value for the pop button
          const popBtn = document.getElementById('pop-btn');
          popBtn.dataset.redirect = itemData.link;

          // Add a click event listener to the #pop-btn
          popBtn.addEventListener('click', function () {
            // Get the redirect URL from the data-redirect attribute
            const redirectUrl = popBtn.dataset.redirect;

            // Redirect the user to the specified URL
            window.open(redirectUrl, '_blank');
          });

          // Show the popup container
          document.getElementById('popup').style.display = 'flex';

          // Blur the background
          document.getElementById('popup-wrapper').style.display = 'flex';
          document.querySelector('.nav-wrapper').classList.add('popup-active');
          document.querySelector('.shop-wrapper').classList.add('popup-active');
        });
      });

      // Close the popup
      document.getElementById('popup-close').addEventListener('click', function () {
        closePopup();
      });

      // Close the popup when clicking outside
      document.addEventListener('click', function (event) {
        if (!event.target.closest('.popup')) {
          closePopup();
        }
      });

    })
    .catch(error => {
      console.error('Error loading JSON data:', error);
    });
});

// Function to close the popup
function closePopup() {
  // Hide the popup container
  document.getElementById('popup').style.display = 'none';

  // Remove the blur effect from the background
  document.getElementById('popup-wrapper').style.display = 'none';
  document.querySelector('.nav-wrapper').classList.remove('popup-active');
  document.querySelector('.shop-wrapper').classList.remove('popup-active');
}
