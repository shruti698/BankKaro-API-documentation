import { Box } from '@mui/material';
import bannLogo from '../assets/bann-logo.png.png';

const Logo = ({ size = 'medium' }) => {
  const sizes = {
    small: { width: 32, height: 32 },
    medium: { width: 40, height: 40 },
    large: { width: 48, height: 48 }
  };

  const { width, height } = sizes[size];

  return (
    <Box
      component="img"
      src={bannLogo}
      alt="BANN Logo"
      sx={{
        width,
        height,
        objectFit: 'contain'
      }}
    />
  );
};

export default Logo; 