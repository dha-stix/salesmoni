import { SetupSteps } from "@/components/auth/AuthAsides";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Create account",
  description: "Create a SalesMoni account for your business and record your first sale in minutes.",
  path: "/auth/register",
});

export default function RegisterPage() {
  return (
    <AuthLayout
      headline="Three steps from sign-up to your"
      highlight="first sale."
      aside={<SetupSteps />}
      reverse
    >
      <RegisterForm />
    </AuthLayout>
  );
}
