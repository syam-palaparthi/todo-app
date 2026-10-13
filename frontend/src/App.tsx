import { useState } from 'react';
import { useAuth, AuthProvider } from './context/AuthContext';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { TodoApp } from './components/TodoApp';

function MainApp() {
  const { token } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  if (token) {
    return <TodoApp />;
  }

  return authView === 'login' ? (
    <Login switchToRegister={() => setAuthView('register')} />
  ) : (
    <Register switchToLogin={() => setAuthView('login')} />
  );
}

export function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;