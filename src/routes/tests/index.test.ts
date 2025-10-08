import request from 'supertest';
import { app } from '../../app';

it('can fetch a list of tickets', async () => {
  const signin = global.signin();
  const ticket1 = await request(app)
    .post('/api/tickets')
    .set('Cookie', signin.cookie)
    .send({
      title: 'test',
      price: 10,
    });
  const ticket2 = await request(app)
    .post('/api/tickets')
    .set('Cookie', signin.cookie)
    .send({
      title: 'test2',
      price: 20,
    });
  const response = await request(app).get('/api/tickets').send();
  expect(response.status).toEqual(200);
  expect(response.body.length).toEqual(2);
  expect(response.body[0].title).toEqual('test');
  expect(response.body[0].price).toEqual(10);
  expect(response.body[0].userId).toEqual(signin.id);
  expect(response.body[1].title).toEqual('test2');
  expect(response.body[1].price).toEqual(20);
  expect(response.body[1].userId).toEqual(signin.id);
});

it('returns an empty array if there are no tickets', async () => {
  const response = await request(app).get('/api/tickets').send();
  expect(response.status).toEqual(200);
  expect(response.body.length).toEqual(0);
});
