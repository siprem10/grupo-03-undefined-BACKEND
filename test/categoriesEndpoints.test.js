const request = require('supertest');
const app = require('../app');
const db = require('../database/models');
const { faker } = require('@faker-js/faker');

// ---------------------------------------------- UTILS ----------------------------------------------

// Funcion para obtener un array con todos los IDS de la tabla Categorias

async function getIdsCategories() {
  const findCategoriesIds = await db.Category.findAll({
    attributes: ['id'],
  });

  const idsCategories = findCategoriesIds.map((category) => category.id);
  return idsCategories;
}

// Funcion para obtener un numero random del arreglo de IDS

function getRandomExistingIdCategory(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ---------------------------------------------- TESTS ----------------------------------------------

describe('GET /categories', () => {
  test('Should send a status 200', async () => {
    const { statusCode } = await request(app).get('/categories');
    expect(statusCode).toBe(200);
  });

  test('Should send the array with the categories, if they contain the active property in true', async () => {
    const { body } = await request(app).get('/categories');
    expect(body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          description: expect.any(String),
          active: true,
        }),
      ])
    );
  });
});

describe('POST /categories', () => {
  const newcategory = {
    name: faker.name.jobArea(),
    description: faker.name.jobDescriptor(),
  };

  test('Should send a status 201 if the category was created', async () => {
    const { statusCode } = await request(app)
      .post('/categories')
      .send(newcategory);
    expect(statusCode).toBe(201);
  });

  test('Should add a category, if the necessary fields are submitted.', async () => {
    const categoriesLengthBefore = await (
      await request(app).get('/categories')
    ).body.length;

    const response = await request(app).post('/categories').send(newcategory);

    const categoriesLengthAfter = await (
      await request(app).get('/categories')
    ).body.length;

    expect(categoriesLengthAfter).toEqual(categoriesLengthBefore + 1);
    expect(response.body.message).toContain('created');
  });

  test('Should send a status 400 if the name, description or both were not sent', async () => {
    const errorCases = [
      {},
      { ...newcategory, name: '' },
      { ...newcategory, description: '' },
    ];

    for (let i = 0; i < errorCases.length; i++) {
      const response = await request(app)
        .post('/categories')
        .send(errorCases[i]);

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toEqual('No name or description provided');
    }
  });
});

describe('GET /categories/:id', () => {
  test('Should send status 200 when the category id exists', async () => {
    const idsCategories = await getIdsCategories();
    const randomExistingIdCategory = getRandomExistingIdCategory(idsCategories);

    const response = await request(app).get(
      `/categories/${randomExistingIdCategory}`
    );

    expect(response.statusCode).toBe(200);
  });

  test('Should send status 404 when the category does not exists', async () => {
    const negativeNumberRandom = Math.floor(Number(`-${Math.random() * 100}`));

    const response = await request(app).get(
      `/categories/${negativeNumberRandom}`
    );

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toContain('Category not found');
  });
});

describe('PUT /categories/:id', () => {
  test('Should send status 200 when the category exists and was edited', async () => {
    const idsCategories = await getIdsCategories();
    const randomExistingIdCategory = getRandomExistingIdCategory(idsCategories);

    const categoryEdited = {
      name: faker.name.jobArea(),
      description: faker.name.jobDescriptor(),
    };

    const response = await request(app)
      .put(`/categories/${randomExistingIdCategory}`)
      .send(categoryEdited);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toContain('Category updated');
  });

  test('Should send status 404 when the category does not exists', async () => {
    const negativeNumberRandom = Math.floor(Number(`-${Math.random() * 100}`));
    const categoryEdited = {
      name: faker.name.jobArea(),
      description: faker.name.jobDescriptor(),
    };

    const response = await request(app)
      .put(`/categories/${negativeNumberRandom}`)
      .send(categoryEdited);

    expect(response.statusCode).toBe(404);
  });

  test('Should send status 400 when some or all of the fields are missing', async () => {
    const idsCategories = await getIdsCategories();
    const randomExistingIdCategory = getRandomExistingIdCategory(idsCategories);

    const categoryEdited = {
      name: faker.name.jobArea(),
      description: faker.name.jobDescriptor(),
    };

    const errorCases = [
      {},
      { name: '', description: '' },
      { ...categoryEdited, name: '' },
      { ...categoryEdited, description: '' },
    ];

    for (let i = 0; i < errorCases.length; i++) {
      const response = await request(app)
        .put(`/categories/${randomExistingIdCategory}`)
        .send(errorCases[i]);

      expect(response.statusCode).toBe(400);
    }
  });
});

describe('DELETE /categories/:id', () => {
  test('Should send status 200 when the category exists and was deleted', async () => {
    const idsCategories = await getIdsCategories();
    const randomExistingIdCategory = getRandomExistingIdCategory(idsCategories);

    const response = await request(app).delete(
      `/categories/${randomExistingIdCategory}`
    );

    expect(response.statusCode).toBe(200);
  });

  test('Should have a filled date in deletedAt model when the category was deleted', async () => {
    const idsCategories = await getIdsCategories();
    const randomExistingIdCategory = getRandomExistingIdCategory(idsCategories);

    await request(app).delete(`/categories/${randomExistingIdCategory}`);
    const categoryDeleted = await request(app).get(
      `/categories/${randomExistingIdCategory}`
    );

    expect(categoryDeleted.body.deletedAt).toBeTruthy();
  });

  test('Should send status 404 when the category does not exists', async () => {
    const negativeNumberRandom = Math.floor(Number(`-${Math.random() * 100}`));

    const response = await request(app).delete(
      `/categories/${negativeNumberRandom}`
    );

    expect(response.statusCode).toBe(404);
  });
});
