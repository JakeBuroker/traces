import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function UploadButton({ btnName, style, color, onChange, fileName }) {
  return (
    <Button
      component="label"
      variant="contained"
      style={style}
      color={color}
    >
      {fileName ? fileName : btnName}
      <VisuallyHiddenInput
        type="file"
        accept="image/*"
        onChange={onChange} // Ensure this calls the correct handler
      />
    </Button>
  );
}
