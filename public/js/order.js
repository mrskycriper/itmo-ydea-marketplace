function getNumber(productId) {
  return {
    content: document.querySelector("input[id='number " + productId + "']")
      .value,
  };
}

function getAddress() {
  return {
    content: document.querySelector("input[id='address']").value,
  };
}

async function handleEditProductsInOrder(productId) {
  const number = getNumber(productId);
  await _api.editProductsInOrder(productId, Number.parseInt(number.content));
}

async function handleDeleteProductsInOrder(productId) {
  await _api.deleteProductsInOrder(productId);
  window.location.reload();
}
async function handleBooking(orderId, timestamp) {
  var today = new Date();
  if (
    today >
    new Date(Date.parse(timestamp)).setDate(
      new Date(Date.parse(timestamp)).getDate() + 2,
    )
  ) {
    await _api.discardOrder(orderId);
    window.location = '/orders/' + orderId;
  } else {
    await _api.bookOrder(orderId);
    window.location = '/orders/' + orderId;
  }
}
async function handleUnBooking(orderId, timestamp) {
  var today = new Date();
  if (
    today >
    new Date(Date.parse(timestamp)).setDate(
      new Date(Date.parse(timestamp)).getDate() + 2,
    )
  ) {
    await _api.discardOrder(orderId);
    window.location.reload();
  } else {
    await _api.unbookOrder(orderId);
    window.location = '/cart';
  }
}
async function handleDiscarding(orderId) {
  await _api.discardOrder(orderId);
  window.location = '/';
}

async function handleReBooking(orderId, times_booked, timestamp) {
  var today = new Date();
  if (
    today >
    new Date(Date.parse(timestamp)).setDate(
      new Date(Date.parse(timestamp)).getDate() + 2,
    )
  ) {
    await _api.discardOrder(orderId);
    window.location.reload();
  }
  if (times_booked == 3) {
    await _api.discardOrder(orderId);
    window.location.reload();
  } else {                                                             
    await _api.bookOrder(orderId);
    window.location.reload();
  }
}

async function handlePaying(orderId, timestamp) {
  var today = new Date();
  if (
    today >
    new Date(Date.parse(timestamp)).setDate(
      new Date(Date.parse(timestamp)).getDate() + 2,
    )
  ) {
    await _api.discardOrder(orderId);
    window.location.reload();
  }
  await _api.payForOrder(orderId);
  window.location.reload();
}

async function handleAddress(orderId) {
  let address = getAddress().content;
  await _api.setAddress(orderId, address);
}

async function handleTimeSlot(orderId, timeslot_start, timeslot_end) {
  let start = new Date(Date.parse(timeslot_start));
  let end = new Date(Date.parse(timeslot_end));
  await _api.setTimeslots(orderId, start.toISOString(), end.toISOString());
  window.location.reload();
}

// window.addEventListener('load', () => {
//   let form = document.querySelector("product__input");
//   form.onsubmit = (event) => {
//     event.preventDefault();
//   };
// });
