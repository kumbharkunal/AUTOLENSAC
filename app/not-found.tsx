import { LensMark } from "@/components/brand/LensMark";
import { ButtonLink, Container } from "@/components/ui/primitives";

export default function NotFound() {
  return (
    <section className="flex min-h-[80svh] items-center pt-28 pb-20">
      <Container className="text-center">
        <LensMark className="mx-auto h-14 w-14" />
        <h1 className="mt-8 font-display text-h2 font-medium text-ink">
          This page is <em className="accent">out of focus.</em>
        </h1>
        <p className="mx-auto mt-5 max-w-[36ch] text-lead text-muted">
          The page you were looking for doesn&apos;t exist. Let&apos;s get you back to the inspection bay.
        </p>
        <ButtonLink href="/" badge="arrow" className="mt-9">
          Back to AutoLens
        </ButtonLink>
      </Container>
    </section>
  );
}
