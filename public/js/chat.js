function getMessageData() {
  return {
    message: document.querySelector("textarea[id='message']").value,
    chatId: Number.parseInt(window.location.pathname.split('/')[2]),
  };
}

function handlePostMessage() {
  const formData = getMessageData();
  _api.postMessage(formData.message, formData.chatId);
}

window.addEventListener('load', () => {
  let form = document.querySelector("form[id='post-message']");
  form.onsubmit = (event) => {
    event.preventDefault();
    handlePostMessage();
  };
});

window.addEventListener('load', () => {
  const socket = io();
  let messages = document.querySelector("div[id='messages']");
  messages.scrollTop = messages.scrollHeight;
  let form = document.getElementById('post-message');
  let input = document.querySelector("textarea[id='message']");

  form.onsubmit = async (event) => {
    event.preventDefault();
    if (input.value !== '') {
      let chatId = Number.parseInt(window.location.pathname.split('/')[2]);
      let userId = null;
      try {
        userId = await supertokens.getUserId();
      } catch (e) {}

      if (userId) {
        socket.emit('messageFromClient', {
          content: input.value,
          chatId: chatId,
          userId: userId,
        });
      }

      input.value = '';
    }
  };

  socket.on('messageFromServer', function (msg) {
    let chatId = Number.parseInt(window.location.pathname.split('/')[2]);
    if (chatId === msg.chatId) {
      let messageCard = document.createElement('div');
      messageCard.className = 'message-card';

      let avatar = document.createElement('img');
      avatar.src =
        'https://ui-avatars.com/api/?name=' +
        msg.author.name +
        '&rounded=true&size=32';
      avatar.className = 'message-card__avatar';

      let div = document.createElement('div');

      let header = document.createElement('div');
      header.className = 'message-card__header';

      let name = document.createElement('a');
      name.href = '/users/' + msg.author.name;
      name.className = 'message-card__name';
      name.textContent = msg.author.name;

      let date = document.createElement('p');
      date.className = 'message-card__date';
      let dateNumber = new Date(msg.createdAt);
      date.textContent = dateNumber.toLocaleString('ru-RU', {
        hour: 'numeric',
        minute: 'numeric',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      });

      let content = document.createElement('p');
      content.className = 'message-card__content';
      content.textContent = msg.content;

      header.append(name);
      header.append(date);
      div.append(header);
      div.append(content);
      messageCard.append(avatar);
      messageCard.append(div);
      messages.append(messageCard);
      messages.scrollTop = messages.scrollHeight;
    }
  });
});

function showEditChat() {
  let form = document.getElementById('chat-form');
  if (form.style.getPropertyValue('display') === 'none') {
    form.style.setProperty('display', 'block');
  } else {
    form.style.setProperty('display', 'none');
  }
}

function showUsers() {
  let form = document.getElementById('user-container');
  if (form.style.getPropertyValue('display') === 'none') {
    form.style.setProperty('display', 'block');
  } else {
    form.style.setProperty('display', 'none');
  }
}

function showDeleteChat() {
  let form = document.getElementById('danger-container');
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

function handleEditChat(chatId) {
  const chatData = getChatData();
  _api.editChat(chatId, chatData.name, chatData.description).then(() => {
    window.location.reload();
  });
}

function getUserData() {
  return {
    name: document.querySelector("input[id='username']").value,
  };
}

function handleInviteUser(chatId) {
  const userData = getUserData();
  _api.inviteUser(chatId, userData.name).then(() => {
    window.location.reload();
  });
}

function handleDeleteChat(chatId) {
  const result = confirm('Вы уверены? Это действие не обратимо.');
  if (result) {
    _api.deleteChat(chatId).then(() => {
      window.location.href = '/';
      alert('Чат удален.');
    });
  }
}
