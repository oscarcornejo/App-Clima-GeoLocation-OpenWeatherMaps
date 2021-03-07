require('dotenv').config();
const { leerInput, inquirerMenu, pausa, listarLugares } = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');

const main = async () => {
  const busquedas = new Busquedas();
  let opt;

  do {
    opt = await inquirerMenu();

    switch (opt) {
      case 1:
        //   Mostrar Mensaje
        const termino = await leerInput('Ciudad: ');

        // Buscar Los Lugares
        const lugares = await busquedas.ciudades(termino);

        // Seleccionar el Lugar
        const id = await listarLugares(lugares);
        if (id === '0') continue;

        const lugarSeleccionado = lugares.find((item) => item.id === id);
        busquedas.agregarHistorial(lugarSeleccionado.nombre);

        // Clima
        const clima = await busquedas.climaLugar(lugarSeleccionado.lat, lugarSeleccionado.lng);

        // Mostrar Resultados
        console.clear();
        console.log('\nInformación de la Ciudad\n'.green);
        console.log('Ciudad: ', `${lugarSeleccionado.nombre}`.green);
        console.log('Lat: ', lugarSeleccionado.lat);
        console.log('Lng: ', lugarSeleccionado.lng);
        console.log('Temperatura: ', clima.temp);
        console.log('Mínima: ', clima.min);
        console.log('Máxima: ', clima.max);
        console.log('¿Cómo está el clima?:', `${clima.desc}`.green);

        break;
      case 2:
        busquedas.historialCapitalizado.forEach((lugar, index) => {
          const idx = `${index + 1}.`.green;
          console.log(`${idx} ${lugar}`);
        });
        break;
    }

    if (opt !== 0) await pausa();
  } while (opt !== 0);
};

main();
