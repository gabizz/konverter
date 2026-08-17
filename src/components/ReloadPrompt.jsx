import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Snackbar, Button, Alert } from '@mui/material';

export default function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered:', r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  const handleClose = () => {
    setNeedRefresh(false);
    setOfflineReady(false);
  };

  return (
    <Snackbar 
      open={needRefresh || offlineReady} 
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      sx={{ mb: 2 }}
    >
      <Alert 
        severity="info" 
        sx={{ width: '100%', alignItems: 'center', borderRadius: 2 }}
        action={
          <>
            {needRefresh && (
              <Button color="inherit" size="small" onClick={() => updateServiceWorker(true)}>
                Reload
              </Button>
            )}
            <Button color="inherit" size="small" onClick={handleClose}>
              Close
            </Button>
          </>
        }
      >
        {needRefresh ? 'A new update is available!' : 'App ready to work offline.'}
      </Alert>
    </Snackbar>
  );
}
