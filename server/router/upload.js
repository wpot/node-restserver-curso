const express = require('express');
const fileUpload = require('express-fileupload');

const app = express();


const Usuario = require('../models/usuario');

const Producto = require('../models/producto');

const fs = require('fs');

const path = require('path');

app.use(fileUpload({ useTempFiles: true }));


app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({

            ok: false,
            err: {
                message: 'no se a enviado ningun archivo'
            }

        });
    }

    //validar tipo

    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'los tipos permitidos son produtos y usuarios'

            }
        });
    }


    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];


    //extensiones permitidas

    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {

        return res.status(400).json({
            ok: false,
            err: {
                message: 'las extensiones validas son ' + extensionesValidas.join(', '),
                ext: extension
            }

        });

    }

    //cambiar nombre del archivo

    let nombreArchivo = `${ id }-${new Date().getMilliseconds()}.${extension}`;

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        if (tipo === 'usuarios') {
            ImagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }



    });

});

function ImagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'usuario no existe'
                }

            });
        }

        if (!usuarioDB) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'usuario no existe'
                }

            });

        }

        borraArchivo(usuarioDB.img, 'usuarios');
        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioDB) => {

            res.json({
                ok: true,
                usuario: usuarioDB,
                img: nombreArchivo

            });

        });

    });


}

function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'producto no existe'
                }

            });
        }

        if (!productoDB) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'producto no existe'
                }

            });

        }

        borraArchivo(productoDB.img, 'productos');
        productoDB.img = nombreArchivo;

        productoDB.save((err, productoDB) => {

            res.json({
                ok: true,
                usuario: productoDB,
                img: nombreArchivo

            });

        });

    });

}

function borraArchivo(nombreImagen, tipo) {

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);

    if (fs.existsSync(pathImagen)) {


        fs.unlinkSync(pathImagen);

    }

}

module.exports = app;