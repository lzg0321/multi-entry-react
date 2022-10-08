import * as React from "react";
import * as ReactDOM from "react-dom";
import Offer from "./Offer";

const reactRoot = document.createElement("div"); // dummy wrapper container to init our react app
declare const namespace: any;
namespace.register("offer", {
  init: () => {
    ReactDOM.render(
      <React.StrictMode>
        <Offer />
      </React.StrictMode>,
      reactRoot
    );
  }
});
namespace.init("offer");
