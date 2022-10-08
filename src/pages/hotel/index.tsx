import * as React from "react";
import * as ReactDOM from "react-dom";
import Hotel from "./Hotel";

const reactRoot = document.createElement("div"); // dummy wrapper container to init our react app
declare const namespace: any;
namespace.register("hotel", {
  init: () => {
    ReactDOM.render(
      <React.StrictMode>
        <Hotel />
      </React.StrictMode>,
      reactRoot
    );
  }
});
namespace.init("hotel");
