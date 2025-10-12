import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const response = await request(app).put(`/api/tickets/${id}`).send({
    title: 'test',
    price: 10,
  });
  expect(response.status).toEqual(401);
});

it('returns a 401 if the user is not the owner of the ticket', async () => {
  const signin = global.signin();

  const createResponse = await request(app)
    .post('/api/tickets')
    .set('Cookie', signin.cookie)
    .send({
      title: 'test',
      price: 10,
    });
  const id = createResponse.body.id;

  const response = await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin().cookie)
    .send({
      title: 'test2',
      price: 20,
    });
  expect(response.status).toEqual(401);
});

it('returns a 404 if the ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const response = await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin().cookie)
    .send({
      title: 'test',
      price: 10,
    });
  expect(response.status).toEqual(404);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
  const signin = global.signin();

  const createResponse = await request(app)
    .post('/api/tickets')
    .set('Cookie', signin.cookie)
    .send({
      title: 'test',
      price: 10,
    });
  const id = createResponse.body.id;

  const response = await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', signin.cookie)
    .send({
      title: '',
      price: 10,
    });
  expect(response.status).toEqual(400);

  const response2 = await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', signin.cookie)
    .send({
      title: 'test2',
      price: -10,
    });
  expect(response2.status).toEqual(400);
});

it('updates the ticket if the user provides a valid title and price', async () => {
  const signin = global.signin();
  const createResponse = await request(app)
    .post('/api/tickets')
    .set('Cookie', signin.cookie)
    .send({
      title: 'test',
      price: 10,
    });
  const id = createResponse.body.id;
  const response = await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', signin.cookie)
    .send({
      title: 'test2',
      price: 20,
    });
  expect(response.status).toEqual(200);
  expect(response.body.title).toEqual('test2');
  expect(response.body.price).toEqual(20);
  expect(response.body.userId).toEqual(signin.id);
});

it('publishes an event', async () => {
  const signin = global.signin();

  const createResponse = await request(app)
    .post('/api/tickets')
    .set('Cookie', signin.cookie)
    .send({
      title: 'test',
      price: 10,
    });
  const id = createResponse.body.id;

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', signin.cookie)
    .send({
      title: 'test2',
      price: 20,
    });

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
