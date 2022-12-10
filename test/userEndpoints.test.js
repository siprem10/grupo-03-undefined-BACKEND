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

async function testTokenNotSentOrInvalid(req) {
  const response = await req;
  expect(response.statusCode).toBe(401);

  const responseWithInvalidToken = await req.set(
    'auth-token',
    'b2Kas1i239nKazBN2jkMzI12kLZ2j8JaazZ'
  );
  expect(responseWithInvalidToken.statusCode).toBe(401);
}

async function testValidToken(req) {
  const token = await handleSuccessLogin();

  const getUsersResponse = await req.set('auth-token', token);
  expect(getUsersResponse.statusCode).toBe(200);
}

// ---------------------------------------------- TESTS ----------------------------------------------

describe('GET /users', () => {
  test('Should response with status 401 when the token is not sent or is invalid', async () => {
    testTokenNotSentOrInvalid(request(app).get('/users'));
  });

  test('Should response with status 200 when the valid token is sent', async () => {
    testValidToken(request(app).get('/users'));
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

    testTokenNotSentOrInvalid(request(app).get(`/users/${minId}`));
  });

  test('Should response with status 200 when the token is sent & UserId exists', async () => {
    const minId = await queryInterface.rawSelect('Users', {}, ['id']);

    testValidToken(request(app).get(`/users/${minId}`));
  });

  test('Should the body contains null when the valid token is sent but the UserId doesnt exists', async () => {
    const token = await handleSuccessLogin();
    const maxId = (await queryInterface.rawSelect('Users', {}, ['id'])) + 500;

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

describe('POST /users', () => {
  const validUser = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  test('Should response with status 200 and the user created in body, when it has the complete and correct fields', async () => {
    const response = await request(app).post('/users').send(validUser);
    const { body } = response.body;

    expect(response.statusCode).toBe(200);
    expect(body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        firstName: expect.any(String),
        lastName: expect.any(String),
        email: expect.any(String),
      })
    );
  });

  test('Should response with status 400 and the object with the errors, when some or all of the fields were not sent correctly or are left empty', async () => {
    const userAllEmptyFields = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    };

    const usersCases = [
      {},
      userAllEmptyFields,
      { ...validUser, firstName: '' },
      { ...validUser, lastName: '' },
      { ...validUser, email: '' },
      { ...validUser, password: '' },
      { ...validUser, email: faker.internet.ip() },
      { ...validUser, email: 'luchemma@gmail.com' },
      { ...validUser, password: faker.internet.password(2) },
    ];

    for (let i = 0; i < usersCases.length; i++) {
      const response = await request(app).post('/users').send(usersCases[i]);
      const { body } = response;

      expect(response.statusCode).toBe(400);
      expect(body).toEqual(
        expect.objectContaining({ error: expect.any(Object) })
      );
    }
  });
});

describe('PUT /users/:id', () => {
  test('Should response with status 401 when the token is not sent or is invalid', async () => {
    const minId = await queryInterface.rawSelect('Users', {}, ['id']);
    const maxId = minId + 19;
    testTokenNotSentOrInvalid(request(app).put(`/users/${maxId}`));
  });
});

describe('DELETE /users/:id', () => {
  test('Should response with status 401 when the token is not sent', async () => {
    testTokenNotSentOrInvalid(request(app).delete(`users/${1}`));
  });
});
