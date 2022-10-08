import * as React from "react";
import * as ReactDOM from "react-dom";
import Checkout from "./Checkout";

const reactRoot = document.createElement("div"); // dummy wrapper container to init our react app
declare const namespace: any;
namespace.register("checkout", {
  init: () => {
    ReactDOM.render(
      <React.StrictMode>
        <Checkout />
      </React.StrictMode>,
      reactRoot
    );
  },
});
namespace.init("checkout");
