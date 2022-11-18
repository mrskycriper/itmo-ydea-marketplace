function getRegisterData() {
  return {
    username: document.querySelector("input[id='username']").value,
    email: document.querySelector("input[id='email']").value,
    password: document.querySelector("input[id='password']").value,
  };
}

const register = () => {
  const registerData = getRegisterData();
  let card = document.getElementById('info-card');
  card.style = 'visibility: hidden';
  _api.checkUsername(registerData.username).then(async (response) => {
    console.log(response);
    if (!response.data.isNameTaken) {
      _api
        .signUp(registerData.email, registerData.password)
        .then(async (response) => {
          if (response.data.status === 'OK') {
            _api.createUser(registerData.username, response.data.user.id);
            window.location.href = '/login';
          }
        });
    } else {
      let card = document.getElementById('info-card');
      card.innerHTML =
        '<p class="login-form__info-text">• Это имя пользователя уже занято</p>';
      card.style = null;
      let input = document.getElementById('username');
      input.value = '';
    }
  });
};

window.addEventListener('load', () => {
  let button = document.querySelector("button[id='register-btn']");
  button.onclick = (event) => {
    event.preventDefault();
    register();
  };
});
