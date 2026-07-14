import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { TwoFactorSetupForm } from "@/components/auth/TwoFactorSetupForm";

export default async function TwoFactorSetupPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <TwoFactorSetupForm />
    </div>
  );
}
