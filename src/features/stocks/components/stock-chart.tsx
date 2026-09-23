'use client';

import { StockCandle } from '@/types/api';
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

const UP = '#16a34a';
const DOWN = '#dc2626';

type StockChartProps = {
  candles: StockCandle[];
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

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chart = createChart(container, {
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: 'white' },
        textColor: '#6b7280',
        attributionLogo: true, // required by the lightweight-charts licence
      },
      grid: {
        vertLines: { color: '#f3f4f6' },
        horzLines: { color: '#f3f4f6' },
      },
      rightPriceScale: { borderVisible: false },
      timeScale: {
        borderVisible: false,
        timeVisible: intraday,
        secondsVisible: false,
      },
    });

    // lightweight-charts renders timestamps as UTC, so shift into exchange-local time.
    const toTime = (t: number) => (t + gmtOffset) as UTCTimestamp;

    if (type === 'candles') {
      chart
        .addSeries(CandlestickSeries, {
          upColor: UP,
          downColor: DOWN,
          wickUpColor: UP,
          wickDownColor: DOWN,
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
      const color = rising ? UP : DOWN;
      chart
        .addSeries(AreaSeries, {
          lineColor: color,
          topColor: `${color}33`,
          bottomColor: `${color}00`,
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
        color: c.close >= c.open ? `${UP}55` : `${DOWN}55`,
      })),
    );

    chart.timeScale().fitContent();

    return () => chart.remove();
  }, [candles, gmtOffset, intraday, type, rising]);

  return <div ref={containerRef} className="h-[420px] w-full" />;
};
