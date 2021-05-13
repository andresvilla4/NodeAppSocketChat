const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utilidades/utilidades');

const usuarios = new Usuarios();

io.on('connection', (client) => {
    client.on('entrarChat', (data, callback) => {
        console.log(data);

        if (!data.nombre || !data.sala) {
            return callback({
                error: true,
                mensaje: 'El nombre es necesario'
            });
        }
        client.join(data.sala);

        let personas = usuarios.agregarPersona(client.id, data.nombre, data.sala);
        client.broadcast.emit('listaPersona', usuarios.getPersonas());
        callback(personas);
    });

    client.on('crearMensaje', (data) => {
        //let persona = usuarios.getPersona(client.id);
        //let mensaje = crearMensaje(persona.nombre, data.mensaje);
        let mensaje = crearMensaje(data.nombre, data.mensaje);
        client.broadcast.emit('crearMensaje', mensaje);
    });

    client.on('disconnect', () => {
        let personaBorrada = usuarios.borrarPersona(client.id);
        //client.broadcast.emit('crearMensaje', { usuario: 'Administrador', mensaje: `${personaBorrada.nombre} abandonó el chat` });
        client.broadcast.emit('crearMensaje', crearMensaje('Administrador', 'Alguien abandonó el chat'));
        client.broadcast.emit('listaPersona', usuarios.getPersonas());
    });

    //Mensaje privados
    client.on('mensajePrivado', data => {
        let persona = usuarios.getPersona(client.id);
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
    });
});