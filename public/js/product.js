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
  var editButtonContainer = document.getElementById('editRow');
  editButtonContainer.innerHTML =
    '<a onclick="editSubmit();">Применить</a><a onclick="window.location.reload();">Отмена</a>'
  nameFieldElement.innerHTML =
    '<form action="javascript:editSubmit();"><input type=text id="newProductNameTextArea" value="' + productName +'"></input></form>';
  productDescriptionFieldElement.innerHTML = 
  '<form action="javascript:editSubmit();"><textarea type=text id="newProductDescriptionTextArea" rows="10" cols="40">' + productDescription +'</textarea></form>';
  productPriceElement.innerHTML =
  'Цена: <form action="javascript:editSubmit();"><input type=text id="newProductPriceTextArea" value="' + productPrice +'"></input></form>';
  numberOfProductElement.innerHTML =
  'Единиц товара: <form action="javascript:editSubmit();"><input type=text id="newProductNumberTextArea" value="' + productNumber +'"></input></form>';
  var categoriesResponse = (await _api.getProductCategories())
  var categories = categoriesResponse.data.categories
  var HTMLContent = 'Категория: <div class="dropdown"><button class="dropbtn" id="buttonWithCategoryValue">' + productCategory + '</button><div class="dropdown-content">'
  for (const category of categories)
  {
    HTMLContent += '<a onclick="handleCategory(\'' +  category.id + '\', \'' + category.category + '\');">' + category.category + '</a>'
  }
  HTMLContent += "</div></div>"
  categoryOfProductElement.innerHTML = HTMLContent
}

async function handleCategory(newCategoryID, newCategory) {
  productCategoryID = newCategoryID
  var categoryOfProduct = document.getElementById('buttonWithCategoryValue');
  categoryOfProduct.innerText = newCategory
}

async function editSubmit() {
  document.getElementById('newProductDescriptionTextArea').value = document.getElementById('newProductDescriptionTextArea').value.replace(/(\r\n|\n|\r)/gm, "");
  await _api.editProduct(
    document.getElementById('newProductNameTextArea').value,
    document.getElementById('newProductDescriptionTextArea').value,
    Number.parseFloat(document.getElementById("newProductPriceTextArea").value),
    Number.parseInt(document.getElementById("newProductNumberTextArea").value),
    productCategoryID,
    productID
  )
  window.location.reload();
}