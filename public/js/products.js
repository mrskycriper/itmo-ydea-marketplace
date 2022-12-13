function getNumber(productId) {
  return {
    content: document.querySelector("input[id='number "+productId+"']").value,
  };
}

async function handleCreateProductsInOrder(productId, userid) {
  const number = getNumber(productId);
  if (userid != "null") {
    let orderId = await _api.getShoppingCartId();
    await _api
      .createProductsInOrder(Number.parseInt(number.content), productId, orderId.data.id);
  }else{
    let url = window.location.search;
    window.location = "/login";
  }
}

async function handleRatingSortUp() {
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set('rating_sort', 1);
  window.location.search = urlParams;
}

async function handleRatingSortDown() {
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set('rating_sort', 0);
  window.location.search = urlParams;
}
async function handlePriceSortUp() {
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set('price_sort', 1);
  window.location.search = urlParams;
}

async function handlePriceSortDown() {
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set('price_sort', 0);
  window.location.search = urlParams;
}
async function handleSortSeller(sellerId) {
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set('seller_id', sellerId);
  window.location.search = urlParams;
}
async function handleSortCategory(categoryId) {
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set('product_category_id', categoryId);
  window.location.search = urlParams;
}

async function handleNoFilters() {
  let url = window.location.search;
  window.location.search = url.split('?')[0] ;
}

window.addEventListener('load', () => {
  let form = document.querySelector("input");
  form.onsubmit = (event) => {
    event.preventDefault();
  };
});