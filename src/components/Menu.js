
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
  Home as HomeIcon,
  Add as AddIcon,
  Translate as TranslateIcon,
  TableChart as TableChartIcon,
  VideoLibrary as VideoLibraryIcon
} from '@mui/icons-material';

const menuItems = [
  { text: 'Inicio', icon: <HomeIcon />, path: '/' },
  { text: 'Sumadora', icon: <AddIcon />, path: '/sumadora' },
  { text: 'Traductor', icon: <TranslateIcon />, path: '/traductor' },
  { text: 'Tablas', icon: <TableChartIcon />, path: '/tabla-multiplicar' },
  { text: 'Experiencia', icon: <VideoLibraryIcon />, path: '/experiencia' },
];

function Menu({ mobileOpen, handleDrawerToggle }) {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width:900px)');

  const drawerContent = (
    <>
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>
          Menú de Opciones
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
              primaryTypographyProps={{ fontWeight: 'medium' }}
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
            backgroundColor: theme.palette.background.default,
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
          backgroundColor: theme.palette.background.default,
          borderRight: 'none'
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