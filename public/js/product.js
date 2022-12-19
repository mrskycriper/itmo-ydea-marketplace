async function edit_Product() {
  var nameFieldElement = document.getElementById('productNameField');
  var productDescriptionFieldElement = document.getElementById(
    'productDescriptionField',
  );
  var productPriceElement = document.getElementById('productPrice');
  var numberOfProductElement = document.getElementById('numberOfProduct');
  var categoryOfProductElement = document.getElementById('categoryOfProduct');
  var editButtonContainer = document.getElementById('editRow');
  editButtonContainer.innerHTML =
    '<a onclick="editSubmit();">Применить</a><a onclick="window.location.reload();">Отмена</a>';
  nameFieldElement.innerHTML =
    '<form action="javascript:editSubmit();"><input type="text" id="newProductNameTextArea" value="' +
    productName +
    '"></input></form>';
  productDescriptionFieldElement.innerHTML =
    '<form action="javascript:editSubmit();"><textarea type="text" id="newProductDescriptionTextArea" rows="10" cols="40">' +
    productDescription +
    '</textarea></form>';
  productPriceElement.innerHTML =
    'Цена: <form action="javascript:editSubmit();"><input type="text" id="newProductPriceTextArea" value="' +
    productPrice +
    '"></input></form>';
  numberOfProductElement.innerHTML =
    'Единиц товара: <form action="javascript:editSubmit();"><input type="text" id="newProductNumberTextArea" value="' +
    productNumber +
    '"></input></form>';
  var categoriesResponse = await _api.getProductCategories();
  var categories = categoriesResponse.data.categories;
  var HTMLContent =
    'Категория: <div class="dropdown"><button class="dropbtn" id="buttonWithCategoryValue">' +
    productCategory +
    '</button><div class="dropdown-content">';
  for (const category of categories) {
    HTMLContent +=
      '<a onclick="handleCategory(\'' +
      category.id +
      "', '" +
      category.category +
      '\');">' +
      category.category +
      '</a>';
  }
  HTMLContent += '</div></div>';
  categoryOfProductElement.innerHTML = HTMLContent;
}

async function handleCategory(newCategoryID, newCategory) {
  productCategoryID = newCategoryID;
  var categoryOfProduct = document.getElementById('buttonWithCategoryValue');
  categoryOfProduct.innerText = newCategory;
}

async function editSubmit() {
  document.getElementById('newProductDescriptionTextArea').value = document
    .getElementById('newProductDescriptionTextArea')
    .value.replace(/(\r\n|\n|\r)/gm, '');
  await _api.editProduct(
    document.getElementById('newProductNameTextArea').value,
    document.getElementById('newProductDescriptionTextArea').value,
    Number.parseFloat(document.getElementById('newProductPriceTextArea').value),
    Number.parseInt(document.getElementById('newProductNumberTextArea').value),
    productCategoryID,
    productID,
  );
  window.location.reload();
}

async function sendReview() {
  var reviewText = document.getElementById('reviewText').value;
  var reviewRating = document.querySelector('input[name="rating"]:checked');
  if (reviewRating == null) {
    document.getElementById('sendResponseReview').innerText =
      'To create review rating must not be empty!';
    return;
  }
  await _api.createReview(
    reviewText,
    Number.parseInt(reviewRating.value),
    currentUserId,
    productID,
  );
  window.location.reload();
}

function showEditImage() {
  let form = document.getElementById('edit-image-form');
  let text = document.getElementById('image-form-toggle');
  let otherForm = document.getElementById('edit-product-form');
  if (otherForm.style.getPropertyValue('display') !== 'none') {
    showEditProduct();
  }
  if (form.style.getPropertyValue('display') === 'none') {
    form.style.setProperty('display', 'block');
    text.innerText = 'Свернуть';
  } else {
    form.style.setProperty('display', 'none');
    text.innerText = 'Изменить изображение товара';
  }
}

function showEditProduct() {
  let form = document.getElementById('edit-product-form');
  let text = document.getElementById('product-form-toggle');
  let otherForm = document.getElementById('edit-image-form');
  if (otherForm.style.getPropertyValue('display') !== 'none') {
    showEditImage();
  }
  if (form.style.getPropertyValue('display') === 'none') {
    form.style.setProperty('display', 'block');
    text.innerText = 'Свернуть';
  } else {
    form.style.setProperty('display', 'none');
    text.innerText = 'Изменить товар';
  }
}

function getImageData() {
  return {
    image_url: document.querySelector("input[id='image-url']").value,
  };
}

async function editImage(photo_id, product_id) {
  event.preventDefault();
  const imageData = getImageData();
  if (photo_id === 'no') {
    await _api.createPhoto(imageData.image_url, product_id);
    window.location.reload();
  } else {
    await _api.deletePhoto(photo_id);
    await _api.createPhoto(imageData.image_url, product_id);
    window.location.reload();
  }
}

function getProductData() {
  return {
    name: document.querySelector("input[id='name']").value,
    description: document.querySelector("textarea[id='product-description']")
      .value,
    price: document.querySelector("input[id='price']").value,
    number: document.querySelector("input[id='quantity']").value,
    category_id: document.querySelector("select[id='category']").value,
  };
}

async function editProduct(product_id) {
  event.preventDefault();
  const productData = getProductData();
  await _api.editProduct(
    productData.name,
    productData.description,
    Number.parseInt(productData.price),
    Number.parseInt(productData.number),
    productData.category_id,
    product_id,
  );

  window.location.reload();
}

function getReviewData() {
  return {
    review_text: document.querySelector("textarea[id='review-text']").value,
    review_rating: document.querySelector("select[id='review-rating']").value,
  };
}

async function postReview(userid, product_id) {
  event.preventDefault();
  const reviewData = getReviewData();
  await _api.createReview(
    reviewData.review_text,
    Number.parseInt(reviewData.review_rating),
    userid,
    product_id,
  );
  window.location.reload();
}

async function handleNextPage() {
  const urlParams = new URLSearchParams(window.location.search);
  let page = urlParams.get('page');
  if (page == null) {
    urlParams.set('page', 1);
  } else {
    urlParams.set('page', Number.parseInt(page) + 1);
  }
  window.location.search = urlParams;
}

async function handlePreviousPage() {
  const urlParams = new URLSearchParams(window.location.search);
  let page = urlParams.get('page');
  if (page == null) {
    urlParams.set('page', 1);
  } else {
    if (page > 1) {
      urlParams.set('page', Number.parseInt(page) - 1);
      window.location.search = urlParams;
    }
  }
}

function showFilters() {
  let form = document.getElementById('apply-filter-form');
  let text = document.getElementById('apply-filter-form-toggle');
  if (form.style.getPropertyValue('display') === 'none') {
    form.style.setProperty('display', 'block');
    text.innerText = 'скрыть';
  } else {
    form.style.setProperty('display', 'none');
    text.innerText = 'показать';
  }
}

function getFilterData() {
  return {
    per_page: document.querySelector("input[id='filter-items-per-page']").value,
  };
}

async function applyFilters() {
  event.preventDefault();
  const filterData = getFilterData();
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set('perPage', filterData.per_page);
  urlParams.set('page', '1');
  window.location.search = urlParams;
}
