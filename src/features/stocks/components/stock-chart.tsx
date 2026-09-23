'use client';

import { StockCandleResponse } from '../model/stock-history';
import { useTheme } from 'next-themes';
import { tokenColor } from '@/utils/css-tokens';
import {
  AreaSeries,
  CandlestickSeries,
  ColorType,
  createChart,
  HistogramSeries,
  UTCTimestamp,
} from 'lightweight-charts';
import { useEffect, useRef } from 'react';

export type ChartType = 'candles' | 'line';

type StockChartProps = {
  candles: StockCandleResponse[];
  gmtOffset: number;
  intraday: boolean;
  type: ChartType;
  rising: boolean; // colours the line chart; matches the change shown in the header
};

export const StockChart = ({
  candles,
  gmtOffset,
  intraday,
  type,
  rising,
}: StockChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // Colours are read from CSS tokens at creation, so rebuild when the theme changes.
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const up = tokenColor('positive');
    const down = tokenColor('negative');

    const chart = createChart(container, {
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: tokenColor('card') },
        textColor: tokenColor('muted-foreground'),
        attributionLogo: true, // required by the lightweight-charts licence
      },
      grid: {
        vertLines: { color: tokenColor('chart-grid') },
        horzLines: { color: tokenColor('chart-grid') },
      },
      rightPriceScale: { borderVisible: false },
      timeScale: {
        borderVisible: false,
        timeVisible: intraday,
        secondsVisible: false,
        fixLeftEdge: true,
        fixRightEdge: true,
        lockVisibleTimeRangeOnResize: true,
      },
    });

    // lightweight-charts renders timestamps as UTC, so shift into exchange-local time.
    const toTime = (t: number) => (t + gmtOffset) as UTCTimestamp;

    if (type === 'candles') {
      chart
        .addSeries(CandlestickSeries, {
          upColor: up,
          downColor: down,
          wickUpColor: up,
          wickDownColor: down,
          borderVisible: false,
        })
        .setData(
          candles.map((c) => ({
            time: toTime(c.time),
            open: c.open,
            high: c.high,
            low: c.low,
            close: c.close,
          })),
        );
    } else {
      const color = rising ? 'positive' : 'negative';
      chart
        .addSeries(AreaSeries, {
          lineColor: tokenColor(color),
          topColor: tokenColor(color, 0.2),
          bottomColor: tokenColor(color, 0),
          lineWidth: 2,
        })
        .setData(
          candles.map((c) => ({ time: toTime(c.time), value: c.close })),
        );
    }

    // Volume bars along the bottom 20% of the chart, on their own hidden scale.
    const volume = chart.addSeries(HistogramSeries, {
      priceScaleId: 'volume',
      priceFormat: { type: 'volume' },
      lastValueVisible: false,
      priceLineVisible: false,
    });
    chart.priceScale('volume').applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    });
    volume.setData(
      candles.map((c) => ({
        time: toTime(c.time),
        value: c.volume,
        color: tokenColor(c.close >= c.open ? 'positive' : 'negative', 0.33),
      })),
    );

    chart.timeScale().fitContent();

    return () => chart.remove();
  }, [candles, gmtOffset, intraday, type, rising, resolvedTheme]);

  // The chart is absolutely positioned so its canvas width doesn't hold the layout open;
  // otherwise the parent can't shrink and autoSize never sees a smaller width.
  return (
    <div className="relative h-[300px] w-full sm:h-[420px]">
      <div ref={containerRef} className="absolute inset-0" />
    </div>
  );
};
