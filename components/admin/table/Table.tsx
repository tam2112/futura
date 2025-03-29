/* eslint-disable @typescript-eslint/no-explicit-any */
export default function Table({
    columns,
    renderRow,
    data,
}: {
    columns: { header: string; accessor: string; className?: string }[];
    renderRow: (item: any) => React.ReactNode;
    data: any[];
}) {
    return (
        <table className="w-full mt-4">
            <thead>
                <tr className="text-left font-heading font-semibold text-sm">
                    {columns.map((col) => (
                        <th key={col.accessor} className={col.className}>
                            {col.header}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="pt-2">{data.map((item) => renderRow(item))}</tbody>
        </table>
    );
}
