const fs = require('fs');

const axios = require('axios');

const languages = 'es';


class search {

    register = [];
    dbPath = './db/database.json';



    get paramsMapbox() {
        return {
            'language': languages,
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5
        };
    }

    get paramsWeather() {
        return {
            appid: process.env.OPENWEATHER_KEY,
            units: 'metric',
            languague: languages,
        }
    }

    constructor() {
        //TODO: Leer base de datos si existe
        this.readDatabase();
    }

    async city(place = '') {


        try {

            //creamos la instancia
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json`,
                params: this.paramsMapbox,
            })


            const answer = await instance.get();


            return answer.data.features.map(zone => ({
                id: zone.id,
                name: zone.place_name,
                lng: zone.center[0],
                lat: zone.center[1],
            }));



        } catch (error) {
            console.error('Hubo un error en el get de la busqueda de la ciudad');
            return [];
        }

    }

    async placesWeather(lat, lon) {

        try {

            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {...this.paramsWeather, lat, lon }
            });

            const answer = await instance.get();

            const { weather, main } = answer.data;

            return {
                description: weather[0].description,
                temp: main.temp,
                temp_min: main.temp_min,
                temp_max: main.temp_max,
            }

        } catch (error) {
            console.error(error);
            return {
                error: error,
                message: 'Hubo en error al buscar el clima del lugar'
            }
        }

    }

    addHistory(place = '') {

        //Prevenir duplicados
        if (this.register.includes(place.toLowerCase())) {
            return;
        }

        this.register.unshift(place.toLowerCase());

        //Grabar en db
        this.saveDatabase();

    }

    saveDatabase() {

        const payload = {
            historial: this.register,
        };

        fs.writeFileSync(this.dbPath, JSON.stringify(payload));

    }

    readDatabase() {

        if (!fs.existsSync(this.dbPath)) {
            return null;
        }

        const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8' });
        const data = JSON.parse(info);
        //console.log(data);
        const registers = data.historial.splice(0, 5);
        this.register = registers; //{...data };

    }

}


module.exports = search;