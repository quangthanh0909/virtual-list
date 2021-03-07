import React, { useState, useEffect, MutableRefObject, useCallback, useRef } from 'react';

const defaultRange = {
    start: 0,
    end: 0,
    scrollOffset: 0,
};

export interface virtualProps {
    size: number;
    rowHeight?: number;
    rowBuffer?: number;
    parentRef: MutableRefObject<HTMLDivElement | null>;
    paddingTop?: number;
    paddingBottom?: number;
}

export interface rangeProp {
    start: number;
    end: number;
    scrollOffset: number;
}

export interface measureProp {
    index: number;
    top: number;
    bottom: number;
    size: number;
}

export function useVirtual({
    size = 0,
    rowHeight = 30,
    rowBuffer = 0,
    paddingTop = 0,
    paddingBottom = 0,
    parentRef,
}: virtualProps) {
    const outerHeight = useRef<number>(0);
    const [scrollElement, setScrollElement] = useState<HTMLElement | null>(null);
    const [range, setRange] = useState<rangeProp>(defaultRange);

    useEffect(() => {
        if (!parentRef.current) return;
        setScrollElement(parentRef.current);
        outerHeight.current = parentRef.current.getBoundingClientRect().height;
    }, [parentRef]);

    const measurements = React.useMemo<measureProp[]>(() => {
        const measurements: measureProp[] = [];
        for (let i = 0; i < size; i++) {
            const top = measurements[i - 1] ? measurements[i - 1].bottom : paddingTop;
            const bottom = top + rowHeight;
            measurements[i] = { index: i, top, size: rowHeight, bottom };
        }
        return measurements;
    }, [size, paddingTop, rowHeight]);

    const totalSize = (measurements[size - 1]?.bottom || 0) + paddingBottom;

    const calculateRange = useCallback(
        (prevRange: rangeProp): rangeProp => {
            const total = measurements.length;
            const { start: preStart, end: preEnd, scrollOffset: preScrollOffset } = prevRange;
            if (!scrollElement || !size) return prevRange;
            const currentScollOffset = scrollElement?.scrollTop;
            let start = preStart;
            let end = preEnd;
            if (currentScollOffset > preScrollOffset) {
                // scroll down
                while (measurements[start].top < currentScollOffset) {
                    start += 1;
                }

                while (end < total - 1 && measurements[end].top < currentScollOffset + outerHeight.current) {
                    end += 1;
                }
            } else if (currentScollOffset < preScrollOffset) {
                // scroll up
                while (start > 0 && measurements[start].top > currentScollOffset) {
                    start -= 1;
                }

                while (end <= total - 1 && measurements[end].top > currentScollOffset + outerHeight.current) {
                    end -= 1;
                }
            } else {
                // initial scroll
                end = Math.round(outerHeight.current / rowHeight);
                while (end < total - 1 && measurements[end].top <= currentScollOffset + outerHeight.current) {
                    end += 1;
                }
            }

            return {
                start: Math.max(start - rowBuffer, 0),
                end: Math.min(end + rowBuffer, total - 1),
                scrollOffset: currentScollOffset,
            };
        },
        [rowBuffer, measurements, rowHeight, scrollElement, size],
    );

    useEffect(() => {
        if (!scrollElement) {
            return;
        }
        const onScroll = () => {
            setRange((prevRange) => calculateRange(prevRange));
        };

        scrollElement.addEventListener('scroll', onScroll, {
            capture: false,
            passive: true,
        });

        // calculate for first time render
        onScroll();

        return () => {
            scrollElement.removeEventListener('scroll', onScroll);
        };
    }, [calculateRange, scrollElement, size]);

    const virtualItems = React.useMemo(() => {
        const end = Math.min(range.end, measurements.length - 1);
        return measurements.slice(range.start, end + 1);
    }, [measurements, range.end, range.start]);

    return {
        virtualItems,
        totalSize,
        range,
    };
}
