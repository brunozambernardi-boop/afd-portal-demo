/* SAMPLE DATA ONLY — demo portal. Nothing here is a real customer or load. */
window.AFD_DATA = {
  customer: { company: "Sample Customer Co.", contact: "Demo User" },
  steps: ["Quote approved", "Permits secured", "Loaded", "In transit", "Delivered"],
  loads: [
    {
      id: "AFD-24871", route: "A",
      cargo: "Pressure vessel", short: "Pressure vessel",
      from: { city: "Houston, TX", place: "Customer fabrication yard" },
      to:   { city: "Odessa, TX",  place: "Plant site, laydown area 3" },
      status: 3, progress: 0.56, moving: true,
      eta: "Thu, Nov 19 · 2:00 PM CT", etaShort: "Nov 19",
      speed: "48 mph",
      po: "PO 55-1093",
      times: ["Nov 10 · 9:05 AM", "Nov 14 · 3:40 PM", "Nov 17 · 6:10 AM", "Nov 17 · 7:30 AM", null],
      notes: ["Quote signed by customer.", "Texas oversize/overweight permit issued.", "Load secured and checked at pickup.", "Daylight travel only, with pilot cars.", "Expected Thu, Nov 19."],
      specs: { Length: "98 ft 0 in", Width: "14 ft 6 in", Height: "15 ft 2 in", "Cargo weight": "182,000 lb", Trailer: "13-axle perimeter frame", Escorts: "2 pilot cars", "Permit states": "Texas" },
      photos: [
        { src: "assets/img/hero.webp", w: 1600, h: 1069, cap: "Pickup — loaded and secured", when: "Nov 17 · 6:10 AM" },
        { src: "assets/img/intro-thumb.webp", w: 1426, h: 808, cap: "Pickup — final check before departure", when: "Nov 17 · 7:20 AM" }
      ],
      docs: [
        { name: "Bill of Lading (BOL)", meta: "PDF · signed at pickup", ok: true },
        { name: "Texas OS/OW permit", meta: "PDF · TxDMV", ok: true },
        { name: "Certificate of insurance", meta: "PDF", ok: true },
        { name: "Proof of delivery (POD)", meta: "Ready after delivery", ok: false }
      ]
    },
    {
      id: "AFD-24877", route: "B",
      cargo: "Data center module", short: "Data center module",
      from: { city: "Conroe, TX", place: "Module builder yard" },
      to:   { city: "Abilene, TX", place: "Data center campus, gate B" },
      status: 2, progress: 0, moving: false,
      eta: "Fri, Nov 20 · 11:00 AM CT", etaShort: "Nov 20",
      po: "PO 55-1101",
      times: ["Nov 11 · 10:20 AM", "Nov 16 · 1:15 PM", "Nov 18 · 9:15 AM", null, null],
      notes: ["Quote signed by customer.", "Texas oversize permit issued.", "Loaded and tarped. Departs at sunrise.", "Starts Thu, Nov 19 at sunrise.", "Expected Fri, Nov 20."],
      specs: { Length: "60 ft 0 in", Width: "16 ft 0 in", Height: "14 ft 8 in", "Cargo weight": "96,000 lb", Trailer: "Stretch RGN", Escorts: "2 pilot cars", "Permit states": "Texas" },
      photos: [
        { src: "assets/img/svc-heavy-haul.webp", w: 1600, h: 1200, cap: "Pickup — module loaded", when: "Nov 18 · 9:15 AM" },
        { src: "assets/img/afd-specialized-equipment.webp", w: 960, h: 640, cap: "Pickup — strapped and checked", when: "Nov 18 · 9:40 AM" }
      ],
      docs: [
        { name: "Bill of Lading (BOL)", meta: "PDF · signed at pickup", ok: true },
        { name: "Texas OS/OW permit", meta: "PDF · TxDMV", ok: true },
        { name: "Certificate of insurance", meta: "PDF", ok: true },
        { name: "Proof of delivery (POD)", meta: "Ready after delivery", ok: false }
      ]
    },
    {
      id: "AFD-24890", route: "D",
      cargo: "400-ton power transformer", short: "Power transformer",
      from: { city: "Pasadena, TX", place: "Port of Houston terminal" },
      to:   { city: "Midland, TX", place: "Substation site" },
      status: 1, progress: 0, moving: false,
      eta: "Mon, Nov 30 · 4:00 PM CT", etaShort: "Nov 30",
      po: "PO 55-1120",
      times: ["Nov 09 · 2:30 PM", "Nov 17 · 11:05 AM", null, null, null],
      notes: ["Quote signed by customer.", "Superload permit issued for the state-assigned route.", "Pickup set for Tue, Nov 24.", "Night moves not allowed on this permit.", "Expected Mon, Nov 30."],
      specs: { Length: "32 ft 4 in", Width: "12 ft 2 in", Height: "14 ft 9 in", "Cargo weight": "800,000 lb (400 tons)", Trailer: "19-axle dual-lane", Escorts: "Pilot cars + police escort", "Permit states": "Texas" },
      photos: [],
      docs: [
        { name: "Texas superload permit", meta: "PDF · TxDMV", ok: true },
        { name: "Certificate of insurance", meta: "PDF", ok: true },
        { name: "Bill of Lading (BOL)", meta: "Ready at pickup", ok: false },
        { name: "Proof of delivery (POD)", meta: "Ready after delivery", ok: false }
      ]
    },
    {
      id: "AFD-24855", route: "C",
      cargo: "Large tube (process column)", short: "Large tube",
      from: { city: "Big Spring, TX", place: "AFD Big Spring Terminal" },
      to:   { city: "Corpus Christi, TX", place: "Refinery site" },
      status: 4, progress: 1, moving: false, delivered: true,
      eta: "Delivered Thu, Nov 12 · 3:20 PM CT", etaShort: "Delivered",
      po: "PO 55-1077",
      times: ["Oct 28 · 8:45 AM", "Nov 04 · 4:10 PM", "Nov 09 · 6:30 AM", "Nov 09 · 7:15 AM", "Nov 12 · 3:20 PM"],
      notes: ["Quote signed by customer.", "Texas oversize permit issued.", "Loaded with rear steer dolly.", "3 days, daylight only.", "Signed for by site lead. On time."],
      specs: { Length: "140 ft 0 in", Width: "13 ft 0 in", Height: "13 ft 6 in", "Cargo weight": "64,000 lb", Trailer: "Stretch trailer + steer dolly", Escorts: "2 pilot cars", "Permit states": "Texas" },
      photos: [
        { src: "assets/img/svc-oversize.webp", w: 1600, h: 739, cap: "Pickup — tube loaded on stretch trailer", when: "Nov 09 · 6:30 AM" }
      ],
      docs: [
        { name: "Bill of Lading (BOL)", meta: "PDF · signed", ok: true },
        { name: "Texas OS/OW permit", meta: "PDF · TxDMV", ok: true },
        { name: "Proof of delivery (POD)", meta: "PDF · signed Nov 12", ok: true },
        { name: "Invoice", meta: "PDF", ok: true }
      ]
    }
  ],
  towns: [
    ["Houston",29.76,-95.37],["Katy",29.79,-95.82],["Sealy",29.78,-96.16],["Columbus",29.71,-96.54],["Weimar",29.70,-96.78],["Schulenburg",29.68,-96.90],["Flatonia",29.69,-97.11],["Waelder",29.69,-97.30],["Seguin",29.57,-97.96],["San Antonio",29.42,-98.49],["Boerne",29.79,-98.73],["Comfort",29.97,-98.90],["Kerrville",30.05,-99.14],["Junction",30.49,-99.77],["Sonora",30.57,-100.64],["Ozona",30.71,-101.20],["Fort Stockton",30.89,-102.88],["McCamey",31.13,-102.22],["Crane",31.40,-102.35],["Odessa",31.85,-102.37],["Midland",32.00,-102.08],["Big Spring",32.25,-101.48],["Sweetwater",32.47,-100.41],["Abilene",32.45,-99.73],["Brenham",30.17,-96.40],["Giddings",30.18,-96.94],["Bastrop",30.11,-97.32],["Austin",30.27,-97.74],["Lampasas",31.06,-98.18],["Brownwood",31.71,-98.99],["Coleman",31.83,-99.43],["Conroe",30.31,-95.46],["Navasota",30.39,-96.09],["Bryan",30.67,-96.37],["Waco",31.55,-97.15],["Temple",31.10,-97.34],["Stephenville",32.22,-98.20],["Eastland",32.40,-98.82],["Cisco",32.39,-98.98],["San Angelo",31.46,-100.44],["Robert Lee",31.89,-100.48],["Garden City",31.86,-101.48],["Sterling City",31.84,-100.98],["Corpus Christi",27.80,-97.40],["George West",28.33,-98.12],["Three Rivers",28.46,-98.18],["Pleasanton",28.97,-98.48],["Sinton",28.04,-97.51],["Lamesa",32.74,-101.95],["Stanton",32.13,-101.79],["Pasadena",29.69,-95.21],["Brady",31.13,-99.33],["Mason",30.75,-99.23],["Fredericksburg",30.27,-98.87],["Llano",30.75,-98.68],["Menard",30.92,-99.79],["Eldorado",30.86,-100.60],["Big Lake",31.19,-101.46],["Rankin",31.22,-101.94],["Victoria",28.80,-97.00],["El Campo",29.20,-96.27],["Wharton",29.31,-96.10],["Hondo",29.35,-99.14],["Uvalde",29.21,-99.79],["Del Rio",29.36,-100.90],["Beeville",28.40,-97.75]
  ]
};
