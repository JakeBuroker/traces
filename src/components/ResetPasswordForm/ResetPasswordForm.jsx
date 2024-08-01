import { useState } from "react"
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"

export default function ResetPasswordForm() {
    const dispatch = useDispatch()
    const history = useHistory()
    const [firstEntry, setFirstEntry] = useState('')
    const [secondEntry, setSecondEntry] = useState('')
    const userEmail = useSelector((store) => store.email.emailReducer[1])
    let updateInfo = [firstEntry, userEmail]
    const newPasswordSubmit = () => {
        if (firstEntry == secondEntry){
            console.log("both of the passwords are the same!", firstEntry, secondEntry);
            console.log('This is the email we\'re targetting', userEmail);
            alert("Password updated successfully!")
            dispatch({type:'EDIT_PASSWORD', payload: updateInfo})
            history.push('/login')
        }
        else{
            alert("Please make sure that the passwords match eachother")
        }
      
    }

    return(
        <div className="login-container">
            <h1>Reset Password Here</h1>
        <form onSubmit={newPasswordSubmit}>
            New Password: <input
            value={firstEntry}
            onChange={(event) => setFirstEntry(event.target.value)}></input>
            Confirm New Password: <input
            value={secondEntry}
            onChange={(event) => setSecondEntry(event.target.value)}></input>
            <button>Save New Password</button>

        </form>
        </div>
    )
}