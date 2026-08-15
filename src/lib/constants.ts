export interface SubjectColor {
  id: string;
  name: string;
  bg: string;
  border: string;
  text: string;
  badge: string;
  dot: string;
  accent: string;
  bgHex: string;
  borderHex: string;
  textHex: string;
}

export const SUBJECT_COLORS: Record<string, SubjectColor> = {
  sage: {
    id: "sage",
    name: "Sage Herb",
    bg: "bg-[#edf4ee]",
    border: "border-[#b8d4bb]",
    text: "text-[#244229]",
    badge: "bg-[#2d5234] text-white",
    dot: "#3b6b44",
    accent: "#3b6b44",
    bgHex: "#edf4ee",
    borderHex: "#b8d4bb",
    textHex: "#244229",
  },
  terracotta: {
    id: "terracotta",
    name: "Terracotta",
    bg: "bg-[#fbf0ec]",
    border: "border-[#eac7bb]",
    text: "text-[#58271a]",
    badge: "bg-[#793423] text-white",
    dot: "#96412c",
    accent: "#96412c",
    bgHex: "#fbf0ec",
    borderHex: "#eac7bb",
    textHex: "#58271a",
  },
  ochre: {
    id: "ochre",
    name: "Golden Ochre",
    bg: "bg-[#faf5e8]",
    border: "border-[#eadcb9]",
    text: "text-[#534015]",
    badge: "bg-[#74581c] text-white",
    dot: "#947023",
    accent: "#947023",
    bgHex: "#faf5e8",
    borderHex: "#eadcb9",
    textHex: "#534015",
  },
  slate: {
    id: "slate",
    name: "Nordic Slate",
    bg: "bg-[#eef3f7]",
    border: "border-[#bed0de]",
    text: "text-[#20374b]",
    badge: "bg-[#304e69] text-white",
    dot: "#3d6487",
    accent: "#3d6487",
    bgHex: "#eef3f7",
    borderHex: "#bed0de",
    textHex: "#20374b",
  },
  "dusty-rose": {
    id: "dusty-rose",
    name: "Dusty Rose",
    bg: "bg-[#faf0f2]",
    border: "border-[#eec8cf]",
    text: "text-[#54252e]",
    badge: "bg-[#763341] text-white",
    dot: "#934051",
    accent: "#934051",
    bgHex: "#faf0f2",
    borderHex: "#eec8cf",
    textHex: "#54252e",
  },
  pine: {
    id: "pine",
    name: "Forest Pine",
    bg: "bg-[#e8f0eb]",
    border: "border-[#bed3c4]",
    text: "text-[#1d3d2c]",
    badge: "bg-[#28523b] text-white",
    dot: "#32684b",
    accent: "#32684b",
    bgHex: "#e8f0eb",
    borderHex: "#bed3c4",
    textHex: "#1d3d2c",
  },
  amber: {
    id: "amber",
    name: "Warm Amber",
    bg: "bg-[#faf2ea]",
    border: "border-[#edd5bf]",
    text: "text-[#573616]",
    badge: "bg-[#794b1f] text-white",
    dot: "#985e26",
    accent: "#985e26",
    bgHex: "#faf2ea",
    borderHex: "#edd5bf",
    textHex: "#573616",
  },
  indigo: {
    id: "indigo",
    name: "Midnight Indigo",
    bg: "bg-[#eff1fa]",
    border: "border-[#cdd2f2]",
    text: "text-[#272e59]",
    badge: "bg-[#37417e] text-white",
    dot: "#4754a2",
    accent: "#4754a2",
    bgHex: "#eff1fa",
    borderHex: "#cdd2f2",
    textHex: "#272e59",
  },
  plum: {
    id: "plum",
    name: "Damson Plum",
    bg: "bg-[#f6eff7]",
    border: "border-[#e1cde4]",
    text: "text-[#47224e]",
    badge: "bg-[#64306e] text-white",
    dot: "#7e3c8b",
    accent: "#7e3c8b",
    bgHex: "#f6eff7",
    borderHex: "#e1cde4",
    textHex: "#47224e",
  },
  charcoal: {
    id: "charcoal",
    name: "Ink Charcoal",
    bg: "bg-[#f2f2f3]",
    border: "border-[#d0d1d4]",
    text: "text-[#2a2c30]",
    badge: "bg-[#40434a] text-white",
    dot: "#535760",
    accent: "#535760",
    bgHex: "#f2f2f3",
    borderHex: "#d0d1d4",
    textHex: "#2a2c30",
  },
};

export const DEFAULT_COLOR = "sage";

export function getSubjectColor(colorKey?: string | null): SubjectColor {
  if (!colorKey || !SUBJECT_COLORS[colorKey]) {
    return SUBJECT_COLORS[DEFAULT_COLOR];
  }
  return SUBJECT_COLORS[colorKey];
}

export interface WeekDay {
  number: number; // 1 = Monday ... 7 = Sunday
  short: string;
  full: string;
  letter: string;
}

export const DAYS_OF_WEEK: WeekDay[] = [
  { number: 1, short: "Mon", full: "Monday", letter: "M" },
  { number: 2, short: "Tue", full: "Tuesday", letter: "T" },
  { number: 3, short: "Wed", full: "Wednesday", letter: "W" },
  { number: 4, short: "Thu", full: "Thursday", letter: "T" },
  { number: 5, short: "Fri", full: "Friday", letter: "F" },
  { number: 6, short: "Sat", full: "Saturday", letter: "S" },
  { number: 7, short: "Sun", full: "Sunday", letter: "S" },
];

export const CLASS_TYPES = [
  { value: "lecture", label: "Lecture" },
  { value: "lab", label: "Laboratory" },
  { value: "tutorial", label: "Tutorial" },
  { value: "seminar", label: "Seminar" },
  { value: "workshop", label: "Workshop" },
  { value: "study", label: "Self Study" },
] as const;

export const NOTIFICATION_INTERVALS = [
  { minutes: 5, label: "5 minutes before" },
  { minutes: 10, label: "10 minutes before" },
  { minutes: 15, label: "15 minutes before (Recommended)" },
  { minutes: 30, label: "30 minutes before" },
  { minutes: 60, label: "1 hour before" },
];

export const APP_NAME = "Demuse";
export const APP_TAGLINE = "Intentional schedule & timetable planner";
