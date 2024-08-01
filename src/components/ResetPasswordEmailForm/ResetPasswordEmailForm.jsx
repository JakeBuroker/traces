import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useSelector } from "react-redux";
import { useState } from "react";

export default function ResetPasswordEmailForm(){
    const history = useHistory()
    const dispatch = useDispatch()
    const [enterEmail, setEnterEmail] = useState('')

    let randNum = 0
    const makeRand = () => {
        let madeRand = Math.floor(100000 + Math.random() * 900000)
        randNum = [madeRand]
    }
    makeRand()
    let emailArr = [randNum, enterEmail]

    const submitEMail = () => {
        console.log("attempting to send email");
        dispatch({ type: 'SEND', payload: emailArr })
        history.push('/reset-password-code')

    }

    return(
        <div>
            <h1>Enter the email associated with your account:</h1>
            <form onSubmit={submitEMail}>
                Email: <input 
                value={enterEmail}
                onChange={(event) => setEnterEmail(event.target.value)}></input>
                <button>Submit</button>

            </form>
        </div>
    )
}