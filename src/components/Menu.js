import { Link, useLocation } from 'react-router-dom';
import { 
  Box,
  Drawer, 
  SwipeableDrawer,
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Divider,
  Typography, 
  useTheme,
  useMediaQuery 
} from '@mui/material';
import {
  HomeMax as Home,
  Add as AddIcon,
  GTranslate as TranslateIcon,
  TableChart as TableChartIcon,
  SmartDisplay as VideoFile
} from '@mui/icons-material';

const menuItems = [
  { text: 'Inicio', icon: <Home />, path: '/' },
  { text: 'Sumadora', icon: <AddIcon />, path: '/sumadora' },
  { text: 'Traductor', icon: <TranslateIcon />, path: '/traductor' },
  { text: 'Tablas', icon: <TableChartIcon />, path: '/tabla-multiplicar' },
  { text: 'Experiencia', icon: <VideoFile />, path: '/experiencia' },
];

function Menu({ mobileOpen, handleDrawerToggle }) {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width:900px)');

  const drawerContent = (
    <>
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>
         Menu de opciones
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            component={Link} 
            to={item.path}
            selected={location.pathname === item.path}
            onClick={isMobile ? handleDrawerToggle : undefined}
            sx={{
              borderRadius: '12px',
              mx: 1,
              my: 0.5,
              '&.Mui-selected': {
                backgroundColor: theme.palette.primary.light,
                color: theme.palette.primary.main,
                '& .MuiListItemIcon-root': {
                  color: theme.palette.primary.main,
                },
              },
              '&:hover': {
                backgroundColor: theme.palette.primary.light,
                color: theme.palette.primary.main,
                '& .MuiListItemIcon-root': {
                  color: theme.palette.primary.main,
                },
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: '40px' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{ 
                fontWeight: 'medium',
                color: 'black' 
              }}
            />
          </ListItem>
        ))}
      </List>
    </>
  );

  if (isMobile) {
    return (
      <SwipeableDrawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        onOpen={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            background: 'linear-gradient(145deg,rgb(25, 30, 46) 0%,rgb(0, 123, 255) 100%)',
            boxShadow: '0 0 20px rgba(255, 25, 25, 0.05)', // Sombra sutil
            borderRight: '1px solid rgba(0, 0, 0, 0.08)', // Borde sutil
          },
        }}
      >
        {drawerContent}
      </SwipeableDrawer>
    );
  }

  return (
    <Drawer
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          background: 'linear-gradient(145deg,rgb(250, 129, 145) 0%, #e6f0fb 100%)',
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.05)', // Sombra sutil
          borderRight: '1px solid rgba(0, 0, 0, 0.08)', // Borde sutil
        },
      }}
      variant="permanent"
      anchor="left"
    >
      {drawerContent}
    </Drawer>
  );
}

export default Menu;
/*
Para importar un icono específico de Material UI Icons, usa la siguiente sintaxis:


Por ejemplo, para importar el icono de "Alarm":


Luego puedes usar <AlarmIcon /> en tu JSX.
*/