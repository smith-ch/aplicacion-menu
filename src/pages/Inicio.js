import React from 'react';
import { Box, Card, CardContent, Avatar, Typography } from '@mui/material';

function Inicio() {
  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      pt: 3
    }}>
      <Card sx={{ 
        width: '100%',
        maxWidth: 400,
        borderRadius: 3,
        boxShadow: 3
      }}>
        <CardContent sx={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 3
        }}>
          <Avatar
            src="/WhatsApp Image 2025-05-17 at 12.47.38 PM.jpeg"
            alt="Foto perso`nal"
            sx={{ 
              width: 250, 
              height:350, 
              mb: 3,
              border: '4px solid #6750A4'
            }}
          />
          <Typography variant="h5" component="div" gutterBottom align="center">
            Smith Rodríguez Peguero
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom align="center">
            Desarrollador Frontend
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
            smithrodriguez345@gmail.com
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Matrícula: 2023-1123
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Inicio;