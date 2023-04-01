import * as React from 'react'
import {render} from 'react-dom'
import { useState, useEffect } from 'react'
import {Tooltip} from "ds";
// import 'figma-plugin-ds/dist/figma-plugin-ds.css'
import "ds/ui.scss";
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
  
  return (
    <Provider store={store}>
      <Tooltip.Providier>
        {page == 'locale' ? <Locale /> : <p>Loading...</p>}
      </Tooltip.Providier>
    </Provider>
  );

}

render(<App />, document.getElementById('root'))