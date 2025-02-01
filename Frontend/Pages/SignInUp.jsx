import React from 'react';
import '../Styles/SignUpIn.css';
import { Link } from 'react-router-dom';

const SignUpIn = () => {
  return (
    <>
      <div className="relative min-h-screen flex items-center justify-center bg-gray-100 overflow-hidden">
        {/* Abstract Green and Black Lines */}
        <div className="abstract-lines">
          <div className="line green-line"></div>
          <div className="line black-line"></div>
          <div className="line green-line diagonal"></div>
          <div className="line black-line diagonal"></div>
        </div>

        {/* Content */}
        <div className="contain flex items-center justify-center space-x-8 relative z-10">
          <div className="container bg-white p-8 rounded-lg shadow-lg max-w-lg text-center">
            <h1 className="text-3xl font-bold text-green-700 mb-4">Recipient Portal</h1>
            <h2 className="text-2xl text-gray-700 mb-4">Empower Your Institute & Collaborate for Change</h2>
            <p className="text-gray-600 text-lg mb-6">
              Join our mission to create meaningful change. Log in to gain access to exclusive resources, manage
              initiatives, and connect with a global network of changemakers dedicated to building a more sustainable
              future.
            </p>
            <Link to={'/Recipient/RecipientSignUp'}>
              <button className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition duration-200 text-lg">
                Sign Up & Assign Roles
              </button>
            </Link>
            <p className="mt-4 text-gray-600">
              Already have an account?{' '}
              <Link to={'/Recipient/RecipientLogin'} className="text-green-600 hover:underline font-medium">
                Login & Manage
              </Link>
            </p>
          </div>

          <div className="container bg-white p-8 rounded-lg shadow-lg max-w-lg text-center">
            <h1 className="text-3xl font-bold text-green-700 mb-4">Donor Portal</h1>
            <h2 className="text-2xl text-gray-700 mb-4">Volunteer with Us & Make a Difference</h2>
            <p className="text-gray-600 text-lg mb-6">
              Over 1 million volunteers have come together to change lives. By joining us, you will be part of a vibrant
              community dedicated to addressing societal challenges. Participate, complete tasks, and be a changemaker in
              your own right.
            </p>
            <Link to={'/Donor/DonorSignUp'}>
              <button className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition duration-200 text-lg">
                Sign Up & Get Involved
              </button>
            </Link>
            <p className="mt-4 text-gray-600">
              Already have an account?{' '}
              <Link to={'/Donor/DonorLogin'} className="text-green-600 hover:underline font-medium">
                Login & Assign
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUpIn;
