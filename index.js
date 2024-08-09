const express = require('express');
const app = express();
const path = require('node:path');
const { MongoClient } = require('mongodb');
const client = new MongoClient('mongodb://localhost:27017');

app.set('view engine', 'ejs');
app.use('/static', express.static(path.join(__dirname, 'public')));

const logMiddleware = (req, res, next) => {
  console.log(req.method, req.path);
  next();
}

app.get('/user/:id', logMiddleware, (req, res) => {
  res.status(200).send(req.params.id);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Internal Server Error');
});

async function main() {
  await client.connect();

  const db = client.db('my-app');

  app.get('/', logMiddleware, async (req, res) => {
    const users = await db.collection('user').find().toArray();
    const names = users.map((user) => {
      return user.name;
    });

    res.render(path.resolve(__dirname, 'views/index.ejs'), { users: names });
  });

  app.post('/api/user', express.json(), async (req, res) => {
    const name = req.body.name;
    if (!name) {
      res.status(400).send('Bad Request');
      return;
    }
    await db.collection('user').insertOne({ name: name });
    res.status(200).send('Created');
  });

  app.post('/api/user/:user/delete', async (req, res) => {
    const userName = req.params.user;
    await db.collection('user').deleteOne({ name: userName });
    res.redirect('/');
  });

  app.listen(3000, () => {
    console.log('start listening');
  });
}
main();

