import React, { useState, lazy, Suspense } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import styles from './index.module.scss';

const navLinks = [
  { title: 'Home', path: '/' },
  { title: 'Weather', path: '/weather' },
];

const Home = lazy(() => import('./components/home/Home'));
const Weather = lazy(() => import('./components/weather/Weather'));
const FullDetailsWeatherPage = lazy(
  () => import('./components/fullDetailsWeatherPage/FullDetailsWeatherPage'),
);

const App: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  return (
    <>
      <AppBar position="static" className={styles.navbar}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            sx={{ display: { xs: 'block', sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            <b>WF</b>
          </Typography>

          <Box
            sx={{
              display: {
                xs: 'none',
                sm: 'block',
                display: 'flex',
                justifyContent: 'center',
                flexGrow: 1,
              },
            }}
          >
            {navLinks.map(link => (
              <Button
                key={link.title}
                color="inherit"
                component={Link}
                to={link.path}
                disabled={location.pathname === link.path}
                sx={{
                  fontWeight:
                    location.pathname === link.path ? 'bold' : 'normal',
                  borderBottom:
                    location.pathname === link.path
                      ? '2px solid white'
                      : 'none',
                }}
              >
                {link.title}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
        >
          <List>
            {navLinks.map(link => (
              <ListItem key={link.title} component={Link} to={link.path}>
                <ListItemText
                  primary={link.title}
                  sx={{
                    color: location.pathname === link.path ? 'red' : 'blue',
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Suspense fallback={<p>Loading...</p>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/details/:city" element={<FullDetailsWeatherPage />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
