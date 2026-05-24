const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// ESTO ES LO ÚNICO QUE CAMBIA - el puerto
const PORT = process.env.PORT || 3000;

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
        const [rows] = await db.query('SELECT * FROM ganado WHERE id_animal = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'No encontrado' });
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
            estado = 'activo',
            id_ranchero = 1
        } = req.body;
        const peso_kg = req.body.peso_kg ?? req.body.peso;
        const foto_url = req.body.foto_url ?? req.body.foto ?? '';

        const [result] = await db.query(
            'INSERT INTO ganado (nombre, especie, raza, edad, peso_kg, foto_url, estado, id_ranchero) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [nombre, especie, raza, edad, peso_kg, foto_url, estado, id_ranchero]
        );
        res.status(201).json({ id: result.insertId, message: 'Animal creado' });
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
            estado = 'activo',
            id_ranchero = 1
        } = req.body;
        const peso_kg = req.body.peso_kg ?? req.body.peso;
        const foto_url = req.body.foto_url ?? req.body.foto ?? '';

        await db.query(
            'UPDATE ganado SET nombre=?, especie=?, raza=?, edad=?, peso_kg=?, foto_url=?, estado=?, id_ranchero=? WHERE id_animal=?',
            [nombre, especie, raza, edad, peso_kg, foto_url, estado, id_ranchero, req.params.id]
        );
        res.json({ message: 'Animal actualizado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE - Eliminar animal
app.delete('/api/ganado/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM ganado WHERE id_animal = ?', [req.params.id]);
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
            SELECT v.*, g.nombre as animal_nombre, vet.nombre_completo as veterinario_nombre
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

app.get('/api/vacunas/:id', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT v.*, g.nombre as animal_nombre, vet.nombre_completo as veterinario_nombre
            FROM vacuna v
            LEFT JOIN ganado g ON v.id_animal = g.id_animal
            LEFT JOIN veterinario vet ON v.id_veterinario = vet.id_veterinario
            WHERE v.id_vacuna = ?
        `, [req.params.id]);

        if (rows.length === 0) return res.status(404).json({ error: 'No encontrado' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/vacunas', async (req, res) => {
    try {
        const {
            nombre_vacuna,
            vacuna,
            fecha_aplicacion,
            fecha,
            proxima_dosis,
            observaciones = '',
            id_animal,
            id_veterinario
        } = req.body;

        const [result] = await db.query(
            'INSERT INTO vacuna (nombre_vacuna, fecha_aplicacion, proxima_dosis, observaciones, id_animal, id_veterinario) VALUES (?, ?, ?, ?, ?, ?)',
            [nombre_vacuna ?? vacuna, fecha_aplicacion ?? fecha, proxima_dosis || null, observaciones, id_animal, id_veterinario]
        );

        res.status(201).json({ id: result.insertId, message: 'Vacuna creada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/vacunas/:id', async (req, res) => {
    try {
        const {
            nombre_vacuna,
            vacuna,
            fecha_aplicacion,
            fecha,
            proxima_dosis,
            observaciones = '',
            id_animal,
            id_veterinario
        } = req.body;

        await db.query(
            'UPDATE vacuna SET nombre_vacuna=?, fecha_aplicacion=?, proxima_dosis=?, observaciones=?, id_animal=?, id_veterinario=? WHERE id_vacuna=?',
            [nombre_vacuna ?? vacuna, fecha_aplicacion ?? fecha, proxima_dosis || null, observaciones, id_animal, id_veterinario, req.params.id]
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
        const { nombre_completo, nombre, telefono, especialidad, sueldo, fecha_contratacion = null } = req.body;
        const [result] = await db.query(
            'INSERT INTO veterinario (nombre_completo, telefono, especialidad, sueldo, fecha_contratacion) VALUES (?, ?, ?, ?, ?)',
            [nombre_completo ?? nombre, telefono ?? '', especialidad ?? '', sueldo ?? 0, fecha_contratacion]
        );
        res.status(201).json({ id: result.insertId, message: 'Veterinario creado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/veterinarios/:id', async (req, res) => {
    try {
        const { nombre_completo, nombre, telefono, especialidad, sueldo, fecha_contratacion = null } = req.body;
        await db.query(
            'UPDATE veterinario SET nombre_completo=?, telefono=?, especialidad=?, sueldo=?, fecha_contratacion=? WHERE id_veterinario=?',
            [nombre_completo ?? nombre, telefono ?? '', especialidad ?? '', sueldo ?? 0, fecha_contratacion, req.params.id]
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
        const { tipo, nombre_item, nombre, cantidad = 0, unidad = '', stock_minimo = 10 } = req.body;
        const [result] = await db.query(
            'INSERT INTO inventario (tipo, nombre_item, cantidad, unidad, stock_minimo) VALUES (?, ?, ?, ?, ?)',
            [String(tipo || '').toLowerCase(), nombre_item ?? nombre, cantidad, unidad, stock_minimo]
        );
        res.status(201).json({ id: result.insertId, message: 'Item creado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/inventario/:id', async (req, res) => {
    try {
        const { tipo, nombre_item, nombre, cantidad = 0, unidad = '', stock_minimo = 10 } = req.body;
        await db.query(
            'UPDATE inventario SET tipo=?, nombre_item=?, cantidad=?, unidad=?, stock_minimo=? WHERE id_inventario=?',
            [String(tipo || '').toLowerCase(), nombre_item ?? nombre, cantidad, unidad, stock_minimo, req.params.id]
        );
        res.json({ message: 'Item actualizado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/inventario/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM inventario WHERE id_inventario = ?', [req.params.id]);
        res.json({ message: 'Item eliminado' });
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
            SELECT a.*, g.nombre as animal_nombre
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
        const { tipo_alimento, tipoAlimento, cantidad_kg, cantidad, horario, id_animal } = req.body;
        const [result] = await db.query(
            'INSERT INTO alimentacion (tipo_alimento, cantidad_kg, horario, id_animal) VALUES (?, ?, ?, ?)',
            [tipo_alimento ?? tipoAlimento, cantidad_kg ?? cantidad, horario, id_animal]
        );
        res.status(201).json({ id: result.insertId, message: 'Alimentacion creada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/alimentacion/:id', async (req, res) => {
    try {
        const { tipo_alimento, tipoAlimento, cantidad_kg, cantidad, horario, id_animal } = req.body;
        await db.query(
            'UPDATE alimentacion SET tipo_alimento=?, cantidad_kg=?, horario=?, id_animal=? WHERE id_alimentacion=?',
            [tipo_alimento ?? tipoAlimento, cantidad_kg ?? cantidad, horario, id_animal, req.params.id]
        );
        res.json({ message: 'Alimentacion actualizada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/alimentacion/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM alimentacion WHERE id_alimentacion = ?', [req.params.id]);
        res.json({ message: 'Alimentacion eliminada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// RUTAS DE RANCHEROS
// ============================================

app.get('/api/rancheros', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM ranchero ORDER BY id_ranchero DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/rancheros', async (req, res) => {
    try {
        const { nombre_completo, nombre, contacto = '', direccion_rancho, direccion, telefono = '', email = '' } = req.body;
        const [result] = await db.query(
            'INSERT INTO ranchero (nombre_completo, contacto, direccion_rancho, telefono, email) VALUES (?, ?, ?, ?, ?)',
            [nombre_completo ?? nombre, contacto, direccion_rancho ?? direccion, telefono || contacto, email]
        );
        res.status(201).json({ id: result.insertId, message: 'Ranchero creado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/rancheros/:id', async (req, res) => {
    try {
        const { nombre_completo, nombre, contacto = '', direccion_rancho, direccion, telefono = '', email = '' } = req.body;
        await db.query(
            'UPDATE ranchero SET nombre_completo=?, contacto=?, direccion_rancho=?, telefono=?, email=? WHERE id_ranchero=?',
            [nombre_completo ?? nombre, contacto, direccion_rancho ?? direccion, telefono || contacto, email, req.params.id]
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

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📋 Endpoints disponibles:`);
    console.log(`   GET    http://localhost:${PORT}/api/ganado`);
    console.log(`   GET    http://localhost:${PORT}/api/ganado/:id`);
    console.log(`   POST   http://localhost:${PORT}/api/ganado`);
    console.log(`   PUT    http://localhost:${PORT}/api/ganado/:id`);
    console.log(`   DELETE http://localhost:${PORT}/api/ganado/:id`);
    console.log(`   GET    http://localhost:${PORT}/api/vacunas`);
    console.log(`   GET    http://localhost:${PORT}/api/veterinarios`);
    console.log(`   GET    http://localhost:${PORT}/api/inventario`);
});
