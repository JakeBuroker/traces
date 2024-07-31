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

export default function UploadButton({
  btnName,
  style,
  // setter,
  color,
  onChange,
  onBlur,
  value,
  name,
}) {
  return (
    <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      style={style}
      color={color}
      onChange={onChange}
      onBlur={onBlur}
      value={value}
      name={name}
      id={name}
      // onChange={(e) => setter(e.target.files[0])}
    >
      {btnName}
      <VisuallyHiddenInput id={name} name={name} type="file" accept='image/*' />
    </Button>
  );
}