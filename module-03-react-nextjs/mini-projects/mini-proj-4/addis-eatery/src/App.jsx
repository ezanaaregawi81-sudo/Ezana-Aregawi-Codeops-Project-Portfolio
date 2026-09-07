import Header from './components/Header';
import Menu from './components/Menu';
import { CartProvider } from './components/CartProvider';
import './App.css';

function App() {
  return (
    <CartProvider>
      <div>
        <Header />
        <Menu />
      </div>
    </CartProvider>
  );
}

export default App;
