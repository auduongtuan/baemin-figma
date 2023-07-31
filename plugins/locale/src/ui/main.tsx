import { render } from "react-dom";
import { Tooltip } from "ds";
// import 'figma-plugin-ds/dist/figma-plugin-ds.css'
import "ds/ui.css";
import "./ui.css";
import { Provider } from "react-redux";
import { store } from "./state/store";
import App from "./App";

const Main = () => {
  return (
    <Provider store={store}>
      <Tooltip.Providier>
        <App />
      </Tooltip.Providier>
    </Provider>
  );
};

render(<Main />, document.getElementById("root"));
