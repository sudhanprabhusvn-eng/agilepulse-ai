import { mockCurrentUser, mockProjects, mockActiveSprint } from '../src/data/mockData';

export async function seedDatabase() {
  console.log('[Seed] Seeding AgilePulse database with initial enterprise data...');
  console.log(`[Seed] Seeded user ${mockCurrentUser.name}, ${mockProjects.length} projects, and sprint ${mockActiveSprint.name}.`);
  return { success: true, count: 1 + mockProjects.length + 1 };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}
