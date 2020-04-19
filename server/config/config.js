//puerto


process.env.PORT = process.env.PORT || 3000;


//Entorno


process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//base de datos


let urlDB;

if (process.env.NODE_ENV == 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://Wpot:nXgnKJvvUIwmdlaz@cluster0-hgqok.mongodb.net/cafe';
}

process.env.URLDB = urlDB;