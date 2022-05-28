import React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Alert from '@mui/material/Alert'

import { createRoot } from 'react-dom/client';

async function loginUser(credentials) {

    let res = await fetch('http://localhost:8000/webservice/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      })
    
    return res.json()
    
}

const theme = createTheme();

// const [username, setUserName] = useState();
// const [password, setPassword] = useState();

export default function SignIn({setToken}) {

  const handleSubmit = async e => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    try{
      const tokenData = await loginUser({
        username: data.get('username'),
        password: data.get('password'),
      });
      
      if(tokenData.username || tokenData.password){
        throw new Error('Fields Required')
      }
      setToken(tokenData);
      // window.location.href = '/';
    }catch(err) {
      console.log(err)

      const container = document.getElementById('alert');
      const root = createRoot(container);
      root.render(<Alert severity="error">{err.message}</Alert>);
    }

  }

  return (
    <ThemeProvider theme={theme}>
      <Container id="container-login" component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <h1 style={{ color: "red" }}><i>SpeedyBite</i></h1>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Container>
      <div id="alert" style={{position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: '0'}}></div>
    </ThemeProvider>
  );
}