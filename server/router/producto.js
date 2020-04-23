const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');


let app = express();

let Producto = require('../models/producto');


app.get('/productos', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({ disponible: true }, )
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({

                    ok: false,
                    err

                });
            }

            res.json({
                ok: true,
                productos

            });

        });


});


app.get('/productos/:id', verificaToken, (req, res) => {

    let desde = req.query.desde || 0
    desde = Number(desde);

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({

                    ok: false,
                    err

                });
            }

            if (!productos) {
                return res.status(400).json({

                    ok: false,
                    err: {
                        message: 'id no existe'
                    }

                });
            }

            res.json({
                ok: true,
                productos

            });

        });


});

// buscar productos

app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({

                    ok: false,
                    err

                });

            }

            res.json({
                ok: true,
                productos
            });

        });

});


app.post('/productos', verificaToken, (req, res) => {

    let body = req.body;

    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({

                ok: false,
                err

            });
        }

        res.status(201).json({

            ok: true,
            producto: productoDB

        });

    });

});

app.put('/productos/:id', verificaToken, (req, res) => {


    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            res.status(400).json({
                ok: false,
                err: {
                    message: 'no existe el id'
                }
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        productoDB.save((err, productoGuardado) => {

            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoGuardado

            });

        });



    });


});

app.delete('/productos/:id', verificaToken, (req, res) => {


    let: id = req.params.id;

    Producto.findById(id, (err, producto) => {

        if (err) {
            res.status(500).json({
                ok: false,
                err: {
                    message: 'no existe el id'
                }
            });
        }

        producto.disponible = false;

        producto.save((err, productoBorrado) => {

            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productoBorrado

            });


        });

    })

});






module.exports = app;