import { useState } from 'react';

export default async function requestToken(token,setToken) {
    const refreshString = localStorage.getItem('refresh');
    const refresh = JSON.parse(refreshString);


    try{
        let res = await requestAPI({refresh})

        if(res.code === "token_not_valid"){
            console.log('hey!')
            throw new Error(res.detail)
        }

        setToken(res,false)
    }catch(e){
        localStorage.clear();
        token = undefined
    }

    return token
}

async function requestAPI(content){
    let res = await fetch('http://localhost:8000/webservice/token/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(content)
      })
      
    return res.json()
}