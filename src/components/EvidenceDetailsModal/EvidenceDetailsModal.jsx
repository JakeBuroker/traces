// Import necessary components from Material-UI
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Typography,
  TextField,
  Chip
} from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

// Functional component for rendering evidence details modal
const EvidenceDetailsModal = ({ selectedItem, isOpen, onClose, editEvidence, deleteEvidence, acceptedMedia }) => {
  // State variables for managing the modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [formState, setFormState] = useState({
    user_id: selectedItem.id,
    title: selectedItem.title,
    notes: selectedItem.notes,
  });

  // Function to cancel the deletion operation
  const cancelDelete = () => {
    setDeleteModalOpen(false)
  };

  // Function to handle the deletion of evidence
  const handleDelete = (id) => {
    deleteEvidence(id)
    setDeleteModalOpen(false)
    onClose()
  }

  // Function to handle saving changes to the evidence
  const handleSave = (id) => {
    const formData = new FormData();
    formData.append("title", formState.title);
    formData.append("notes", formState.notes);
    if (formState.file) {
      formData.append("file", formState.file);
    }
    // function for PUT request
    editEvidence(id, formData)
    onClose()
  };

  // Function to render different media types
  const renderImageForMediaItem = ({media_type, aws_url, title}) => {
    if (media_type === 4) {
      return ( // Render an audio element for audio files
      <video
        src={aws_url}
        controls
        style={{ maxHeight: "500px", maxWidth: "100%", objectFit: "cover", margin: '5px 0' }}
        poster='./audio_placeholder.jpeg'
      />)
    } else if (media_type === 3) {
      return (
        // Render a video element for video files
        <video
        src={aws_url}
        controls
        style={{maxHeight: "500px", maxWidth: "100%", objectFit: "cover", margin: '5px 0' }}
        poster='./video_placeholder.jpeg'
      />
      )
    } else if (media_type === 2) {
      return (
        // Render an image for image files
        <img
        src={aws_url}
        alt={title}
        style={{ maxHeight: "500px", maxWidth: "100%", objectFit: "cover", margin: '5px 0' }}
      />
      )
    }
  }

  // Return statement for rendering the evidence details modal
  return (
    <>
      {/* Dialog for displaying evidence details */}
      <Dialog
        open={isOpen}
        onClose={onClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogContent>
          {selectedItem && (
            <div style={{display: 'flex', flexDirection: 'column', alignContent: 'center'}}>
              {renderImageForMediaItem(selectedItem)}
              {/* Display evidence title */}
              <Typography variant="h5" style={{ textAlign: "center" }}>
                {selectedItem.title}
              </Typography>
              {/* Display evidence notes */}
              <Typography variant="body1" style={{ textAlign: "center" }}>
                {selectedItem.notes}
              </Typography>
              {/* Display evidence location */}
              <Typography variant="body1" style={{ textAlign: "center" }}>
                Location: {selectedItem.location}
              </Typography>
              {/* Chips for edit and delete actions */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                {/* Chip for editing evidence */}
                <Chip
                  icon={<CreateIcon />}
                  label="Edit"
                  onClick={() => setIsEditing(true)}
                  color="default"
                  style={{ cursor: "pointer" }}
                />
                {/* Chip for deleting evidence */}
                <Chip
                  icon={<DeleteForeverIcon />}
                  label="Delete"
                  onClick={() => setDeleteModalOpen(true)}
                  color="error"
                  style={{ cursor: "pointer" }}
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Dialog for confirming evidence deletion */}
      <Dialog open={deleteModalOpen} onClose={cancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          {/* Message for confirming deletion */}
          <Typography>
            Are you sure you want to delete this evidence?
          </Typography>
        </DialogContent>
        <DialogActions>
          {/* Button to cancel deletion */}
          <Button onClick={cancelDelete} autoFocus>Cancel</Button>
          {/* Button to confirm deletion */}
          <Button onClick={() => handleDelete(selectedItem.id)} color="warning">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for editing evidence */}
      <Dialog
        open={isEditing}
        onClose={(event, reason) => {
          if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
            setIsEditing(false);
          }
        }}
        fullWidth
        maxWidth="md"
        disableEscapeKeyDown
        sx={{border:"solid"}}
      >
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent>
          {selectedItem.media_type !== 1 && (
            <input
              onChange={(e) =>
                setFormState({ ...formState, file: e.target.files[0] })
              }
              type="file"
              id="fileInput"
            accept={acceptedMedia(selectedItem.media_type)}
            />
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            value={formState.title}
            onChange={(e) =>
              setFormState({ ...formState, title: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Notes"
            type="text"
            fullWidth
            value={formState.notes}
            onChange={(e) =>
              setFormState({ ...formState, notes: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditing(false)} color="error">
            Cancel
          </Button>
          <Button onClick={() => handleSave(selectedItem.id)} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog> 
    </>
  );
};

export default EvidenceDetailsModal;