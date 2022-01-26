const inquirer = require('inquirer');
require('colors');


const preguntas = [

    {
        type: 'list',
        name: 'options',
        message: 'Que desea hacer?',
        choices: [{
                value: 1,
                name: `${'1.'.green}Buscar Ciudad `
            },
            {
                value: 2,
                name: `${'2.'.green}Historial `
            },
            {
                value: 0,
                name: `${'0.'.green}Salir `
            },

        ]
    }

];


const inquirerMenu = async() => {


    console.clear();
    console.log('========================='.green);
    console.log('Seleccione una Opcion'.white);
    console.log('=========================\n'.green);

    const { options } = await inquirer.prompt(preguntas);

    return options;
}

const pausa = async() => {
    const pause = [{
        type: 'input',
        message: `\nPresione ${'ENTER'.green}\n`,
        name: 'Enter'
    }]

    console.log('\n');
    await inquirer.prompt(pause);

}


const leerInput = async(message) => {

    const question = [{
        type: 'input',
        name: 'description',
        message,
        validate(value) {
            if (value.length === 0) {
                return 'Porfavor Ingrese un Valor'
            }
            return true;
        }
    }];

    const { description } = await inquirer.prompt(question);

    return description;
}


const placesList = async(places = []) => {

    const choices = places.map((place, i) => {

        const idx = `${i+1}.`.green;

        return {
            value: place.id,
            name: `${idx}.  ${place.name}`
        }
    });


    choices.unshift({
        value: 0,
        name: '0.'.green + 'Cancelar',
    });

    const preguntas = [{
        type: 'list',
        name: 'id',
        message: 'Seleccione Lugar',
        choices
    }]

    const { id } = await inquirer.prompt(preguntas);

    return id

}



const confirm = async(message) => {

    const quetion = [{
        type: 'confirm',
        name: 'ok',
        message,
    }]

    const { ok } = await inquirer.prompt(quetion);
    return ok;

}


module.exports = {
    inquirerMenu,
    pausa,
    leerInput,
    placesList,
    confirm,
}