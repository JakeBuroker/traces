export default function EvidenceUpload(props) {
    return (
        <div>
        <>This is where you upload Evidence</>
        <br/>
        <form>
            <label>Input Name</label>
        <input/>
        <br/>
        <input type ="file" id = "fileInput" multiple/>
        <br/>
        <textarea placeholder="Optional Notes"/>
        </form>
        </div>
    )
}