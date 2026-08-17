import { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

import useExchangeRates from './hooks/useExchangeRates';
import CurrencyRow from './components/CurrencyRow';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#050505',
      paper: '#111111',
    },
    primary: {
      main: '#bb86fc',
    },
    divider: 'rgba(255, 255, 255, 0.1)',
  },
  typography: {
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
});

const CURRENCIES = ['RON', 'EUR', 'USD', 'THB'];

export default function App() {
  const { rates, loading, error } = useExchangeRates();
  const [baseCurrency, setBaseCurrency] = useState('RON');
  const [baseAmount, setBaseAmount] = useState('100');
  
  const getValues = () => {
    if (!rates) return {};
    
    const parsedAmount = parseFloat(baseAmount) || 0;
    const eurValue = parsedAmount / rates[baseCurrency];
    
    const values = {};
    CURRENCIES.forEach(currency => {
      if (currency === baseCurrency) {
        values[currency] = baseAmount;
      } else {
        const converted = eurValue * rates[currency];
        values[currency] = converted > 0 ? parseFloat(converted.toFixed(2)).toString() : '';
      }
    });
    
    return values;
  };

  const handleAmountChange = (currency, newAmount) => {
    if (newAmount !== '' && !/^\d*\.?\d*$/.test(newAmount)) return;
    setBaseCurrency(currency);
    setBaseAmount(newAmount);
  };

  const values = getValues();

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        maxWidth: '500px',
        margin: '0 auto',
        backgroundColor: 'background.default',
        overflow: 'hidden'
      }}>
        {error && (
          <Alert severity="warning" sx={{ borderRadius: 0 }}>
            {error}
          </Alert>
        )}
        
        <Box sx={{ p: 3, textAlign: 'center', pb: 2, pt: 5 }}>
          <Typography variant="h5" color="text.primary" fontWeight="600" letterSpacing="-0.02em">
            Konverter
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, px: 2, pb: 4 }}>
            {CURRENCIES.map(currency => (
              <CurrencyRow 
                key={currency}
                currency={currency}
                amount={values[currency] !== undefined ? values[currency] : ''}
                onAmountChange={handleAmountChange}
              />
            ))}
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
}
