import { Tooltip } from "ds";
// import 'figma-plugin-ds/dist/figma-plugin-ds.css'
import "ds/ui.css";
import "./ui.css";
import LocaleMain from "./locale/LocaleMain";
import { Provider } from "react-redux";
import { store } from "./state/store";
import DevMain from "./dev/DevMain";
import {
  useSetIsDevMode,
  useSetLocaleData,
  useUpdateLocaleSelection,
} from "./hooks/init";
import { useAppSelector } from "./hooks/redux";
const App = () => {
  useSetIsDevMode();
  useSetLocaleData();
  useUpdateLocaleSelection();
  const isDevMode = useAppSelector((state) => state.localeApp.isDevMode);
  return (
    <Provider store={store}>
      <Tooltip.Providier>
        {isDevMode === true && <DevMain />}
        {isDevMode === false && <LocaleMain />}
      </Tooltip.Providier>
    </Provider>
  );
};
export default App;
