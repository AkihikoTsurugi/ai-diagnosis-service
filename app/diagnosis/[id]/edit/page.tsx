import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DiagnosisEditContent from "./DiagnosisEditContent";

export default async function DiagnosisEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const { id } = await params;
  return <DiagnosisEditContent id={id} />;
}
