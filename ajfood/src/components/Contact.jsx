import React from 'react';

const Contact = () => {
  return (
    <section className="bg-white ml-20 py-16 px-4">
      <div className="container mx-auto ">
        <h2 className="text-4xl font-semibold text-green-600 mb-4">Contact Us</h2>
        <p className="text-lg text-gray-600 mb-12">We'd love to hear from you! For any help or queries, feel free to reach out.</p>

        <div className="flex flex-col gap-16">
          <div className="text-left">
            <h3 className="text-2xl font-semibold text-green-500 mb-6">Phone</h3>
            <p className="text-lg text-gray-600">
              You can reach us directly at <a href="tel:+917717501630" className="text-blue-500">7717501630</a> for any inquiries or assistance.
            </p>
          </div>

          <div className="text">
            <h3 className="text-2xl font-semibold text-green-500 mb-6">Email</h3>
            <p className="text-lg text-gray-600">
              For support or general questions, feel free to email us at <a href="mailto:sarwararobin3151@gmail.com" className="text-blue-500">sarwararobin3151@gmail.com</a>.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <p className="text-lg font-bold text-gray-600">
            We're here to help, and we’ll respond as soon as possible. Thank you for reaching out!
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
