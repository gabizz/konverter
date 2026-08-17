import { Box, Button } from '@mui/material';
import BackspaceIcon from '@mui/icons-material/Backspace';

export default function Keyboard({ onKeyPress }) {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'backspace'];

  return (
    <Box 
      sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: 1, 
        p: 2,
        backgroundColor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        height: '45dvh',
        pb: 'max(env(safe-area-inset-bottom), 16px)' // Handle iOS safe area
      }}
    >
      {keys.map((key) => (
        <Button
          key={key}
          onClick={() => onKeyPress(key)}
          variant="text"
          sx={{
            fontSize: '1.75rem',
            fontWeight: 500,
            color: 'text.primary',
            borderRadius: 3,
            backgroundColor: 'rgba(255,255,255,0.03)',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.08)'
            },
            '&:active': {
              backgroundColor: 'rgba(255,255,255,0.12)'
            }
          }}
        >
          {key === 'backspace' ? <BackspaceIcon fontSize="medium" /> : key}
        </Button>
      ))}
    </Box>
  );
}
