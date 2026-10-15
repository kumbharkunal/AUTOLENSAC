/**
 * AutoLens: every word on the site lives here.
 *
 * Edit copy, links and feature flags in this file only. Anything marked
 * `// TODO: confirm with client` is a placeholder or an assumption and is also listed in README.md.
 * House style: no em-dashes or en-dashes in visible copy; Indian English spelling.
 */

export type IconName =
  | "engine"
  | "battery"
  | "paint"
  | "gauge"
  | "lightning"
  | "magnifier"
  | "chats"
  | "truck"
  | "calendar"
  | "package"
  | "cpu"
  | "certificate"
  | "file"
  | "shield"
  | "phone"
  | "map-pin"
  | "clipboard"
  | "key"
  | "armchair"
  | "drop"
  | "tire"
  | "steering"
  | "headlights"
  | "barcode"
  | "disc"
  | "seal";

export interface Checkpoint {
  id: string;
  title: string;
  /** Mono readout shown beside the loupe, e.g. "PAINT DEPTH / PANEL GAPS". */
  readout: string;
  body: string;
  icon: IconName;
  /** Hotspot position as a fraction of the image (0 = left/top, 1 = right/bottom). Calibrate with ?hotspots. */
  x: number;
  y: number;
}

export const site = {
  brand: {
    name: "AutoLens",
    // TODO: confirm with client: Instagram shows "Auto Lens" (two words); the brief uses "AutoLens".
    subline: "Pre-Delivery Inspection | Consultation",
    positioning: "Helping you buy the right vehicle with confidence and clarity.",
    description:
      "AutoLens inspects new cars and bikes before delivery. Computerized diagnosis, a detailed Vehicle Health Report and expert consultation, so you take the keys with confidence.",
  },

  /** Used for canonical URLs, the sitemap and social cards when not deployed on Vercel. */
  siteUrl: "https://autolensac.vercel.app", // TODO: confirm with client (production domain)

  contact: {
    phoneDisplay: "+91 88057 74390",
    phoneShort: "88057 74390",
    phoneE164: "+918805774390",
    phoneSchema: "+91-88057-74390",
    whatsappNumber: "918805774390", // TODO: confirm WhatsApp number (assumed same as phone)
    whatsappMessage:
      "Hi AutoLens, I'd like to book a Pre-Delivery Inspection (PDI).\nVehicle: \nDelivery date: \nCity: ",
    consultMessage: "Hi AutoLens, I'd like some advice before buying a vehicle. I'm considering: ",
    email: null as string | null, // TODO: confirm with client
    instagram: "https://www.instagram.com/autolensac/",
    instagramHandle: "@autolensac",
    facebook: null as string | null, // TODO: confirm with client
    youtube: null as string | null, // TODO: confirm with client
    googleBusiness: null as string | null, // TODO: confirm with client
    serviceAreas: [] as string[], // TODO: confirm with client (city and service areas)
    hours: null as string | null, // TODO: confirm with client
  },

  features: {
    /** Short lens intro on the first visit of a session. */
    intro: true as boolean,
    /** Lens ring that follows the mouse on desktop. */
    cursor: true as boolean,
  },

  copyrightYear: 2026,

  nav: [
    { label: "Services", href: "#services" },
    { label: "What We Check", href: "#what-we-check" },
    { label: "Process", href: "#process" },
    { label: "Report", href: "#report" },
    { label: "FAQ", href: "#faq" },
  ],

  cta: {
    book: "Book your PDI",
    call: "Call",
    consult: "Ask on WhatsApp",
    follow: "Follow on Instagram",
  },

  hero: {
    eyebrow: "Pre-Delivery Inspection · Consultation",
    /** Full sentence for screen readers and SEO; the visual lines below must spell the same words. */
    title: "Before the keys are handed over, perfection comes first.",
    accent: "perfection",
    lines: {
      mobile: ["Before the keys", "are handed over,", "*perfection*", "comes first."],
      tablet: ["Before the keys are", "handed over, *perfection*", "comes first."],
      desktop: ["Before the keys are handed over,", "*perfection* comes first."],
    },
    subtitle: "Expert computerized car & bike diagnosis before delivery.",
    imageAlt:
      "An AutoLens inspector holding a diagnostic tablet beside a new SUV in a bright dealership delivery bay",
    /** Glass "report" chips floating over the photograph (positions in % of the hero frame). */
    // Positions in % of the hero frame: `x` = from the left edge, `r` = from the right edge.
    chips: [
      { label: "Engine status", value: "Good", desktop: { x: 62, y: 22 }, mobile: { x: 6, y: 16 } },
      { label: "Accident check", value: "Clear", desktop: { r: 5, y: 38 }, mobile: { r: 6, y: 28 } },
      { label: "Odometer", value: "Verified", desktop: { x: 64, y: 54 }, mobile: null },
    ] as {
      label: string;
      value: string;
      desktop: { x?: number; r?: number; y: number };
      mobile: { x?: number; r?: number; y: number } | null;
    }[],
    /** Where the lens aperture opens from (the vehicle), in % of the frame. */
    focal: { desktop: { x: 70, y: 40 }, mobile: { x: 50, y: 32 } },
  },

  statement: {
    lines: ["Don't buy a vehicle", "without *PDI.*"],
    body: "Every vehicle deserves a thorough Pre-Delivery Inspection, for safety, performance and peace of mind from day one.",
  },

  models: {
    label: "We inspect all major cars & bikes",
    items: [
      "MG ZS EV",
      "MG Gloster",
      "Hyundai Venue",
      "Tata Nexon",
      "VW Taigun",
      "Skoda Slavia",
      "TVS Jupiter",
      "Honda Activa",
      "Bajaj Pulser",
      "and many more",
    ],
  },

  problem: {
    title: "What a showroom shine can hide.",
    body: "New doesn't always mean flawless. Before it reaches you, a vehicle is transported, stored and handled many times, and small problems are easy to miss on delivery day.",
    imageAlt: "Close-up of a new tyre's sidewall and its DOT manufacturing date code",
    findings: [
      {
        icon: "truck",
        title: "Transit damage",
        body: "Scratches, dents and chips picked up on the way to the showroom.",
      },
      {
        icon: "paint",
        title: "Repainted panels",
        body: "Touch-ups that hide damage, caught with careful paint checks.",
      },
      {
        icon: "calendar",
        title: "Old stock or mismatched VIN",
        body: "Manufacturing dates and chassis numbers that don't match your papers.",
      },
      {
        icon: "gauge",
        title: "Odometer tampering",
        body: "Kilometres that don't add up on a vehicle sold as brand new.",
      },
      {
        icon: "lightning",
        title: "Electrical faults",
        body: "Hidden error codes, weak batteries and sensors that misbehave.",
      },
      {
        icon: "package",
        title: "Missing accessories",
        body: "Items on your invoice that never made it into the vehicle.",
      },
    ] as { icon: IconName; title: string; body: string }[],
    callout: {
      title: "Save money from hidden problems.",
      body: "Spot it before you sign and the dealer fixes it. Spot it after, and it can become your problem.",
    },
  },

  services: {
    id: "services",
    title: "Inspection, done properly.",
    body: "Every service covers cars and bikes, and every finding goes into your report.",
    appliesTo: "Cars · Bikes",
    items: [
      {
        id: "engine",
        icon: "engine",
        title: "Engine & battery health check",
        body: "Computerized diagnosis of engine status, fault codes and battery condition before you accept delivery.",
        imageAlt: "A technician's hand holding a diagnostic tablet connected to a new car's OBD port",
      },
      {
        id: "paint",
        icon: "paint",
        title: "Accident & paint inspection",
        body: "Panel-by-panel checks for repaints, filler and transit damage.",
        imageAlt: "Close-up of a paint thickness gauge on a glossy car panel",
      },
      {
        id: "odometer",
        icon: "gauge",
        title: "Odometer & electrical scan",
        body: "Odometer verification and a full scan of the electrical system.",
        readouts: [
          { label: "Odometer", value: "Verified" },
          { label: "Electrical", value: "OK" },
          { label: "Fault codes", value: "None" },
        ],
      },
      {
        id: "hidden",
        icon: "magnifier",
        title: "Hidden-problem detection",
        body: "Catch the issues that are expensive later, while the dealer still has to fix them.",
        imageAlt: "An inspector checking a new motorcycle in a bright showroom",
      },
      {
        id: "consult",
        icon: "chats",
        title: "Professional vehicle consultation",
        body: "Not sure which model or variant fits you? Get honest, expert advice before you buy.",
      },
    ] as {
      id: string;
      icon: IconName;
      title: string;
      body: string;
      imageAlt?: string;
      readouts?: { label: string; value: string }[];
    }[],
  },

  lens: {
    id: "what-we-check",
    eyebrow: "What we check",
    title: "Under the lens.",
    body: "Our PDI checklist covers every system that matters, so nothing reaches the road unchecked.",
    status: "Checked",
    ready: "Ready for delivery",
    kinds: [
      {
        id: "car",
        label: "Cars",
        imageAlt: "Side profile of a new compact SUV on a cream studio background",
        checkpoints: [
          {
            id: "exterior",
            title: "Exterior & paint",
            readout: "Paint depth / panel gaps",
            body: "Every panel checked for repaints, dents, scratches and uneven gaps.",
            icon: "paint",
            x: 0.62,
            y: 0.5,
          },
          {
            id: "interior",
            title: "Interior quality",
            readout: "Trim / upholstery / fitment",
            body: "Seats, trim, dashboard and fitment inspected for marks and defects.",
            icon: "armchair",
            x: 0.53,
            y: 0.43,
          },
          {
            id: "electrical",
            title: "Electrical systems",
            readout: "Lights / sensors / ECU scan",
            body: "Lights, infotainment, sensors and controls tested, with a full computerized scan.",
            icon: "headlights",
            x: 0.17,
            y: 0.52,
          },
          {
            id: "fluids",
            title: "Fluid levels",
            readout: "Engine oil / coolant / brake",
            body: "Engine oil, coolant, brake and washer fluids verified under the bonnet.",
            icon: "drop",
            x: 0.28,
            y: 0.47,
          },
          {
            id: "tyres",
            title: "Tyres & wheels",
            readout: "DOT date / pressure / rims",
            body: "Tyre manufacturing dates, pressure, tread and rims checked on every wheel.",
            icon: "tire",
            x: 0.27,
            y: 0.68,
          },
          {
            id: "road",
            title: "Road-readiness",
            readout: "Brakes / steering / test",
            body: "A final assessment that the vehicle is safe and ready for the road.",
            icon: "steering",
            x: 0.45,
            y: 0.6,
          },
        ] as Checkpoint[],
      },
      {
        // TODO: confirm with client: bike checklist adapted from the car checklist.
        id: "bike",
        label: "Bikes",
        imageAlt: "Side profile of a new motorcycle on a cream studio background",
        checkpoints: [
          {
            id: "body",
            title: "Paint & body",
            readout: "Tank / panels / finish",
            body: "Tank, panels and fenders checked for scratches, dents and repaints.",
            icon: "paint",
            x: 0.47,
            y: 0.46,
          },
          {
            id: "controls",
            title: "Controls & electricals",
            readout: "Lights / horn / indicators",
            body: "Headlamp, indicators, horn, switches and the instrument cluster tested.",
            icon: "headlights",
            x: 0.36,
            y: 0.47,
          },
          {
            id: "engine",
            title: "Engine & fluids",
            readout: "Oil / leaks / idle",
            body: "Engine oil, leaks, battery and idle behaviour checked.",
            icon: "drop",
            x: 0.52,
            y: 0.58,
          },
          {
            id: "tyres",
            title: "Tyres & brakes",
            readout: "DOT date / pads / pressure",
            body: "Tyre dates and pressure, brake feel and wheel alignment inspected.",
            icon: "tire",
            x: 0.33,
            y: 0.65,
          },
          {
            id: "chassis",
            title: "Chassis & VIN",
            readout: "Frame no. / engine no.",
            body: "Chassis and engine numbers matched against your invoice and papers.",
            icon: "barcode",
            x: 0.7,
            y: 0.5,
          },
          {
            id: "road",
            title: "Road-readiness",
            readout: "Brakes / steering / test",
            body: "A final assessment that the bike is safe and ready for the road.",
            icon: "steering",
            x: 0.6,
            y: 0.66,
          },
        ] as Checkpoint[],
      },
    ],
  },

  process: {
    id: "process",
    title: "Four steps to a confident delivery.",
    steps: [
      {
        verb: "Book.",
        title: "Message or call us",
        body: "Book on WhatsApp or by phone. Share your vehicle and delivery date.",
        icon: "phone",
      },
      {
        verb: "Meet.",
        title: "At the dealership",
        body: "We meet you at the dealership before delivery.",
        icon: "map-pin",
      },
      {
        verb: "Inspect.",
        title: "Computerized and physical",
        body: "A full diagnostic scan and a detailed physical check, documented in your report.",
        icon: "clipboard",
      },
      {
        verb: "Drive away.",
        title: "With confidence",
        body: "Take delivery knowing every detail, or ask the dealer to fix what we found first.",
        icon: "key",
      },
    ] as { verb: string; title: string; body: string; icon: IconName }[],
  },

  report: {
    id: "report",
    eyebrow: "Vehicle Health Report",
    title: "A report you can actually read.",
    body: "Clear findings, plain language and a status for every check. No jargon and no guesswork.",
    sampleLabel: "Sample",
    documentTitle: "Vehicle Health Report",
    meta: [
      { label: "Vehicle", value: "Compact SUV, petrol, automatic" },
      { label: "Inspection", value: "Pre-delivery (PDI)" },
      { label: "Method", value: "Computerized + physical" },
    ],
    rows: [
      { label: "Engine status", readout: "No fault codes", status: "Good" },
      { label: "Battery health", readout: "Healthy charge", status: "Good" },
      { label: "Electrical system", readout: "All systems responding", status: "Good" },
      { label: "Accident check", readout: "No repaint detected", status: "Clear" },
      { label: "Odometer verification", readout: "Reading consistent", status: "Verified" },
    ],
    summaryLead: "Inspector's summary:",
    summaryHighlight: "ready for delivery",
    summary: "All checks passed. The vehicle is ready for delivery.",
    badges: [
      { icon: "cpu", label: "100% computerized" },
      { icon: "magnifier", label: "Detailed analysis" },
      { icon: "file", label: "Accurate reports" },
      { icon: "shield", label: "Trusted service" },
    ] as { icon: IconName; label: string }[],
    // TODO: confirm with client: report format and delivery (PDF? WhatsApp? same day?).
  },

  why: {
    id: "why",
    title: "Confidence and clarity, built into every inspection.",
    imageAlt: "Hands passing the keys of a new car across a table",
    pillars: [
      {
        icon: "cpu",
        title: "100% computerized diagnosis",
        body: "Diagnostic tools read what the eye can't, from fault codes to battery health.",
      },
      {
        icon: "certificate",
        title: "Expert & certified technicians",
        // TODO: confirm with client: which certification the technicians hold.
        body: "Experienced inspectors who know where new vehicles hide their problems.",
      },
      {
        icon: "file",
        title: "Detailed & accurate reports",
        body: "Every check documented with a clear status you can show the dealer.",
      },
      {
        icon: "shield",
        title: "Safe & smart buying decisions",
        body: "Advice that protects your money before it leaves your account.",
      },
    ] as { icon: IconName; title: string; body: string }[],
  },

  testimonials: {
    enabled: true as boolean,
    title: "In their words.",
    note: "Placeholder",
    // TODO: confirm with client: replace with real reviews (with permission) and set isPlaceholder to false.
    items: [
      {
        quote: "A real review from a verified AutoLens customer will appear here.",
        name: "Customer name",
        meta: "Vehicle · City",
        isPlaceholder: true,
      },
      {
        quote: "Short and specific works best: what was found, and how it helped at delivery.",
        name: "Customer name",
        meta: "Vehicle · City",
        isPlaceholder: true,
      },
      {
        quote: "Reviews from bike owners will sit alongside car owners in this rail.",
        name: "Customer name",
        meta: "Vehicle · City",
        isPlaceholder: true,
      },
    ] as { quote: string; name: string; meta: string; isPlaceholder: boolean }[],
  },

  instagram: {
    eyebrow: "@autolensac",
    title: "Insights from the inspection bay.",
    body: "PDI awareness, automotive insights, vehicle care tips and industry updates, shared on Instagram.",
    tiles: [
      { kind: "image", image: "paintGauge", category: "PDI awareness", alt: "Paint thickness gauge on a car door" },
      {
        kind: "tip",
        category: "Vehicle care tips",
        text: "Check the tyre DOT code: the last four digits show the week and year it was made.",
      },
      { kind: "image", image: "diagnosticTablet", category: "Automotive insights", alt: "Diagnostic tablet reading a car's computer" },
      { kind: "image", image: "bikeInspection", category: "PDI awareness", alt: "Inspection of a new motorcycle" },
      {
        kind: "tip",
        category: "Industry updates",
        text: "Never sign the delivery note before the inspection is done.",
      },
      { kind: "image", image: "detailVinTyre", category: "Vehicle care tips", alt: "Close-up of a tyre sidewall and date code" },
    ] as (
      | { kind: "image"; image: "paintGauge" | "diagnosticTablet" | "bikeInspection" | "detailVinTyre"; category: string; alt: string }
      | { kind: "tip"; category: string; text: string }
    )[],
  },

  faq: {
    id: "faq",
    title: "Questions, answered.",
    items: [
      {
        q: "What is a Pre-Delivery Inspection (PDI)?",
        a: "A PDI is a thorough check of a new vehicle before you accept delivery. We inspect the body, paint, interior, electricals, fluids, tyres and road-readiness, and run a computerized diagnosis, so any issue is fixed before the vehicle becomes your responsibility.",
      },
      {
        q: "When should I book my PDI?",
        a: "As soon as you have a delivery date. The inspection should happen before you sign the delivery note or make the final payment, so the dealer can still put things right.",
      },
      {
        q: "Do you inspect bikes and scooters too?",
        a: "Yes. We inspect all major cars and two-wheelers, from SUVs like the Tata Nexon and MG Gloster to scooters and motorcycles like the Honda Activa, TVS Jupiter and Bajaj Pulser.",
      },
      {
        q: "How long does an inspection take?",
        // TODO: confirm with client: typical inspection duration.
        a: "It depends on the vehicle. We will confirm the timing when you book, so you can plan your delivery day around it.",
      },
      {
        q: "What do I get in the report?",
        a: "A Vehicle Health Report covering engine status, battery health, the electrical system, accident and paint checks and odometer verification, with a clear status for each.",
      },
      {
        q: "Do you come to the dealership?",
        a: "Yes. We meet you at the dealership before delivery, so anything we find can be raised with the dealer on the spot.",
      },
      {
        q: "What happens if you find a problem?",
        a: "We document it in your report and explain it in plain language, so you can ask the dealer to fix or replace parts before you take delivery.",
      },
      {
        q: "Which cities do you cover?",
        // TODO: confirm with client: city and service areas.
        a: "Message us on WhatsApp with your dealership's location and we will confirm availability.",
      },
      {
        q: "How much does a PDI cost?",
        // TODO: confirm with client: pricing.
        a: "Pricing depends on the vehicle. Send us your model on WhatsApp for a quick quote.",
      },
    ],
  },

  finalCta: {
    id: "book",
    title: ["For a worry-free drive,", "trust *AutoLens.*"],
    body: "Book your PDI today.",
  },

  footer: {
    servicesTitle: "Services",
    contactTitle: "Contact",
    areasTitle: "Service areas",
    areasPlaceholder: "City and service areas to be confirmed.", // TODO: confirm with client
    followTitle: "Follow",
    legal: "Sample report and placeholder content shown for demonstration.",
  },

  seo: {
    title: "AutoLens — Pre-Delivery Inspection & Vehicle Consultancy",
    description:
      "Don't buy a vehicle without PDI. AutoLens inspects new cars and bikes before delivery with computerized diagnosis, a detailed Vehicle Health Report and expert consultation.",
    ogTitle: "Don't buy a vehicle without PDI.",
    keywords: [
      "pre-delivery inspection",
      "PDI",
      "new car inspection",
      "bike PDI",
      "vehicle consultancy",
      "computerized car diagnosis",
      "AutoLens",
    ],
  },
} as const;

export type Site = typeof site;
