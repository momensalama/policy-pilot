"use server";

import { db } from "@/db";
import { messages, policies } from "@/db/schema";
import { extractPolicyTitle } from "@/lib/policy-tools";

export async function getMessages() {
  return db.query.messages.findMany({
    orderBy: [messages.createdAt],
  });
}

export async function saveUserMessage(content: string) {
  await db.insert(messages).values({ role: "user", content });
}

export async function saveAssistantMessage(content: string) {
  await db.insert(messages).values({ role: "assistant", content });

  // Auto-detect and save policies
  const policyTitle = extractPolicyTitle(content);
  if (policyTitle) {
    await db.insert(policies).values({ title: policyTitle, content });
  }
}

export async function clearMessages() {
  await db.delete(messages);
}
