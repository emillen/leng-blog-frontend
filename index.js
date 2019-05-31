import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "font-awesome/css/font-awesome.min.css";

import axios from "axios";
import { h, app } from "hyperapp";
import { location, Route } from "@hyperapp/router";

const state = {
  list: [],
  location: location.state
};

const actions = {
  getArticleList: () => (state, actions) =>
    axios
      .get("http://localhost:3000/articles")
      .then(response => response.data)
      .then(list => actions.setState({ ...state, list }))
      .then(() => console.log(state))
      .catch(console.error),
  setState: state => state,
  location: location.actions
};

const ArticleList = ({ oncreate, list }) => (
  <div oncreate={oncreate} id="article-list">
    {list && list.map(item => <div>{item.title}</div>)}
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
          list: state.list
        })
      }
    />
  </div>
);

const main = app(state, actions, view, document.querySelector("#app"));
const unsubscribe = location.subscribe(main.location);
