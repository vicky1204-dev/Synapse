/**
 * Subject service.
 *
 * Handles operations related to canonical subject catalog.
 */

import { Subject } from "./subject.model";
import type {
  ISubject,
  SubjectResponse,
  CreateSubjectDto,
  GetSubjectsQuery,
} from "./subject.types";
import { logger } from "../../lib/logger";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function mapSubjectToResponse(subject: ISubject): SubjectResponse {
  return {
    id: subject._id.toString(),
    name: subject.name,
    slug: subject.slug,
    department: subject.department,
    active: subject.active,
    createdAt: subject.createdAt.toISOString(),
    updatedAt: subject.updatedAt.toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Default Subject Catalog
// ---------------------------------------------------------------------------

export const DEFAULT_SUBJECTS: Array<{ name: string; department: string }> = [
  // Computer Science & IT
  { name: "Data Structures & Algorithms", department: "Computer Science" },
  { name: "Operating Systems", department: "Computer Science" },
  { name: "Computer Networks", department: "Computer Science" },
  { name: "Database Management Systems", department: "Computer Science" },
  { name: "Software Engineering", department: "Computer Science" },
  { name: "Computer Architecture", department: "Computer Science" },
  { name: "Theory of Computation", department: "Computer Science" },
  { name: "Artificial Intelligence", department: "Computer Science" },
  { name: "Machine Learning", department: "Computer Science" },
  { name: "Web Development", department: "Computer Science" },

  // Mathematics & Statistics
  { name: "Calculus", department: "Mathematics" },
  { name: "Linear Algebra", department: "Mathematics" },
  { name: "Discrete Mathematics", department: "Mathematics" },
  { name: "Probability & Statistics", department: "Mathematics" },
  { name: "Differential Equations", department: "Mathematics" },

  // Electrical & Electronics
  { name: "Digital Logic Design", department: "Electrical Engineering" },
  { name: "Signals and Systems", department: "Electrical Engineering" },
  {
    name: "Microprocessors & Microcontrollers",
    department: "Electrical Engineering",
  },
  { name: "Control Systems", department: "Electrical Engineering" },

  // Natural Sciences
  { name: "General Physics", department: "Physics" },
  { name: "Electromagnetism", department: "Physics" },
  { name: "Organic Chemistry", department: "Chemistry" },
  { name: "Cell Biology", department: "Biology" },

  // Business & Economics
  { name: "Microeconomics", department: "Economics" },
  { name: "Macroeconomics", department: "Economics" },
  { name: "Financial Accounting", department: "Business" },
  { name: "Principles of Management", department: "Business" },
];

// ---------------------------------------------------------------------------
// Service functions
// ---------------------------------------------------------------------------

export async function getSubjects(
  query: GetSubjectsQuery = {},
): Promise<SubjectResponse[]> {
  const filter: Record<string, unknown> = {};

  // By default, return only active subjects unless specified
  if (query.active !== undefined) {
    filter.active = query.active;
  } else {
    filter.active = true;
  }

  if (query.department) {
    filter.department = { $regex: new RegExp(`^${query.department}$`, "i") };
  }

  if (query.search) {
    const escaped = query.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.$or = [
      { name: { $regex: escaped, $options: "i" } },
      { department: { $regex: escaped, $options: "i" } },
    ];
  }

  const subjects = await Subject.find(filter).sort({ name: 1 });
  return subjects.map(mapSubjectToResponse);
}

export async function getSubjectById(
  id: string,
): Promise<SubjectResponse | null> {
  const subject = await Subject.findById(id);
  return subject ? mapSubjectToResponse(subject) : null;
}

export async function findOrCreateSubject(
  dto: CreateSubjectDto,
): Promise<SubjectResponse> {
  const slug = slugify(dto.name);

  // Check if subject with same slug already exists
  let subject = await Subject.findOne({ slug });

  if (!subject) {
    subject = await Subject.create({
      name: dto.name.trim(),
      slug,
      department: dto.department?.trim(),
      active: true,
    });

    logger.info({
      message: "Subject created",
      subjectId: subject._id.toString(),
      name: subject.name,
      slug: subject.slug,
    });
  }

  return mapSubjectToResponse(subject);
}

export async function seedDefaultSubjects(): Promise<{
  inserted: number;
  total: number;
}> {
  let inserted = 0;

  for (const item of DEFAULT_SUBJECTS) {
    const slug = slugify(item.name);
    const existing = await Subject.findOne({ slug });

    if (!existing) {
      await Subject.create({
        name: item.name,
        slug,
        department: item.department,
        active: true,
      });
      inserted++;
    }
  }

  const total = await Subject.countDocuments();

  logger.info({
    message: "Subject seeding completed",
    inserted,
    total,
  });

  return { inserted, total };
}
