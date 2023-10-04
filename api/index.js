const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require("helmet");

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

console.log(process.env.MONGO_URL)

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDB")
}).catch((error) => {
  console.log("Failed to connect to MongoDB")
  console.log(error)
});

const corsOptions = {
  credentials: true,
  origin: process.env.CLIENT_DOMAIN,
  methods: ['GET', 'POST', 'PUT']
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet());
app.use(helmet.hidePoweredBy());




// Include authentication routes
const authRoutes = require('./routes/auth');
app.use('/auth/', authRoutes);

// Include other routes (e.g., hospital routes)
const hospitalRoutes = require('./routes/hospital');
app.use('/hospitals/', hospitalRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});