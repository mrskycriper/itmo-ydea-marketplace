class Api {
  #api = undefined;

  constructor() {
    this.#api = axios.create({
      baseURL: window.location.origin,
      withCredentials: true,
    });
    supertokens.addAxiosInterceptors(this.#api);
  }

  #createForm = (email, password) => ({
    formFields: [
      { id: 'email', value: email },
      { id: 'password', value: password },
    ],
  });

  signUp = (email, password) =>
    this.#api.post('/auth/signup', this.#createForm(email, password));

  signIn = (email, password) =>
    this.#api.post('/auth/signin', this.#createForm(email, password));

  signOut = () => this.#api.post('/auth/signout', {});

  checkUsername = (name) => this.#api.post('/checkName', { name: name });

  createUser = (name, id) => this.#api.post('/user', { name: name, id: id });

  updateRole = (name, isModerator, isAdmin) =>
    this.#api.put('/users/' + name + '/role', {
      isModerator: isModerator,
      isAdmin: isAdmin,
    });

  updateBio = (name, bio) =>
    this.#api.put('/users/' + name + '/bio', { bio: bio });

  deleteUser = (name) => this.#api.delete('/users/' + name);

  createChat = (name, description) =>
    this.#api.post('/chats', { name: name, description: description });

  postMessage = (message, chatId) =>
    this.#api.post('/chats/' + chatId, { content: message });

  editChat = (chatId, name, description) =>
    this.#api.put('/chats/' + chatId, { name: name, description: description });

  inviteUser = (chatId, userName) =>
    this.#api.post('/chats/' + chatId + '/invite/' + userName);

  unInviteUser = (chatId, userName) =>
    this.#api.delete('/chats/' + chatId + '/invite/' + userName);

  deleteChat = (chatId) => this.#api.delete('/chats/' + chatId);

  createCategory = (name, description) =>
    this.#api.post('/categories', { name: name, description: description });

  editCategory = (categoryId, name, description) =>
    this.#api.put('/categories/' + categoryId, {
      name: name,
      description: description,
    });

  deleteCategory = (categoryId) =>
    this.#api.delete('/categories/' + categoryId);

  createTopic = (name, description, categoryId) =>
    this.#api.post('/topics', {
      name: name,
      description: description,
      categoryId: categoryId,
    });

  editTopic = (topicId, name, description) =>
    this.#api.put('/topics/' + topicId, {
      name: name,
      description: description,
    });

  deleteTopic = (topicId) => this.#api.delete('/topics/' + topicId);

  createPost = (title, content, topicId, userId) =>
    this.#api.post('/posts', {
      title: title,
      content: content,
      topicId: topicId,
      userId: userId,
    });

  editPost = (postId, title, content) =>
    this.#api.put('/posts/' + postId, {
      title: title,
      content: content,
    });

  deletePost = (postId) => this.#api.delete('/posts/' + postId);

  createComment = (content, postId, userId) =>
    this.#api.post('/comments', {
      content: content,
      userId: userId,
      postId: postId,
    });

  deleteComment = (commentId) => this.#api.delete('/comments/' + commentId);
}

const _api = new Api();

function logOut() {
  _api.signOut().then(() => {
    window.location.href = '/';
  });
}
