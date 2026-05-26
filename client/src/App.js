import { Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/Home';
import { SocketProvider } from "./providers/socket";

function App() {
  return (
    <div className="App">
      <Routes>
        <SocketProvider>
        <Route path="/" element={<HomePage />} />
        </SocketProvider>
      </Routes>
    </div>
  );
}

export default App;