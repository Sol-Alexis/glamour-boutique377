// src/lib/ethiopianCalendar.ts

export const toEthiopianDate = (date: Date) => {
  // If the date is invalid, return a fallback string
  if (!date || isNaN(date.getTime())) {
    return { fullDate: "Recently" };
  }

  const months = [
    "Meskerem", "Tikimt", "Hedar", "Tahsas", "Ter", "Yekatit",
    "Megabit", "Miazia", "Ginbot", "Sene", "Hamle", "Nehase", "Pagume"
  ];

  const jdn = Math.floor(date.getTime() / 86400000) + 2440588;
  const r = (jdn - 1724221) % 1461;
  const n = (r % 365) + 365 * Math.floor(r / 1460);
  
  const year = 4 * Math.floor((jdn - 1724221) / 1461) + Math.floor(r / 365) - (Math.floor(r / 1460));
  const monthIndex = Math.floor(n / 30);
  const day = (n % 30) + 1;

  const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const monthName = months[monthIndex] || "Pagume";

  // We return a string here to make it easy to use
  return {
    fullDate: `${monthName} ${day}, ${year} at ${time}`
  };
};