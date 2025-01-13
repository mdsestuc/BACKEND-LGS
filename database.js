const mongoose = require('mongoose');
require('dotenv').config();
 
const URI = process.env.DB_MONGO //mongodb://localhost/guindi

const OPTIONS = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
};
 
mongoose.connect(URI, OPTIONS)
    .then(db => console.log('Base de datos conectada'))
    .catch(error => {
        console.error(error);
        process.exit(1); //Detener el servidor
    });
 
module.exports = mongoose;