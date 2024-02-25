import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Home from"./Home"
import Products from './Products';
import { Page404 } from './components/NotFound';

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/products' element={<Products/>} />
          <Route path='/*' element={<Page404/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
