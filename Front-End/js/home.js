/* eslint-disable no-undef */
import { logout } from './login.js';
import {
  GetPublicOcurrencies,
  findUserId,
  formatDate,
  isTokenValid
} from './scripts.js';
import { GeoLocalizationToAdress } from './scripts.js';

const title = document.getElementById('titulo');
const data = document.getElementById('data');
const hora = document.getElementById('hora');
const local = document.getElementById('local');
const tipo = document.getElementById('tipo');
const status = document.getElementById('status');
const addOcorrencia = document.getElementById('adicionar__ocorrencia');

let location = {
  type: 'Point',
  coordinates: []
};

const loadSpinner = document.createElement('div');
loadSpinner.className = 'lds-ring';
loadSpinner.innerHTML = `
  <div></div>
  <div></div>
  <div></div>
  <div></div>
`;

let isDone = false;

addOcorrencia?.addEventListener('click', async (e) => {
  addOcorrencia.disabled = isDone;
  addOcorrencia.replaceChildren(loadSpinner);
  e.preventDefault();
  const isPublic = status.value === 'publica';
  const { _id, token } = await findUserId();
  const ocurrencyData = {
    userId: _id,
    title: title.value,
    date: data.value,
    time: hora.value,
    location,
    type: tipo.value,
    public: isPublic
  };
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(ocurrencyData)
  };
  await fetch('http://localhost:3000/ocurrency', options)
    .then((response) => response.json())
    .then((data) => {
      isDone = true;
      if (data.message) {
        iziToast.error({
          title: 'Erro ao cadastrar ocorrência',
          message: data.message
        });
        addOcorrencia.disabled = isDone;
      } else {
        alert('Ocorrência cadastrada com sucesso!');
        window.location.href = './home.html';
        addOcorrencia.disabled = isDone;
      }
    })
    .finally(() => {
      addOcorrencia.replaceChildren('Adicionar');
    });
});

// Pop Up

const logoutButton = document.querySelector('.button-logoff');
const popup = document.querySelector('.popup');
const confirmButton = document.getElementById('confirmButton');
const cancelButton = document.getElementById('cancelButton');

logoutButton.addEventListener('click', () => {
  popup.style.display = 'flex';
});

confirmButton.addEventListener('click', () => {
  logout();
});

cancelButton.addEventListener('click', () => {
  popup.style.display = 'none';
});

// mapa
let actualPos = [-6.892101664756008, -38.55633394935698];

var map = L.map('map').setView(actualPos, 14);
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition((position) => {
    actualPos = [position.coords.latitude, position.coords.longitude];
    map.setView(actualPos, 14);
  });
}

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var googleStreets = L.tileLayer(
  'http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}',
  {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
  }
);

let marker;
async function AddMarker(e) {
  if (marker) {
    map.removeLayer(marker);
  }
  marker = L.marker([e.latlng.lat, e.latlng.lng]);
  marker.addTo(map);
  map.setView([e.latlng.lat, e.latlng.lng]);
  location.coordinates[1] = e.latlng.lat;
  location.coordinates[0] = e.latlng.lng;
  let adress = await GeoLocalizationToAdress(e.latlng);
  local.value = `${adress.road}, ${adress.neighbourhood} - ${adress.city_district} - ${adress.state}`;
}

map.on('click', (e) => AddMarker(e));

const redIcon = new L.Icon({
  iconUrl: '../assets/red_marker.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

window.onload = async () => {
  if (!(await isTokenValid())) {
    window.location.href = '../index.html';
  }

  const occurrencies = await GetPublicOcurrencies();
  if (occurrencies?.message) {
    alert(occurrencies.message);
  }
  if (!occurrencies) {
    alert('Não há ocorrências públicas cadastradas!');
  }
  occurrencies?.map((ocurrency) => {
    const isPublic = ocurrency.public ? 'Pública' : 'Privada';
    L.marker(
      [ocurrency?.location.coordinates[1], ocurrency?.location.coordinates[0]],
      { icon: redIcon }
    )
      .bindPopup(
        `<b><h2>${ocurrency.title}</h2></b><br>${formatDate(
          ocurrency.date
        )} - ${ocurrency.time}<br>${isPublic}<br>${ocurrency.type}<br>`
      )
      .addTo(map);
  });
};

googleStreets.addTo(map);
