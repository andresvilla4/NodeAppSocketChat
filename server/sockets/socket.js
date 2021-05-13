const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');


io.on('connection', (client) => {
    client.on('entrarChat', (data, callback) => {
        if (!data.nombre) {
            return callback({
                error: true,
                mensaje: 'El nombre es necesario'
            });
        }

        let personas = usuarios.agragarPersona(client.id, data.nombre);

        callback(personas);
    });
});