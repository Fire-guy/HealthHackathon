import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import MainPage from './Pages/MainPage';
import { APIProvider } from './Components/context';

function App() {
  return (
    <div className="App">
      <APIProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<MainPage />} />
          </Routes>
        </BrowserRouter>
      </APIProvider>
    </div>
  );
}

export default App;
