/* eslint-disable no-undef */
const createCookie = (token) => {
  let validade = '8';
  let date = new Date();
  date.setTime(date.getTime() + validade * 60 * 60 * 1000);
  validade = '; expires=' + date.toUTCString();
  document.cookie = 'token' + '=' + token + validade + '; path=/';
};

const readCookie = () => {
  let nameEQ = 'token' + '=';
  let ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

const deleteCookie = () => {
  let date = new Date();
  date.setTime(date.getTime() - 1);
  let expires = '; expires=' + date.toUTCString();
  document.cookie = 'token' + '=; path=/' + expires;
};

const checkCookie = () => {
  let token = readCookie();
  if (!token) {
    return false;
  }
  return true;
};

const login = async (email, password) => {
  const url = 'http://localhost:3000/login';
  const data = {
    email: email,
    password: password
  };
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  };
  await fetch(url, options)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.token) {
        iziToast.success({
          title: 'Login realizado com sucesso'
        });
        createCookie(data.token);
        window.location.href = './html/home.html';
      } else {
        iziToast.error({
          title: 'Erro ao fazer login',
          message: data.message
        });
      }
    });
};

const logout = () => {
  deleteCookie();
  window.location.href = '../index.html';
};

const register = async (nome, email, password, telefone) => {
  const url = 'http://localhost:3000/user';
  const data = {
    name: nome,
    email: email,
    password: password,
    phone: telefone
  };
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  };
  await fetch(url, options)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.token) {
        createCookie(data.token);
        window.location.href = './home.html';
      } else {
        alert('Erro ao cadastrar usuário');
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export { login, logout, register, checkCookie, readCookie, deleteCookie };
