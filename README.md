# ajFood Project

This is a full-stack food delivery web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js). It includes a wide range of features for both customers and administrators.

## Key Features

### Customer Features
- **User Authentication:** Secure user registration and login system with password reset functionality.
- **Browse and Search:** Easily search for specific food items and browse through different categories.
- **Product Information:** View detailed information about each food item, including its description, price, and customer reviews.
- **Shopping Cart:** Add and remove items from the cart, and view the total price.
- **Checkout and Payment:** Seamlessly place orders and make payments using Razorpay.
- **Order Tracking:** Track the status of your orders in real-time.
- **Profile Management:** Update your profile information, including your email and delivery address.
- **Reviews and Feedback:** Share your feedback and read reviews from other customers.
- **AI Chat:** Get instant support and answers to your questions through our AI-powered chatbot.
- **FAQ and Support:** Find answers to frequently asked questions and get in touch with our support team.

### Admin Features
- **Product Management:** Add, update, and remove food items from the menu.
- **Order Management:** View and manage all incoming orders.
- **User Management:** View and manage all registered users.

## Technologies Used

- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Payment Gateway:** Razorpay

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js and npm installed on your machine.
- MongoDB installed and running.

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/your_username/ajFood.git
   ```
2. Install NPM packages for the frontend
   ```sh
   cd ajfood
   npm install
   ```
3. Install NPM packages for the backend
   ```sh
   cd ../backend
   npm install
   ```
4. Create a `.env` file in the `backend` directory and add the following environment variables:
   ```
   PORT=5000
   MONGO_URI=<your_mongodb_uri>
   JWT_SECRET=<your_jwt_secret>
   RAZORPAY_KEY_ID=<your_razorpay_key_id>
   RAZORPAY_KEY_SECRET=<your_razorpay_key_secret>
   ```

### Running the Application

1. Start the backend server
   ```sh
   cd backend
   npm start
   ```
2. Start the frontend development server
   ```sh
   cd ajfood
   npm run dev
   ```
3. Open your browser and navigate to `http://localhost:3000`.

## Folder Structure

```
ajFood/
├── ajfood/         # Frontend React application
│   ├── src/
│   │   ├── components/
│   │   ├── layout/
│   │   └── ...
│   └── ...
├── backend/        # Backend Node.js application
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── ...
└── README.md
```

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.
