import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DiagnosisForm from "./DiagnosisForm";

export default async function DiagnosisPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin");
  }

  return <DiagnosisForm />;
}
