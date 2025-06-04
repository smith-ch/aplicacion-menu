import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper,
  Chip,
  Divider
} from '@mui/material';
import TranslateIcon from '@mui/icons-material/Translate';

function Traductor() {
  const [numero, setNumero] = useState('');
  const [enLetras, setEnLetras] = useState('');

  const traducirNumero = (num) => {
    if (num < 1 || num > 1000) return 'Número fuera de rango (1-1000)';
    
    const unidades = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
    const decenas = ['', 'diez', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
    const especiales = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
    const veintes = ['veinte', 'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco', 'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve'];
    const centenas = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];
    
    if (num === 0) return 'cero';
    if (num === 1000) return 'mil';
    
    let resultado = '';
    const centena = Math.floor(num / 100);
    const resto = num % 100;
    
    if (centena > 0) {
      resultado += centenas[centena] + ' ';
    }
    
    if (resto > 0) {
      if (resto < 10) {
        resultado += unidades[resto];
      } else if (resto < 20) {
        if (resto === 10) {
          resultado += decenas[1];
        } else {
          resultado += especiales[resto - 10];
        }
      } else if (resto < 30) {
        resultado += veintes[resto - 20];
      } else {
        const decena = Math.floor(resto / 10);
        const unidad = resto % 10;
        resultado += decenas[decena];
        if (unidad > 0) {
          resultado += ' y ' + unidades[unidad];
        }
      }
    }
    
    return resultado.trim();
  };

  const handleTraducir = () => {
    const num = parseInt(numero);
    setEnLetras(isNaN(num) ? 'Ingrese un número válido' : traducirNumero(num));
  };

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
        <TranslateIcon sx={{ mr: 1, verticalAlign: 'bottom' }} />
        Traductor de Números
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          label="Número (1-1000)"
          variant="outlined"
          fullWidth
          type="number"
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
          inputProps={{ min: 1, max: 1000 }}
          size="small"
        />
        <Button
          variant="contained"
          onClick={handleTraducir}
        >
          Traducir
        </Button>
      </Box>

      {enLetras && (
        <>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              En letras:
            </Typography>
            <Chip 
              label={enLetras} 
              sx={{ 
                fontSize: '1rem',
                p: 1.5,
                borderRadius: 2,
                backgroundColor: 'primary.light',
                color: 'primary.contrastText'
              }} 
            />
          </Box>
        </>
      )}
    </Paper>
  );
}

export default Traductor;