import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import { useSelector } from "react-redux"
import { useState } from "react"

export default function ResetPasswordCodeConfForm () {
    const [codeAttempt, setCodeAttempt] = useState('')
    const resetCodeStore = useSelector((store) => store.email)
    const resetCode = resetCodeStore.emailReducer[0]
    const history = useHistory()

    const submitCode = (event) => {
        event.preventDefault()
        if (codeAttempt == resetCode){
        
            history.push('/reset-password-page')
        }
        else{
            alert("Incorrect code. Please try again.");
        }
       
    }
    return(
        <div className="login-container">
            <h1>You have been emailed a password reset code. Please enter it here:</h1>
            <form onSubmit={submitCode}>
               Code: <input 
               value={codeAttempt}
               onChange={(event) => setCodeAttempt(event.target.value)}></input>
               <button>Submit</button>

            </form>
        </div>
    )
}