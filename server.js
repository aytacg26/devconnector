import express from 'express';
import { connectDB } from './config/db.js';
import usersRouter from './routes/api/users.js';
import profileRouter from './routes/api/profile.js';
import postsRouter from './routes/api/posts.js';
import authRouter from './routes/api/auth.js';

const app = express();

//Connect Database :
connectDB();

//Init Middleware (Body Parser :)
app.use(express.json({ extended: false }));

app.get('/', (req, res) => {
  res.send('API is running');
});

//Define Routes : Now we can test these api routes in postman
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/profile', profileRouter);
app.use('/api/posts', postsRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Hello Aytac GULEY, devconnector server is up and running on port ${PORT}`
  );
});
