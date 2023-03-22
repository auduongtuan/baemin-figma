import * as React from 'react'
import {render} from 'react-dom'
import { useState, useEffect } from 'react'
import * as Tooltip from "@radix-ui/react-tooltip";
// import 'figma-plugin-ds/dist/figma-plugin-ds.css'
import "./ui.scss";
import Locale from './locale/LocaleMain';
import { Provider } from 'react-redux'
import { store } from './state/store';
const App = () => {
  const [page, setPage] = useState<string>();

  useEffect(() => {
    window.onmessage = async (event) => {
      if(event.data.pluginMessage && event.data.pluginMessage.page) {
        setPage(event.data.pluginMessage.page);
      }
    }
  }, []);
  
  const ui = () => {
    switch(page) {
      case "locale":
        return <Locale />;
    
      default:
        return <p>Loading...</p>
    }
  }
  return (
    <Provider store={store}>
      <Tooltip.Provider>
        {ui()}
      </Tooltip.Provider>
    </Provider>
  );

}

render(<App />, document.getElementById('root'))