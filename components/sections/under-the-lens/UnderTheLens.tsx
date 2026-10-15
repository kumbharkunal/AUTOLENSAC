import { Icon } from "@/components/ui/Icon";
import { images } from "@/content/images";
import { site, type IconName } from "@/content/site";
import { Inspector } from "./Inspector";

// The inspector is server-rendered (stable page height from first paint); its heavy part, the
// pinned GSAP timeline, is code-split and only loads once motion is unlocked (see InspectorPin).

export function UnderTheLens() {
  const { lens } = site;
  const iconNames = Array.from(new Set(lens.kinds.flatMap((kind) => kind.checkpoints.map((point) => point.icon))));
  const icons = Object.fromEntries(
    iconNames.map((name) => [name, <Icon key={name} name={name} weight="regular" className="h-full w-full" />]),
  ) as Partial<Record<IconName, React.ReactNode>>;
  return (
    <Inspector
      id={lens.id}
      eyebrow={lens.eyebrow}
      title={lens.title}
      body={lens.body}
      status={lens.status}
      ready={lens.ready}
      kinds={lens.kinds}
      images={{ car: images.lensCar, bike: images.lensBike }}
      icons={icons}
    />
  );
}
