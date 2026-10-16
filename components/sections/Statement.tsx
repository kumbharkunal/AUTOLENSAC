import { LensMark } from "@/components/brand/LensMark";
import { StatementScrub } from "@/components/motion/scenes";
import { renderAccent } from "@/components/ui/accent";
import { Container } from "@/components/ui/primitives";
import { site } from "@/content/site";

export function Statement() {
  const { statement } = site;
  return (
    <section aria-labelledby="statement-title" className="relative section-y-28 sm:section-y-36 lg:section-y-48">
      <Container className="text-center">
        <StatementScrub>
          <h2
            id="statement-title"
            className="mx-auto font-display text-statement font-medium text-balance text-ink"
          >
            {statement.lines.map((line) => (
              <span key={line} className="block">
                {renderAccent(line)}
              </span>
            ))}
          </h2>
        </StatementScrub>
        <p data-reveal className="mx-auto mt-10 max-w-[44ch] text-lead text-muted sm:mt-12">
          {statement.body}
        </p>
        <LensMark className="mx-auto mt-12 h-9 w-9" />
      </Container>
    </section>
  );
}
