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
import Sample from './sample';
import Matrix from './components/matrix';
import Sample2 from './sample2';
import MatrixEffect from './components/matrix2';
import Sample3 from './sample3';
import Man from './man';
import Female from './female';
import TwoD from './2dhuman';


function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path='/' element={<RogIn />} />
          <Route path='/home' element={<Home />} />
          <Route path='/books' element={<Books/>} />
          <Route path='/*' element={<Page404/>} />
          <Route path='/sample' element={<Sample />} />
          <Route path='/matrix' element={<Matrix />} />
          <Route path='/sample2' element={<Sample2 />} />
          <Route path='/matrix2' element={<MatrixEffect />} />
          <Route path='/sample3' element={<Sample3 />} />
          <Route path='/man' element={<Man />} />
          <Route path='/female' element={<Female />} />
          <Route path='/2dhuman' element={<TwoD />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
