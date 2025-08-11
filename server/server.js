const express = require('express');
const helmet = require('helmet');
const csurf = require('csurf');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const sessionMiddleware = require('./modules/session-middleware');
const passport = require('./strategies/user.strategy');
const userRouter = require('./routes/user.router');
const evidenceRouter = require('./routes/evidence.router');
const emailRouter = require('./routes/email.router');

const PORT = process.env.PORT || 5001;
const app = express();

// Set up Express to trust proxies
app.set('trust proxy', 1);

// Security Middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
    dnsPrefetchControl: false,
    expectCt: false,
    frameguard: false,
    hidePoweredBy: true,
    hsts: false,
    ieNoOpen: true,
    noSniff: true,
    permittedCrossDomainPolicies: false,
    referrerPolicy: { policy: 'no-referrer' },
    xssFilter: true,
  })
);

// Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Files Middleware
app.use(express.static('build'));

// Cookie Parser Middleware
app.use(cookieParser());

// Rate Limiting Middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
});
app.use(limiter);

// Passport Session Configuration
app.use(sessionMiddleware);

// Start Passport Sessions
app.use(passport.initialize());
app.use(passport.session());

// CSRF Protection Middleware
// const csrfProtection = csurf({ cookie: true });
// app.use(csrfProtection);

// Middleware to set the CSRF token in a cookie
// app.use((req, res, next) => {
//   res.cookie('XSRF-TOKEN', req.csrfToken());
//   next();
// });

// Routes
app.use('/api/user', userRouter);
app.use('/api/evidence', evidenceRouter);
app.use('/api/email', emailRouter);

// Listen Server & Port
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Listening on port: ${PORT}`);
});