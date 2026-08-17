import { Box, Typography, Paper, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const getFlagEmoji = (currencyCode) => {
  if (!currencyCode) return '';
  const overrides = { EUR: '🇪🇺', BTC: '₿', XAU: '🪙', XAG: '🪙', XPT: '🪙', XPD: '🪙' };
  if (overrides[currencyCode]) return overrides[currencyCode];

  // Most fiat currencies start with the 2-letter ISO country code.
  if (currencyCode.startsWith('X')) return '🌍'; // Multi-national or special

  const countryCode = currencyCode.substring(0, 2).toUpperCase();
  const codePoints = countryCode.split('').map(char => 127397 + char.charCodeAt(0));
  
  // Wrapped in try/catch just in case the environment doesn't support fromCodePoint
  try {
    return String.fromCodePoint(...codePoints);
  } catch (e) {
    return '🌍';
  }
};

const getCurrencySymbol = (currencyCode) => {
  try {
    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode });
    const symbolPart = formatter.formatToParts(0).find(p => p.type === 'currency');
    const overrides = { RON: 'lei' }; // en-US sometimes fails to localize RON correctly
    return overrides[currencyCode] || (symbolPart ? symbolPart.value : currencyCode);
  } catch (e) {
    return currencyCode;
  }
};

export default function CurrencyRow({ currency, amount, selected, onClick, onClear }) {
  const symbol = getCurrencySymbol(currency);
  const flag = getFlagEmoji(currency);

  const displayAmount = amount.toString() || '0';
  let fontSize = '1.75rem';
  if (displayAmount.length > 8) fontSize = '1.5rem';
  if (displayAmount.length > 12) fontSize = '1.25rem';

  return (
    <Paper 
      elevation={0}
      onClick={onClick}
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '12px 20px',
        mb: 1.5,
        borderRadius: '1em',
        border: '1px solid',
        borderColor: selected ? 'primary.main' : 'divider',
        width: '100%',
        backgroundColor: selected ? 'rgba(187, 134, 252, 0.08)' : 'background.paper',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: selected ? '0 4px 20px rgba(187, 134, 252, 0.15)' : 'none',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Typography variant="h6" fontWeight="600" color="text.primary">
          {currency}
        </Typography>
        <Typography sx={{ fontSize: '1.2em' }}>
          {flag}
        </Typography>
      </Box>

      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1 }}>
        <Typography variant="h6" color="text.secondary">
          {symbol}
        </Typography>
        <Typography 
          variant="h5" 
          fontWeight="600" 
          color="text.primary"
          sx={{ 
            fontSize,
            lineHeight: 1.2,
            wordBreak: 'break-all',
            textAlign: 'right'
          }}
        >
          {displayAmount}
        </Typography>

        {displayAmount !== '0' && displayAmount !== '' && (
          <IconButton 
            size="small" 
            onClick={(e) => {
              e.stopPropagation();
              if (onClear) onClear(currency);
            }}
            sx={{ ml: 0.5, color: 'text.secondary', p: 0.5 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
    </Paper>
  );
}
