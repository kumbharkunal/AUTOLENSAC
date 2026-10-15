import { Rail } from "@/components/sections/Rail";
import { site } from "@/content/site";

/**
 * Reviews rail. Entries in content/site.ts are obvious placeholders flagged `isPlaceholder`;
 * nothing here is presented as a real review. Set `testimonials.enabled` to false to hide it.
 */
export function Testimonials() {
  const { testimonials } = site;
  if (!testimonials.enabled || testimonials.items.length === 0) return null;

  return (
    <section aria-labelledby="testimonials-title" className="py-24 sm:py-32">
      <Rail titleId="testimonials-title" title={testimonials.title} label="Customer reviews">
        {testimonials.items.map((item, index) => (
          <li
            key={index}
            className="flex w-[86%] shrink-0 snap-start flex-col justify-between rounded-[28px] border border-ink/10 bg-ivory p-7 sm:w-[60%] sm:p-9 lg:w-[44%]"
          >
            <div>
              {item.isPlaceholder ? (
                <span className="inline-flex rounded-full border border-dashed border-ink/25 px-2.5 py-1 font-mono text-[10.5px] tracking-[0.14em] text-muted uppercase">
                  {testimonials.note}
                </span>
              ) : null}
              <blockquote className="mt-6 font-display text-[1.6rem] leading-snug font-medium text-ink">
                <p>“{item.quote}”</p>
              </blockquote>
            </div>
            <p className="mt-8 text-[15px]">
              <span className="font-medium text-ink">{item.name}</span>
              <span className="text-muted"> · {item.meta}</span>
            </p>
          </li>
        ))}
      </Rail>
    </section>
  );
}
