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

function showEditRole() {
  let form = document.getElementById('edit-role-form');
  let text = document.getElementById('edit-role-form-toggle');
  if (form.style.getPropertyValue('display') === 'none') {
    form.style.setProperty('display', 'block');
    text.innerText = 'свернуть';
  } else {
    form.style.setProperty('display', 'none');
    text.innerText = 'изменить';
  }
}

function getEditRoleData() {
  return {
    id: document.querySelector("input[id='edit-role-userid']").value,
    role: document.querySelector("select[id='edit-role-selector']").value,
  };
}

async function editRole() {
  event.preventDefault();
  const roleData = getEditRoleData();
  let is_moderator = false;
  let is_admin = false;
  let is_support = false;
  let is_seller = false;
  if (roleData.role === '1') {
    is_admin = true;
  } else if (roleData.role === '2') {
    is_moderator = true;
  } else if (roleData.role === '3') {
    is_support = true;
  } else if (roleData.role === '4') {
    is_seller = true;
  }
  await _api.updateRole(
    roleData.id,
    is_moderator,
    is_admin,
    is_support,
    is_seller,
  );
  window.location.reload();
}
