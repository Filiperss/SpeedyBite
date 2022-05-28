import { useState } from 'react';

export default function useToken() {
    const getToken = () => {
        const tokenString = localStorage.getItem('token');
        const userToken = JSON.parse(tokenString);
        return userToken
    };

    const [token, setToken] = useState(getToken());

    const saveToken = userTokenData => {
    localStorage.setItem('token', JSON.stringify(userTokenData.access));
    localStorage.setItem('refresh', JSON.stringify(userTokenData.refresh));
    setToken(userTokenData.access);
  };

  return {
    setToken: saveToken,
    token
  }
}