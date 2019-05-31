const createActions = axios => ({
  getArticleList: () => (state, actions) =>
    axios
      .get("http://localhost:3000/articles")
      .then(response => response.data)
      .then(list => actions.setState({ ...state, list }))
      .catch(console.error),
  getArticle: id => (state, actions) =>
    axios
      .get(`http://localhost:3000/articles/${id}`)
      .then(response => response.data)
      .then(article => actions.setState({ ...state, currentArticle: article }))
      .catch(console.error),
  createArticle: ({ title, markdown }) =>
    axios
      .post("http://localhost:3000/articles", { title, markdown })
      .then(response => response.data)
      .then(data => {
        console.log(data);
        actions.location.go(`/articles/${data._id}`);
      })
      .then(console.log)
      .catch(console.error),
  updateArticle: id => ({ title, markdown }) => {
    return axios
      .put(`http://localhost:3000/articles/${id}`, { title, markdown })
      .then(response => response.data)
      .then(console.log())
      .catch(console.error);
  },
  deleteArticle: id => (state, actions) =>
    axios
      .delete(`http://localhost:3000/articles/${id}`)
      .then(response => response.data)
      .then(console.log)
      .then(() => {
        actions.setState({
          ...state,
          list: state.list.filter(item => item._id !== id),
          currentArticle:
            state.currentArticle._id === id ? {} : state.currentArticle
        });
        actions.location.go("/articles");
      })
      .catch(console.error),
  setState: state => state,
  location: location.actions
});

export default { createActions };
