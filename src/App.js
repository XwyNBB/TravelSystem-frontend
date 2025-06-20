//app.js
import './App.css';
import AppRouter from './Routes';
import { AuthProvider } from './AuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <AppRouter />
      </div>
    </AuthProvider>
  );
}
export default App;