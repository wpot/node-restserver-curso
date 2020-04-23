//puerto


process.env.PORT = process.env.PORT || 3000;


//Entorno


process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//vencimiento del token

process.env.CADUCIDAD_TOKEN = '48h';

// seed de autentificacion


//base de datos

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';


//google client

process.env.CLIENT_ID = process.env.CLIENT_ID || '623057896937-qkhs4uudsca200rn8ppfknhjudsues21.apps.googleusercontent.com';



let urlDB;

if (process.env.NODE_ENV == 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;