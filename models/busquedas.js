const fs = require('fs');
const axios = require('axios');

class Busquedas {
  historial = [];
  dbPath = './db/dataBase.json';

  constructor() {
    // Leer DB si existe
    this.leerDB();
  }

  get historialCapitalizado() {
    return this.historial.map((item) => {
      let palabras = item.split(' ');
      palabras = palabras.map((p) => p[0].toUpperCase() + p.substring(1));

      return palabras.join(' ');
    });
  }

  get paramsMapbox() {
    return {
      access_token: process.env.MAPBOX_KEY,
      autocomplete: true,
      limit: 5,
      language: 'es',
    };
  }

  get paramsWeather() {
    return {
      appid: process.env.OPENWEATHER_KEY,
      units: 'metric',
      lang: 'es',
    };
  }

  async ciudades(lugar = '') {
    try {
      // Petición HTTP

      const API = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
        params: this.paramsMapbox,
      });

      const response = await API.get();
      return response.data.features.map((item) => ({
        id: item.id,
        nombre: item.place_name,
        lng: item.center[0],
        lat: item.center[1],
      })); // Retorna los lugares
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async climaLugar(lat, lon) {
    try {
      const API = axios.create({
        baseURL: `https://api.openweathermap.org/data/2.5/weather`,
        params: { ...this.paramsWeather, lat, lon },
      });

      const response = await API.get();
      const { weather, main } = response.data;

      return {
        desc: weather[0].description,
        min: main.temp_min,
        max: main.temp_max,
        temp: main.temp,
      };
    } catch (error) {
      console.log(error);
    }
  }

  agregarHistorial(lugar = '') {
    // Prvenir lugares duplicados
    if (this.historial.includes(lugar.toLocaleLowerCase())) {
      return;
    }

    //  Se quita el último del historial
    this.historial = this.historial.splice(0, 5);

    //  Se agrega al inico del arreglo
    this.historial.unshift(lugar.toLocaleLowerCase());

    // grabar en DB
    this.guardarDB();
  }

  guardarDB() {
    const payload = {
      historial: this.historial,
    };

    fs.writeFileSync(this.dbPath, JSON.stringify(payload));
  }

  leerDB() {
    // Se comprueba si el archivo existe
    if (!fs.existsSync(this.dbPath)) {
      return;
    }

    // Se carga la información desde el Archivo
    const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8' });
    const data = JSON.parse(info);
    this.historial = data.historial;
  }
}

module.exports = Busquedas;
