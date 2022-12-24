import * as React from 'react'
import {render} from 'react-dom'
import { useState, useEffect } from 'react'
import * as Tooltip from "@radix-ui/react-tooltip";
// import 'figma-plugin-ds/dist/figma-plugin-ds.css'
import "./ui.scss";
import Locale from './Locale';
import { Provider } from 'react-redux'
import { store } from './state/store';
const App = () => {
  const [type, setType] = useState<string>();

  useEffect(() => {
    window.onmessage = async (event) => {
      if(event.data.pluginMessage && event.data.pluginMessage.type) {
        setType(event.data.pluginMessage.type);
      }
    }
  }, []);
  
  const ui = () => {
    switch(type) {
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