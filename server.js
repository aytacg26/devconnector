import express from 'express';
import { connectDB } from './config/db.js';
import usersRouter from './routes/api/users.js';
import profileRouter from './routes/api/profile.js';
import postsRouter from './routes/api/posts.js';
import authRouter from './routes/api/auth.js';
import path from 'path';

const app = express();

//Connect Database :
connectDB();

//Init Middleware (Body Parser :)
app.use(express.json({ extended: false }));

//Define Routes : Now we can test these api routes in postman
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/profile', profileRouter);
app.use('/api/posts', postsRouter);

//Serve static assets in production :
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Hello Aytac GULEY, devconnector server is up and running on port ${PORT}`
  );
});
