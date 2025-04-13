import ingredients from '../../fixtures/ingredients.json';
import orderSuccessData from '../../fixtures/orderSuccess.json';

const bunId = ingredients.data[0]._id;
const bunName = ingredients.data[0].name;
const mainIngredientId = ingredients.data[1]._id;
const orderNumber = orderSuccessData.order.number;

beforeEach(function () {
  cy.intercept('GET', `api/ingredients`, {
    fixture: 'ingredients'
  });
  cy.intercept('POST', `api/auth/login`, {
    fixture: 'login'
  }).as('loginrequest');

  cy.intercept('GET', 'api/auth/user', {
    fixture: 'authCheck'
  });

  cy.intercept('POST', 'api/orders', {
    fixture: 'orderSuccess'
  }).as('order');

  cy.visit('/');

  cy.get(`[data-cy=${bunId}]`).as('bunElement');
  cy.get('@bunElement').click();
  cy.get(`[data-cy='modal']`).as('modal');
  cy.get(`[data-cy='modal close button']`).as('modalCloseBtn');
  cy.get('@modalCloseBtn').click();
});

describe('добавление ингредиентов в конструктор', function () {
  it('добавление булочки', function () {
    cy.get('@bunElement').contains('Добавить').click();
    cy.get('.counter').should('contain', '2');
    cy.get(`[data-cy='selected top bun']`).should('exist');
    cy.get(`[data-cy='selected bottom bun']`).should('exist');
  });

  it('добавление ингредиента', function () {
    cy.get(`[data-cy=${mainIngredientId}]`).contains('Добавить').click();
    cy.get('.counter').should('contain', '1');
    cy.get(`[data-cy='selected ingredient-${1}']`).should('exist');
  });
});

describe('открытие и закрытие модального окна ингридиента', function () {
  beforeEach(function () {
    cy.get('@bunElement').click();
  });
  it('открытие модального окна', function () {
    cy.url().should('include', `${bunId}`);
    cy.get('@modal').should('contain', `${bunName}`);
  });
  it('закрытие модального окна по крестику', function () {
    cy.get('@modalCloseBtn').click();
    cy.url().should('equal', 'http://localhost:4000/');
    cy.get('@modal').should('not.exist');
  });
  it('закрытие модального окна по оверлею', function () {
    cy.get('body').click('topRight');
    cy.url().should('equal', 'http://localhost:4000/');
    cy.get('@modal').should('not.exist');
  });
});

describe('совершение заказа', function () {
  beforeEach(function () {
    cy.visit('/login');
    cy.get(`[data-cy='login button']`).click();
    cy.wait('@loginrequest').then((interception) => {
      window.localStorage.setItem(
        'refreshToken',
        interception.response?.body.refreshToken
      );
      cy.setCookie('accessToken', interception.response?.body.accessToken);
    });
  });

  afterEach(function () {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('успешное создание заказа авторизованным пользователем', function () {
    cy.get('@bunElement').contains('Добавить').click();
    cy.get(`[data-cy=${mainIngredientId}]`).contains('Добавить').click();
    cy.get(`[data-cy='submit order btn']`).click();
    cy.wait('@order');
    cy.get(`[data-cy='successful order number']`).should(
      'contain.text',
      `${orderNumber}`
    );
    cy.get('@modalCloseBtn').click();
    cy.get('@modal').should('not.exist');
    cy.get(`[data-cy='empty ingredient']`).should('exist');
    cy.get(`[data-cy='empty top bun']`).should('exist');
  });
});
