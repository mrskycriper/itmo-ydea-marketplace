function showEditBio() {
  let form = document.getElementById('bio-form');
  if (form.style.getPropertyValue('display') === 'none') {
    form.style.setProperty('display', 'block');
  } else {
    form.style.setProperty('display', 'none');
  }
}

function getBioData() {
  return {
    bio: document.querySelector("textarea[id='bio']").value,
  };
}

async function editBio(seller_id) {
  event.preventDefault();
  const bioData = getBioData();
  await _api.editSeller(bioData.bio, seller_id);
  window.location.reload();
}
