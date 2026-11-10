
const mongoose = require("mongoose");

const dbconnect = () => {
    mongoose.set("strictQuery", true);

    return mongoose.connect("mongodb://127.0.0.1:27017/login_node")
        .then(() => {
            console.log("Conexión con MongoDB establecida correctamente");
        })
        .catch((error) => {
            console.log("Error de conexión:", error.message);
            throw error;
        });
};

module.exports = dbconnect;
