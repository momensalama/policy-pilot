"use server";

import { db } from "@/db";
import {
  assessments,
  shareholders,
  type AssessmentWithShareholders,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { assessmentSchema, type AssessmentFormData } from "@/lib/validations";

export async function getAssessment(): Promise<AssessmentWithShareholders | null> {
  const result = await db.query.assessments.findFirst({
    with: { shareholders: true },
  });
  return result ?? null;
}

export async function createAssessment(data: AssessmentFormData) {
  const parsed = assessmentSchema.parse(data);

  const [assessment] = await db
    .insert(assessments)
    .values({
      companyName: parsed.companyName,
      companyEmail: parsed.companyEmail,
      companyLocation: parsed.companyLocation,
      primaryActivity: parsed.primaryActivity,
    })
    .returning();

  if (parsed.shareholders.length > 0) {
    await db.insert(shareholders).values(
      parsed.shareholders.map((s) => ({
        assessmentId: assessment.id,
        name: s.name,
        sharePercentage: String(s.sharePercentage),
      })),
    );
  }

  revalidatePath("/assessment");
  revalidatePath("/chat");
  return assessment;
}

export async function updateAssessment(id: string, data: AssessmentFormData) {
  const parsed = assessmentSchema.parse(data);

  await db
    .update(assessments)
    .set({
      companyName: parsed.companyName,
      companyEmail: parsed.companyEmail,
      companyLocation: parsed.companyLocation,
      primaryActivity: parsed.primaryActivity,
      updatedAt: new Date(),
    })
    .where(eq(assessments.id, id));

  // Replace shareholders: delete old, insert new
  await db.delete(shareholders).where(eq(shareholders.assessmentId, id));

  if (parsed.shareholders.length > 0) {
    await db.insert(shareholders).values(
      parsed.shareholders.map((s) => ({
        assessmentId: id,
        name: s.name,
        sharePercentage: String(s.sharePercentage),
      })),
    );
  }

  revalidatePath("/assessment");
  revalidatePath("/chat");
}

export async function deleteAssessment(id: string) {
  // Cascade delete handles shareholders
  await db.delete(assessments).where(eq(assessments.id, id));
  revalidatePath("/assessment");
  revalidatePath("/chat");
}
