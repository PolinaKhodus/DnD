/* eslint-disable linebreak-style */
/* eslint-disable import/newline-after-import */
/* eslint-disable no-undef */
/* eslint-disable linebreak-style */
/* eslint-disable spaced-comment */
/* eslint-disable linebreak-style */
import puppetteer from 'puppeteer';
const { fork } = require('child_process');

jest.setTimeout(30000);

describe('Goods widget testing', () => {
  let browser = null;
  let page = null;
  let server = null;
  const baseUrl = 'http://localhost:9000';

  beforeAll(async () => {
    server = fork('./src/__tests__/e2e.server.js');
    await new Promise((resolve, reject) => {
      server.on('error', () => {
        reject();
      });
      server.on('message', (message) => {
        if (message === 'ok') {
          resolve();
        }
      });
    });
    browser = await puppetteer.launch({
      //headless: false,
      //slowMo: 500,
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
    server.kill();
  });

  test('No errors messages in loaded document', async () => {
    await page.goto(baseUrl);

    const result = await page.evaluate(() => {
      const id = document.querySelector('.error-box');
      return id;
    });

    expect(result).toBe(null);
  });

  test('Should show addModal with click on "+"', async () => {
    await page.goto(baseUrl);

    const addBtn = await page.$('.widget-add');
    await addBtn.click();

    const result = await page.evaluate(() => {
      const modal = document.querySelector('.add-form-modal');

      return !modal.classList.contains('hidden');
    });

    expect(result).toBe(true);

    test('Should hide addModal with click on "Отменить"', async () => {
      await page.goto(baseUrl);

      const addBtn = await page.$('.widget-add');
      await addBtn.click();
      const reset = await page.$('.add-reset-btn');
      await reset.click();

      const result = await page.evaluate(() => {
        const modal = document.querySelector('.add-form-modal');
        return modal.classList.contains('hidden');
      expect(result).toBe(true);
    });

    test('Should show error when input "Name" is empty', async () => {
    await page.goto(baseUrl);

    const addBtn = await page.$('.widget-add');
    await addBtn.click();
    const save = await page.$('.add-save-btn');
    await save.click();

    const result = await page.evaluate(() => {
      const error = document.querySelector('.error-box');

      return error.innerText;     
    });

    expect(result).toBe('Поле \'Название\' должно быть заполнено!');    
    });

    test('Should show error when input "Cost" is empty', async () => {
    await page.goto(baseUrl);

    const addBtn = await page.$('.widget-add');
    await addBtn.click();
    const input = await page.$('.good-name');
    await input.type('Samsung');

    const save = await page.$('.add-save-btn');
    await save.click();

    const result = await page.evaluate(() => {
      const error = document.querySelector('.error-box');

      return error.innerText;     
    });

    expect(result).toBe('Поле \'Стоимость\' должно быть заполнено!');    
    });

    test('Should show error when input "Cost" is not number', async () => {
    await page.goto(baseUrl);

    const addBtn = await page.$('.widget-add');
    await addBtn.click();
    const input1 = await page.$('.good-name');
    await input1.type('Samsung');
    const input2 = await page.$('.good-cost');
    await input2.type('abs');

    const save = await page.$('.add-save-btn');
    await save.click();

    const result = await page.evaluate(() => {
      const error = document.querySelector('.error-box');

      return error.innerText;     
    });

    expect(result).toBe('Поле \'Стоимость\' должно содержать только цифры!');    
    });

    test('Should show error when input "Cost" is negative', async () => {
    await page.goto(baseUrl);

    const addBtn = await page.$('.widget-add');
    await addBtn.click();
    const input1 = await page.$('.good-name');
    await input1.type('Samsung');
    const input2 = await page.$('.good-cost');
    await input2.type('-10');

    const save = await page.$('.add-save-btn');
    await save.click();

    const result = await page.evaluate(() => {
      const error = document.querySelector('.error-box');

      return error.innerText;     
    });

    expect(result).toBe('Стоимость не должна быть отрицательной');    
    });

    test('Should hide addModal', async () => {
    await page.goto(baseUrl);

    const addBtn = await page.$('.widget-add');
    await addBtn.click();
    const input1 = await page.$('.good-name');
    await input1.type('Samsung');
    const input2 = await page.$('.good-cost');
    await input2.type('80000');

    const save = await page.$('.add-save-btn');
    await save.click();

    const result1 = await page.evaluate(() => {
      const modal = document.querySelector('.add-form-modal');

      return modal.classList.contains('hidden');     
    });

    expect(result1).toBe(true);    
    });

    test('Should add product into table', async () => {
    await page.goto(baseUrl);

    const addBtn = await page.$('.widget-add');
    await addBtn.click();
    const input1 = await page.$('.good-name');
    await input1.type('Samsung');
    const input2 = await page.$('.good-cost');
    await input2.type('80000');

    const save = await page.$('.add-save-btn');
    await save.click();    

    const result = await page.evaluate(() => {
      const list = document.querySelector('tbody');

      return list.children.length;     
    });

    expect(result).toBe(1);    
    });

    test('Should remove product from table', async () => {
    await page.goto(baseUrl);

    const addBtn = await page.$('.widget-add');
    await addBtn.click();
    const input1 = await page.$('.good-name');
    await input1.type('Samsung');
    const input2 = await page.$('.good-cost');
    await input2.type('80000');

    const save = await page.$('.add-save-btn');
    await save.click(); 

    const remove = await page.$('.icon-remove');
    await remove.click();

    const del = await page.$('.delete-save-btn');
    await del.click();

    const result = await page.evaluate(() => {
    const list = document.querySelector('tbody');

      return list.children.length;     
    });

    expect(result).toBe(0);
    });
  });
