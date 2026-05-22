process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-para-jest';
process.env.CORS_ORIGIN = 'http://localhost';

const request = require('supertest');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Mock de los modelos de Mongoose — no se necesita BD real
const mockSave = jest.fn().mockResolvedValue({});
const MockUsuario = jest.fn().mockImplementation((data) => ({ ...data, save: mockSave }));
MockUsuario.findOne = jest.fn();
MockUsuario.findOneAndUpdate = jest.fn();

const MockDestino = jest.fn().mockImplementation((data) => ({ ...data, save: mockSave }));
MockDestino.find = jest.fn();
MockDestino.findByIdAndDelete = jest.fn();

jest.mock('../models', () => ({
    Usuario: MockUsuario,
    Destino: MockDestino
}));

const app = require('../app');

beforeEach(() => {
    jest.clearAllMocks();
    mockSave.mockResolvedValue({});
});

// ── Ruta raíz ──────────────────────────────────────────────

describe('GET /', () => {
    test('responde con mensaje de bienvenida', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(200);
    });
});

// ── Destinos (GET público) ─────────────────────────────────

describe('GET /api/destinos', () => {
    test('devuelve lista de destinos', async () => {
        MockDestino.find.mockResolvedValue([
            { nombre: 'Teotihuacán', estado: 'EdoMex' }
        ]);
        const res = await request(app).get('/api/destinos');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0].nombre).toBe('Teotihuacán');
    });

    test('devuelve 500 si la BD falla', async () => {
        MockDestino.find.mockRejectedValue(new Error('DB error'));
        const res = await request(app).get('/api/destinos');
        expect(res.statusCode).toBe(500);
    });
});

// ── Registro ───────────────────────────────────────────────

describe('POST /api/registro', () => {
    test('falla 400 si faltan campos', async () => {
        const res = await request(app)
            .post('/api/registro')
            .send({ email: 'test@test.com' });
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error');
    });

    test('falla 400 si la contraseña tiene menos de 8 caracteres', async () => {
        const res = await request(app)
            .post('/api/registro')
            .send({ nombre: 'Test', email: 'test@test.com', password: '1234' });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toMatch(/8 caracteres/);
    });

    test('falla 400 si el correo ya está registrado', async () => {
        MockUsuario.findOne.mockResolvedValue({ email: 'test@test.com' });
        const res = await request(app)
            .post('/api/registro')
            .send({ nombre: 'Test', email: 'test@test.com', password: 'password123' });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toMatch(/registrado/);
    });

    test('crea usuario correctamente (201)', async () => {
        MockUsuario.findOne.mockResolvedValue(null);
        const res = await request(app)
            .post('/api/registro')
            .send({ nombre: 'Usuario Test', email: 'nuevo@test.com', password: 'password123' });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('mensaje');
        expect(mockSave).toHaveBeenCalled();
    });
});

// ── Login ──────────────────────────────────────────────────

describe('POST /api/login', () => {
    test('falla 400 con usuario inexistente', async () => {
        MockUsuario.findOne.mockResolvedValue(null);
        const res = await request(app)
            .post('/api/login')
            .send({ email: 'noexiste@test.com', password: 'password123' });
        expect(res.statusCode).toBe(400);
    });

    test('falla 400 con contraseña incorrecta', async () => {
        const hash = await bcrypt.hash('correcta', 10);
        MockUsuario.findOne.mockResolvedValue({
            _id: '123',
            nombre: 'Test',
            email: 'test@test.com',
            password: hash,
            rol: 'usuario'
        });
        const res = await request(app)
            .post('/api/login')
            .send({ email: 'test@test.com', password: 'incorrecta' });
        expect(res.statusCode).toBe(400);
    });

    test('login exitoso devuelve token, nombre y rol', async () => {
        const hash = await bcrypt.hash('password123', 10);
        MockUsuario.findOne.mockResolvedValue({
            _id: 'abc123',
            nombre: 'Usuario Test',
            email: 'test@test.com',
            password: hash,
            rol: 'usuario'
        });
        const res = await request(app)
            .post('/api/login')
            .send({ email: 'test@test.com', password: 'password123' });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body.nombre).toBe('Usuario Test');
        expect(res.body.rol).toBe('usuario');

        // Verificar que el token es válido
        const payload = jwt.verify(res.body.token, process.env.JWT_SECRET);
        expect(payload.rol).toBe('usuario');
    });
});

// ── Protección de rutas admin ──────────────────────────────

describe('Protección de rutas admin', () => {
    test('POST /api/destinos sin token → 401', async () => {
        const res = await request(app)
            .post('/api/destinos')
            .send({ nombre: 'Test', estado: 'CDMX', descripcion: 'Desc', foto: 'http://img.jpg' });
        expect(res.statusCode).toBe(401);
    });

    test('DELETE /api/destinos/:id sin token → 401', async () => {
        const res = await request(app).delete('/api/destinos/507f1f77bcf86cd799439011');
        expect(res.statusCode).toBe(401);
    });

    test('POST /api/destinos con token de usuario normal → 403', async () => {
        const token = jwt.sign(
            { id: '123', nombre: 'Normal', rol: 'usuario' },
            process.env.JWT_SECRET
        );
        const res = await request(app)
            .post('/api/destinos')
            .set('Authorization', `Bearer ${token}`)
            .send({ nombre: 'Test', estado: 'CDMX', descripcion: 'Desc', foto: 'http://img.jpg' });
        expect(res.statusCode).toBe(403);
    });

    test('POST /api/destinos con token admin válido → 201', async () => {
        const token = jwt.sign(
            { id: '999', nombre: 'Admin', rol: 'admin' },
            process.env.JWT_SECRET
        );
        MockDestino.prototype = { save: mockSave };
        const res = await request(app)
            .post('/api/destinos')
            .set('Authorization', `Bearer ${token}`)
            .send({ nombre: 'Teotihuacán', estado: 'EdoMex', descripcion: 'Pirámides', foto: 'http://img.jpg' });
        expect(res.statusCode).toBe(201);
    });

    test('POST /api/destinos con token admin pero campos faltantes → 400', async () => {
        const token = jwt.sign(
            { id: '999', nombre: 'Admin', rol: 'admin' },
            process.env.JWT_SECRET
        );
        const res = await request(app)
            .post('/api/destinos')
            .set('Authorization', `Bearer ${token}`)
            .send({ nombre: 'Teotihuacán' });
        expect(res.statusCode).toBe(400);
    });

    test('Token expirado → 401', async () => {
        const token = jwt.sign(
            { id: '123', nombre: 'Test', rol: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '0s' }
        );
        const res = await request(app)
            .post('/api/destinos')
            .set('Authorization', `Bearer ${token}`)
            .send({ nombre: 'Test', estado: 'CDMX', descripcion: 'Desc', foto: 'http://img.jpg' });
        expect(res.statusCode).toBe(401);
    });
});
