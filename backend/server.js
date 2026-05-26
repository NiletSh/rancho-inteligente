require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();

// ============================================
// CONFIGURACION
// ============================================

app.use(cors({
    origin: 'https://rancho-inteligente.vercel.app'
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

// ============================================
// INICIAR SERVIDOR
// ============================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});