function showEditDescription() {
  let form = document.getElementById('edit-description-form');
  let text = document.getElementById('seller-description-form-toggle');
  if (form.style.getPropertyValue('display') === 'none') {
    form.style.setProperty('display', 'block');
    text.innerText = 'свернуть';
  } else {
    form.style.setProperty('display', 'none');
    text.innerText = 'изменить';
  }
}

function getDescriptionData() {
  return {
    description: document.querySelector("textarea[id='description']").value,
  };
}

async function editDescription(seller_id) {
  event.preventDefault();
  const descriptionData = getDescriptionData();
  await _api.editSeller(descriptionData.description, seller_id);
  window.location.reload();
}

function showAddProduct() {
  let form = document.getElementById('add-product-form');
  let text = document.getElementById('product-form-toggle');
  if (form.style.getPropertyValue('display') === 'none') {
    form.style.setProperty('display', 'block');
    text.innerText = 'свернуть';
  } else {
    form.style.setProperty('display', 'none');
    text.innerText = 'развернуть';
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

async function addProduct(seller_id) {
  event.preventDefault();
  const productData = getProductData();
  console.log(productData);
  const rsp = await _api.createProduct(
    productData.name,
    productData.description,
    productData.category_id,
    Number.parseInt(productData.price),
    Number.parseInt(productData.number),
    seller_id,
  );
  if (rsp.data.productId !== null) {
    window.location.href = '/products/' + rsp.data.productId;
  } else {
    window.location.reload();
  }
}
