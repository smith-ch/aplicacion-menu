import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper,
  Grid,
  Divider
} from '@mui/material';
import FunctionsIcon from '@mui/icons-material/Functions';

function TablaMultiplicar() {
  const [numero, setNumero] = useState('');
  const [tabla, setTabla] = useState([]);

  const generarTabla = () => {
    const num = parseFloat(numero);
    if (isNaN(num)) {
      setTabla([]);
      return;
    }
    
    const nuevaTabla = Array.from({ length: 13 }, (_, i) => ({
      multiplicador: i + 1,
      resultado: num * (i + 1)
    }));
    setTabla(nuevaTabla);
  };

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
        <FunctionsIcon sx={{ mr: 1, verticalAlign: 'bottom' }} />
        Tabla de Multiplicar
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          label="Ingrese un número"
          variant="outlined"
          fullWidth
          type="number"
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
          size="small"
        />
        <Button
          variant="contained"
          onClick={generarTabla}
        >
          Generar
        </Button>
      </Box>

      {tabla.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" sx={{ mb: 1, textAlign: 'center' }}>
            Tabla del {numero}
          </Typography>
          <Grid container spacing={1}>
            {tabla.map((item, index) => (
              <Grid item xs={4} sm={3} key={index}>
                <Box sx={{ 
                  p: 1, 
                  textAlign: 'center',
                  backgroundColor: 'background.paper',
                  borderRadius: 2
                }}>
                  <Typography variant="body2">
                    {numero} × {item.multiplicador} = {item.resultado}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Paper>
  );
}

export default TablaMultiplicar;