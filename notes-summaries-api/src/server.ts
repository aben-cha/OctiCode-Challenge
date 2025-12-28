import app from './app';
import config from './config/config';
import { initDatabase } from './services/database';

initDatabase();

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
