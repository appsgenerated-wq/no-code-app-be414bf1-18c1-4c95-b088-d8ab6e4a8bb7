import React, { useState } from 'react';

const LandingPage = ({ onLogin, onSignup, error, isLoading }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoginView) {
      onLogin(email, password);
    } else {
      onSignup(name, email, password);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">Calculus Clash</h1>
        <p className="text-lg md:text-xl text-gray-400 mb-8">Debate the titans of mathematics. Who reigns supreme: Newton or Lagrange?</p>
      </div>

      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-2xl mt-8">
        <div className="flex border-b border-gray-700 mb-6">
          <button 
            onClick={() => setIsLoginView(true)}
            className={`w-1/2 py-3 text-lg font-semibold transition-colors duration-200 ${isLoginView ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-500'}`}>
            Login
          </button>
          <button 
            onClick={() => setIsLoginView(false)}
            className={`w-1/2 py-3 text-lg font-semibold transition-colors duration-200 ${!isLoginView ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-500'}`}>
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLoginView && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-400">Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-400">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-400">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800 disabled:bg-blue-800 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing...' : (isLoginView ? 'Log In' : 'Create Account')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LandingPage;
