import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

function LogOutButton(props) {
  const dispatch = useDispatch();
  const history = useHistory()

  function logOut(){
  dispatch({ type: 'LOGOUT' })
  dispatch({ type: 'REMOVE' })
  dispatch({ type: 'CLEAR_MEDIA' })
  dispatch({ type: 'RESET_EVIDENCE' })
  history.push('/')
  }
  return (
    <button
      // This button shows up in multiple locations and is styled differently
      // because it's styled differently depending on where it is used, the className
      // is passed to it from it's parents through React props
      className={props.className}
      onClick={() => logOut()}
    >
      Log Out
    </button>
  );
}

export default LogOutButton;
