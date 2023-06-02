
//-----------------------//
//  Add and Edit Handle  //
//-----------------------//

// Get references to the form and preview elements
const addform = document.getElementById('add-item');
const editform = document.getElementById('edit-item');

// Listen for form input changes
addform.addEventListener('input', () => updatePreview(addform, 'preview-img1', 'preview-title1', 'preview-description1', 'preview-size1', 'preview-price1'));


// Update the preview based on form input
function updatePreview(form, imgId, titleId, descriptionId, sizeId, priceId) {
    // Capture form data using FormData
    const formData = new FormData(form);

    // Get the values from the form inputs
    const title = formData.get('title');
    const description = formData.get('description');
    const size = formData.get('size');
    const price = formData.get('price');
    const imageFile = formData.get('image');

    // Update the preview elements with the form values
    const previewImg = document.getElementById(imgId);
    const previewTitle = document.getElementById(titleId);
    const previewDescription = document.getElementById(descriptionId);
    const previewSize = document.getElementById(sizeId);
    const previewPrice = document.getElementById(priceId);

    // Update the preview elements with the form values
    previewTitle.textContent = title;
    previewDescription.textContent = description;
    previewSize.textContent = `${size}in`;
    previewPrice.textContent = `$${price}`;

    // Update the preview image if a file is selected
    if (imageFile && imageFile.size > 0) {
        const reader = new FileReader();

        reader.onload = function (e) {
            previewImg.src = e.target.result;
        };

        reader.readAsDataURL(imageFile);
    } else {
        // Use a placeholder image if no file is selected
        previewImg.src = '/assetts/shop/placeholder.jpg';
    }
}

document.getElementById('edit-item').addEventListener('input', function (event) {
    if (event.target.id === 'item-id') {
        event.preventDefault(); // Prevent the form from submitting and refreshing the page

        const itemId = document.getElementById('item-id').value.toString();


        fetch('/data/items.json')
            .then(response => response.json())
            .then(data => {
                const items = data; // Assign the loaded JSON data to the "items" variable

                // Find the item in the JSON data based on the provided itemId
                const itemData = items.find(item => item.id === itemId);

                // Check if the item exists
                if (!itemData) {
                    document.getElementById('preview-img2').src = '/assetts/shop/placeholder.jpg';
                    document.getElementById('preview-title2').textContent = 'Item Not Found';
                    console.error('Item not found:', itemId);
                    return;
                }

                // Check if the item is sold
                if (itemData.availability === 'sold') {
                    return; // Exit the function, preventing the preview from being populated
                }

                // Populate the preview container with the retrieved data
                document.getElementById('preview-img2').src = itemData.image;
                document.getElementById('preview-title2').textContent = itemData.title;
                document.getElementById('preview-description2').textContent = itemData.description;
                document.getElementById('preview-size2').textContent = itemData.size;
                document.getElementById('preview-price2').textContent = itemData.price;
            })
            .catch(error => {
                console.error('Error loading JSON data:', error);
            });
    }
});

// Update the preview based on form input
editform.addEventListener('input', () => updatePreviewEdit(editform, 'preview-img2', 'preview-title2', 'preview-description2', 'preview-size2', 'preview-price2'));


// Update the preview based on form input
function updatePreviewEdit(form, imgId, titleId, descriptionId, sizeId, priceId) {
    // Capture form data using FormData
    const formData = new FormData(form);

    // Get the values from the form inputs
    const title = formData.get('title');
    const description = formData.get('description');
    const size = formData.get('size');
    const price = formData.get('price');
    const imageFile = formData.get('image');

    // Update the preview elements with the form values
    const previewImg = document.getElementById(imgId);
    const previewTitle = document.getElementById(titleId);
    const previewDescription = document.getElementById(descriptionId);
    const previewSize = document.getElementById(sizeId);
    const previewPrice = document.getElementById(priceId);
  

    // Update the preview title if input is provided; otherwise, keep the original text
    if (title.trim() !== '') {
        previewTitle.textContent = title;
    }

    // Update the preview description if input is provided; otherwise, keep the original text
    if (description.trim() !== '') {
        previewDescription.textContent = description;
    }

    // Update the preview size if input is provided; otherwise, keep the original text
    if (size.trim() !== '') {
        previewSize.textContent = `${size}in`;
    }

    // Update the preview price if input is provided; otherwise, keep the original text
    if (price.trim() !== '') {
        previewPrice.textContent = `$${price}`;
    }


    // Update the preview image if a file is selected
    if (imageFile && imageFile.size > 0) {
        const reader = new FileReader();

        reader.onload = function (e) {
            previewImg.src = e.target.result;
        };

        reader.readAsDataURL(imageFile);
    } else {
        // Use a original image if no file is selected
        previewImg.src = '/assetts/shop/placeholder.jpg';
    }
}




//-----------------------//
//     Remove Handle     //
//-----------------------//

const removeform = document.getElementById('remove-item');

removeform.addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent the form from submitting and refreshing the page

  const itemId = document.getElementById('item-id2').value.toString();
  console.log('itemId:', itemId);

  fetch('/dashboard/remove-item', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: itemId }),
  })
    .then((response) => {
      if (response.ok) {
        // Item removed successfully
        // Handle any further actions or UI updates

        // Reset the preview container
        document.getElementById('preview-img3').src = '/assetts/shop/placeholder.jpg';
        document.getElementById('preview-title3').textContent = '';
        document.getElementById('preview-description3').textContent = '';
        document.getElementById('preview-size3').textContent = '';
        document.getElementById('preview-price3').textContent = '';
      } else {
        // Handle the error case
        // Display an error message or perform necessary actions
      }
    })
    .catch((error) => {
      // Handle any network or other errors
      console.error(error);
    });
});

// Preview update based on input change
const inputElement = document.getElementById('item-id2');

inputElement.addEventListener('input', function () {
  const itemId = inputElement.value.toString();

  fetch('/data/items.json')
    .then((response) => response.json())
    .then((data) => {
      const items = data; // Assign the loaded JSON data to the "items" variable

      // Find the item in the JSON data based on the provided itemId
      const itemData = items.find((item) => item.id === itemId);

      // Check if the item exists
      if (!itemData) {
        document.getElementById('preview-img3').src = '/assetts/shop/placeholder.jpg';
        document.getElementById('preview-title3').textContent = 'Item Not Found';
        document.getElementById('preview-description3').textContent = '';
        document.getElementById('preview-size3').textContent = '';
        document.getElementById('preview-price3').textContent = '';
        console.error('Item not found:', itemId);
        return;
      }

      // Check if the item is sold
      if (itemData.availability === 'sold') {
        // Handle the case when the item is sold
        // Display an appropriate message or perform necessary actions
        return;
      }

      // Populate the preview container with the retrieved data
      document.getElementById('preview-img3').src = itemData.image;
      document.getElementById('preview-title3').textContent = itemData.title;
      document.getElementById('preview-description3').textContent = itemData.description;
      document.getElementById('preview-size3').textContent = itemData.size;
      document.getElementById('preview-price3').textContent = itemData.price;
    })
    .catch((error) => {
      console.error('Error loading JSON data:', error);
    });
});

