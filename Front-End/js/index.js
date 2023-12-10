/* eslint-disable no-undef */
import { login, register } from './login.js';
import { isTokenValid } from './scripts.js';

const loadSpinner = document.createElement('div');
loadSpinner.className = 'lds-ring';
loadSpinner.innerHTML = `
  <div></div>
  <div></div>
  <div></div>
  <div></div>
`;

window.onload = async () => {
  if (await isTokenValid()) {
    window.location.href = './html/home.html';
  }
};
let isLoading = false;
const loginButton = document.getElementById('signin');

loginButton?.addEventListener('click', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('senha').value;
  isLoading = true;
  loginButton.replaceChildren(loadSpinner);
  await login(email, password)
    .then(() => {
      isLoading = false;
      loginButton.replaceChildren('Entrar');
    })
    .catch(() => {
      isLoading = false;
      loginButton.replaceChildren('Entrar');
    });
});

const registerButton = document.getElementById('signup');

registerButton?.addEventListener('click', async (e) => {
  e.preventDefault();
  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('senha').value;
  const telefone = document.getElementById('telefone').value;
  await register(nome, email, password, telefone);
});
