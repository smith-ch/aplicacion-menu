import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Menu from './Menu';
import Inicio from '../pages/Inicio';
import Sumadora from '../pages/Sumadora';
import Traductor from '../pages/Traductor';
import TablaMultiplicar from '../pages/TablaMultiplicar';
import Experiencia from '../pages/Experiencia';
import { Box, CssBaseline, IconButton, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const androidTheme = createTheme({
  palette: {
    primary: { main: '#dd0b0b' }, 
    secondary: { main: '#dd0b0b' },
    background: { 
      default: '#F3EDF7', 
      paper: '#FFFFFF' 
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: 'none' 
    }
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#b52c0e'
        }
      }
    }
  }
});

function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:900px)');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <ThemeProvider theme={androidTheme}>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <CssBaseline />
        
     
        <Menu mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
        
       
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              position: 'fixed',
              top: 16,
              left: 16,
              zIndex: 1300,
              color: 'primary.main',
              backgroundColor: 'background.paper',
              boxShadow: 2,
              '&:hover': {
                backgroundColor: 'background.paper'
              }
            }}
          >
            <MenuIcon />
          </IconButton>
        )}
        
        {/* Contenido principal */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: isMobile ? 1 : 2,
            width: '100%',
            marginLeft: isMobile ? 0 : '240px',
            transition: 'margin 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
            maxWidth: isMobile ? '100%' : 'calc(100% - 240px)'
          }}
        >
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/sumadora" element={<Sumadora />} />
            <Route path="/traductor" element={<Traductor />} />
            <Route path="/tabla-multiplicar" element={<TablaMultiplicar />} />
            <Route path="/experiencia" element={<Experiencia />} />
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Layout;