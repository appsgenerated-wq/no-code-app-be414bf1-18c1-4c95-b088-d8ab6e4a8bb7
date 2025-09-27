import React, { useState, useEffect } from 'react';
import Manifest from '@mnfst/sdk';
import LandingPage from './screens/LandingPage';
import DashboardPage from './screens/DashboardPage';
import './index.css';
import { testBackendConnection, createManifestWithLogging } from './services/apiService.js';

function App() {
  const [user, setUser] = useState(null);
  const [backendConnected, setBackendConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Testing...');
  const [arguments, setArguments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const manifest = createManifestWithLogging('be414bf1-18c1-4c95-b088-d8ab6e4a8bb7');

  useEffect(() => {
    const checkUserSession = async () => {
      setIsLoading(true);
      try {
        const currentUser = await manifest.from('User').me();
        setUser(currentUser);
        await loadArguments();
      } catch (e) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkUserSession();
  }, [])

  useEffect(() => {
    // Enhanced backend connection test with detailed logging
    const testConnection = async () => {
      console.log('🚀 [APP] Starting enhanced backend connection test...');
      console.log('🔍 [APP] Backend URL:', 'https://no-code-app-be414bf1-18c1-4c95-b088-d8ab6e4a8bb7-generated-apps-234234-234.us-central1.run.app');
      console.log('🔍 [APP] App ID:', 'be414bf1-18c1-4c95-b088-d8ab6e4a8bb7');

      setConnectionStatus('Testing connection...');

      const result = await testBackendConnection(3);
      setBackendConnected(result.success);

      if (result.success) {
        console.log('✅ [APP] Backend connection successful - proceeding with app initialization');
        setConnectionStatus('Connected');

        // Test Manifest SDK connection
        console.log('🔍 [APP] Testing Manifest SDK connection...');
        try {
          const manifest = createManifestWithLogging('be414bf1-18c1-4c95-b088-d8ab6e4a8bb7');
          console.log('✅ [APP] Manifest SDK initialized successfully');
        } catch (error) {
          console.error('❌ [APP] Manifest SDK initialization failed:', error);
          setConnectionStatus('SDK Error');
        }
      } else {
        console.error('❌ [APP] Backend connection failed - app may not work properly');
        console.error('❌ [APP] Connection error:', result.error);
        setConnectionStatus('Connection Failed');
      }
    };

    testConnection();
  }, []);;

  const handleAuth = async (authPromise) => {
    setError(null);
    setIsLoading(true);
    try {
      await authPromise;
      const currentUser = await manifest.from('User').me();
      setUser(currentUser);
      await loadArguments();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = (email, password) => handleAuth(manifest.login(email, password));

  const signup = (name, email, password) => handleAuth(manifest.from('User').signup({ name, email, password }));

  const logout = async () => {
    await manifest.logout();
    setUser(null);
    setArguments([]);
  };

  const loadArguments = async () => {
    try {
      const response = await manifest.from('Argument').find({
        include: ['author'],
        sort: { upvotes: 'desc' },
      });
      setArguments(response.data);
    } catch (err) {
      setError('Failed to load arguments.');
    }
  };

  const createArgument = async (argumentData) => {
    try {
      const newArgument = await manifest.from('Argument').create(argumentData);
      // Refetch to get the new argument with author included
      await loadArguments();
    } catch (err) {
      setError('Failed to create argument.');
    }
  };

  const upvoteArgument = async (argument) => {
    try {
      const updatedArgument = await manifest.from('Argument').update(argument.id, {
        upvotes: argument.upvotes + 1,
      });
      setArguments(args => 
        args.map(arg => (arg.id === updatedArgument.id ? { ...arg, ...updatedArgument } : arg))
      );
    } catch (err) {
      setError('Failed to upvote.');
    }
  };

  const deleteArgument = async (id) => {
    try {
      await manifest.from('Argument').delete(id);
      setArguments(args => args.filter(arg => arg.id !== id));
    } catch (err) {
      setError('Failed to delete argument.');
    }
  };

  if (isLoading && !user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      {/* Enhanced Backend Connection Status Indicator */}
      <div className="fixed top-4 right-4 z-50">
        <div className={`px-3 py-2 rounded-lg text-xs font-medium shadow-lg ${backendConnected ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${backendConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span>{backendConnected ? '✅ Backend Connected' : '❌ Backend Disconnected'}</span>
          </div>
          <div className="text-xs opacity-75 mt-1">{connectionStatus}</div>
        </div>
      </div>
      
        <p className="text-white text-xl">Loading Calculus Clash...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {user ? (
        <DashboardPage
          user={user}
          arguments={arguments}
          onLogout={logout}
          onCreateArgument={createArgument}
          onUpvoteArgument={upvoteArgument}
          onDeleteArgument={deleteArgument}
          error={error}
        />
      ) : (
        <LandingPage onLogin={login} onSignup={signup} error={error} isLoading={isLoading} />
      )}
    </div>
  );
}

export default App;
