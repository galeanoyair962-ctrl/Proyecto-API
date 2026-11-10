
const express = require("express");
const dbconnect = require("./config");
const ModeUser = require("./model");

const app = express();
const router = express.Router();

// Configuración para recibir datos JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// RUTA PRINCIPAL
// ==========================================

app.get("/", (req, res) => {
    res.send("API de registro de usuarios funcionando correctamente");
});

// ==========================================
// REGISTRAR UN USUARIO
// ==========================================

router.post("/", async (req, res) => {
    try {
        console.log("Datos recibidos:", req.body);

        if (!req.body || !req.body.nomuser || !req.body.Password) {
            return res.status(400).json({
                error: "No se recibieron nomuser y Password correctamente",
                datos_recibidos: req.body
            });
        }

        const respuesta = await ModeUser.create({
            nomuser: req.body.nomuser,
            Password: req.body.Password
        });

        res.status(201).json(respuesta);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

// ==========================================
// INICIAR SESIÓN (LOGIN)
// ==========================================

router.post("/login", async (req, res) => {
    try {
        const { nomuser, Password } = req.body;

        if (!nomuser || !Password) {
            return res.status(400).json({
                mensaje: "Debe ingresar usuario y contraseña"
            });
        }

        const usuario = await ModeUser.findOne({
            nomuser: nomuser,
            Password: Password
        });

        if (!usuario) {
            return res.status(401).json({
                mensaje: "Error en la autenticación. Usuario o contraseña incorrectos"
            });
        }

        res.status(200).json({
            mensaje: "Autenticación satisfactoria",
            nomuser: usuario.nomuser
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

// ==========================================
// CONSULTAR TODOS LOS USUARIOS
// ==========================================

router.get("/", async (req, res) => {
    try {
        const respuesta = await ModeUser.find({});

        res.status(200).json(respuesta);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

// ==========================================
// CONSULTAR UN USUARIO POR SU ID
// ==========================================

router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const respuesta = await ModeUser.findById(id);

        if (!respuesta) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado"
            });
        }

        res.status(200).json(respuesta);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

// ==========================================
// ACTUALIZAR UN USUARIO POR SU ID
// ==========================================

router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { nomuser, Password } = req.body;

        if (!nomuser || !Password) {
            return res.status(400).json({
                mensaje: "Debe enviar nomuser y Password"
            });
        }

        const respuesta = await ModeUser.findByIdAndUpdate(
            id,
            {
                nomuser: nomuser,
                Password: Password
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!respuesta) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado"
            });
        }

        res.status(200).json(respuesta);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

// ==========================================
// ELIMINAR UN USUARIO POR SU ID
// ==========================================

router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const respuesta = await ModeUser.findByIdAndDelete(id);

        if (!respuesta) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado"
            });
        }

        res.status(200).json({
            mensaje: "Usuario eliminado correctamente"
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

// ==========================================
// ACTIVAR LAS RUTAS DE USUARIOS
// ==========================================

app.use("/usuarios", router);

// ==========================================
// CONECTAR MONGODB E INICIAR SERVIDOR
// ==========================================

dbconnect()
    .then(() => {
        app.listen(3000, () => {
            console.log("Servidor ejecutándose en http://localhost:3000");
        });
    })
    .catch((error) => {
        console.error("Error de conexión:", error);
    });
