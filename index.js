import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "font-awesome/css/font-awesome.min.css";

import axios from "axios";
import { h, app } from "hyperapp";
import { location, Route } from "@hyperapp/router";

const state = {
  list: [],
  currentArticle: {},
  location: location.state
};

const actions = {
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
      .then(console.log)
      .catch(console.error),
  updateArticle: id => ({ title, markdown }) =>
    axios
      .put(`http://localhost:3000/articles/${id}`, { title, markdown })
      .then(response => response.data)
      .then(console.log())
      .catch(console.error),
  deleteArticle: id => (state, actions) =>
    axios
      .delete(`http://localhost:3000/articles/${id}`)
      .then(response => response.data)
      .then(console.log)
      .then(() =>
        actions.setState({
          ...state,
          list: state.list.filter(item => item._id !== id),
          currentArticle:
            state.currentArticle._id === id ? {} : state.currentArticle
        })
      )
      .catch(console.error),
  setState: state => state,
  location: location.actions
};

const ArticleList = ({ oncreate, list, onclick }) => (
  <div oncreate={oncreate} id="article-list">
    {list &&
      list.map(item => (
        <div onclick={() => onclick(item._id)}>{item.title}</div>
      ))}
  </div>
);

const view = (state, actions) => (
  <div>
    <h1> Hello World</h1>
    <Route
      to="/articles"
      render={() =>
        ArticleList({
          oncreate: actions.getArticleList,
          onclick: actions.getArticle,
          list: state.list
        })
      }
    />
  </div>
);

const main = app(state, actions, view, document.body);
const unsubscribe = location.subscribe(main.location);
