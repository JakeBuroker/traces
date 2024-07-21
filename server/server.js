const express = require('express');
const helmet = require('helmet');  // Import Helmet
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

// Use Helmet to secure HTTP headers, disabling specific headers that might interfere with S3
app.use(
  helmet({
    contentSecurityPolicy: false,  // Disable content security policy
    dnsPrefetchControl: false,     // Disable DNS prefetch control
    expectCt: false,               // Disable Expect-CT header
    frameguard: false,             // Disable frameguard
    hidePoweredBy: true,           // Enable hiding X-Powered-By header
    hsts: false,                   // Disable HSTS (HTTP Strict Transport Security)
    ieNoOpen: true,                // Enable IE no open
    noSniff: true,                 // Enable no-sniff
    permittedCrossDomainPolicies: false,  // Disable permitted cross-domain policies
    referrerPolicy: { policy: 'no-referrer' },  // Set referrer policy to no-referrer
    xssFilter: true,               // Enable XSS filter
  })
);

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
