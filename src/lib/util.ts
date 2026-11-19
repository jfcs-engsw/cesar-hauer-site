export const brl = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: v % 1 ? 2 : 0 });

// Estado do protótipo no navegador: compra simulada, progresso das aulas e perfil da área de gestão.
const KEY = 'ch-prototipo';
type State = { purchased: string[]; done: string[]; bookings: Booking[]; gestao: string };
export type Booking = { id: string; start: string; name: string; email: string; topic: string; teams: string };

export function load(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { purchased: [], done: [], bookings: [], gestao: '', ...JSON.parse(raw) };
  } catch {
    /* sem armazenamento: segue com estado vazio */
  }
  return { purchased: [], done: [], bookings: [], gestao: '' };
}

export function save(patch: Partial<State>) {
  localStorage.setItem(KEY, JSON.stringify({ ...load(), ...patch }));
}
