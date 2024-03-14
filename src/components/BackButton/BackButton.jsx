import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import './BackButton.css'

// Function to navigate back to the previous page
export default function BackButton() {
    const history = useHistory()
    const goBack = () => {
        history.goBack();
    }
    return (
        <button
            className="BackButton"
            onClick={goBack}>
            <b>
                Go Back
            </b>
        </button>
    )

};