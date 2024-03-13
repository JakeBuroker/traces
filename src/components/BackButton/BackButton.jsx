import { useHistory } from "react-router-dom/cjs/react-router-dom.min";


// Function to navigate back to the previous page
export default function BackButton(){
    const history = useHistory()
    const goBack = () => {
        history.goBack();
    }
    return (
<button onClick = {goBack}> Go Back </button>
    )
    
  };