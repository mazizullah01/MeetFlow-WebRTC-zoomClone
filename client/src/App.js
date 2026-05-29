import { Routes, Route } from 'react-router-dom';
import './App.css';

import HomePage from './pages/Home';
import { SocketProvider } from "./providers/socket";


function App() {
  return (
    <div className="App">
       <SocketProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
      </SocketProvider>

    </div>
  );
};

export default App;