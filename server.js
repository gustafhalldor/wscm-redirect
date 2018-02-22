import express from 'express';
import fs from 'fs';
import path from 'path';
import router from './routes';
import cors from 'cors';

const app = express();

app.use(cors());
app.set('port', (process.env.PORT || 3001));

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

app.use('/api', router);

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});
