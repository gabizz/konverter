import { Box, Typography, TextField, Paper } from '@mui/material';

export default function CurrencyRow({ currency, amount, onAmountChange }) {
  const info = {
    EUR: { symbol: '€', name: 'Euro', flag: '🇪🇺' },
    USD: { symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
    RON: { symbol: 'lei', name: 'Romanian Leu', flag: '🇷🇴' },
    THB: { symbol: '฿', name: 'Thai Baht', flag: '🇹🇭' },
  };

  const current = info[currency] || { symbol: currency, name: currency, flag: '' };

  const displayAmount = amount.toString();
  let fontSize = '2rem';
  if (displayAmount.length > 8) fontSize = '1.5rem';
  if (displayAmount.length > 12) fontSize = '1.25rem';

  return (
    <Paper 
      elevation={0}
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '20px 24px',
        mb: 2,
        borderRadius: '1em',
        border: '1px solid',
        borderColor: 'divider',
        width: '100%',
        backgroundColor: 'background.paper',
        transition: 'all 0.2s ease',
        '&:focus-within': {
          borderColor: 'primary.main',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        }
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: '80px' }}>
        <Typography variant="h6" fontWeight="600" color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {currency} <span style={{ fontSize: '1.2em' }}>{current.flag}</span>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {current.name}
        </Typography>
      </Box>

      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1 }}>
        <Typography variant="h5" color="text.secondary">
          {current.symbol}
        </Typography>
        <TextField
          variant="filled" // Note: TextField doesn't have 'contained', so we use 'filled'
          value={displayAmount}
          onChange={(e) => onAmountChange(currency, e.target.value)}
          placeholder="0"
          slotProps={{
            htmlInput: { 
              inputMode: 'decimal', 
              style: { 
                fontSize: fontSize, 
                textAlign: 'right', 
                fontWeight: 600,
                color: 'white',
                paddingTop: '12px',
                paddingBottom: '12px',
              } 
            },
            input: {
              disableUnderline: true,
              sx: { 
                borderRadius: '1em',
                backgroundColor: 'rgba(255,255,255,0.05)',
                '&.Mui-focused': {
                  backgroundColor: 'rgba(255,255,255,0.08)',
                }
              }
            }
          }}
          sx={{
            width: '100%',
            maxWidth: '220px',
          }}
        />
      </Box>
    </Paper>
  );
}
