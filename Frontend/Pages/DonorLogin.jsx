import React from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';

const DonorLogin = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: `url('https://source.unsplash.com/1600x900/?donor,login')`,
      }}
    >
      {/* Overlay for background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black bg-opacity-50"></div>
      <div className="relative bg-white p-8 rounded-xl shadow-lg w-full max-w-md transform transition duration-300 hover:scale-105 hover:shadow-2xl">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-green-700 tracking-tight">
          Donor Login
        </h2>
        <form className="space-y-6">
          {/* Email Field */}
          <div className="relative">
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="email"
            >
              Email Address
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500">
              <FaEnvelope className="text-gray-500 mr-2" />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                className="w-full bg-transparent py-1 text-sm border-none placeholder-gray-400 focus:outline-none focus:ring-0"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="relative">
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="password"
            >
              Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500">
              <FaLock className="text-gray-500 mr-2" />
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                className="w-full bg-transparent py-1 text-sm border-none placeholder-gray-400 focus:outline-none focus:ring-0"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-6 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 focus:ring-offset-gray-100 transition duration-200"
          >
            Login
          </button>
        </form>

        {/* Redirect to Sign Up */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link
            to="/Donor/DonorSignUp"
            className="text-green-600 hover:text-green-800 font-medium transition duration-200"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default DonorLogin;
