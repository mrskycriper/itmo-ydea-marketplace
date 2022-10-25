function showCreateCategory() {
  let form = document.getElementById('create-category');
  if (form.style.getPropertyValue('display') === 'none') {
    form.style.setProperty('display', 'block');
  } else {
    form.style.setProperty('display', 'none');
  }
}

function getCategoryData() {
  return {
    name: document.querySelector("input[id='name']").value,
    description: document.querySelector("textarea[id='description']").value,
  };
}

function handleCreateCategory() {
  const formData = getCategoryData();
  _api.createCategory(formData.name, formData.description).then((response) => {
    if (response.data.categoryId !== null) {
      window.location.href =
        '/categories/' + response.data.categoryId + '?page=1';
    } else {
      window.location.href = '/categories?page=1';
    }
  });
}

window.addEventListener('load', () => {
  let form = document.querySelector("form[id='create-category']");
  form.onsubmit = (event) => {
    event.preventDefault();
    handleCreateCategory();
  };
});

function showEditCategory() {
  let form = document.getElementById('category-form');
  if (form.style.getPropertyValue('display') === 'none') {
    form.style.setProperty('display', 'block');
  } else {
    form.style.setProperty('display', 'none');
  }
}

function handleEditCategory(categoryId) {
  const categoryData = getCategoryData();
  _api
    .editCategory(categoryId, categoryData.name, categoryData.description)
    .then(() => {
      window.location.reload();
    });
}

function showDeleteCategory() {
  let form = document.getElementById('danger-container');
  if (form.style.getPropertyValue('display') === 'none') {
    form.style.setProperty('display', 'block');
  } else {
    form.style.setProperty('display', 'none');
  }
}

function handleDeleteCategory(categoryId) {
  const result = confirm('Вы уверены? Это действие не обратимо.');
  if (result) {
    _api.deleteCategory(categoryId).then(() => {
      window.location.href = '/';
      alert('Категория удалена.');
    });
  }
}
