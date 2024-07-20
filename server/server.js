const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 5001;

app.set('trust proxy', 1);

const sessionMiddleware = require('./modules/session-middleware');
const passport = require('./strategies/user.strategy');

const userRouter = require('./routes/user.router');
const evidenceRouter = require('./routes/evidence.router');

// Middleware for rate limiting
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('build'));

app.use(sessionMiddleware);

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/user', userRouter);
app.use('/api/evidence', evidenceRouter);

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
