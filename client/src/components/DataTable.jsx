import React, { useState } from 'react';

const DataTable = ({
  columns,
  data = [],
  keyField = 'id',
  emptyMessage = 'No records available in this view.',
  className = '',
  onRowClick,
}) => {
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const handleHeaderClick = (column) => {
    if (!column.sortable) return;
    if (sortField === column.key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(column.key);
      setSortDirection('desc');
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortField) return data;
    return [...data].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = (bVal || '').toLowerCase();
      }
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortField, sortDirection]);

  return (
    <div className={`overflow-x-auto rounded-3xl border border-white/10 bg-gradient-to-br from-[#081028]/85 via-[#040816]/90 to-[#0c0818]/85 backdrop-blur-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8),0_0_25px_-5px_rgba(0,102,255,0.2),0_0_25px_-5px_rgba(255,0,85,0.15)] ${className}`}>
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-black/40 text-xs font-black uppercase tracking-wider text-slate-400">
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => handleHeaderClick(col)}
                className={`px-4 py-4 ${col.className || ''} ${
                  col.sortable ? 'cursor-pointer select-none hover:text-[#FFD700]' : ''
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span>{col.label}</span>
                  {col.sortable && sortField === col.key && (
                    <span className="text-[#FFD700] drop-shadow-[0_0_6px_#FFD700]">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800 text-slate-200">
          {sortedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sortedData.map((row, idx) => (
              <tr
                key={row[keyField] || idx}
                onClick={() => onRowClick && onRowClick(row)}
                className={`transition-colors hover:bg-slate-800/50 ${
                  onRowClick ? 'cursor-pointer' : ''
                }`}
              >
                {columns.map((col) => (
                  <td key={col.key} className={`px-4 py-3.5 ${col.className || ''}`}>
                    {col.render ? col.render(row[col.key], row, idx) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
