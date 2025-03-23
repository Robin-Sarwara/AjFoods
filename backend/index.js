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
const corsOptions = {
    origin:"http://localhost:5173",
    credentials: true,
}

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
app.use("/api", cart)

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})