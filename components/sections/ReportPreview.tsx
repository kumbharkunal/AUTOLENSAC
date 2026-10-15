import { LensMark } from "@/components/brand/LensMark";
import { Logo } from "@/components/brand/Logo";
import { ReportPrint, SplitHeading } from "@/components/motion/scenes";
import { Icon } from "@/components/ui/Icon";
import { ButtonLink, Container, Eyebrow, StatusPill } from "@/components/ui/primitives";
import { site } from "@/content/site";
import { whatsappHref } from "@/lib/links";

export function ReportPreview() {
  const { report, cta } = site;
  const [before, after] = report.summary.split(report.summaryHighlight);

  return (
    <section id={report.id} aria-labelledby="report-title" className="px-2 py-3 sm:px-3">
      <div className="rounded-[24px] bg-sand/55 py-20 sm:py-28 md:rounded-[36px] lg:py-36">
        <Container className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Eyebrow>{report.eyebrow}</Eyebrow>
            <SplitHeading id="report-title" order={75} className="mt-5 max-w-[12ch] font-display text-h2 font-medium text-ink">
              {report.title}
            </SplitHeading>
            <p data-reveal className="mt-6 max-w-[40ch] text-lead text-muted">
              {report.body}
            </p>
            <div data-reveal className="mt-8">
              <ButtonLink href={whatsappHref()} badge="whatsapp" external>
                {cta.book}
              </ButtonLink>
            </div>
          </div>

          <ReportPrint className="lg:col-span-7">
            <figure className="rounded-[32px] bg-ivory/55 p-1.5 shadow-lift ring-1 ring-ink/5 sm:p-2">
              <div
                data-report-doc
                className="relative overflow-hidden rounded-[26px] bg-ivory px-5 py-7 sm:px-9 sm:py-10"
              >
                {/* scanning line */}
                <div
                  data-scan
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-lens opacity-0 shadow-[0_0_18px_4px_rgb(26_71_209/0.35)]"
                />

                <header className="flex flex-wrap items-start justify-between gap-4">
                  <Logo className="text-[26px] sm:text-[30px]" subline />
                  <div className="flex items-center gap-3">
                    <span className="text-label text-muted">{report.documentTitle}</span>
                    <span className="-rotate-6 rounded-md border-[1.5px] border-lens px-2 py-1 font-mono text-[11px] leading-none font-medium tracking-[0.18em] text-lens uppercase">
                      {report.sampleLabel}
                    </span>
                  </div>
                </header>

                <dl className="mt-7 grid gap-4 border-y border-ink/10 py-5 sm:grid-cols-3">
                  {report.meta.map((item) => (
                    <div key={item.label}>
                      <dt className="text-label text-muted">{item.label}</dt>
                      <dd className="mt-1.5 text-[15px] text-ink">{item.value}</dd>
                    </div>
                  ))}
                </dl>

                <ul className="mt-5">
                  {report.rows.map((row) => (
                    <li
                      key={row.label}
                      data-row
                      className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 py-3.5 sm:flex sm:gap-4"
                    >
                      <span className="text-[16px] font-medium text-ink">{row.label}</span>
                      <span aria-hidden="true" className="leader hidden text-ink sm:block" />
                      <span className="col-start-1 row-start-2 font-mono text-[12px] tracking-[0.06em] text-muted">
                        {row.readout}
                      </span>
                      <StatusPill className="col-start-2 row-span-2 row-start-1 justify-self-end">{row.status}</StatusPill>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-col gap-5 rounded-[20px] bg-cream/70 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                  <p className="text-[15.5px] leading-relaxed text-ink">
                    <span className="font-medium">{report.summaryLead}</span> {before}
                    <span className="relative isolate whitespace-nowrap">
                      <span
                        data-highlight
                        aria-hidden="true"
                        className="absolute -inset-x-1 inset-y-0.5 -z-10 origin-left rounded-[0.3em_0.6em_0.4em_0.5em] bg-signal/55"
                      />
                      {report.summaryHighlight}
                    </span>
                    {after}
                  </p>
                  <div className="flex shrink-0 items-center gap-2.5 text-[13px] text-muted">
                    <LensMark className="h-8 w-8" />
                    <span>
                      AutoLens
                      <br />
                      inspector
                    </span>
                  </div>
                </div>

                <ul className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {report.badges.map((badge) => (
                    <li key={badge.label} data-seal className="flex flex-col items-center gap-2.5 text-center">
                      <span className="grid h-14 w-14 place-items-center rounded-full border border-dashed border-lens/40 text-lens">
                        <span className="grid h-10 w-10 place-items-center rounded-full bg-lens/[0.08]">
                          <Icon name={badge.icon} className="h-5 w-5" weight="regular" />
                        </span>
                      </span>
                      <span className="font-mono text-[10.5px] leading-tight font-medium tracking-[0.12em] text-ink/80 uppercase">
                        {badge.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <figcaption className="sr-only">
                Sample Vehicle Health Report showing engine status, battery health, electrical system, accident check and
                odometer verification, each with a status.
              </figcaption>
            </figure>
          </ReportPrint>
        </Container>
      </div>
    </section>
  );
}
