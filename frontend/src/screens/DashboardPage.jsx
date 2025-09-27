import React, { useState, useMemo } from 'react';
import { ArrowUpIcon, TrashIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import config from '../constants.js';

const ArgumentForm = ({ onCreateArgument }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [champion, setChampion] = useState('Newton');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !content) return;
    onCreateArgument({ title, content, champion });
    setTitle('');
    setContent('');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Post a New Argument</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Argument Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
        <textarea
          placeholder="Explain your reasoning..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md h-28 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
        <div className="flex items-center space-x-6">
          <label className="font-semibold">Champion:</label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="radio" name="champion" value="Newton" checked={champion === 'Newton'} onChange={(e) => setChampion(e.target.value)} className="form-radio text-blue-600" />
              <span>Newton</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="radio" name="champion" value="Lagrange" checked={champion === 'Lagrange'} onChange={(e) => setChampion(e.target.value)} className="form-radio text-green-600" />
              <span>Lagrange</span>
            </label>
          </div>
        </div>
        <button type="submit" className="w-full sm:w-auto bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200">
          Submit Argument
        </button>
      </form>
    </div>
  );
};

const ArgumentCard = ({ argument, user, onUpvote, onDelete }) => (
  <div className="bg-white rounded-lg shadow-md p-5 flex flex-col justify-between h-full">
    <div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{argument.title}</h3>
      <p className="text-gray-600 mb-4 whitespace-pre-wrap">{argument.content}</p>
    </div>
    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
      <div className="flex items-center text-sm text-gray-500">
        <UserCircleIcon className="h-5 w-5 mr-1.5" />
        <span>{argument.author ? argument.author.name : 'Anonymous'}</span>
      </div>
      <div className="flex items-center space-x-3">
        {user && user.id === argument.author?.id && (
          <button onClick={() => onDelete(argument.id)} className="text-gray-400 hover:text-red-600 transition-colors">
            <TrashIcon className="h-5 w-5" />
          </button>
        )}
        <div className="flex items-center space-x-1.5">
          <span className="font-bold text-gray-700 text-lg">{argument.upvotes}</span>
          <button onClick={() => onUpvote(argument)} className="p-1.5 rounded-full bg-gray-200 hover:bg-blue-200 transition-colors">
            <ArrowUpIcon className="h-5 w-5 text-gray-600 hover:text-blue-600" />
          </button>
        </div>
      </div>
    </div>
  </div>
);

const DashboardPage = ({ user, arguments, onLogout, onCreateArgument, onUpvoteArgument, onDeleteArgument, error }) => {
  const newtonArgs = useMemo(() => arguments.filter(a => a.champion === 'Newton'), [arguments]);
  const lagrangeArgs = useMemo(() => arguments.filter(a => a.champion === 'Lagrange'), [arguments]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Calculus Clash</h1>
            <p className="text-gray-600">Welcome, {user.name}!</p>
          </div>
          <div className="flex items-center space-x-4">
            <a href={`${config.BACKEND_URL}/admin`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              Admin Panel
            </a>
            <button onClick={onLogout} className="bg-red-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && 
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        }
        <ArgumentForm onCreateArgument={onCreateArgument} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-4 border-blue-500 pb-2">Team Newton</h2>
            <div className="space-y-6">
              {newtonArgs.length > 0 ? (
                newtonArgs.map(arg => <ArgumentCard key={arg.id} argument={arg} user={user} onUpvote={onUpvoteArgument} onDelete={onDeleteArgument} />)
              ) : (
                <p className="text-gray-500 mt-4">No arguments for Newton yet. Be the first!</p>
              )}
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-4 border-green-500 pb-2">Team Lagrange</h2>
            <div className="space-y-6">
              {lagrangeArgs.length > 0 ? (
                lagrangeArgs.map(arg => <ArgumentCard key={arg.id} argument={arg} user={user} onUpvote={onUpvoteArgument} onDelete={onDeleteArgument} />)
              ) : (
                <p className="text-gray-500 mt-4">No arguments for Lagrange yet. Be the first!</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
