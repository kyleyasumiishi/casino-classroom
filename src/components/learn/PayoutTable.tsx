import type { PayoutTableRow } from '../../types/lesson';

interface PayoutTableProps {
  rows: PayoutTableRow[];
  showCategory?: boolean;
}

const categoryColors: Record<string, string> = {
  smart: 'bg-green-900/30 border-green-700/30',
  standard: 'bg-yellow-900/20 border-yellow-700/30',
  sucker: 'bg-red-900/20 border-red-700/30',
};

export function PayoutTable({ rows, showCategory = false }: PayoutTableProps) {
  return (
    <div className="overflow-x-auto my-4">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-cream/20">
            <th className="text-left py-2 px-3 text-gold font-semibold">Bet</th>
            <th className="text-left py-2 px-3 text-gold font-semibold">Pays</th>
            <th className="text-left py-2 px-3 text-gold font-semibold">House Edge</th>
            {rows.some((r) => r.notes) && (
              <th className="text-left py-2 px-3 text-gold font-semibold">Notes</th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const catClass =
              showCategory && row.category
                ? categoryColors[row.category] ?? ''
                : '';
            return (
              <tr
                key={`${row.bet}-${i}`}
                className={`border-b border-cream/10 ${catClass}`}
              >
                <td className="py-2 px-3 text-cream">{row.bet}</td>
                <td className="py-2 px-3 text-cream/80">{row.pays}</td>
                <td className="py-2 px-3 text-cream/80">{row.houseEdge}</td>
                {rows.some((r) => r.notes) && (
                  <td className="py-2 px-3 text-cream/60 text-xs">{row.notes ?? ''}</td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
