import React, { useState } from 'react';
import { 
   
  TextField, 
  Button, 
  Typography, 
  Paper,
  Divider,
  Stack
} from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';

function Sumadora() {
  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [resultado, setResultado] = useState('');

  const handleSumar = () => {
    const suma = parseFloat(num1) + parseFloat(num2);
    setResultado(isNaN(suma) ? 'Ingrese números válidos' : suma.toString());
  };

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
        <CalculateIcon sx={{ mr: 1, verticalAlign: 'bottom' }} />
        Sumadora
      </Typography>
      
      <Stack spacing={2}>
        <TextField
          label="Primer número"
          variant="outlined"
          fullWidth
          type="number"
          value={num1}
          onChange={(e) => setNum1(e.target.value)}
          size="small"
        />
        
        <TextField
          label="Segundo número"
          variant="outlined"
          fullWidth
          type="number"
          value={num2}
          onChange={(e) => setNum2(e.target.value)}
          size="small"
        />
        
        <Button
          variant="contained"
          onClick={handleSumar}
          sx={{ py: 1 }}
        >
          Calcular Suma
        </Button>
      </Stack>

      {resultado && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body1" sx={{ textAlign: 'center' }}>
            Resultado: <Typography component="span" sx={{ fontWeight: 'bold' }}>{resultado}</Typography>
          </Typography>
        </>
      )}
    </Paper>
  );
}

export default Sumadora;