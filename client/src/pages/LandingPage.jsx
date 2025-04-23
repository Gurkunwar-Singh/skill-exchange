

import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const LandingPage = () => {
  return (
    <>
      <Navbar />
      <div className="bg-white min-h-screen flex flex-col items-center justify-center text-gray-800">
        {/* Hero Section */}
        <div className="text-center max-w-4xl px-4 py-12">
          <div className="flex justify-center mb-6">
            <svg 
              className="w-16 h-16 text-orange-500"
              fill="currentColor" 
              viewBox="0 0 20 20" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Welcome to Freelancer
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-600">
            Trade your skills, collaborate with others, and grow your business in a
            simple and effective way.
          </p>
          <Link
            to="/signup"
            className="inline-block bg-orange-500 text-white px-6 py-3 rounded-md font-medium hover:bg-orange-600 transition duration-200"
          >
            Get Started
          </Link>
        </div>

        {/* Features Section */}
        <div className="w-full bg-gray-50 py-12">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Choose Freelancer?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 hover:border-orange-300 transition duration-200">
                <h3 className="text-xl font-bold mb-3 text-orange-600">Skill Trading</h3>
                <p className="text-gray-600">
                  Exchange your expertise with other professionals and get the help you need.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 hover:border-orange-300 transition duration-200">
                <h3 className="text-xl font-bold mb-3 text-orange-600">Earn Credits</h3>
                <p className="text-gray-600">
                  Complete tasks and earn credits redeemable for services from others.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 hover:border-orange-300 transition duration-200">
                <h3 className="text-xl font-bold mb-3 text-orange-600">Global Network</h3>
                <p className="text-gray-600">
                  Connect with professionals worldwide and expand your opportunities.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="w-full py-16 text-center">
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Begin?
            </h2>
            <p className="text-lg mb-8 text-gray-600">
              Create your account and start trading skills today!
            </p>
            <Link
              to="/signup"
              className="inline-block bg-orange-500 text-white px-6 py-3 rounded-md font-medium hover:bg-orange-600 transition duration-200"
            >
              Join Now
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;