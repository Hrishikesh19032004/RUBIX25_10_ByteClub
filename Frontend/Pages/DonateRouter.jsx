import React from 'react';
import '../Styles/SignUpIn.css';
import { Link } from 'react-router-dom';

const DonateRouter = () => {
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
            <h1 className="text-3xl font-bold text-green-700 mb-4">Donation Portal</h1>
            <h2 className="text-2xl text-gray-700 mb-4">Empower Communities & Support Causes</h2>
            <p className="text-gray-600 text-lg mb-6">
              Join us in making a difference. Through your donations, you can help create a better world by supporting
              those in need. Contribute now or fill out the form to become part of our donation initiatives.
            </p>
            <Link to={'/FormComponent'}>
              <button className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition duration-200 text-lg">
                Fill Out Donation Form
              </button>
            </Link>
            <p className="mt-4 text-gray-600">
              Want to make an immediate impact?{' '}
              
            </p>
          </div>

          <div className="container bg-white p-8 rounded-lg shadow-lg max-w-lg text-center">
            <h1 className="text-3xl font-bold text-green-700 mb-4">Support & Get Involved</h1>
            <h2 className="text-2xl text-gray-700 mb-4">Contribute & Help Change Lives</h2>
            <p className="text-gray-600 text-lg mb-6">
              Your contribution is more than just a donation – it is a lifeline for those in need. By supporting causes,
              you are helping bring hope and joy to communities. Get involved, fill out the form, or donate now to make
              a real difference.
            </p>
            <Link to={'/FormComponent'}>
              <button className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition duration-200 text-lg">
                Contribute & Support
              </button>
            </Link>
            <p className="mt-4 text-gray-600">
              Ready to make an immediate donation?{' '}
              
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default DonateRouter;
