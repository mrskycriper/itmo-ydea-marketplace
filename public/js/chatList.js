function showCreateChat() {
  let form = document.getElementById('create-chat');
  if (form.style.getPropertyValue('display') === 'none') {
    form.style.setProperty('display', 'block');
  } else {
    form.style.setProperty('display', 'none');
  }
}

function getChatData() {
  return {
    name: document.querySelector("input[id='name']").value,
    description: document.querySelector("textarea[id='description']").value,
  };
}

function handleCreateChat() {
  const formData = getChatData();
  _api.createChat(formData.name, formData.description).then((response) => {
    if (response.data.chatId !== null) {
      window.location.href = '/chats/' + response.data.chatId;
    } else {
      window.location.href = '/chats?page=1';
    }
  });
}

window.addEventListener('load', () => {
  let form = document.querySelector("form[id='create-chat']");
  form.onsubmit = (event) => {
    event.preventDefault();
    handleCreateChat();
  };
});
