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

  editChat = (chatId, name, description) =>
    this.#api.put('/chats/' + chatId, { name: name, description: description });

  inviteUser = (chatId, userId) =>
    this.#api.post('/chats/' + chatId + '/invite/' + userId);

  unInviteUser = (chatId, userId) =>
    this.#api.delete('/chats/' + chatId + '/invite/' + userId);

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

  getOrder = (orderId) => this.#api.get('/orders' + orderId);

  getTimeslots = () => this.#api.get('/timeslots');

  setTimeslots = (orderId, timeslot_start, timeslot_end) =>
    this.#api.patch('order/' + orderId + '/timeslot', {
      timeslot_start: timeslot_start,
      timeslot_end: timeslot_end,
    });

  setAddress = (orderId, address) =>
    this.#api.patch('order/' + orderId + '/address', {
      address: address,
    });

  editProductsInOrder = (productsInOrderId, number) =>
    this.#api.patch('/productsInOrder/' + productsInOrderId, {
      number: number,
    });

  bookOrder = (orderId) => this.#api.patch('order/' + orderId + '/book');
  unbookOrder = (orderId) => this.#api.patch('order/' + orderId + '/unbook');
  payForOrder = (orderId) => this.#api.patch('order/' + orderId + '/pay');
  refundOrder = (orderId) => this.#api.patch('order/' + orderId + '/refund');
  completeOrder = (orderId) =>
    this.#api.patch('order/' + orderId + '/complete');

  createProduct = (name, price, number, seller_id) =>
    this.#api.post('/products', {
      name: name,
      number: number,
      price: price,
      seller_id: seller_id,
    });

  deleteProduct = (productId) => this.#api.delete('/products/' + productId);

  getProduct = (productId) => this.#api.get('/product/' + productId);

  createReview = (text, rating, user_id, product_id) =>
    this.#api.post('/reviews', {
      text: text,
      rating: rating,
      user_id: user_id,
      product_id: product_id,
    });

  deleteReview = (reviewId) => this.#api.delete('/reviews/' + reviewId);
  getReview = (reviewId) => this.#api.get('/reviews/' + reviewId);

  createPhoto = (photo_url, product_id) =>
    this.#api.post('/photos', {
      photo_url: photo_url,
      product_id: product_id,
    });
  deletePhoto = (photoId) => this.#api.delete('/photos/' + photoId);
  getPhoto = (photoId) => this.#api.get('/photos/' + photoId);

  editProduct = (name, description, price, number, category_id, productId) =>
    this.#api.patch('products/' + productId, {
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

  deleteProductCategory = (categoryId) =>
    this.#api.delete('/productcategories/' + categoryId);
  getProductCategory = (categoryId) =>
    this.#api.get('/productcategories/' + categoryId);
  getProductCategories = () => this.#api.get('/productcategories/');
  getCatalogue = () => this.#api.get('/products');

  createSeller = (description, user_id) =>
    this.#api.post('/sellers', {
      description: description,
      user_id: user_id,
    });

  deleteSeller = (sellerId) => this.#api.delete('/sellers/' + sellerId);
  getSeller = (sellerId) => this.#api.get('/sellers/' + sellerId);

  editSeller = (description, sellerId) =>
    this.#api.patch('sellers/' + sellerId, {
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
