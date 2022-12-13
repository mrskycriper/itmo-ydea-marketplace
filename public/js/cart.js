function getNumber(productId) {
  return {
    content: document.querySelector("input[id='number "+productId+"']").value,
  };
}

async function handleEditProductsInOrder(productId) {
  const number = getNumber(productId);
  await _api.
  editProductsInOrder(productId, Number.parseInt(number.content));
}

async function handleDeleteProductsInOrder(productId) {
  await _api.
  deleteProductsInOrder(productId);
  window.location.reload();
}
async function handleBooking(orderId) {
  await _api.
  bookOrder(orderId);
  window.location='/orders/'+orderId;
}

// window.addEventListener('load', () => {
//   let form = document.querySelector("product__input");
//   form.onsubmit = (event) => {
//     event.preventDefault();
//   };
// });