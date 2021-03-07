const inquirer = require('inquirer');
const colors = require('colors');

const preguntas = [
  {
    type: 'list',
    name: 'opcion', // Nombre a destructurar para retornar (ver línea 27)
    message: '¿Qué desea realizar?',
    choices: [
      { value: 1, name: `${'1.'.green} Buscar ciudad` },
      { value: 2, name: `${'2.'.green} Historial` },
      { value: 0, name: `${'0.'.green} Salir` },
    ],
  },
];

const inquirerMenu = async () => {
  console.clear();
  console.log('========================'.green);
  console.log(' Selecione una opción '.white);
  console.log('========================\n'.green);

  const { opcion } = await inquirer.prompt(preguntas); /* Pass your questions in here */

  return opcion;
};

const pausa = async () => {
  const question = [
    {
      type: 'input',
      name: 'enter',
      message: `Presione ${'Enter'.green} para continuar`,
    },
  ];
  console.log('\n');
  await inquirer.prompt(question);
};

const leerInput = async (mensaje) => {
  const question = [
    {
      type: 'input',
      name: 'desc',
      message: mensaje,
      validate(value) {
        if (value.length === 0) {
          return 'Por favor ingrese un valor';
        }
        return true;
      },
    },
  ];

  const { desc } = await inquirer.prompt(question);
  return desc;
};

const listarLugares = async (lugares = []) => {
  const choices = lugares.map((lugar, index) => {
    const idx = `${index + 1}.`.green;

    return {
      value: lugar.id,
      name: `${idx} ${lugar.nombre}`,
    };
  });

  choices.unshift({
    value: '0',
    name: '0.'.green + ' Cancelar',
  });

  const preguntas = [
    {
      type: 'list',
      name: 'id',
      message: 'Seleccionar Lugar',
      choices: choices,
    },
  ];
  const { id } = await inquirer.prompt(preguntas);

  return id;
};

const confirmar = async (message) => {
  const question = [
    {
      type: 'confirm',
      name: 'ok',
      message,
    },
  ];

  const { ok } = await inquirer.prompt(question);

  return ok;
};

const mostrarListadoChecklist = async (tareas = []) => {
  const choices = tareas.map((tarea, index) => {
    const idx = `${index + 1}`.green;

    return {
      value: tarea.id,
      name: `${idx} ${tarea.desc}`,
      checked: tarea.completadoEn ? true : false,
    };
  });

  const pregunta = [
    {
      type: 'checkbox',
      name: 'ids',
      message: 'Selecciones',
      choices: choices,
    },
  ];
  const { ids } = await inquirer.prompt(pregunta);

  return ids;
};

module.exports = {
  inquirerMenu,
  pausa,
  leerInput,
  listarLugares,
  confirmar,
  mostrarListadoChecklist,
};
