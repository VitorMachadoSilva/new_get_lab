// Utilidades de data sem alterar timezone

// Converte uma string YYYY-MM-DD para uma data formatada pt-BR sem deslocar fuso
export function formatBrazilianDateFromYmd(ymd) {
  if (!ymd) return '';
  const [year, month, day] = ymd.split('-').map(Number);
  if (!year || !month || !day) return ymd;
  // Usa Date UTC para evitar offset de timezone
  const date = new Date(Date.UTC(year, month - 1, day));
  const dd = String(date.getUTCDate()).padStart(2, '0');
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const yyyy = date.getUTCFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

// Formata campo date do backend (YYYY-MM-DDTHH:mm:ss.sssZ ou YYYY-MM-DD) sem deslocar
export function formatBrazilianDateFromBackend(value) {
  if (!value) return '';
  // Tenta extrair apenas a parte YYYY-MM-DD
  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return value;
  return formatBrazilianDateFromYmd(`${match[1]}-${match[2]}-${match[3]}`);
}


