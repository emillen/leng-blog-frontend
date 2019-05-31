import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "font-awesome/css/font-awesome.min.css";

import axios from "axios";
import { h, app } from "hyperapp";
import { location, Route, Link } from "@hyperapp/router";
import marked from "marked";

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
      .then(data => {
        console.log(data);
        actions.location.go(`/articles/${data._id}`);
      })
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
  <div oncreate={oncreate} id="article-list" class="list-group">
    {list &&
      list.map(item => (
        <Link
          to={`/articles/${item._id}`}
          class="list-group-item list-group-item-action"
          i
          onclick={() => onclick(item._id)}
        >
          {item.title}
        </Link>
      ))}
  </div>
);

const CreateArticle = ({ onsubmit }) => (
  <form id="create-article">
    <div class="form-group">
      <label for="create-article-title">Title</label>
      <input
        type="text"
        class="form-control"
        id="create-article-title"
        placeholder="Title"
      />
    </div>

    <div class="form-group">
      <label for="create-article-markdown">Text</label>
      <textarea class="form-control" id="create-article-markdown" rows="8" />
    </div>
    <div class="d-flex justify-content-between">
      <div />
      <div
        onclick={() => {
          const title = document.querySelector("#create-article-title").value;
          const markdown = document.querySelector("#create-article-markdown")
            .value;

          onsubmit({ title, markdown });
        }}
        type="submit"
        class="btn btn-primary"
      >
        Submit
      </div>
    </div>
  </form>
);
const dangerouslySetInnerHTML = html => element => (element.innerHTML = html);
const compile = ({ marked, source }) =>
  dangerouslySetInnerHTML(marked(source, { sanitize: true }));
const Article = ({ match, title, markdown, marked, oncreate }) => (
  <div
    onupdate={() => oncreate(match.params.id)}
    oncreate={() => oncreate(match.params.id)}
  >
    {title && markdown && (
      <div>
        <h1>{title}</h1>
        <div
          id="mark-down-viewer"
          onupdate={compile({ source: markdown, marked })}
          oncreate={compile({ source: markdown, marked })}
        >
          {markdown}
        </div>
      </div>
    )}
  </div>
);

const view = (state, actions) => (
  <div>
    <h1> Hello World</h1>
    <div class="container">
      <Route
        path="/articles/create"
        render={() => CreateArticle({ onsubmit: actions.createArticle })}
      />
      <Route
        path="/articles/:id"
        render={({ match }) =>
          Article({
            ...state.currentArticle,
            marked,
            match,
            oncreate: id => {
              console.log(id);
              actions.getArticle(id);
            }
          })
        }
      />
      <Route
        path="/articles"
        render={() =>
          ArticleList({
            oncreate: actions.getArticleList,
            onclick: id => {
              actions.location.go(`/articles/${id}`);
            },
            list: state.list
          })
        }
      />
    </div>
  </div>
);

const main = app(state, actions, view, document.body);
const unsubscribe = location.subscribe(main.location);
