import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns 404 if the ticket is not found', async () => {
  const signin = global.signin();
  const id = new mongoose.Types.ObjectId().toHexString();
  const response = await request(app)
    .get(`/api/tickets/${id}`)
    .set('Cookie', signin.cookie)
    .send();
  expect(response.status).toEqual(404);
});

it('returns the ticket if the ticket is found', async () => {
  const signin = global.signin();
  const createResponse = await request(app)
    .post('/api/tickets')
    .set('Cookie', signin.cookie)
    .send({
      title: 'test',
      price: 10,
    });
  const response = await request(app)
    .get(`/api/tickets/${createResponse.body.id}`)
    .set('Cookie', signin.cookie)
    .send();
  expect(response.status).toEqual(200);
  expect(response.body.title).toEqual(createResponse.body.title);
  expect(response.body.price).toEqual(createResponse.body.price);
});
