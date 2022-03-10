import Card from './components/Card';
import { SocketProvider } from './context/SocketContext';
import { symbols } from "./coins";

function App() {
  return (
    <SocketProvider>
      {symbols.map(sym => <Card symbol={sym} />)}
    </SocketProvider>
  );
}

export default App;
