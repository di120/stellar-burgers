import ingredients from '../../fixtures/ingredients.json';
import orderSuccessData from '../../fixtures/orderSuccess.json'

const bunId = ingredients.data[0]._id;
const bunName = ingredients.data[0].name;
const mainIngredientId = ingredients.data[1]._id;
const orderNumber = orderSuccessData.order.number;

beforeEach(function () {
  cy.intercept('GET', `/ingredients`, {
    fixture: 'ingredients'
  });
  cy.intercept('POST', `https://norma.nomoreparties.space/api/auth/login`, {
    fixture: 'login'
  }).as('loginrequest');

  cy.intercept('GET', 'https://norma.nomoreparties.space/api/auth/user', {
    fixture: 'authCheck'
  });

  cy.intercept('POST', 'https://norma.nomoreparties.space/api/orders', {
    fixture: 'orderSuccess'
  }).as('order');

  cy.visit('/');
});

describe('добавление ингредиентов в конструктор', function () {
  it('добавление булочки', function () {
    cy.get(`[data-cy=${bunId}]`).contains('Добавить').click();
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
    cy.get(`[data-cy=${bunId}]`).click();
  });
  it('открытие модального окна', function () {
    cy.url().should('include', `${bunId}`);
    cy.get(`[data-cy='modal']`).should('contain', `${bunName}`);
  });
  it('закрытие модального окна по крестику', function () {
    cy.get(`[data-cy='modal close button']`).click();
    cy.url().should('equal', 'http://localhost:4000/');
    cy.get(`[data-cy='modal']`).should('not.exist');
  });
  it('закрытие модального окна по оверлею', function () {
    cy.get('body').click('topRight');
    cy.url().should('equal', 'http://localhost:4000/');
    cy.get(`[data-cy='modal']`).should('not.exist');
  });
});

describe('совершение заказа', function () {
  beforeEach(function () {
    cy.visit('/login');
    cy.contains('Войти').click();
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
    cy.get(`[data-cy=${bunId}]`).contains('Добавить').click();
    cy.get(`[data-cy=${mainIngredientId}]`).contains('Добавить').click();
    cy.contains('Оформить заказ').click();
    cy.wait('@order');
    cy.get('h2').should('contain.text', `${orderNumber}`);
    cy.get(`[data-cy='modal close button']`).click();
    cy.get(`[data-cy='modal']`).should('not.exist');
    cy.contains('Выберите начинку').should('exist');
    cy.contains('Выберите булки').should('exist');
  });
});
