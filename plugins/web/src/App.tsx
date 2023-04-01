import { useState } from 'react'

// import './App.css'
import "ds/ui.scss";
import {Button} from 'ds';
import * as ds from "ds";
function App() {
  const [count, setCount] = useState(0)
  console.log(ds);
  return (
    <div className="App">
      <Button variant="primary">Test s</Button>
    </div>
  )
}

export default App
