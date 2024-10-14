require('dotenv').config({ path: '../.env' });
const express = require('express');
const app = express();
const logger = require('./helper/logger');
const path = require('path');

// database
const connectDB = require('./db/connect');

//  routers
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const roomRouter = require('./routes/roomRouter');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/room/', roomRouter);

app.use(express.static('../frontend/dist'));
app.get('*', function(req, res) {
    res.sendFile('index.html', {root: path.join(__dirname, '../frontend/dist')});
});

const port = process.env.PORT || 6002;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () =>
      logger.info(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    logger.error(error);
  }
};

start();