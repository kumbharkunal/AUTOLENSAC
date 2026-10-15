import {
  ArmchairIcon,
  BarcodeIcon,
  BatteryChargingIcon,
  CalendarXIcon,
  CertificateIcon,
  ChatsCircleIcon,
  ClipboardTextIcon,
  CpuIcon,
  DiscIcon,
  DropIcon,
  EngineIcon,
  FileTextIcon,
  GaugeIcon,
  HeadlightsIcon,
  KeyIcon,
  LightningIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  PackageIcon,
  PaintBrushBroadIcon,
  PhoneIcon,
  SealCheckIcon,
  ShieldCheckIcon,
  SteeringWheelIcon,
  TireIcon,
  TruckIcon,
} from "@phosphor-icons/react/dist/ssr";
import type { IconWeight } from "@phosphor-icons/react";
import type { IconName } from "@/content/site";

const MAP = {
  engine: EngineIcon,
  battery: BatteryChargingIcon,
  paint: PaintBrushBroadIcon,
  gauge: GaugeIcon,
  lightning: LightningIcon,
  magnifier: MagnifyingGlassIcon,
  chats: ChatsCircleIcon,
  truck: TruckIcon,
  calendar: CalendarXIcon,
  package: PackageIcon,
  cpu: CpuIcon,
  certificate: CertificateIcon,
  file: FileTextIcon,
  shield: ShieldCheckIcon,
  phone: PhoneIcon,
  "map-pin": MapPinIcon,
  clipboard: ClipboardTextIcon,
  key: KeyIcon,
  armchair: ArmchairIcon,
  drop: DropIcon,
  tire: TireIcon,
  steering: SteeringWheelIcon,
  headlights: HeadlightsIcon,
  barcode: BarcodeIcon,
  disc: DiscIcon,
  seal: SealCheckIcon,
} satisfies Record<IconName, unknown>;

/** Phosphor icon by content name. Light weight for feature icons, regular for small UI. */
export function Icon({
  name,
  className,
  weight = "light",
}: {
  name: IconName;
  className?: string;
  weight?: IconWeight;
}) {
  const Component = MAP[name];
  return <Component className={className} weight={weight} aria-hidden="true" />;
}
