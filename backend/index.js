const express = require('express');
const app = express();
require('dotenv').config();
require('./models/db')
const bodyParser = require('body-parser')
const cors = require('cors')
const authRouter = require('./routes/AuthRouter')
const forgetPassRoutes = require('./routes/PasswordForget')
const products = require('./routes/Products');
const productFilter = require('./routes/productFilter');
const feedback = require('./routes/feedback')
const refreshToken = require('./routes/refreshToken')
const cookieParser = require('cookie-parser');
const userInfo = require('./routes/userInfo')
const answer = require('./routes/Answers')
const userAskedQuestion = require('./routes/userAskedQuestions')
const review = require('./routes/Review')
const cart = require('./routes/cartRouter')
const orders = require('./routes/Order')
const editUser = require('./routes/EditProfile')
const deliveryAddress = require('./routes/DeliveryAddress')
const searchBar = require('./routes/SearchBar')
const relatedProducts = require('./routes/RelatedProducts')

// Update CORS configuration
const corsOptions = {
  origin: ['http://localhost:5173', 'https://ajfoods.netlify.app'], // Allow local dev & deployed frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Include OPTIONS for preflight requests
  credentials: true // Allow credentials (cookies, authorization headers, TLS client certificates)
};


const PORT = process.env.PORT || 9090;

app.get('/ping', (req,res)=>{
    res.send("PONG")
})
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use('/api', authRouter)
app.use('/api',forgetPassRoutes )
app.use('/api',products )
app.use('/api/products/filter',productFilter )
app.use('/api',feedback )
app.use('/api',refreshToken)
app.use('/api',userInfo)
app.use('/api',answer)
app.use('/api',userAskedQuestion)
app.use('/api',review)
app.use("/api",cart)
app.use("/api",orders)
app.use("/api",editUser)
app.use("/api",deliveryAddress)
app.use("/api",searchBar)
app.use("/api",relatedProducts)

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})