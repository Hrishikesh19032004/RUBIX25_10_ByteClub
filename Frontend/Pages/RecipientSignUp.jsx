import React from 'react';
import { Link } from 'react-router-dom';

const RecipientSignUp = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: `url('https://source.unsplash.com/1600x900/?community,help')`,
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative bg-white p-8 rounded-lg shadow-lg w-full max-w-md transform transition duration-300 hover:shadow-2xl hover:scale-105">
        <h2 className="text-3xl font-bold text-center mb-6 text-green-700">Recipient Signup</h2>
        <form className="space-y-6">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700" htmlFor="name">
              Name
            </label>
            <div className="flex items-center border rounded-md">
              <span className="px-3 text-gray-500">
                <i className="fas fa-user"></i>
              </span>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your name"
                className="w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-r-md"
              />
            </div>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">
              Email
            </label>
            <div className="flex items-center border rounded-md">
              <span className="px-3 text-gray-500">
                <i className="fas fa-envelope"></i>
              </span>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-r-md"
              />
            </div>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700" htmlFor="password">
              Password
            </label>
            <div className="flex items-center border rounded-md">
              <span className="px-3 text-gray-500">
                <i className="fas fa-lock"></i>
              </span>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-r-md"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-md hover:opacity-90 transition duration-200 font-semibold"
          >
            Signup
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-300">
          Already have an account?{' '}
          <Link
            to="/Recipient/RecipientLogin"
            className="text-green-300 font-semibold hover:underline ml-1"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RecipientSignUp;
