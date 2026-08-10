declare module "mhah-panchang" {
  interface Named {
    name?: string;
    name_en_IN?: string;
    name_en_UK?: string;
    ino?: number;
    start?: string | Date;
    end?: string | Date;
  }

  interface BasicPanchang {
    Day?: Named;
    Tithi?: Named;
    Paksha?: Named;
    Nakshatra?: Named;
    Karna?: Named;
    Yoga?: Named;
    Raasi?: Named;
    Ayanamsa?: Named;
  }

  interface CalendarPanchang extends BasicPanchang {
    Masa?: Named;
    MoonMasa?: Named & { isLeapMonth?: boolean };
    Ritu?: Named;
  }

  export class MhahPanchang {
    calculate(date: Date): BasicPanchang;
    calendar(date: Date, lat: number, lng: number): CalendarPanchang;
    sunTimer(date: Date, lat: number, lng: number): Record<string, Date | undefined>;
  }
}
