import { useState, useEffect, useMemo } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, Box, Typography, Autocomplete, TextField, IconButton
} from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import AddIcon from '@mui/icons-material/Add';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const generateItems = (currencies) => currencies.map((c, i) => ({ id: `slot-${i}-${Date.now()}`, currency: c }));

export default function Settings({ open, onClose, currentCurrencies, availableCurrencies, onSave }) {
  const [items, setItems] = useState(() => generateItems(currentCurrencies));

  useEffect(() => {
    if (open) {
      setItems(generateItems(currentCurrencies));
    }
  }, [open, currentCurrencies]);

  const currencyOptions = useMemo(() => {
    let displayNames;
    try {
      displayNames = new Intl.DisplayNames(['en'], { type: 'currency' });
    } catch (e) {
      // Fallback if not supported
    }
    
    return availableCurrencies.map(code => {
      let name = code;
      if (displayNames) {
        try {
          name = displayNames.of(code) || code;
        } catch (e) {}
      }
      return { code, label: `${code} - ${name}` };
    });
  }, [availableCurrencies]);

  const handleChange = (index, newValue) => {
    if (!newValue) return;
    const newItems = [...items];
    newItems[index] = { ...newItems[index], currency: newValue.code };
    setItems(newItems);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);
    setItems(newItems);
  };
  
  const handleRemove = (index) => {
    if (items.length <= 2) return;
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleAdd = () => {
    if (items.length >= 5) return;
    const currentCodes = items.map(i => i.currency);
    const nextAvailable = availableCurrencies.find(c => !currentCodes.includes(c)) || availableCurrencies[0] || 'USD';
    setItems([...items, { id: `slot-${items.length}-${Date.now()}`, currency: nextAvailable }]);
  };

  const handleSave = () => {
    onSave(items.map(item => item.currency));
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 3, backgroundImage: 'none', bgcolor: 'background.paper' } }}>
      <DialogTitle sx={{ pb: 1 }}>Configuration</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Configure between 2 and 5 currencies. Drag to arrange them.
        </Typography>
        
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="currency-list">
            {(provided) => (
              <Box 
                {...provided.droppableProps} 
                ref={provided.innerRef} 
                sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}
              >
                {items.map((item, index) => {
                  const selectedOption = currencyOptions.find(o => o.code === item.currency) || { code: item.currency, label: item.currency };
                  return (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided, snapshot) => (
                        <Box 
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1,
                            backgroundColor: snapshot.isDragging ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                            borderRadius: 2,
                            p: snapshot.isDragging ? 1 : 0,
                            mx: snapshot.isDragging ? -1 : 0,
                            boxShadow: snapshot.isDragging ? '0 8px 32px rgba(0,0,0,0.5)' : 'none',
                          }}
                        >
                          <Box 
                            {...provided.dragHandleProps} 
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              color: 'text.secondary',
                              cursor: 'grab',
                              '&:active': { cursor: 'grabbing' }
                            }}
                          >
                            <DragIndicatorIcon fontSize="small" />
                          </Box>
                          
                          <Typography variant="body2" color="text.secondary" sx={{ width: 16 }}>
                            {index + 1}.
                          </Typography>
                          
                          <Autocomplete
                            size="small"
                            options={currencyOptions}
                            getOptionLabel={(option) => option.label}
                            isOptionEqualToValue={(option, value) => option.code === value.code}
                            value={selectedOption}
                            onChange={(_, newValue) => handleChange(index, newValue)}
                            disableClearable
                            sx={{ flexGrow: 1 }}
                            renderInput={(params) => (
                              <TextField 
                                {...params} 
                                variant="outlined" 
                                sx={{ 
                                  '& .MuiOutlinedInput-root': { 
                                    borderRadius: 2,
                                    backgroundColor: 'background.default'
                                  } 
                                }} 
                              />
                            )}
                            slotProps={{
                              paper: {
                                sx: {
                                  borderRadius: 2,
                                }
                              }
                            }}
                          />
                          
                          <IconButton 
                            size="small" 
                            onClick={() => handleRemove(index)}
                            disabled={items.length <= 2}
                            sx={{ 
                              color: 'text.secondary', 
                              '&:hover': { color: 'error.main', bgcolor: 'rgba(244, 67, 54, 0.08)' } 
                            }}
                          >
                            <DeleteOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </DragDropContext>
        
        {items.length < 5 && (
          <Button 
            startIcon={<AddIcon />} 
            onClick={handleAdd}
            sx={{ mt: 2, borderRadius: 2 }}
            fullWidth
            variant="outlined"
            color="inherit"
          >
            Add Currency
          </Button>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Button onClick={onClose} color="inherit" sx={{ borderRadius: 2 }}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary" sx={{ borderRadius: 2, color: '#fff' }}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
