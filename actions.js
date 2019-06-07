const createActions = ({ location, axios }) => {
  axios.defaults.headers.common["Authorization"] =
    "Bearer " + localStorage.getItem("auth-token");

  return {
    getArticleList: () => (state, actions) =>
      axios
        .get("http://localhost:3000/articles")
        .then(response => response.data)
        .then(list => actions.setState({ ...state, list }))
        .catch(
          err => console.error(err) && localStorage.setItem("auth-token", null)
        ),
    getArticle: id => (state, actions) =>
      axios
        .get(`http://localhost:3000/articles/${id}`)
        .then(response => response.data)
        .then(article =>
          actions.setState({ ...state, currentArticle: article })
        )
        .catch(
          err => console.error(err) && localStorage.setItem("auth-token", null)
        ),
    createArticle: ({ title, markdown }) => (state, actions) =>
      axios
        .post("http://localhost:3000/articles", { title, markdown })
        .then(response => response.data)
        .then(data => {
          console.log(data);
          actions.setState({ ...state, ...data });
          actions.location.go(`/articles/${data._id}`);
        })
        .then(console.log)
        .catch(
          err => console.error(err) && localStorage.setItem("auth-token", null)
        ),
    updateArticle: ({ id, title, markdown }) => (state, actions) => {
      return axios
        .put(`http://localhost:3000/articles/${id}`, { title, markdown })
        .then(response => response.data)
        .then(_ => {
          actions.setState({
            ...state,
            currentArticle: { _id: id, title, markdown }
          });
          actions.location.go(`/articles/${id}`);
        })
        .catch(
          err => console.error(err) && localStorage.setItem("auth-token", null)
        );
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
        .catch(
          err => console.error(err) && localStorage.setItem("auth-token", null)
        ),
    authenticate: ({ username, password }) => (_, actions) =>
      axios
        .post("http://localhost:3000/auth", { username, password })
        .then(response => response.data.token)
        .then(token => {
          axios.defaults.headers.common["Authorization"] = "Bearer " + token;
          return localStorage.setItem("auth-token", token);
        })
        .then(_ => actions.location.go("/articles"))
        .catch(
          err => console.error(err) && localStorage.setItem("auth-token", null)
        ),
    setState: state => state,
    location: location.actions
  };
};

export { createActions };
