import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';

function Experiencia() {
  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
        <VideoLibraryIcon sx={{ mr: 1, verticalAlign: 'bottom' }} />
        Mi Experiencia
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 2 }}>
        En este video explico mi experiencia desarrollando esta aplicación:
      </Typography>
      
      <Box sx={{ 
        position: 'relative',
        paddingBottom: '56.25%', 
        height: 0,
        overflow: 'hidden',
        borderRadius: 2,
        backgroundColor: '#000',
        mb: 2
      }}>
        <iframe
          title="Video experiencia"
          width="100%"
          height="100%"
          style={{ position: 'absolute', top: 0, left: 0 }}
          src="https://www.youtube.com/embed/VIDEO_ID"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
        Nota: El video muestra mi rostro mientras explico el desarrollo.
        Duración: menos de 5 minutos.
      </Typography>
    </Paper>
  );
}

export default Experiencia;