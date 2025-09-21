import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import RoutesManager from "./RoutesManager";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Auth0Provider
    domain="dev-w4dc0a5tuadmi6ac.us.auth0.com"
    clientId="aeQtLpsc80kgoSrh6PnZF7NZI6CWypwQ"
    authorizationParams={{ redirect_uri: window.location.origin }}
  >
    <BrowserRouter>
      <RoutesManager />
    </BrowserRouter>
  </Auth0Provider>
);
