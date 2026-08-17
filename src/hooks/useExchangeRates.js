import { useState, useEffect } from 'react';

const CACHE_KEY = 'konverter_rates_v2';
const TIME_KEY = 'konverter_time_v2';
// 24 hours in milliseconds
const CACHE_DURATION = 24 * 60 * 60 * 1000;
// We fetch EUR base, and get USD, RON, THB. 
// Note: EUR to EUR is always 1, we can add it manually if missing.
const API_URL = 'https://open.er-api.com/v6/latest/EUR';

export default function useExchangeRates() {
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const cachedRates = localStorage.getItem(CACHE_KEY);
        const cachedTime = localStorage.getItem(TIME_KEY);

        const now = Date.now();

        if (cachedRates && cachedTime && (now - parseInt(cachedTime)) < CACHE_DURATION) {
          // Use cached data
          console.log('Using cached rates');
          setRates(JSON.parse(cachedRates));
          setLoading(false);
          return;
        }

        console.log('Fetching new rates');
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('Failed to fetch rates');
        }
        
        const data = await response.json();
        
        // Ensure EUR is in the rates object, and store all available rates
        const allRates = {
          ...data.rates,
          EUR: 1,
        };

        localStorage.setItem(CACHE_KEY, JSON.stringify(allRates));
        localStorage.setItem(TIME_KEY, now.toString());

        setRates(allRates);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching rates, falling back to cache if available', err);
        // Fallback to cache even if expired
        const cachedRates = localStorage.getItem(CACHE_KEY);
        if (cachedRates) {
          setRates(JSON.parse(cachedRates));
          setError('Using outdated offline rates');
        } else {
          setError('Failed to fetch rates and no cache available. Please connect to the internet.');
        }
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  return { rates, loading, error };
}
