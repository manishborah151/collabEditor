import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const navigate = useNavigate();

  const createRoom = () => {
    const id = uuidv4();
    navigate(`/room/${id}`);
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Realtime Doc Editor</h1>
      <button onClick={createRoom} style={{ padding: '1rem 2rem' }}>
        Create Room
      </button>
    </div>
  );
}

export default App;
