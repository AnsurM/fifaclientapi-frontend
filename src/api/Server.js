import React from 'react';

export default getRequest(url)
{
    fetch(url ,{
        method: 'get',
        headers: {'Content-Type': 'application/json'}
    })
    .then(response => response.json()) 
    .then(data => {
        return data;
    })
    .catch(function (error) {
        console.log(error);
        return error;
    });

}

export default postRequest (url, payload)
{
    fetch(url ,{
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    })
    .then(response => response.json()) 
    .then(data => {
        return data;
    })
    .catch(function (error) {
        console.log(error);
        return error;
    });

}
