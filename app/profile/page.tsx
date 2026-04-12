import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ProfileContent from "./ProfileContent";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin");
  }

  return <ProfileContent />;
}
