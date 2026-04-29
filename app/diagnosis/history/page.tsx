import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DiagnosisHistoryContent from "./DiagnosisHistoryContent";

export default async function DiagnosisHistoryPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin");
  }

  return <DiagnosisHistoryContent />;
}
