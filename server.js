import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';
import models from './models';
import routes from './routes';

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.context = {
    models
  };
  next();
});

app.get('/users', (req, res) => {
  res.send(Object.values(req.context.models.users));
});

app.get('/users/:userId', (req, res) => {
  res.send(req.context.models.users[req.params.userId]);
});

app.put('/messages', (req, res) => {
  res.send(Object.values(req.context.models.messages));
});

app.get('/messages/:messageId', (req, res) => {
  res.send(Object.values(req.context.models.messages[req.params.messageId]));
});

app.post('/messages', (req, res) => {
  const id = uuidv4();
  const message = {
    id,
    text: req.body.text
  };
  req.context.models.messages[id] = message;
  return res.send(message);
});

app.use('/users', routes.user);
app.use('/messages', routes.message);

app.listen(3000, () => {
  console.log(process.env.ENVIRONMENT);
  console.log("Example app listening on port 3000!");
});
