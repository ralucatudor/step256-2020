// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Add action when user clicks button for image uploading.
$('#upload-photo-button').click(function() {
  fetchBlobstoreUrlAndShowForm();
});

/**
 * Stores the URL, generated by the Blobstore API, which allows
 * the user to upload a file, namely {@code imageUploadUrl},
 * and displays the form content.
 */
let imageUploadUrl;
async function fetchBlobstoreUrlAndShowForm() {
  const response = await fetch('/blobstore-upload-url');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  imageUploadUrl = await response.text();
  $('#upload-image-form').removeClass('hidden');
}

/**
 * Makes a POST request to {@code imageUploadUrl}, gets the
 * shopping results in JSON format, into {@code products},
 * and calls the method for integrating those results into the main
 * web page.
 */
async function onSubmitUploadImageForm() {
  // Get the data introduced by the user in the form.
  const photoCategory = document.getElementById('photo-category').value;
  const selectedFile = document.getElementById('input-photo').files[0];

  // Construct the FormData object.
  const formData = new FormData();
  formData.append('photo-category', photoCategory);
  formData.append('photo', selectedFile);

  // Before making the POST request, empty or hide containers from previous photo requests.
  $('#shopping-query-display').empty();
  if (!$('#shopping-query-display-container').hasClass('hidden')) {
    $('#shopping-query-display-container').addClass('hidden');
  }
  $('#shopping-results-wrapper').empty();
  $('#shopping-query').empty();

  // Stop displaying the logo.
  $('#logo').addClass('hidden');

  // Close the form modal and display a prompt, alerting the user that the results are loading.
  $('#upload-image-modal').modal('hide');
  $('#search-loading-prompt').text('Shopping results loading, please wait!');
  $('#loading-gif-prompt').removeClass('hidden');

  // Make a POST request to {@code imageUploadUrl} to process the image uploading.
  const response = await fetch(imageUploadUrl, {
    method: 'POST',
    body: formData,
  }).catch((error) => {
    console.warn(error);
    return new Response(JSON.stringify({
      code: error.response.status,
      message: `Failed to fetch ${imageUploadUrl}`,
    }));
  });

  if (!response.ok) {
    return Promise.reject(response);
  }

  // The request returns a JSON object with the all the shopping queries
  // used to search on Google Shopping and the data about each product
  // for each query from the Google Shopping results page.
  const shoppingResults = await response.json();

  // Empty the prompt container and add the query and its resultant content into the page.
  $('#search-loading-prompt').empty();
  $('#loading-gif-prompt').addClass('hidden');
  $('#shopping-query-display-container').removeClass('hidden');

  appendShoppingResults(shoppingResults);
}

/**
 * Integrates product results from Google Shopping and their respective queries into the web page.
 */
function appendShoppingResults(shoppingResults) {
  shoppingResults.forEach((result) => {
    // Show the user the shopping query built to search on Google Shopping.
    $('#shopping-query').append('<br>' + result['query']);
    const query = `<div class='text-center query'>${result['query']}</div>`;
    $('#shopping-results-wrapper').append(query);

    const listProductsContainer = $('<div>', {class: 'row'});

    const products = result['products'];
    // Integrate the products into the web page.
    products.forEach((product) => {
      // Create an HTML node for the item container.
      const productContainer = $('<div>', {class: 'col-md-4'});

      // Get the HTML content for the container.
      const productElementHTML = getProductElementHTML(product.title,
          product.imageLink,
          product.priceAndSeller,
          product.link,
          product.shippingPrice);

      // Load the content using jQuery's append.
      productContainer.append(productElementHTML);

      // Add the container to the results page, into the corresponding product wrapper.
      listProductsContainer.append(productContainer);
    });
    $('#shopping-results-wrapper').append(listProductsContainer);
  });
}

/**
 * Returns the HTML content for a product container, based on the arguments.
 */
function getProductElementHTML(productTitle,
    productImageLink,
    productPriceAndSeller,
    productLink,
    productShippingPrice) {
  return `<div class="card mb-4 shadow-sm">
            <div class="card-body">
              <img src="${productImageLink}" style="float: left;" class="mr-2">
              <p class="card-text">${productTitle}</p>
              <p class="card-text">${productPriceAndSeller}</p>
              <div class="d-flex justify-content-between align-items-center">
                <div class="btn-group">
                  <a class="btn btn-sm btn-outline-secondary" 
                     href="${productLink}"
                     target="_blank">
                    View
                  </a>
                </div>
                <small class="text-muted">${productShippingPrice}</small>
              </div>
            </div>
          </div>`;
}
