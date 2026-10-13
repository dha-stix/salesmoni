import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ledgerBackground } from "@/images";
import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { Reveal } from "@/components/ui/Motion";
import { homeLinks } from "./links";

export function CallToAction() {
  return (
    <>
      <section className="container-page pt-28">
        <Reveal>
          <div
            className="draw-icons flex flex-col items-center gap-[22px] rounded-[32px] bg-forest px-6 py-14 text-center text-white sm:py-20"
            style={ledgerBackground}
          >
            <h2 className="heading-display max-w-[760px] text-4xl leading-[1.04] sm:text-6xl">
              Close today&apos;s book with the numbers already <span className="text-gold">added up.</span>
            </h2>
            <p className="max-w-[520px] text-lg text-sage">
              Create an account for your business, add your team, and record your first sale in a
              few minutes.
            </p>
            <ButtonLink href="/auth/register" variant="gold" size="pill">
              Create your account <ArrowRight className="size-[18px]" aria-hidden />
            </ButtonLink>
          </div>
        </Reveal>
      </section>

      <footer className="container-page flex flex-wrap items-center justify-between gap-5 py-12 text-sm text-muted">
        <Logo className="text-lg" />
        <nav className="flex flex-wrap gap-7">
          {homeLinks.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-ink">
              {link.label}
            </a>
          ))}
          <Link href="/auth/login" className="hover:text-ink">
            Sign in
          </Link>
        </nav>
        <p>
          © 2026 SalesMoni · Built by{" "}
          <a
            href="https://www.linkedin.com/in/david-asaolu234/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-brand hover:underline"
          >
            David Asaolu
          </a>
        </p>
      </footer>
    </>
  );
}
