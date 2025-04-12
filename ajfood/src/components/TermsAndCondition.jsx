import React from 'react';
import { Link } from 'react-router-dom';

const TermsAndCondition = () => {
  return (
    <div className="max-w-lg mx-auto p-5 bg-gray-50 rounded-lg shadow-md">
      {/* Header */}
      <div className="pb-5 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-800">Terms & Conditions</h1>
        <p className="mt-2 text-sm text-gray-600">
          Last updated: April 06, 2025
        </p>
      </div>

      {/* Content */}
      <div className="py-5 max-h-[60vh] overflow-y-auto">
        <section className="mb-6">
          <h2 className="text-lg font-medium text-gray-700">1. Introduction</h2>
          <p className="mt-2 text-sm text-gray-600">
            Welcome to AjFood! These Terms & Conditions govern your use of our app and services. By accessing or using our platform, you agree to comply with these terms. If you do not agree, please refrain from using our services.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-medium text-gray-700">2. User Responsibilities</h2>
          <p className="mt-2 text-sm text-gray-600">
            You are responsible for providing accurate information during registration, including your name, address, and payment details. You agree not to misuse the app, such as placing fraudulent orders or harassing restaurant partners or delivery personnel.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-medium text-gray-700">3. Orders and Payments</h2>
          <p className="mt-2 text-sm text-gray-600">
            All orders are subject to availability and confirmation by the restaurant. Payments must be made through the app using approved methods. Refunds, if applicable, will be processed as per our refund policy.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-medium text-gray-700">4. Delivery</h2>
          <p className="mt-2 text-sm text-gray-600">
            Delivery times are estimates and may vary due to traffic, weather, or other factors. We are not liable for delays beyond our control. Please ensure someone is available to receive the order at the specified address.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-medium text-gray-700">5. Limitation of Liability</h2>
          <p className="mt-2 text-sm text-gray-600">
            AjFood is not responsible for food quality, allergic reactions, or issues arising from restaurant partners. Our liability is limited to the order value in case of disputes.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-medium text-gray-700">6. Changes to Terms</h2>
          <p className="mt-2 text-sm text-gray-600">
            We may update these terms from time to time. Continued use of the app after changes constitutes acceptance of the new terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-gray-700">7. Contact Us</h2>
          <p className="mt-2 text-sm text-gray-600">
            For questions or concerns, reach out to us at sarwararobin2@.com or call us at +91 7717501630.
          </p>
        </section>
      </div>

      {/* Footer */}
      <div className="pt-5 border-t border-gray-200">
        <Link to="/profile" className="w-full p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Back to Profile
        </Link>
      </div>
    </div>
  );
};

export default TermsAndCondition;