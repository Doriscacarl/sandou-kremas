import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`Sandou Kremas server → http://localhost:${PORT}`);
});
