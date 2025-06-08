interface SlotTime {
  startTime: string;
  endTime: string;
}

const twoDigitFormattedNumber = (num: number): string =>
  num < 10 ? `0${num}` : `${num}`;

const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${twoDigitFormattedNumber(hours)}:${twoDigitFormattedNumber(mins)}`;
};

export const generateSlots = (
  startTime: string,
  endTime: string,
  serviceDuration: number
): SlotTime[] => {
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  const totalDuration = endMinutes - startMinutes;
  const numSlots = Math.floor(totalDuration / serviceDuration);
  const slots: SlotTime[] = [];

  for (let i = 0; i < numSlots; i++) {
    const slotStart = minutesToTime(startMinutes + i * serviceDuration);
    const slotEnd = minutesToTime(startMinutes + (i + 1) * serviceDuration);
    slots.push({ startTime: slotStart, endTime: slotEnd });
  }

  return slots;
};
