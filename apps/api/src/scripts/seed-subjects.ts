/**
 * Subject catalog seed script.
 *
 * Populates MongoDB with default canonical academic subjects.
 * Usage:
 *   npx tsx src/scripts/seed-subjects.ts
 */

import { connectDB, disconnectDB } from "../lib/db";
import { seedDefaultSubjects } from "../modules/subjects/subject.service";
import { logger } from "../lib/logger";

async function main() {
  try {
    logger.info({ message: "Connecting to database for subject seeding..." });
    await connectDB();

    const result = await seedDefaultSubjects();
    logger.info({
      message: `Seeding finished. Inserted: ${result.inserted}, Total: ${result.total}`,
    });

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    logger.error({
      message: "Subject seeding failed",
      error: error instanceof Error ? error.message : String(error),
    });
    process.exit(1);
  }
}

void main();
