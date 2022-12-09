const request = require('supertest');
const app = require('../app');

const handleSuccessLogin = async () => {
  const userRegistered = {
    email: 'luchemma@gmail.com',
    password: 'luciano123',
  };
  const loginResponse = await request(app)
    .post('/auth/login')
    .send(userRegistered);

  const token = loginResponse.headers['auth-token'];

  const getUsersResponse = await request(app)
    .get('/users')
    .set('auth-token', token);

  return getUsersResponse;
};

// ---------------------------------------------- TESTS ----------------------------------------------

describe('GET /users', () => {
  test('Should response with status 401 when the token is not sent or is invalid', async () => {
    const response = await request(app).get('/users');
    expect(response.statusCode).toBe(401);
  });

  test('Should response with status 200 when the token is sent', async () => {
    const getUsersResponse = await handleSuccessLogin();
    expect(getUsersResponse.statusCode).toBe(200);
  });

  test('Should send an array of users', async () => {
    const getUsersResponse = await handleSuccessLogin();
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
