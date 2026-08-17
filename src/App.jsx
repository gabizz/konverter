import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';

import useExchangeRates from './hooks/useExchangeRates';
import CurrencyRow from './components/CurrencyRow';
import Keyboard from './components/Keyboard';
import Settings from './components/Settings';
import ReloadPrompt from './components/ReloadPrompt';

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

const DEFAULT_CURRENCIES = ['RON', 'EUR', 'USD', 'THB', 'TRY'];

export default function App() {
  const { rates, loading, error } = useExchangeRates();
  
  const [currencies, setCurrencies] = useState(() => {
    const saved = localStorage.getItem('konverter_currencies');
    return saved ? JSON.parse(saved) : DEFAULT_CURRENCIES;
  });
  
  const [baseCurrency, setBaseCurrency] = useState(currencies[0]);
  const [baseAmount, setBaseAmount] = useState('100'); // Raw string input
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  const getValues = () => {
    if (!rates) return {};
    
    const parsedAmount = parseFloat(baseAmount) || 0;
    const eurValue = parsedAmount / (rates[baseCurrency] || 1);
    
    const values = {};
    currencies.forEach(currency => {
      if (currency === baseCurrency) {
        values[currency] = baseAmount;
      } else {
        const converted = eurValue * (rates[currency] || 1);
        values[currency] = converted > 0 ? parseFloat(converted.toFixed(2)).toString() : '0';
      }
    });
    
    return values;
  };

  const handleKeyPress = (key) => {
    if (key === 'backspace') {
      setBaseAmount(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
    } else if (key === '.') {
      if (!baseAmount.includes('.')) {
        setBaseAmount(prev => prev + '.');
      }
    } else {
      setBaseAmount(prev => prev === '0' ? key : prev + key);
    }
  };

  const handleCurrencySelect = (currency) => {
    if (currency !== baseCurrency) {
      const values = getValues();
      setBaseCurrency(currency);
      setBaseAmount(values[currency] === '0' ? '' : values[currency]);
    }
  };

  const handleSettingsSave = (newCurrencies) => {
    setCurrencies(newCurrencies);
    localStorage.setItem('konverter_currencies', JSON.stringify(newCurrencies));
    if (!newCurrencies.includes(baseCurrency)) {
      setBaseCurrency(newCurrencies[0]);
    }
  };

  const values = getValues();
  const availableCurrencies = rates ? Object.keys(rates).sort() : [];

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ 
        height: '100dvh', 
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
        
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" color="text.primary" fontWeight="600" letterSpacing="-0.02em">
            Konverter
          </Typography>
          <IconButton onClick={() => setSettingsOpen(true)} size="small" sx={{ color: 'text.secondary' }}>
            <SettingsIcon />
          </IconButton>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', flexGrow: 1, alignItems: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              flexGrow: 1, 
              px: 2, 
              pt: 2,
              justifyContent: 'flex-start',
              overflowY: 'auto'
            }}>
              {currencies.map(currency => (
                <CurrencyRow 
                  key={currency}
                  currency={currency}
                  amount={values[currency] !== undefined ? values[currency] : ''}
                  selected={currency === baseCurrency}
                  onClick={() => handleCurrencySelect(currency)}
                  onClear={() => {
                    setBaseCurrency(currency);
                    setBaseAmount('0');
                  }}
                />
              ))}
            </Box>

            <Keyboard onKeyPress={handleKeyPress} />
          </>
        )}
      </Box>

      <Settings 
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        currentCurrencies={currencies}
        availableCurrencies={availableCurrencies}
        onSave={handleSettingsSave}
      />
      <ReloadPrompt />
    </ThemeProvider>
  );
}
