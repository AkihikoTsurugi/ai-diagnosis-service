import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DiagnosisResultClient from "./DiagnosisResultClient";

export default async function DiagnosisResultPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin");
  }

  return <DiagnosisResultClient />;
}
