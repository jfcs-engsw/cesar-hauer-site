// Agenda simulada. Na versão real, a disponibilidade e as reservas vêm do servidor, e a reunião do
// Teams é criada pela API do Microsoft Graph na conta do Cesar depois da confirmação do pagamento.

export const SESSION = { minutes: 60, price: 500, noticeHours: 24, weeksAhead: 6 };

// Disponibilidade semanal (0 = domingo). Horário de Brasília.
const WEEKLY: Record<number, number[]> = {
  2: [9, 10, 11, 14, 15, 16],
  4: [9, 10, 11, 14, 15, 16],
  6: [9, 10],
};

// Ocupação determinística, para o protótipo parecer uma agenda em uso.
const taken = (d: Date) => {
  const n = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate() + d.getHours() * 3;
  return (n * 37) % 7 < 2;
};

export function slotsFor(day: Date, booked: string[]): Date[] {
  const hours = WEEKLY[day.getDay()] ?? [];
  const limit = Date.now() + SESSION.noticeHours * 3600_000;
  return hours
    .map((h) => new Date(day.getFullYear(), day.getMonth(), day.getDate(), h))
    .filter((s) => s.getTime() > limit && !taken(s) && !booked.includes(s.toISOString()));
}

export function lastBookableDay() {
  const d = new Date();
  d.setDate(d.getDate() + SESSION.weeksAhead * 7);
  return d;
}

const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

export function icsFile(start: Date, title: string, url: string) {
  const end = new Date(start.getTime() + SESSION.minutes * 60_000);
  const body = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Cesar Hauer//Agenda//PT-BR',
    'BEGIN:VEVENT',
    `UID:${stamp(start)}@cesarhauer`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${title}`,
    'LOCATION:Microsoft Teams',
    `DESCRIPTION:Link da reunião: ${url}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  return URL.createObjectURL(new Blob([body], { type: 'text/calendar' }));
}

export const fmtDay = (d: Date) =>
  d.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });
export const fmtTime = (d: Date) => d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
