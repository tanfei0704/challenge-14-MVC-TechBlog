async function logout() {

  const response = await fetch('/api/users/logout', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json'
     }
  });

  if (response.ok) {
    document.location.replace('/');
    alert('You are logged out!')
  } else {
    alert('Fail to log out');
  }
}

document.querySelector('.logout').addEventListener('click', logout);