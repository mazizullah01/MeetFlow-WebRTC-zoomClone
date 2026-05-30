import { Routes, Route } from 'react-router-dom';
import './App.css';

import HomePage from './pages/Home';
import RoomPage from './pages/Room';
import { SocketProvider } from "./providers/socket";


function App() {
  return (
    <div className="App">
       <SocketProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/room/:roomId" element={<RoomPage />} />
      </Routes>
      </SocketProvider>

    </div>
  );
};

export default App;