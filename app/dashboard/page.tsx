import { auth } from "@/auth";
import { getDashboardDisplayImage } from "@/lib/dashboardAvatar";
import { redirect } from "next/navigation";
import DashboardContent from "./DashboardContent";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const dbImage = await getDashboardDisplayImage(session.user.id);
  const displayImage =
    dbImage !== undefined ? dbImage : session.user.image ?? null;

  return (
    <DashboardContent
      user={{
        name: session.user.name,
        email: session.user.email,
        image: displayImage,
      }}
    />
  );
}
