function getRegisterData() {
  return {
    username: document.querySelector("input[id='username']").value,
    email: document.querySelector("input[id='email']").value,
    password: document.querySelector("input[id='password']").value,
    description: document.querySelector('#description').value,
  };
}

const register = () => {
  const registerData = getRegisterData();
  _api
    .signUp(registerData.email, registerData.password)
    .then(async (response) => {
      if (response.data.status === 'OK') {
        _api
          .createUser(registerData.username, response.data.user.id)
          .then(() => {
              _api.createSeller(
                registerData.description,
                response.data.user.id,
              );
              window.location.href = '/login';
            });
      }else{
        
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
