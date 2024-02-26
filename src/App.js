import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Home from"./Home"
import Books from './Books';
import { Page404 } from './components/NotFound';
import RogIn from "./components/RogIn";


function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path='/' element={<RogIn />} />
          <Route path='/home' element={<Home />} />
          <Route path='/books' element={<Books/>} />
          <Route path='/*' element={<Page404/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
