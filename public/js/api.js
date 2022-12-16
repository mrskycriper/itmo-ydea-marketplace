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

  updateRole = (id, is_moderator, is_admin, is_support, is_seller) =>
    this.#api.put('/users/' + id + '/role', {
      is_moderator: is_moderator,
      is_admin: is_admin,
      is_support: is_support,
      is_seller: is_seller,
    });

  //updateBio = (name, bio) =>
  //  this.#api.put('/users/' + name + '/bio', { bio: bio });

  deleteUser = (id) => this.#api.delete('/users/' + id);

  editUser = (name, id) => this.#api.put('/users/' + id, { name: name });

  createChat = (name, description) =>
    this.#api.post('/chats', { name: name, description: description });

  postMessage = (message, chatId) =>
    this.#api.post('/chats/' + chatId, { content: message });

  editChat = (chat_id, name, description) =>
    this.#api.put('/chats/' + chat_id, {
      name: name,
      description: description,
    });

  inviteUser = (chat_id, user_id) =>
    this.#api.post('/chats/' + chat_id + '/invite/' + user_id);

  unInviteUser = (chat_id, user_id) =>
    this.#api.delete('/chats/' + chat_id + '/invite/' + user_id);

  deleteChat = (chat_id) => this.#api.delete('/chats/' + chat_id);

  createCategory = (name, description) =>
    this.#api.post('/categories', { name: name, description: description });

  editCategory = (category_id, name, description) =>
    this.#api.put('/categories/' + category_id, {
      name: name,
      description: description,
    });

  deleteCategory = (category_id) =>
    this.#api.delete('/categories/' + category_id);

  createTopic = (name, description, category_id) =>
    this.#api.post('/topics', {
      name: name,
      description: description,
      category_id: category_id,
    });

  editTopic = (topic_id, name, description) =>
    this.#api.put('/topics/' + topic_id, {
      name: name,
      description: description,
    });

  deleteTopic = (topic_id) => this.#api.delete('/topics/' + topic_id);

  createPost = (title, content, topic_id, user_id) =>
    this.#api.post('/posts', {
      title: title,
      content: content,
      topic_id: topic_id,
      user_id: user_id,
    });

  editPost = (post_id, title, content) =>
    this.#api.put('/posts/' + post_id, {
      title: title,
      content: content,
    });

  deletePost = (post_id) => this.#api.delete('/posts/' + post_id);

  createComment = (content, post_id, user_id) =>
    this.#api.post('/comments', {
      content: content,
      user_id: user_id,
      post_id: post_id,
    });

  deleteComment = (comment_id) => this.#api.delete('/comments/' + comment_id);

  createOrder = (start_timestamp, user_id) =>
    this.#api.post('/orders', {
      start_timestamp: start_timestamp,
      user_id: user_id,
    });

  createProductsInOrder = (number, product_id, order_id) =>
    this.#api.post('/productsInOrder', {
      number: number,
      product_id: product_id,
      order_id: order_id,
    });

  deleteProductsInOrder = (productsInOrderId) =>
    this.#api.delete('/productsInOrder/' + productsInOrderId);

  getShoppingCart = () => this.#api.get('/cart');
  getShoppingCartId = () => this.#api.get('/cartId');

  getOrders = () => this.#api.get('/orders');

  getOrder = (orderId) => this.#api.get('/orders/' + orderId);

  getTimeslots = () => this.#api.get('/timeslots');

  setTimeslots = (order_id, timeslot_start, timeslot_end) =>
    this.#api.patch('/order/' + order_id + '/timeslot', {
      timeslot_start: timeslot_start,
      timeslot_end: timeslot_end,
    });

  setAddress = (orderId, address) =>
    this.#api.patch('/order/' + orderId + '/address', {
      address: address,
    });

  editProductsInOrder = (productsInOrderId, number) =>
    this.#api.patch('/productsInOrder/' + productsInOrderId, {
      number: number,
    });

  bookOrder = (order_id) => this.#api.patch('/order/' + order_id + '/book');
  unbookOrder = (order_id) => this.#api.patch('/order/' + order_id + '/unbook');
  discardOrder = (order_id) =>
    this.#api.patch('/order/' + order_id + '/discard');
  payForOrder = (order_id) => this.#api.patch('/order/' + order_id + '/pay');
  refundOrder = (order_id) => this.#api.patch('/order/' + order_id + '/refund');
  completeOrder = (order_id) =>
    this.#api.patch('/order/' + order_id + '/complete');

  createProduct = (name, description, category_id, price, number, seller_id) =>
    this.#api.post('/products', {
      name: name,
      number: number,
      price: price,
      seller_id: seller_id,
      category_id: category_id,
      description: description,
    });

  deleteProduct = (product_id) => this.#api.delete('/products/' + product_id);

  getProduct = (productId) => this.#api.get('/product/' + productId);

  createReview = (text, rating, user_id, product_id) =>
    this.#api.post('/reviews', {
      text: text,
      rating: rating,
      user_id: user_id,
      product_id: product_id,
    });

  deleteReview = (review_id) => this.#api.delete('/reviews/' + review_id);
  getReview = (review_id) => this.#api.get('/reviews/' + review_id);

  createPhoto = (photo_url, product_id) =>
    this.#api.post('/photos', {
      photo_url: photo_url,
      product_id: product_id,
    });
  deletePhoto = (photo_id) => this.#api.delete('/photos/' + photo_id);
  getPhoto = (photo_id) => this.#api.get('/photos/' + photo_id);

  editProduct = (name, description, price, number, category_id, productId) =>
    this.#api.patch('/products/' + productId, {
      name: name,
      description: description,
      price: price,
      number: number,
      category_id: category_id,
    });

  createProductCategory = (category) =>
    this.#api.post('/productcategories', {
      category: category,
    });

  deleteProductCategory = (category_id) =>
    this.#api.delete('/productcategories/' + category_id);
  getProductCategory = (category_id) =>
    this.#api.get('/productcategories/' + category_id);
  getProductCategories = () => this.#api.get('/productcategories/');
  getCatalogue = () => this.#api.get('/products');

  createSeller = (description, user_id) =>
    this.#api.post('/sellers', {
      description: description,
      user_id: user_id,
    });

  deleteSeller = (seller_id) => this.#api.delete('/sellers/' + seller_id);
  getSeller = (seller_id) => this.#api.get('/sellers/' + seller_id);

  editSeller = (description, seller_id) =>
    this.#api.patch('/sellers/' + seller_id, {
      description: description,
    });

  getSellers = () => this.#api.get('/sellers/');
}

const _api = new Api();

function logOut() {
  _api.signOut().then(() => {
    window.location.href = '/';
  });
}
