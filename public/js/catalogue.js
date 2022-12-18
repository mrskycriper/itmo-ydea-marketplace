async function handleNextPage() {
  const urlParams = new URLSearchParams(window.location.search);
  let page = urlParams.get('page');
  if (page == null) {
    urlParams.set('page', 1);
  } else {
    if (document.getElementById('products-card')) {
      urlParams.set('page', Number.parseInt(page) + 1);
    }
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
    sort_by_price: document.querySelector("select[id='filter-sort-by-price']")
      .value,
    sort_by_rating: document.querySelector("select[id='filter-sort-by-rating']")
      .value,
    seller: document.querySelector("select[id='filter-seller']").value,
    product_category: document.querySelector(
      "select[id='filter-product-category']",
    ).value,
    per_page: document.querySelector("input[id='filter-items-per-page']").value,
  };
}

async function applyFilters() {
  event.preventDefault();
  const filterData = getFilterData();
  const urlParams = new URLSearchParams(window.location.search);
  if (filterData.sort_by_price === 'no') {
    urlParams.delete('price_sort');
  } else if (filterData.sort_by_price === 'up') {
    urlParams.set('price_sort', '1');
  } else if (filterData.sort_by_price === 'down') {
    urlParams.set('price_sort', '0');
  }

  if (filterData.sort_by_rating === 'no') {
    urlParams.delete('rating_sort');
  } else if (filterData.sort_by_rating === 'up') {
    urlParams.set('rating_sort', '1');
  } else if (filterData.sort_by_rating === 'down') {
    urlParams.set('rating_sort', '0');
  }

  if (filterData.seller === 'any') {
    urlParams.delete('seller_id');
  } else {
    urlParams.set('seller_id', filterData.seller);
  }

  if (filterData.product_category === 'any') {
    urlParams.delete('product_category_id');
  } else {
    urlParams.set('product_category_id', filterData.product_category);
  }

  urlParams.set('perPage', filterData.per_page);
  urlParams.set('page', '1');

  window.location.search = urlParams;
}

function getProductData(productId) {
  return {
    quantity: document.querySelector(
      "input[id='item-quantity-" + productId + "']",
    ).value,
  };
}

async function addProductToCart(productId, userid) {
  event.preventDefault();
  const productData = getProductData(productId);
  if (userid !== 'null') {
    let orderId = await _api.getShoppingCartId();
    await _api.createProductsInOrder(
      Number.parseInt(productData.quantity),
      productId,
      orderId.data.id,
    );
    document.querySelector(
      "input[id='item-quantity-" + productId + "']",
    ).value = '1';
    alert('Товар добавлен в корзину');
  } else {
    window.location = '/login';
  }
}
