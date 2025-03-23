import React from 'react';

const About = () => {
  return (
    <section className="bg-gray-50 py-16 px-4">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-semibold text-green-600 mb-4">About Us</h2>
        <p className="text-lg text-gray-600 mb-12">We are passionate about bringing you the best food experience, made with love and fresh ingredients!</p>
        
        <div className="grid md:grid-cols-2 gap-16">
          <div className="text-left">
            <h3 className="text-2xl font-semibold text-green-500 mb-6">Our Mission</h3>
            <p className="text-gray-600 mb-4">
              Our mission is to provide delicious, healthy, and affordable meals that bring people together. We focus on using high-quality, sustainable ingredients in every dish.
            </p>
            <p className="text-gray-600">
              We believe food should be an experience, and our goal is to create memorable moments with every meal we serve.
            </p>
          </div>
          
          <div className="text-left">
            <h3 className="text-2xl font-semibold text-green-500 mb-6">Our Values</h3>
            <ul className="list-disc pl-6 text-gray-600">
              <li>Fresh Ingredients</li>
              <li>Customer Satisfaction</li>
              <li>Sustainability</li>
              <li>Innovation in Cooking</li>
              <li>Building a Food Community</li>
            </ul>
          </div>
        </div>

        <div className="mt-12">
          <p className="text-lg text-gray-600">
            Thank you for being a part of our journey. We're excited to continue bringing you the best of food, and we can't wait to share more delicious experiences with you!
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
