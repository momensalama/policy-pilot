import { redirect } from "next/navigation";
import { getAssessment } from "./actions/assessment";

export default async function Home() {
  const assessment = await getAssessment();

  if (assessment) {
    redirect("/chat");
  } else {
    redirect("/assessment");
  }
}
