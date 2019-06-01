import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "font-awesome/css/font-awesome.min.css";

import axios from "axios";
import { h, app } from "hyperapp";
import { location, Route, Link } from "@hyperapp/router";
import marked from "marked";

import { createActions } from "./actions";
const actions = createActions({ axios, location });

const state = {
  list: [],
  currentArticle: {},
  location: location.state
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

const CreateArticle = ({ oncreate, title, markdown, onsubmit }) => (
  <form id="create-article" oncreate={() => oncreate()}>
    <div class="form-group">
      <label for="create-article-title">Title</label>
      <input
        type="text"
        class="form-control"
        id="create-article-title"
        placeholder="Title"
        value={title}
      />
    </div>

    <div class="form-group">
      <label for="create-article-markdown">Text</label>
      <textarea
        class="form-control"
        id="create-article-markdown"
        rows="8"
        value={markdown}
      />
    </div>
    <div class="d-flex justify-content-between">
      <div />
      <div
        id="create-article-button"
        onclick={() => {
          const newTitle = document.querySelector("#create-article-title")
            .value;
          const newMarkdown = document.querySelector("#create-article-markdown")
            .value;

          onsubmit({ title: newTitle, markdown: newMarkdown });
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
const Article = ({
  match,
  title,
  markdown,
  marked,
  oncreate,
  ondelete,
  onedit
}) => (
  <div oncreate={() => oncreate(match.params.id)}>
    {title && markdown && (
      <div>
        <div class="d-flex justify-content-between">
          <h1>{title}</h1>
          <div>
            <button
              id="edit button"
              class="btn btn-sm btn-primary"
              type="submit"
              onclick={() => onedit(match.params.id)}
            >
              <i class="fa fa-pencil" /> Edit
            </button>{" "}
            <button
              class="btn btn-sm btn-danger"
              type="submit"
              onclick={() => ondelete(match.params.id)}
            >
              <i class="fa fa-trash" /> Delete
            </button>{" "}
          </div>
        </div>
        <div
          id="mark-down-viewer"
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
        render={() =>
          CreateArticle({
            onsubmit: actions.createArticle
          })
        }
      />
      <Route
        path="/articles/:id/edit"
        render={({ match }) => {
          return CreateArticle({
            ...state.currentArticle,
            oncreate: () => actions.getArticle(match.params.id),
            onsubmit: ({ title, markdown }) => {
              return actions.updateArticle({
                id: match.params.id,
                title,
                markdown
              });
            }
          });
        }}
      />
      <Route
        path="/articles/:id"
        render={({ match }) =>
          Article({
            ...state.currentArticle,
            marked,
            match,
            oncreate: id => {
              return actions.getArticle(id);
            },
            ondelete: id => {
              return actions.deleteArticle(id);
            },
            onedit: id => {
              return actions.location.go(`/articles/${id}/edit`);
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
