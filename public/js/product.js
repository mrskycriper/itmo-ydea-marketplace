async function changeProductImage() {
  alert('I');
}

async function changeProductDescription() {
  alert('D');
}

async function changeProductName() {
  var nameField = document.getElementById('productNameField');
  nameField.innerHTML =
    '<form><input type=text id="newProductNameTextArea"> </input><button  id="newProductNameSubmitButton">Применить</button><span class="text-danger" id="changeProductNameResponse"></span></form>';
  document
    .getElementById('newProductNameSubmitButton')
    .addEventListener('click', changeProductNameSubmit);
}

async function changeProductNameSubmit() {
  event.preventDefault();
  if (document.getElementById('newProductNameTextArea').value === '') {
    return;
  }
  await _api.editProduct(
    document.getElementById('newProductNameTextArea').value,
    productDescription,
    productPrice,
    Number.parseInt(productNumber),
    productCategoryID,
    productID,
  );
  window.location.reload();
}


async function editProduct() {
  var nameFieldElement = document.getElementById('productNameField');
  var productDescriptionFieldElement = document.getElementById('productDescriptionField');
  var productPriceElement = document.getElementById('productPrice');
  var numberOfProductElement = document.getElementById('numberOfProduct');
  var categoryOfProductElement = document.getElementById('categoryOfProduct');
  nameFieldElement.innerHTML =
    '<form action="javascript:editSubmit();"><input type=text id="newProductNameTextArea" value="' + productName +'"></input></form>';
  productDescriptionFieldElement.innerHTML = 
  '<form action="javascript:editSubmit();"><textarea type=text id="newProductNameTextArea" rows="10" cols="40">' + productDescription +'</textarea></form>';
  productPriceElement.innerHTML =
  'Цена: <form action="javascript:editSubmit();"><input type=text id="newProductNameTextArea" value="' + productPrice +'"></input></form>';
  numberOfProductElement.innerHTML =
  'Единиц товара: <form action="javascript:editSubmit();"><input type=text id="newProductNameTextArea" value="' + productNumber +'"></input></form>';
}

async function editSubmit() {
  alert('A')
}