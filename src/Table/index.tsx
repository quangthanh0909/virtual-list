import React, { useEffect, useRef } from 'react';
import { useVirtual } from './useReactVirtual';

import './tables.css';

export interface CellProp {
    rowData: Record<string, any>;
    index: number;
    cellValue: any;
}

export interface ColumnsProp {
    header: string | React.ReactElement;
    field: string;
    Cell?: (args: CellProp) => any;
    width?: number;
}

interface TableProps {
    data: Record<string, any>[];
    rowHeight: number;
    rowBuffer?: number;
    columns: ColumnsProp[];
    tableHeight: number;
    paddingTop?: number;
}

const Table: React.FC<TableProps> = ({ data, columns, tableHeight, rowHeight, ...others }) => {
    const parentElementRef = useRef<HTMLDivElement | null>(null);

    const { totalSize, virtualItems } = useVirtual({
        parentRef: parentElementRef,
        size: data.length,
        ...others,
    });

    useEffect(() => {
        //reset scroll when new data comming
        if (!parentElementRef.current) return;
        parentElementRef.current.scrollTop = 0;
    }, [data]);

    return (
        <div style={{ height: tableHeight, overflow: 'auto' }} ref={parentElementRef}>
            <div
                style={{
                    height: `${totalSize}px`,
                    width: '100%',
                    position: 'relative',
                }}
            >
                <div
                    className="header"
                    style={{
                        display: 'flex',
                        flexWrap: 'nowrap',
                        background: 'red',
                        position: 'sticky',
                        top: 0,
                        left: 0,
                        zIndex: 2,
                    }}
                >
                    {columns.map((column) => (
                        <div style={{ width: `${column.width}px`, flexShrink: 0 }}>
                            <b>{column.header}</b>
                        </div>
                    ))}
                </div>
                {virtualItems.map((row) => {
                    const { index, size, top } = row;
                    return (
                        <div
                            key={top}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                height: `${size}px`,
                                transform: `translateY(${top}px)`,
                                display: 'flex',
                                flexWrap: 'nowrap',
                            }}
                            className="row"
                        >
                            {columns.map((column) => {
                                const cellValue = data[index][column?.field] || '';
                                return (
                                    <div key={column.field} style={{ width: `${column.width}px`, flexShrink: 0 }}>
                                        {typeof column?.Cell === 'function'
                                            ? column?.Cell({ index, rowData: row, cellValue })
                                            : cellValue.toString()}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Table;
