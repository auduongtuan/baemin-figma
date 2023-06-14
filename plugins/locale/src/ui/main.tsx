import * as React from "react";
import { render } from "react-dom";
import { Tooltip } from "ds";
// import 'figma-plugin-ds/dist/figma-plugin-ds.css'
import "ds/ui.scss";
import "./ui.css";
import Locale from "./locale/LocaleMain";
import { Provider } from "react-redux";
import { store } from "./state/store";
const App = () => {
  return (
    <Provider store={store}>
      <Tooltip.Providier>
        <Locale />
      </Tooltip.Providier>
    </Provider>
  );
};

render(<App />, document.getElementById("root"));
