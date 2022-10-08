import * as React from "react";
import * as ReactDOM from "react-dom";
import Confirmation from "./Confirmation";

const reactRoot = document.createElement("div"); // dummy wrapper container to init our react app
declare const namespace: any;
namespace.register("confirmation", {
  init: () => {
    ReactDOM.render(
      <React.StrictMode>
        <Confirmation />
      </React.StrictMode>,
      reactRoot
    );
  }
});
namespace.init("confirmation");
