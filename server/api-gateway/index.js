const express = require('express');
const httpProxy = require('express-http-proxy');
const cors = require('cors');
const app = express();
const port = 8000;
const { AUTH_API_URL } = require('./urls');

const authServiceProxy = httpProxy(AUTH_API_URL);

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true
}));

app.get('/', (req, res) => res.status(200).json({ message: 'API gateway is working!🚀', code: 200 }));

app.use('/auth', authServiceProxy);

app.listen(port, () => console.log(`API gateway listening on port ${port}!`));
