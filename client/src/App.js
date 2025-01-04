
import './App.css';
import { BrowserRouter, Routes,Route   } from "react-router-dom";

import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
function App() {
  return (
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
    <BrowserRouter>
      <Routes>
          <Route path='/' element={<LoginPage/>}/>
          <Route path='/main' element={<MainPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
