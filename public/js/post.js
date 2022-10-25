function showCreatePost() {
  let form = document.getElementById('create-post');
  if (form.style.getPropertyValue('display') === 'none') {
    form.style.setProperty('display', 'block');
  } else {
    form.style.setProperty('display', 'none');
  }
}

function getPostData() {
  return {
    title: document.querySelector("input[id='title']").value,
    content: document.querySelector("textarea[id='content']").value,
  };
}

async function handleCreatePost(topicId) {
  const formData = getPostData();
  let userId = null;
  try {
    userId = await supertokens.getUserId();
  } catch (e) {}
  if (userId) {
    _api
      .createPost(
        formData.title,
        formData.content,
        Number.parseInt(topicId),
        userId,
      )
      .then((response) => {
        if (response.data.postId !== null) {
          window.location.href = '/posts/' + response.data.postId + '?page=1';
        } else {
          window.location.href = window.location.pathname + '?page=1';
        }
      });
  }
}

function showCreateComment() {
  let form = document.getElementById('create-comment');
  if (form.style.getPropertyValue('display') === 'none') {
    form.style.setProperty('display', 'block');
  } else {
    form.style.setProperty('display', 'none');
  }
}

function getCommentData() {
  return {
    content: document.querySelector("textarea[id='content']").value,
  };
}

async function handleCreateComment(postId) {
  const formData = getCommentData();
  let userId = null;
  try {
    userId = await supertokens.getUserId();
  } catch (e) {}
  if (userId) {
    _api
      .createComment(formData.content, Number.parseInt(postId), userId)
      .then(() => {
        window.location.href = '/posts/' + postId + '?page=1';
      });
  }
}

function showEditPost() {
  let form = document.getElementById('post-form');
  if (form.style.getPropertyValue('display') === 'none') {
    form.style.setProperty('display', 'block');
  } else {
    form.style.setProperty('display', 'none');
  }
}

function showDeletePost() {
  let form = document.getElementById('danger-container');
  if (form.style.getPropertyValue('display') === 'none') {
    form.style.setProperty('display', 'block');
  } else {
    form.style.setProperty('display', 'none');
  }
}

function handleEditPost(postId) {
  const formData = getPostData();
  _api
    .editPost(Number.parseInt(postId), formData.title, formData.content)
    .then(() => {
      window.location.reload();
    });
}

function handleDeletePost(postId) {
  const result = confirm('Вы уверены? Это действие не обратимо.');
  if (result) {
    _api.deletePost(postId).then(() => {
      window.location.href = '/';
      alert('Пост удален.');
    });
  }
}
