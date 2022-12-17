function showCreateProductCategory() {
  let form = document.getElementById('create-product-category-form');
  let text = document.getElementById('create-product-category-form-toggle');
  if (form.style.getPropertyValue('display') === 'none') {
    form.style.setProperty('display', 'block');
    text.innerText = 'свернуть';
  } else {
    form.style.setProperty('display', 'none');
    text.innerText = 'развернуть';
  }
}

function getCreateProductCategoryData() {
  return {
    name: document.querySelector("input[id='create-category-name']").value,
  };
}

async function createProductCategory() {
  event.preventDefault();
  const productCategoryData = getCreateProductCategoryData();
  await _api.createProductCategory(productCategoryData.name);
  window.location.reload();
}

function showEditProductCategory() {
  let form = document.getElementById('edit-product-category-form');
  let text = document.getElementById('edit-product-category-form-toggle');
  if (form.style.getPropertyValue('display') === 'none') {
    form.style.setProperty('display', 'block');
    text.innerText = 'свернуть';
  } else {
    form.style.setProperty('display', 'none');
    text.innerText = 'развернуть';
  }
}

function getEditProductCategoryData() {
  return {
    name: document.querySelector("input[id='edit-category-name']").value,
    id: document.querySelector("select[id='edit-category-id']").value,
  };
}

async function editProductCategory() {
  event.preventDefault();
  const productCategoryData = getEditProductCategoryData();
  await _api.editProductCategory(
    productCategoryData.id,
    productCategoryData.name,
  );
  window.location.reload();
}

function showDeleteProductCategory() {
  let form = document.getElementById('delete-product-category-form');
  let text = document.getElementById('delete-product-category-form-toggle');
  if (form.style.getPropertyValue('display') === 'none') {
    form.style.setProperty('display', 'block');
    text.innerText = 'свернуть';
  } else {
    form.style.setProperty('display', 'none');
    text.innerText = 'развернуть';
  }
}

function getDeleteProductCategoryData() {
  return {
    id: document.querySelector("select[id='delete-category-id']").value,
  };
}

async function deleteProductCategory() {
  event.preventDefault();
  const productCategoryData = getDeleteProductCategoryData();
  const result = confirm('Вы уверены? Это действие не обратимо.');
  if (result) {
    await _api.deleteProductCategory(productCategoryData.id);
    window.location.reload();
  }
}
