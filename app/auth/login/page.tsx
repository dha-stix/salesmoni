import { MonthPreview } from "@/components/auth/AuthAsides";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Sign in",
  description: "Sign in to SalesMoni to see today's sales and your stock.",
  path: "/auth/login",
});

export default function LoginPage() {
  return (
    <AuthLayout headline="Your sales book is right where you" highlight="left it." aside={<MonthPreview />}>
      <LoginForm />
    </AuthLayout>
  );
}
