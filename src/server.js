require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const session = require('express-session');
const { RedisStore } = require('connect-redis');
const passport = require('./config/passport');
const redis = require('./config/redis');
const taskRoutes = require('./routes/tasks');
const sequelize = require('./config/database');

require('./models/Task');
require('./models/User');

const app = express();

app.use(helmet());
app.use(compression());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true }));

app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use(session({
  store: new RedisStore({ client: redis }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/tasks', taskRoutes);
app.use('/api/auth', require('./routes/auth'));
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Unexpected server error' });
});

let startupStep = 'database synchronization';

(async () => {
  try {
    await sequelize.sync({ alter: true });
    startupStep = 'Redis connection';
    await redis.connect();
    app.listen(process.env.PORT || 3000, () => console.log('API running'));
  } catch (err) {
    console.error(`Could not complete startup during ${startupStep}.`, err);
    process.exitCode = 1;
  }
})();
