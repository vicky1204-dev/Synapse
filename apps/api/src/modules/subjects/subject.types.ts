/**
 * Subject types.
 *
 * Types and interfaces for the canonical subject catalog.
 */

import type { Types } from "mongoose";

// ---------------------------------------------------------------------------
// Document interface
// ---------------------------------------------------------------------------

export interface ISubject {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  department?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ---------------------------------------------------------------------------
// API DTOs & Responses
// ---------------------------------------------------------------------------

export interface SubjectResponse {
  id: string;
  name: string;
  slug: string;
  department?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubjectDto {
  name: string;
  department?: string;
}

export interface GetSubjectsQuery {
  department?: string;
  search?: string;
  active?: boolean;
}
