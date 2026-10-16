import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { useAuthStore } from './store/authStore';
import { supabase } from './lib/supabase';

function Root() {
  const initialize = useAuthStore((s) => s.loading !== undefined ? s : null);
  const { initialize: initAuth, setAuth, _loadProfile } = useAuthStore();

  useEffect(() => {
    // 1. Check initial session on mount
    initAuth();

    // 2. Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await _loadProfile(session.user.id, session);
        } else if (event === 'SIGNED_OUT') {
          useAuthStore.setState({ user: null, role: null, session: null, loading: false });
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          useAuthStore.setState({ session });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
