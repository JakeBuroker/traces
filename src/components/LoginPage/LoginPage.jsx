import React from 'react';
import LoginForm from '../LoginForm/LoginForm';
import { useHistory } from 'react-router-dom';


function LoginPage() {
  const history = useHistory();

  return (
    <div className="login-page-container">
      <LoginForm />
    </div>
  );
}

export default LoginPage;
