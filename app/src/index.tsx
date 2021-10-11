import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import "./bootstrap.min.css";
import { BrowserRouter } from 'react-router-dom';
import { ReactRouterGlobalHistory } from 'react-router-global-history';

ReactDOM.render(
  <BrowserRouter>
    <div>
      <ReactRouterGlobalHistory />
      <App />
    </div>
  </BrowserRouter>,
  document.getElementById("root")
);
