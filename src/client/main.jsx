import React from "react";
import ReactDOM from "react-dom/client";

import "./index.less";

import { Provider } from "react-redux";
import store from "./store";

import AuthForm from "./features/auth/AuthForm";
import Root from "./layout/Root.jsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Review from "./features/reviews/ListReviews.jsx";
import Home from "./features/home/MyHome.jsx";
import SingleItem from "./features/item/ItemDetails.jsx";
import CreateItem from "./features/item/CreateItem.jsx";
import Reviews from "./features/reviews/ListReviews.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <AuthForm /> },
      { path: "/review", element: <Review /> },
      { path: "/items/:id", element: <SingleItem /> },
      { path: "/create/items", element: <CreateItem /> },
      { path: "/reviews", element: <Reviews /> }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
