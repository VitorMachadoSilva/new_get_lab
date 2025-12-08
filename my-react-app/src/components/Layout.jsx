// Layout principal: AppBar + Drawer com navegação condicional por papel do usuário.
import { useState } from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Button
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Computer as ComputerIcon,
  CalendarMonth as CalendarIcon,
  AdminPanelSettings as AdminIcon,
  AccountCircle,
  Logout,
  Person
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import GetLabIcon from '../assets/GetLab-Branco-Png.png';

const drawerWidth = 240;

export default function Layout({ user, children, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    { text: 'Laboratórios', icon: <ComputerIcon />, path: '/' },
    { text: 'Minhas Reservas', icon: <CalendarIcon />, path: '/my-reservations' },
    { text: 'Reservas do Dia', path: '/reservas' }, // ADICIONE ESTA LINHA
    { text: 'Meu Perfil', icon: <Person />, path: '/profile' },
  ];

  if (user.role === 'ADMIN') {
    menuItems.push({ text: 'Painel Admin', icon: <AdminIcon />, path: '/admin' });
  }

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Parte superior com logo */}
      <Box>
        <Toolbar sx={{backgroundColor:'#1c286d'}}>
          <Typography variant="h6" noWrap component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#fff' }}>
            Get Lab
            <img 
              src={GetLabIcon}
              alt="GetLab Logo"
              style={{ width: 50, marginBottom:0 }}
            />
          </Typography>
        </Toolbar>
        <Divider />
      </Box>

      {/* Lista de menu items - ocupa o espaço disponível */}
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Botão Sair fixado no canto inferior */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button
          fullWidth
          variant="outlined"
          color="error"
          startIcon={<Logout />}
          onClick={onLogout}
          sx={{
            justifyContent: 'flex-start',
            py: 1.5,
            textTransform: 'none',
            fontWeight: 'bold'
          }}
        >
          Sair
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar sx={{backgroundColor: "#1c286d"}}>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Sistema de Reserva de Laboratórios
          </Typography>
          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
              <Typography variant="body2" sx={{ ml: 1 }}>
                {user.name}
              </Typography>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={onLogout}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Sair
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              overflow: 'hidden', // Para garantir que o layout flex funcione
            }, 
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}