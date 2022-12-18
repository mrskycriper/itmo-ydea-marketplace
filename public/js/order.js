function getNumber(productId) {
  return {
    content: document.querySelector(
      "input[id='item-quantity-" + productId + "']",
    ).value,
  };
}

function getAddress() {
  return {
    content: document.querySelector("input[id='address']").value,
  };
}

async function handleEditProductsInOrder(productId) {
  event.preventDefault();
  const number = getNumber(productId);
  await _api.editProductsInOrder(productId, Number.parseInt(number.content));
  window.location.reload();
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
    window.location = '/orders/' + orderId + '?page=1';
  } else {
    await _api.bookOrder(orderId);
    window.location = '/orders/' + orderId + '?page=1';
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
    window.location = '/cart?page=1';
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
  if (times_booked === 3) {
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
}

// window.addEventListener('load', () => {
//   let form = document.querySelector("product__input");
//   form.onsubmit = (event) => {
//     event.preventDefault();
//   };
// });

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
  window.location.search = urlParams;
}

function getOrderData() {
  return {
    address: document.querySelector("input[id='address']").value,
    timeslot: document.querySelector("select[id='timeslot']").value,
  };
}

async function validateData(orderId) {
  event.preventDefault();
  const orderData = getOrderData();
  await _api.setAddress(orderId, orderData.address);
  let start = '';
  let end = '';
  start = orderData.timeslot.split('&')[0];
  end = orderData.timeslot.split('&')[1];
  await handleTimeSlot(orderId, start, end);
  window.location.reload();
}
