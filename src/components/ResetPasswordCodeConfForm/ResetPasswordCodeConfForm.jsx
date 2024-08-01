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
        console.log("resetCode", resetCode);
        console.log("code attempt", codeAttempt);
        if (codeAttempt == resetCode){
            console.log("you entered the reset code correctly");
            history.push('/reset-password-page')
        }
        else{
            alert("you entered the reset code incorrectly dumbass");
        }
       
    }
    return(
        <div className="login-container">
            <h1>Please enter your password reset code:</h1>
            <form onSubmit={submitCode}>
               Code: <input 
               value={codeAttempt}
               onChange={(event) => setCodeAttempt(event.target.value)}></input>
               <button>Submit</button>

            </form>
        </div>
    )
}