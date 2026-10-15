import { site } from "@/lib/site";

/**
 * Weekly schedule in minutes past midnight. A `close` value above 1440 means
 * the kitchen runs past midnight into the following day.
 * JS getDay(): 0 = Sunday … 6 = Saturday.
 */
const schedule: { days: number[]; open: number; close: number }[] = [
  { days: [0, 6], open: 660, close: 1500 }, // Sat–Sun 11:00 → 01:00
  { days: [1], open: -1, close: -1 }, // Monday closed
  { days: [2, 3, 4], open: 720, close: 1410 }, // Tue–Thu 12:00 → 23:30
  { days: [5], open: 720, close: 1500 }, // Fri 12:00 → 01:00
];

function minutesOfDay(date: Date) {
  return date.getHours() * 60 + date.getMinutes();
}

function formatMinute(total: number) {
  const wrapped = ((total % 1440) + 1440) % 1440;
  const hours24 = Math.floor(wrapped / 60);
  const mins = wrapped % 60;
  const suffix = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return `${hours12}:${String(mins).padStart(2, "0")} ${suffix}`;
}

function dayName(index: number) {
  return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][
    index
  ];
}

/** Shared so both server and client components format the clock identically. */
export function clockLabel(date: Date) {
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export type KitchenStatus = {
  isOpen: boolean;
  headline: string;
  detail: string;
  /** Minutes until the kitchen closes (while open) or opens (while shut). */
  minutesUntilChange: number;
  /** Rough kitchen wait in minutes, driven by typical service peaks. */
  waitMinutes: number;
  /** Decorative clay-oven temperature in celsius. */
  tandoorCelsius: number;
  /** Deterministic "plates out today" figure so it does not flicker per render. */
  platesToday: number;
  todayHours: string;
};

export function getKitchenStatus(now: Date = new Date()): KitchenStatus {
  const day = now.getDay();
  const nowMinutes = minutesOfDay(dateSafe(now));
  const todayWindow = schedule.find((entry) => entry.days.includes(day));
  const todayHours =
    site.hours.find((entry) => {
      if (entry.day === "Monday") return day === 1;
      if (entry.day.startsWith("Tuesday")) return day >= 2 && day <= 4;
      if (entry.day === "Friday") return day === 5;
      return day === 0 || day === 6;
    })?.value ?? "Closed";

  const openNow =
    !!todayWindow && todayWindow.open >= 0 && nowMinutes >= todayWindow.open && nowMinutes < todayWindow.close;

  // Find the next moment the kitchen opens or closes.
  let minutesUntilChange = 0;
  let changeLabel = "";

  if (openNow && todayWindow) {
    minutesUntilChange = todayWindow.close - nowMinutes;
    changeLabel = `closes ${formatMinute(todayWindow.close)}`;
  } else {
    for (let step = 0; step <= 7; step += 1) {
      const probeDay = (day + step) % 7;
      const window = schedule.find((entry) => entry.days.includes(probeDay));
      if (!window || window.open < 0) continue;
      const candidate = step * 1440 + window.open - nowMinutes;
      if (candidate > 0) {
        minutesUntilChange = candidate;
        changeLabel = `opens ${step === 0 ? "today" : step === 1 ? "tomorrow" : dayName(probeDay)} ${formatMinute(
          window.open,
        )}`;
        break;
      }
    }
  }

  // Peak service windows: 7–11pm is busy, lunch is steady, off-peak is quiet.
  const isPeak = nowMinutes >= 1140 && nowMinutes <= 1380;
  const isLunch = nowMinutes >= 720 && nowMinutes < 900;
  const waitMinutes = !openNow ? 0 : isPeak ? 45 : isLunch ? 30 : 18;

  // A tandoor idles cool overnight and sits around 430–470°C in service.
  const tandoorCelsius = openNow ? 430 + (nowMinutes % 40) : 96 + (nowMinutes % 25);

  // Deterministic pseudo-random from the date, so the number is stable all day.
  const seed = Number(
    `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(
      now.getDate(),
    ).padStart(2, "0")}`,
  );
  const platesToday = openNow ? 240 + (seed % 170) : 180 + (seed % 120);

  return {
    isOpen: openNow,
    headline: openNow ? "Kitchen is firing" : "Kitchen is resting",
    detail: openNow ? `Closes ${formatMinute(todayWindow!.close)}` : changeLabel || "Closed today",
    minutesUntilChange,
    waitMinutes,
    tandoorCelsius,
    platesToday,
    todayHours,
  };
}

function dateSafe(date: Date) {
  // Guard against environments that return skewed clocks.
  return Number.isNaN(date.getTime()) ? new Date(0) : date;
}

export function countdown(minutes: number) {
  if (minutes <= 0) return "now";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours}h` : `${hours}h ${rest}m`;
}
