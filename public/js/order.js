function getNumber(productId) {
  return {
    content: document.querySelector("input[id='number "+productId+"']").value,
  };
}

function getAddress() {
  return {
    content: document.querySelector("input[id='address']").value,
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
async function handleUnBooking(orderId) {
  await _api.
  unbookOrder(orderId);
  window.location='/cart';
}
async function handleDiscarding(orderId) {
  await _api.
  discardOrder(orderId);
  window.location='/';
}

async function handleReBooking(orderId) {
  await _api.
  bookOrder(orderId);
}

async function handlePaying(orderId) {
  await _api.
  payForOrder(orderId);
  window.location.reload();
}

async function handleAddress(orderId) {
  let address = getAddress().content;
  await _api.
  setAddress(orderId, address);
}

async function handleTimeSlot(orderId, timeslot_start, timeslot_end) {
  let text = '{' +
'"timeslot_start": "' + timeslot_start +
'" , "timeslot_end": "' +  timeslot_end + '"}'; 
console.log(text);
const timeslot = JSON.parse(text); 
console.log(timeslot.timeslot_end);
  await _api.
  setTimeslots(orderId, timeslot);
}

// window.addEventListener('load', () => {
//   let form = document.querySelector("product__input");
//   form.onsubmit = (event) => {
//     event.preventDefault();
//   };
// });