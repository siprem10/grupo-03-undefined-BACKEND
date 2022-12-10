const request = require('supertest');
const app = require('../app');
const db = require('../database/models');
const queryInterface = db.sequelize.getQueryInterface();
const { faker } = require('@faker-js/faker');
// ---------------------------------------------- UTILS ----------------------------------------------

async function handleSuccessLogin() {
  const userRegistered = {
    email: 'luchemma@gmail.com',
    password: 'luciano123',
  };
  const loginResponse = await request(app)
    .post('/auth/login')
    .send(userRegistered);

  const token = loginResponse.headers['auth-token'];

  return token;
}

//TODO: Funciones para reutilizar codigo para la validacion de Tokens (Ver como pasar metodo y ruta)

// function testTokenNotSentOrInvalid (method, route) {

//   test('Should response with status 401 when the token is not sent or is invalid', async () => {
//     const response = await request(app).get(route);
//     expect(response.statusCode).toBe(401);

//     const responseWithInvalidToken = await request(app)
//       .get('/users')
//       .set('auth-token', 'b2Kas1i239nKazBN2jk');
//     expect(responseWithInvalidToken.statusCode).toBe(401);
//   });

// }

// async function testValidToken (route) {

// }

// ---------------------------------------------- TESTS ----------------------------------------------

describe('GET /users', () => {
  test('Should response with status 401 when the token is not sent or is invalid', async () => {
    const response = await request(app).get('/users');
    expect(response.statusCode).toBe(401);

    const responseWithInvalidToken = await request(app)
      .get('/users')
      .set('auth-token', 'b2Kas1i239nKazBN2jk');
    expect(responseWithInvalidToken.statusCode).toBe(401);
  });

  test('Should response with status 200 when the valid token is sent', async () => {
    const token = await handleSuccessLogin();

    const getUsersResponse = await request(app)
      .get('/users')
      .set('auth-token', token);
    expect(getUsersResponse.statusCode).toBe(200);
  });

  test('Should send an array of users', async () => {
    const token = await handleSuccessLogin();

    const getUsersResponse = await request(app)
      .get('/users')
      .set('auth-token', token);

    const { body } = getUsersResponse.body;

    expect(body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          firstName: expect.any(String),
          lastName: expect.any(String),
          avatar: expect.any(String),
          email: expect.any(String),
          roleId: expect.any(Number),
        }),
      ])
    );
  });
});

describe('GET /users/:id', () => {
  test('Should response with status 401 when the token is not sent or is invalid', async () => {
    const minId = await queryInterface.rawSelect('Users', {}, ['id']);
    const maxId = minId + 19;

    const response = await request(app).get(`/users/${minId}`);
    expect(response.statusCode).toBe(401);

    const responseWithInvalidToken = await request(app)
      .get(`/users/${maxId}`)
      .set('auth-token', 'b2Kas1i239nKazBN2jk');
    expect(responseWithInvalidToken.statusCode).toBe(401);
  });

  test('Should response with status 200 when the token is sent & UserId exists', async () => {
    const token = await handleSuccessLogin();
    const minId = await queryInterface.rawSelect('Users', {}, ['id']);

    const getUsersResponse = await request(app)
      .get(`/users/${minId}`)
      .set('auth-token', token);

    expect(getUsersResponse.statusCode).toBe(200);
  });

  test('Should the body contains null when the valid token is sent but the UserId doesnt exists', async () => {
    const token = await handleSuccessLogin();
    const maxId = (await queryInterface.rawSelect('Users', {}, ['id'])) + 100;

    const getUsersResponse = await request(app)
      .get(`/users/${maxId + 1}`)
      .set('auth-token', token);

    const { body } = getUsersResponse.body;
    expect(body).toBeNull();
  });

  test('Should the body contains the user when the token is sent and the UserId exists', async () => {
    const token = await handleSuccessLogin();
    const maxId = (await queryInterface.rawSelect('Users', {}, ['id'])) + 19;

    const getUsersResponse = await request(app)
      .get(`/users/${maxId}`)
      .set('auth-token', token);

    const { body } = getUsersResponse.body;
    expect(body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        firstName: expect.any(String),
        lastName: expect.any(String),
        avatar: expect.any(String),
        email: expect.any(String),
        roleId: expect.any(Number),
      })
    );
  });
});
