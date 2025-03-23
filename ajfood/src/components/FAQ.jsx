import React, { useState } from 'react';

const FAQ = () => {
  const [open, setOpen] = useState(null);

  const toggle = (index) => {
    setOpen(open === index ? null : index);
  };

  const faqs = [
    {
      question: 'What kind of food do you serve?',
      answer: 'We serve a variety of fresh and healthy meals, including vegetarian, vegan, and gluten-free options, made with high-quality ingredients.',
    },
    {
      question: 'How can I place an order?',
      answer: 'You can place an order directly through our website. Just browse the menu, add your items to the cart, and proceed to checkout.',
    },
    {
      question: 'Do you offer delivery?',
      answer: 'Yes, we offer delivery services within a specified area. You can check if we deliver to your location at checkout.',
    },
    {
      question: 'Can I customize my order?',
      answer: 'Absolutely! You can customize your order by selecting different toppings or ingredients based on your preferences.',
    },
    {
      question: 'How can I contact customer support?',
      answer: 'You can reach our customer support team by calling us at 7717501630 or emailing us at sarwararobin3151@gmail.com.',
    },
  ];

  return (
    <section className="bg-gray-50 py-16 px-4">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-semibold text-green-600 mb-8">Frequently Asked Questions</h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white shadow-md rounded-md">
              <button
                className="w-full text-left px-6 py-4 text-lg font-semibold text-green-600 focus:outline-none"
                onClick={() => toggle(index)}
              >
                {faq.question}
              </button>
              {open === index && (
                <div className="px-6 pb-4 text-gray-600">
                  <p className='font-semibold text-left'>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
