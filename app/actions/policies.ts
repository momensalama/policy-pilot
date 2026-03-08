"use server";

import { db } from "@/db";
import { policies } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getPolicies() {
  return db.query.policies.findMany({
    orderBy: [policies.createdAt],
  });
}

export async function updatePolicy(id: string, content: string) {
  await db
    .update(policies)
    .set({ content, updatedAt: new Date() })
    .where(eq(policies.id, id));

  revalidatePath("/policies");
}

export async function deletePolicy(id: string) {
  await db.delete(policies).where(eq(policies.id, id));
  revalidatePath("/policies");
}
