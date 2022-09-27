async function SendRequest(url, method, body) {
    
    const options = {
        method: method,
        headers: new Headers({'content-type': 'application/json'}),
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify(body)
    };

    return await fetch(url, options);
}

async function GetAuthenticatedUser() {

    let account_authentication = await SendRequest('http://localhost:5000/auth/getcurrentuser', 'GET');
    
    let account_authentication_data = await account_authentication.text();

    return account_authentication_data;
  
}

async function loginUser(email, password) {

    let account_authentication = await SendRequest('http://localhost:5000/auth/authenticatelocal', 'POST',
    { 
      username: email,
      password: password
        
    });
      
    let account_authentication_data = await account_authentication.text();

    return account_authentication_data;
}

async function logoutUser(e) {

    let account_authentication = await SendRequest('http://localhost:5000/auth/logout', 'DELETE');
    
    let account_authentication_data = await account_authentication.text();

    return account_authentication_data; 
}

function validateEmail(email) 
{
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
    {
      return true;
    }
      return false;
}

function checkNameLength(name) {

    if (name.length < 3 || name.length > 40) {
      return false;
    }

    return true;
}

function checkName(name) {

    if (name.indexOf(' ') >= 0 || !name.match(/^[a-zA-Z\s]+$/i)) {
      return false;
    }
    return true;
}

export { SendRequest, GetAuthenticatedUser, loginUser ,logoutUser, validateEmail, checkNameLength, checkName }