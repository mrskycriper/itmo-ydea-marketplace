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
