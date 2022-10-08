import * as React from "react";
import * as ReactDOM from "react-dom";
import Landing from "./Landing";

const reactRoot = document.createElement("div"); // dummy wrapper container to init our react app
declare const namespace: any;
namespace.register("landing", {
  init: () => {
    ReactDOM.render(
      <React.StrictMode>
        <Landing />
      </React.StrictMode>,
      reactRoot
    );
  }
});
namespace.init("landing");
