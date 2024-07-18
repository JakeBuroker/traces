const cookieSession = require('cookie-session');
const warnings = require('../constants/warnings');

/*
  The cookie session makes it so a user can enters their username and password one time,
  and then we can keep them logged in. We do this by giving them a really long random string
  that the browser will pass back to us with every single request. The long random string is
  something the server can confirm, and then we know that we have the right user.

  You can see this string that gets passed back and forth in the
  `application` ->  `storage` -> `cookies` section of the chrome debugger
*/

const serverSessionSecret = () => {
  if (
    !process.env.SERVER_SESSION_SECRET ||
    process.env.SERVER_SESSION_SECRET.length < 8 ||
    process.env.SERVER_SESSION_SECRET === warnings.exampleBadSecret
  ) {
    console.log(warnings.badSecret);
  }

  return process.env.SERVER_SESSION_SECRET;
};

module.exports = cookieSession({
  secret: serverSessionSecret(),
  key: 'user',
  resave: 'false',
  saveUninitialized: false,
  maxAge: 1000 * 60 * 60 * 24 * 7,
  secure: process.env.NODE_ENV === 'production',
});
