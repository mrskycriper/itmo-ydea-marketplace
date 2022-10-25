// Показать/скрыть редактирование

function showEditRole() {
  let form = document.getElementById('role-form');
  if (form.style.getPropertyValue('display') === 'none') {
    form.style.setProperty('display', 'block');
  } else {
    form.style.setProperty('display', 'none');
  }
}
function showEditBio() {
  let form = document.getElementById('bio-form');
  if (form.style.getPropertyValue('display') === 'none') {
    form.style.setProperty('display', 'block');
  } else {
    form.style.setProperty('display', 'none');
  }
}

function showDelete() {
  let form = document.getElementById('danger-container');
  if (form.style.getPropertyValue('display') === 'none') {
    form.style.setProperty('display', 'block');
  } else {
    form.style.setProperty('display', 'none');
  }
}

// Редактирование

function getRoleData() {
  let isModerator = false;
  let moderatorCheck = document.getElementById('isModerator');
  if (moderatorCheck.checked) {
    isModerator = true;
  }
  let isAdmin = false;
  let adminCheck = document.getElementById('isAdmin');
  if (adminCheck.checked) {
    isAdmin = true;
  }

  return {
    isModerator: isModerator,
    isAdmin: isAdmin,
  };
}

function editRole(userName) {
  const roleData = getRoleData();
  _api.updateRole(userName, roleData.isModerator, roleData.isAdmin).then(() => {
    window.location.reload();
  });
}

function getBioData() {
  return {
    bio: document.querySelector("textarea[id='bio']").value,
  };
}

function editBio(userName) {
  const bioData = getBioData();
  _api.updateBio(userName, bioData.bio).then(() => {
    window.location.reload();
  });
}

function handleDeleteUser(userName) {
  const result = confirm('Вы уверены? Это действие не обратимо.');
  if (result) {
    _api.deleteUser(userName).then(() => {
      window.location.href = '/';
      alert('Пользователь ' + userName + ' удален.');
    });
  }
}
