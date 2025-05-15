import { seedMenuData } from './lib/db';

seedMenuData().then(() => {
  console.log('Seeding complete!');
  process.exit(0);
}).catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
}); 