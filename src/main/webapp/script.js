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

$("#upload-photo-button").click(function() {
  fetchBlobstoreUrlAndShowForm(); 
  openFileUploadDialog();
});

/**
 * Event processing for upload button
 */
function openFileUploadDialog() {
  document.querySelector('.bg-model').style.display = 'flex';
}

/**
 * Event processing for close button
 */
function closeFileUploadDialog() {
  document.querySelector('.bg-model').style.display = 'none';
}

/**
 * Makes the form for uploading an image visible and
 * adds the 'action' to it by fetching
 * the url(that the form needs to post to) from the servlet
 */
let imageUploadUrl;

async function fetchBlobstoreUrlAndShowForm() {
  const response = await fetch('/blobstore-upload-url');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  imageUploadUrl = await response.text();
  const uploadForm = document.getElementById('upload-image-form');
  uploadForm.classList.remove('hidden');
}

async function onSubmitUploadImageForm() {
  const photoCategory = document.getElementById('photo-category').value;
  const selectedFile = document.getElementById('input-photo').files[0];

  let formData = new FormData();
  formData.append('photo-category', photoCategory);
  formData.append('photo', selectedFile);

  $('#shopping-results-wrapper').empty();

  closeFileUploadDialog();
  const searchLoadingPrompt = document.getElementById('search-loading-prompt');
  searchLoadingPrompt.textContent = "Search loading";

  const response = await fetch(imageUploadUrl, {
        method: 'POST',
        body: formData
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

  // The request returns a JSON with data about each product from the Google Shopping results page.
  const products = await response.json();

  searchLoadingPrompt.textContent = "";
  buildShoppingResultsUI(products);
}

/**
 * Builds the Shopping Results Page UI by integrating product results from 
 * Google Shopping into the webpage. 
 */
async function buildShoppingResultsUI(products) {
  // Integrate the products into the webpage.
  products.forEach(product => {
    // Create an HTML node for the item container.
    let $productContainer = $('<div>', {class: 'col-md-4'});

    // Get the HTML content for the container.
    const productElementHTML = getProductElementHTML(product.title,
                                                     product.imageLink,
                                                     product.priceAndSeller,
                                                     product.link,
                                                     product.shippingPrice);

    // Load the content using jQuery's append.
    $productContainer.append(productElementHTML);

    // Add the container to the results page, into the corresponding product wrapper.
    $('#shopping-results-wrapper').append($productContainer);
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
            <div class="col-4">
              <img src="${productImageLink}" class="mx-auto d-block">
            </div>
            <div class="card-body">
              <p class="card-text">${productTitle}</p>
              <p class="card-text">${productPriceAndSeller}</p>
              <div class="d-flex justify-content-between align-items-center">
                <div class="btn-group">
                  <button type="button" 
                          class="btn btn-sm btn-outline-secondary" 
                          onclick="window.location.href='${productLink}'">
                    View
                  </button>
                </div>
                <small class="text-muted">${productShippingPrice}</small>
              </div>
            </div>
          </div>`;
}
