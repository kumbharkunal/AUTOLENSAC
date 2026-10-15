import dynamic from "next/dynamic";
import { images } from "@/content/images";
import { site } from "@/content/site";

// Code-split: the inspector's JavaScript ships in its own chunk, but the markup is still
// server-rendered, so the page height (and every ScrollTrigger below it) is stable from first paint.
const Inspector = dynamic(() => import("./Inspector").then((mod) => mod.Inspector));

export function UnderTheLens() {
  const { lens } = site;
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
    />
  );
}
