  async function changeProductImage() {
    alert("I")
  }

  async function changeProductDescription() {
    alert("D")
  }

  async function changeProductName() {
    var nameField = document.getElementById("productNameField")
    nameField.innerHTML = "<form><input type=text id=\"newProductNameTextArea\"> </input><button  id=\"newProductNameSubmitButton\">Применить</button><span class=\"text-danger\" id=\"changeProductNameResponse\"></span></form>"
    document.getElementById("newProductNameSubmitButton").addEventListener('click', changeProductNameSubmit)
  }

  async function changeProductNameSubmit() {
    event.preventDefault();
      if (document.getElementById("newProductNameTextArea").value === "")
      {
        return;
      }
      await _api.
        editProduct(
            document.getElementById("newProductNameTextArea").value,
            productDescription,
            productPrice,
            productNumber,
            productCategoryID,
            productID
        )
        window.location.reload()
  }
