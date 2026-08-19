import 'dotenv/config';
import app from './app.js';
import { prisma } from './config/prisma.js';

const PORT = process.env.PORT || 4000;

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  console.error('JWT_SECRET manquant en production — arrêt.');
  process.exit(1);
}

async function main() {
  await prisma.$connect();
  console.log('DB connectée');
  app.listen(PORT, () => {
    console.log(`API mathemlearning : http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error('Échec du démarrage:', err);
  process.exit(1);
});
