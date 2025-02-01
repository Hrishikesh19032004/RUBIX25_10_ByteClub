import React from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';

const RecipientLogin = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: `url('https://source.unsplash.com/1600x900/?community,login')`,
      }}
    >
      {/* Overlay for background */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative bg-white p-8 rounded-lg shadow-lg w-full max-w-md transform transition duration-300 hover:shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-green-700">
          Recipient Login
        </h2>
        <form className="space-y-5">
          <div className="relative">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="email"
            >
              Email Address
            </label>
            <div className="flex items-center border rounded-md px-3 focus-within:ring-2 focus-within:ring-green-500">
              <FaEnvelope className="text-gray-500 mr-3" />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                className="w-full py-2 border-none focus:outline-none focus:ring-0"
              />
            </div>
          </div>
          <div className="relative">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="password"
            >
              Password
            </label>
            <div className="flex items-center border rounded-md px-3 focus-within:ring-2 focus-within:ring-green-500">
              <FaLock className="text-gray-500 mr-3" />
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                className="w-full py-2 border-none focus:outline-none focus:ring-0"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition duration-200"
          >
            Login
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link
            to="/Recipient/RecipientSignUp"
            className="text-green-600 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RecipientLogin;
