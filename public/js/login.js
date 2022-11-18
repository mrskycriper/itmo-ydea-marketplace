function getLoginData() {
  return {
    email: document.querySelector("input[id='email']").value,
    password: document.querySelector("input[id='password']").value,
  };
}

const login = () => {
  const loginData = getLoginData();
  _api.signIn(loginData.email, loginData.password).then((response) => {
    if (response.data.status === 'OK') {
      window.location.href = '/';
    }
  });
};

window.addEventListener('load', () => {
  let form = document.querySelector("form[id='login-form']");
  form.onsubmit = (event) => {
    event.preventDefault();
    login();
  };
});
