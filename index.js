require('dotenv').config();

const search = require('./models/search.js');
//Importaciones de clases,modelos, middlewares,etc....
const { leerInput, inquirerMenu, pausa, placesList } = require('./helpers/inquirer.js');


const main = async() => {

    console.clear();
    let option;
    const searchObject = new search; //instancia de la clase search

    do {

        option = await inquirerMenu();
        console.log({ option });


        switch (option) {
            case 1:
                console.clear();
                //Mostrar Mensaje
                const termReceived = await leerInput('Ciudad: ');

                //Buscar los lugares
                const places = await searchObject.city(termReceived);

                //Seleccionar el lugar
                const id = await placesList(places);

                if (id === 0) continue;

                const placeReceived = places.find(l => l.id === id);

                searchObject.addHistory(placeReceived.name);

                //Mostrar datos del clima de ese lugar
                const { temp, temp_max, temp_min, description } = await searchObject.placesWeather(
                    placeReceived.lat,
                    placeReceived.lng
                );

                //Mostrar resultados
                console.clear();
                console.log('\nInformacion de la Ciudad\n'.green);
                console.log('Ciudad: ', placeReceived.name);
                console.log('Lat: ', placeReceived.lat);
                console.log('Lng: ', placeReceived.lng);
                console.log('Temperatura: ', temp);
                console.log('Minima: ', temp_min);
                console.log('Maxima: ', temp_max);
                console.log('El clima esta como: ', description);

                break;

            case 2:
                searchObject.register.forEach((place, index) => {
                    const idx = `${index + 1}.`.green;
                    const placeCapitalizated = place.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
                    console.log(`${idx} ${placeCapitalizated}`);
                });

            default:
                break;
        }

        if (option !== 0) {
            await pausa();
        }

    } while (option !== 0);

}


main();