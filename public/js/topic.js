function showCreateTopic() {
  let form = document.getElementById('create-topic');
  if (form.style.getPropertyValue('display') === 'none') {
    form.style.setProperty('display', 'block');
  } else {
    form.style.setProperty('display', 'none');
  }
}

function getTopicData() {
  return {
    name: document.querySelector("input[id='name']").value,
    description: document.querySelector("textarea[id='description']").value,
  };
}

function handleCreateTopic(categoryId) {
  const formData = getTopicData();
  _api
    .createTopic(
      formData.name,
      formData.description,
      Number.parseInt(categoryId),
    )
    .then((response) => {
      if (response.data.topicId !== null) {
        window.location.href = '/topics/' + response.data.topicId + '?page=1';
      } else {
        window.location.href = window.location.pathname + '?page=1';
      }
    });
}

function showEditTopic() {
  let form = document.getElementById('topic-form');
  if (form.style.getPropertyValue('display') === 'none') {
    form.style.setProperty('display', 'block');
  } else {
    form.style.setProperty('display', 'none');
  }
}

function handleEditTopic(topicId) {
  const formData = getTopicData();
  _api.editTopic(topicId, formData.name, formData.description).then(() => {
    window.location.reload();
  });
}

function showDeleteTopic() {
  let form = document.getElementById('danger-container');
  if (form.style.getPropertyValue('display') === 'none') {
    form.style.setProperty('display', 'block');
  } else {
    form.style.setProperty('display', 'none');
  }
}

function handleDeleteTopic(topicId) {
  const result = confirm('Вы уверены? Это действие не обратимо.');
  if (result) {
    _api.deleteTopic(topicId).then(() => {
      window.location.href = '/';
      alert('Топик удален.');
    });
  }
}
