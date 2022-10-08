import * as React from "react";
import * as ReactDOM from "react-dom";
import Region from "./Region";

const reactRoot = document.createElement("div"); // dummy wrapper container to init our react app
declare const namespace: any;
namespace.register("region", {
  init: () => {
    ReactDOM.render(
      <React.StrictMode>
        <Region />
      </React.StrictMode>,
      reactRoot
    );
  }
});
namespace.init("region");
