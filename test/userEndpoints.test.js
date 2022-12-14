const request = require('supertest');
const app = require('../app');
const db = require('../database/models');
const { faker } = require('@faker-js/faker');
// ---------------------------------------------- UTILS ----------------------------------------------

// Funcion para obtener todos los usuarios de la DB.
async function getAllUsersInDb() {
  const attributes = [
    'id',
    'firstName',
    'lastName',
    'email',
    'avatar',
    'roleId',
  ];

  const response = await db.User.findAll({
    attributes,
  });

  const users = response.map((user) => ({
    ...user.dataValues,
    password: `${user.dataValues.firstName.toLowerCase()}123`,
  }));

  return users;
}

// Funcion para obtener un usuario al azar de la DB.
function getOneRandomUser(randomUser) {
  return randomUser[Math.floor(Math.random() * randomUser.length)];
}

// Funcion para obtener el token luego del login.
async function handleSuccessLogin() {
  const userRandom = await (await db.User.findOne()).dataValues;

  const userLogin = {
    email: userRandom.email,
    password: userRandom.firstName.toLowerCase() + '123',
  };

  const loginResponse = await request(app).post('/auth/login').send(userLogin);

  const token = loginResponse.headers['auth-token'];

  return token;
}

// Funcion para reutilizar la validacion del token en los tests (cuando el token es invalido o no es enviado).
async function testTokenNotSentOrInvalid(req) {
  const response = await req;
  expect(response.statusCode).toBe(401);

  const responseWithInvalidToken = await req.set(
    'auth-token',
    'b2Kas1i239nKazBN2jkMzI12kLZ2j8JaazZ'
  );
  expect(responseWithInvalidToken.statusCode).toBe(401);
}

// Funcion para reutilizar la validacion del token en los tests (cuando el token es valido).
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
    const users = await getAllUsersInDb();
    const { id } = getOneRandomUser(users);

    testTokenNotSentOrInvalid(request(app).get(`/users/${id}`));
  });

  test('Should response with status 200 when the token is sent & UserId exists', async () => {
    const users = await getAllUsersInDb();
    const { id } = getOneRandomUser(users);

    testValidToken(request(app).get(`/users/${id}`));
  });

  test('Should the body contains null when the valid token is sent but the UserId doesnt exists', async () => {
    const token = await handleSuccessLogin();
    const invalidUserId = -Math.floor(Math.random() * 50);

    console.log('invalidUserId', invalidUserId);

    const getUsersResponse = await request(app)
      .get(`/users/${invalidUserId}`)
      .set('auth-token', token);

    const { body } = getUsersResponse.body;
    expect(body).toBeNull();
  });

  test('Should the body contains the user when the token is sent and the UserId exists', async () => {
    const token = await handleSuccessLogin();
    const users = await getAllUsersInDb();
    const { id } = getOneRandomUser(users);

    const getUsersResponse = await request(app)
      .get(`/users/${id}`)
      .set('auth-token', token);

    const { body } = getUsersResponse.body;
    expect(body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        firstName: expect.any(String),
        lastName: expect.any(String),
        email: expect.any(String),
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
    const users = await getAllUsersInDb();
    const { id } = getOneRandomUser(users);

    testTokenNotSentOrInvalid(request(app).put(`/users/${id}`).send({}));
  });

  test('Should response with status 200 when the token is valid', async () => {
    const users = await getAllUsersInDb();
    const { id } = getOneRandomUser(users);

    testValidToken(request(app).put(`/users/${id}`).send({}));
  });

  test('Should response with status 404 when the user does not exists', async () => {
    const token = handleSuccessLogin();
    const invalidUserId = -Math.floor(Math.random() * 50);

    const response = await request(app)
      .put(`/users/${invalidUserId}`)
      .set('auth-token', token)
      .send({});

    expect(response.statusCode).toBe(404);
  });
});

describe('DELETE /users/:id', () => {
  test('Should response with status 401 when the token is not sent', async () => {
    const users = await getAllUsersInDb();
    const { id } = getOneRandomUser(users);
    testTokenNotSentOrInvalid(request(app).delete(`/users/${id}`));
  });

  test('Should response with status 404 when the user to delete not exists', async () => {
    const token = await handleSuccessLogin();
    const invalidUserId = -Math.floor(Math.random() * 50);

    const response = await request(app)
      .delete(`/users/${invalidUserId}`)
      .set('auth-token', token);
    expect(response.statusCode).toBe(404);
  });

  test('Should response with status 200 when the user was deleted', async () => {
    const token = await handleSuccessLogin();
    const users = await getAllUsersInDb();
    const { id } = getOneRandomUser(users);

    const response = await request(app)
      .delete(`/users/${id}`)
      .set('auth-token', token);
    expect(response.statusCode).toBe(200);
  });
});
