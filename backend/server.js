require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();

// ============================================
// CONFIGURACION
// ============================================

const allowedOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({
    origin: allowedOrigin === '*' ? true : allowedOrigin
}));

app.use(express.json());

// ============================================
// RUTA RAIZ
// ============================================

app.get('/', (req, res) => {
    res.json({
        message: 'API Rancho Inteligente funcionando',
        status: 'OK',
        endpoints: {
            ganado: '/api/ganado',
            vacunas: '/api/vacunas',
            veterinarios: '/api/veterinarios',
            inventario: '/api/inventario',
            alimentacion: '/api/alimentacion',
            rancheros: '/api/rancheros'
        }
    });
});

// ============================================
// RUTAS DE GANADO
// ============================================

// GET - Obtener todos los animales
app.get('/api/ganado', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM ganado');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET - Obtener un animal por ID
app.get('/api/ganado/:id', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM ganado WHERE id_animal = ?',
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'No encontrado' });
        }

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST - Crear animal
app.post('/api/ganado', async (req, res) => {
    try {
        const {
            nombre,
            especie,
            raza,
            edad,
            peso_kg,
            foto_url,
            estado = 'activo',
            id_ranchero = 1
        } = req.body;

        const [result] = await db.query(
            `INSERT INTO ganado 
            (nombre, especie, raza, edad, peso_kg, foto_url, estado, id_ranchero) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                nombre,
                especie,
                raza,
                edad,
                peso_kg,
                foto_url,
                estado,
                id_ranchero
            ]
        );

        res.status(201).json({
            id: result.insertId,
            message: 'Animal creado'
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT - Actualizar animal
app.put('/api/ganado/:id', async (req, res) => {
    try {
        const {
            nombre,
            especie,
            raza,
            edad,
            peso_kg,
            foto_url,
            estado = 'activo',
            id_ranchero = 1
        } = req.body;

        await db.query(
            `UPDATE ganado 
            SET nombre=?, especie=?, raza=?, edad=?, peso_kg=?, foto_url=?, estado=?, id_ranchero=? 
            WHERE id_animal=?`,
            [
                nombre,
                especie,
                raza,
                edad,
                peso_kg,
                foto_url,
                estado,
                id_ranchero,
                req.params.id
            ]
        );

        res.json({ message: 'Animal actualizado' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE - Eliminar animal
app.delete('/api/ganado/:id', async (req, res) => {
    try {
        await db.query(
            'DELETE FROM ganado WHERE id_animal = ?',
            [req.params.id]
        );

        res.json({ message: 'Animal eliminado' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// RUTAS DE VACUNAS
// ============================================

app.get('/api/vacunas', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                v.*, 
                g.nombre as animal_nombre,
                vet.nombre_completo as veterinario_nombre
            FROM vacuna v
            LEFT JOIN ganado g ON v.id_animal = g.id_animal
            LEFT JOIN veterinario vet ON v.id_veterinario = vet.id_veterinario
            ORDER BY v.id_vacuna DESC
        `);

        res.json(rows);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/vacunas', async (req, res) => {
    try {
        const { nombre_vacuna, id_animal, id_veterinario, fecha_aplicacion, proxima_dosis, observaciones } = req.body;

        const [result] = await db.query(
            `INSERT INTO vacuna (nombre_vacuna, id_animal, id_veterinario, fecha_aplicacion, proxima_dosis, observaciones) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [nombre_vacuna, id_animal, id_veterinario, fecha_aplicacion, proxima_dosis, observaciones || null]
        );

        res.status(201).json({ id: result.insertId, message: 'Vacuna creada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/vacunas/:id', async (req, res) => {
    try {
        const { nombre_vacuna, id_animal, id_veterinario, fecha_aplicacion, proxima_dosis, observaciones } = req.body;

        await db.query(
            `UPDATE vacuna SET nombre_vacuna=?, id_animal=?, id_veterinario=?, fecha_aplicacion=?, proxima_dosis=?, observaciones=? 
             WHERE id_vacuna=?`,
            [nombre_vacuna, id_animal, id_veterinario, fecha_aplicacion, proxima_dosis, observaciones || null, req.params.id]
        );

        res.json({ message: 'Vacuna actualizada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/vacunas/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM vacuna WHERE id_vacuna = ?', [req.params.id]);
        res.json({ message: 'Vacuna eliminada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// RUTAS DE VETERINARIOS
// ============================================

app.get('/api/veterinarios', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM veterinario');
        res.json(rows);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/veterinarios', async (req, res) => {
    try {
        const { nombre_completo, especialidad, telefono, sueldo } = req.body;

        const [result] = await db.query(
            `INSERT INTO veterinario (nombre_completo, especialidad, telefono, sueldo) 
             VALUES (?, ?, ?, ?)`,
            [nombre_completo, especialidad, telefono, sueldo || 0]
        );

        res.status(201).json({ id: result.insertId, message: 'Veterinario creado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/veterinarios/:id', async (req, res) => {
    try {
        const { nombre_completo, especialidad, telefono, sueldo } = req.body;

        await db.query(
            `UPDATE veterinario SET nombre_completo=?, especialidad=?, telefono=?, sueldo=? 
             WHERE id_veterinario=?`,
            [nombre_completo, especialidad, telefono, sueldo || 0, req.params.id]
        );

        res.json({ message: 'Veterinario actualizado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/veterinarios/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM veterinario WHERE id_veterinario = ?', [req.params.id]);
        res.json({ message: 'Veterinario eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// RUTAS DE INVENTARIO
// ============================================

app.get('/api/inventario', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM inventario');
        res.json(rows);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/inventario', async (req, res) => {
    try {
        const { tipo, nombre_item, cantidad, unidad, stock_minimo } = req.body;

        const [result] = await db.query(
            `INSERT INTO inventario (tipo, nombre_item, cantidad, unidad, stock_minimo) 
             VALUES (?, ?, ?, ?, ?)`,
            [tipo, nombre_item, cantidad, unidad, stock_minimo || 10]
        );

        res.status(201).json({ id: result.insertId, message: 'Inventario creado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/inventario/:id', async (req, res) => {
    try {
        const { tipo, nombre_item, cantidad, unidad, stock_minimo } = req.body;

        await db.query(
            `UPDATE inventario SET tipo=?, nombre_item=?, cantidad=?, unidad=?, stock_minimo=? 
             WHERE id_inventario=?`,
            [tipo, nombre_item, cantidad, unidad, stock_minimo || 10, req.params.id]
        );

        res.json({ message: 'Inventario actualizado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/inventario/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM inventario WHERE id_inventario = ?', [req.params.id]);
        res.json({ message: 'Inventario eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// RUTAS DE ALIMENTACION
// ============================================

app.get('/api/alimentacion', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                a.*, 
                g.nombre as animal_nombre
            FROM alimentacion a
            LEFT JOIN ganado g ON a.id_animal = g.id_animal
            ORDER BY a.id_alimentacion DESC
        `);

        res.json(rows);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/alimentacion', async (req, res) => {
    try {
        const { id_animal, tipo_alimento, cantidad, fecha } = req.body;

        const [result] = await db.query(
            `INSERT INTO alimentacion (id_animal, tipo_alimento, cantidad, fecha) 
             VALUES (?, ?, ?, ?)`,
            [id_animal, tipo_alimento, cantidad, fecha]
        );

        res.status(201).json({ id: result.insertId, message: 'Alimentación registrada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/alimentacion/:id', async (req, res) => {
    try {
        const { id_animal, tipo_alimento, cantidad, fecha } = req.body;

        await db.query(
            `UPDATE alimentacion SET id_animal=?, tipo_alimento=?, cantidad=?, fecha=? 
             WHERE id_alimentacion=?`,
            [id_animal, tipo_alimento, cantidad, fecha, req.params.id]
        );

        res.json({ message: 'Alimentación actualizada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/alimentacion/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM alimentacion WHERE id_alimentacion = ?', [req.params.id]);
        res.json({ message: 'Alimentación eliminada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// RUTAS DE RANCHEROS
// ============================================

app.get('/api/rancheros', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM ranchero ORDER BY id_ranchero DESC'
        );

        res.json(rows);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/rancheros', async (req, res) => {
    try {
        const { nombre, ubicacion, telefono, email } = req.body;

        const [result] = await db.query(
            `INSERT INTO ranchero (nombre, ubicacion, telefono, email) 
             VALUES (?, ?, ?, ?)`,
            [nombre, ubicacion, telefono, email]
        );

        res.status(201).json({ id: result.insertId, message: 'Ranchero creado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/rancheros/:id', async (req, res) => {
    try {
        const { nombre, ubicacion, telefono, email } = req.body;

        await db.query(
            `UPDATE ranchero SET nombre=?, ubicacion=?, telefono=?, email=? 
             WHERE id_ranchero=?`,
            [nombre, ubicacion, telefono, email, req.params.id]
        );

        res.json({ message: 'Ranchero actualizado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/rancheros/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM ranchero WHERE id_ranchero = ?', [req.params.id]);
        res.json({ message: 'Ranchero eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// INICIAR SERVIDOR
// ============================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});