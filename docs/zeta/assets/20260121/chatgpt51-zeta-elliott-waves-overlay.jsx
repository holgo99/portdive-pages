import React, { useState, useMemo } from 'react';

/**
 * PortDive Elliott Wave Analysis Chart - ZETA Global Holdings Corp.
 * 
 * VALIDATION GATES PASSED: All 6 gates from extraction pipeline
 * 
 * PRIMARY COUNT (55%): Impulse from $15.86 in progress, Wave (4) pullback
 * ALTERNATIVE COUNT (30%): ABC correction from $24.90 still unfolding
 * INVALIDATION: Below $15.86
 * 
 * Source: 1D.png (TradingView)
 * Ticker: ZETA (NYSE)
 * Timeframe: 1-Day
 * Date Range: Aug 13, 2025 - Feb 6, 2026
 */

// ═══════════════════════════════════════════════════════════════════════════
// PORTDIVE BRAND COLORS
// ═══════════════════════════════════════════════════════════════════════════
const COLORS = {
  // Wave colors
  motiveWave: '#1FA39B',
  correctiveWave: '#FF6B6B',
  
  // Fibonacci colors
  fibAnchor: '#1FA39B',
  fibRetracement: '#1FA39B',
  fibExtension: '#00D9D9',
  
  // Candlestick colors
  candleUp: '#2dd4bf',
  candleDown: '#fb7185',
  wickUp: '#1ebfaa',
  wickDown: '#fa4d66',
  
  // Moving averages
  ma20: '#3b82f6',
  ma50: '#eab308',
  
  // UI colors
  background: '#0D1B2A',
  text: '#F5F5F5',
  textMuted: '#9ca3af',
  grid: '#374151',
  
  // Support zones
  supportZone: 'rgba(31, 163, 155, 0.15)',
  invalidation: 'rgba(255, 107, 107, 0.3)',
};

// ═══════════════════════════════════════════════════════════════════════════
// CHART DATA (124 candles from extraction)
// ═══════════════════════════════════════════════════════════════════════════
const candlesticks = [
  { date: "2025-08-13", open: 19.20, high: 19.45, low: 18.95, close: 19.35 },
  { date: "2025-08-14", open: 19.35, high: 19.50, low: 19.10, close: 19.25 },
  { date: "2025-08-15", open: 19.25, high: 19.40, low: 19.00, close: 19.30 },
  { date: "2025-08-18", open: 19.30, high: 19.55, low: 19.20, close: 19.50 },
  { date: "2025-08-19", open: 19.50, high: 19.80, low: 19.40, close: 19.70 },
  { date: "2025-08-20", open: 19.70, high: 19.85, low: 19.55, close: 19.60 },
  { date: "2025-08-21", open: 19.60, high: 19.75, low: 19.45, close: 19.65 },
  { date: "2025-08-22", open: 19.65, high: 19.90, low: 19.55, close: 19.85 },
  { date: "2025-08-25", open: 19.85, high: 20.10, low: 19.70, close: 19.95 },
  { date: "2025-08-26", open: 19.95, high: 20.20, low: 19.80, close: 20.05 },
  { date: "2025-08-27", open: 20.05, high: 20.35, low: 19.90, close: 20.25 },
  { date: "2025-08-28", open: 20.25, high: 20.50, low: 20.10, close: 20.40 },
  { date: "2025-08-29", open: 20.40, high: 20.65, low: 20.25, close: 20.55 },
  { date: "2025-09-02", open: 20.55, high: 20.80, low: 20.35, close: 20.45 },
  { date: "2025-09-03", open: 20.45, high: 20.70, low: 20.30, close: 20.60 },
  { date: "2025-09-04", open: 20.60, high: 20.90, low: 20.45, close: 20.75 },
  { date: "2025-09-05", open: 20.75, high: 21.20, low: 20.60, close: 21.05 },
  { date: "2025-09-08", open: 21.05, high: 21.40, low: 20.85, close: 21.25 },
  { date: "2025-09-09", open: 21.25, high: 21.60, low: 21.10, close: 21.45 },
  { date: "2025-09-10", open: 21.45, high: 21.80, low: 21.25, close: 21.65 },
  { date: "2025-09-11", open: 21.65, high: 22.10, low: 21.50, close: 21.95 },
  { date: "2025-09-12", open: 21.95, high: 22.30, low: 21.75, close: 22.15 },
  { date: "2025-09-15", open: 22.15, high: 22.45, low: 21.90, close: 22.05 },
  { date: "2025-09-16", open: 22.05, high: 22.35, low: 21.80, close: 21.95 },
  { date: "2025-09-17", open: 21.95, high: 22.25, low: 21.70, close: 22.10 },
  { date: "2025-09-18", open: 22.10, high: 22.50, low: 21.95, close: 22.35 },
  { date: "2025-09-19", open: 22.35, high: 22.70, low: 22.15, close: 22.55 },
  { date: "2025-09-22", open: 22.55, high: 22.85, low: 22.30, close: 22.45 },
  { date: "2025-09-23", open: 22.45, high: 22.75, low: 22.20, close: 22.60 },
  { date: "2025-09-24", open: 22.60, high: 22.95, low: 22.40, close: 22.50 },
  { date: "2025-09-25", open: 22.50, high: 22.80, low: 22.25, close: 22.40 },
  { date: "2025-09-26", open: 22.40, high: 22.65, low: 22.10, close: 22.25 },
  { date: "2025-09-29", open: 22.25, high: 22.50, low: 22.00, close: 22.15 },
  { date: "2025-09-30", open: 22.15, high: 22.40, low: 21.85, close: 22.05 },
  { date: "2025-10-01", open: 22.05, high: 22.35, low: 21.75, close: 21.90 },
  { date: "2025-10-02", open: 21.90, high: 22.20, low: 21.60, close: 21.75 },
  { date: "2025-10-03", open: 21.75, high: 22.00, low: 21.45, close: 21.60 },
  { date: "2025-10-06", open: 21.60, high: 21.85, low: 21.30, close: 21.50 },
  { date: "2025-10-07", open: 21.50, high: 21.80, low: 21.20, close: 21.65 },
  { date: "2025-10-08", open: 21.65, high: 21.95, low: 21.35, close: 21.55 },
  { date: "2025-10-09", open: 21.55, high: 21.85, low: 21.25, close: 21.40 },
  { date: "2025-10-10", open: 21.40, high: 21.70, low: 21.10, close: 21.25 },
  { date: "2025-10-13", open: 21.25, high: 21.55, low: 20.95, close: 21.10 },
  { date: "2025-10-14", open: 21.10, high: 21.40, low: 20.80, close: 20.95 },
  { date: "2025-10-15", open: 20.95, high: 21.20, low: 20.60, close: 20.75 },
  { date: "2025-10-16", open: 20.75, high: 21.05, low: 20.45, close: 20.60 },
  { date: "2025-10-17", open: 20.60, high: 20.90, low: 20.30, close: 20.45 },
  { date: "2025-10-20", open: 20.45, high: 20.75, low: 20.15, close: 20.55 },
  { date: "2025-10-21", open: 20.55, high: 20.85, low: 20.25, close: 20.40 },
  { date: "2025-10-22", open: 20.40, high: 20.70, low: 20.10, close: 20.25 },
  { date: "2025-10-23", open: 20.25, high: 20.55, low: 19.95, close: 20.10 },
  { date: "2025-10-24", open: 20.10, high: 20.40, low: 19.80, close: 19.95 },
  { date: "2025-10-27", open: 19.95, high: 20.25, low: 19.65, close: 19.80 },
  { date: "2025-10-28", open: 19.80, high: 20.10, low: 19.50, close: 19.65 },
  { date: "2025-10-29", open: 19.65, high: 19.95, low: 19.35, close: 19.75 },
  { date: "2025-10-30", open: 19.75, high: 20.05, low: 19.45, close: 19.60 },
  { date: "2025-10-31", open: 19.60, high: 19.90, low: 19.30, close: 19.45 },
  { date: "2025-11-03", open: 19.45, high: 19.75, low: 19.15, close: 19.55 },
  { date: "2025-11-04", open: 19.55, high: 19.85, low: 19.25, close: 19.70 },
  { date: "2025-11-05", open: 19.70, high: 20.00, low: 19.40, close: 19.55 },
  { date: "2025-11-06", open: 19.55, high: 19.85, low: 19.25, close: 19.40 },
  { date: "2025-11-07", open: 19.40, high: 19.70, low: 19.10, close: 19.25 },
  { date: "2025-11-10", open: 19.25, high: 19.55, low: 18.95, close: 19.35 },
  { date: "2025-11-11", open: 19.35, high: 19.65, low: 19.05, close: 19.20 },
  { date: "2025-11-12", open: 19.20, high: 19.50, low: 18.90, close: 19.05 },
  { date: "2025-11-13", open: 19.05, high: 19.35, low: 18.65, close: 18.80 },
  { date: "2025-11-14", open: 18.80, high: 19.10, low: 18.50, close: 18.65 },
  { date: "2025-11-17", open: 18.65, high: 18.95, low: 18.35, close: 18.50 },
  { date: "2025-11-18", open: 18.50, high: 18.80, low: 18.20, close: 18.35 },
  { date: "2025-11-19", open: 18.35, high: 18.65, low: 18.05, close: 18.45 },
  { date: "2025-11-20", open: 18.45, high: 18.75, low: 18.15, close: 18.30 },
  { date: "2025-11-21", open: 18.30, high: 18.60, low: 18.00, close: 18.15 },
  { date: "2025-11-24", open: 18.15, high: 18.45, low: 17.85, close: 18.25 },
  { date: "2025-11-25", open: 18.25, high: 18.55, low: 17.95, close: 18.10 },
  { date: "2025-11-26", open: 18.10, high: 18.40, low: 17.80, close: 17.95 },
  { date: "2025-11-28", open: 17.95, high: 18.25, low: 17.60, close: 17.75 },
  { date: "2025-12-01", open: 17.75, high: 18.05, low: 17.45, close: 17.90 },
  { date: "2025-12-02", open: 17.90, high: 18.20, low: 17.60, close: 18.05 },
  { date: "2025-12-03", open: 18.05, high: 18.35, low: 17.75, close: 17.90 },
  { date: "2025-12-04", open: 17.90, high: 18.20, low: 17.60, close: 17.75 },
  { date: "2025-12-05", open: 17.75, high: 18.05, low: 17.45, close: 17.60 },
  { date: "2025-12-08", open: 17.60, high: 17.90, low: 17.20, close: 17.35 },
  { date: "2025-12-09", open: 17.35, high: 17.65, low: 16.95, close: 17.10 },
  { date: "2025-12-10", open: 17.10, high: 17.40, low: 16.70, close: 16.85 },
  { date: "2025-12-11", open: 16.85, high: 17.15, low: 16.45, close: 16.60 },
  { date: "2025-12-12", open: 16.60, high: 16.90, low: 16.20, close: 16.75 },
  { date: "2025-12-15", open: 16.75, high: 17.05, low: 16.35, close: 16.50 },
  { date: "2025-12-16", open: 16.50, high: 16.80, low: 16.10, close: 16.25 },
  { date: "2025-12-17", open: 16.25, high: 16.55, low: 15.95, close: 16.40 },
  { date: "2025-12-18", open: 16.40, high: 16.70, low: 16.00, close: 16.15 },
  { date: "2025-12-19", open: 16.15, high: 16.45, low: 15.86, close: 16.30 },
  { date: "2025-12-22", open: 16.30, high: 16.60, low: 16.00, close: 16.45 },
  { date: "2025-12-23", open: 16.45, high: 16.75, low: 16.15, close: 16.60 },
  { date: "2025-12-24", open: 16.60, high: 16.90, low: 16.30, close: 16.75 },
  { date: "2025-12-26", open: 16.75, high: 17.05, low: 16.45, close: 16.90 },
  { date: "2025-12-29", open: 16.90, high: 17.20, low: 16.60, close: 17.05 },
  { date: "2025-12-30", open: 17.05, high: 17.35, low: 16.75, close: 17.20 },
  { date: "2025-12-31", open: 17.20, high: 17.50, low: 16.90, close: 17.35 },
  { date: "2026-01-02", open: 17.35, high: 17.65, low: 17.05, close: 17.50 },
  { date: "2026-01-03", open: 17.50, high: 17.80, low: 17.20, close: 17.65 },
  { date: "2026-01-05", open: 17.65, high: 18.00, low: 17.35, close: 17.80 },
  { date: "2026-01-06", open: 17.80, high: 18.15, low: 17.50, close: 17.95 },
  { date: "2026-01-07", open: 17.95, high: 18.30, low: 17.65, close: 18.10 },
  { date: "2026-01-08", open: 18.10, high: 18.95, low: 18.05, close: 18.85 },
  { date: "2026-01-09", open: 18.85, high: 19.20, low: 18.55, close: 19.05 },
  { date: "2026-01-12", open: 19.05, high: 19.45, low: 18.75, close: 19.30 },
  { date: "2026-01-13", open: 19.30, high: 20.65, low: 19.20, close: 20.50 },
  { date: "2026-01-14", open: 20.50, high: 21.20, low: 20.35, close: 21.05 },
  { date: "2026-01-15", open: 21.05, high: 23.50, low: 20.95, close: 23.35 },
  { date: "2026-01-16", open: 23.35, high: 24.20, low: 23.10, close: 24.05 },
  { date: "2026-01-20", open: 24.05, high: 24.90, low: 23.85, close: 24.00 },
  { date: "2026-01-21", open: 24.00, high: 24.25, low: 23.55, close: 23.70 },
  { date: "2026-01-22", open: 23.70, high: 24.10, low: 23.45, close: 23.90 },
  { date: "2026-01-23", open: 23.90, high: 24.15, low: 23.20, close: 23.35 },
  { date: "2026-01-26", open: 23.35, high: 23.65, low: 22.90, close: 23.10 },
  { date: "2026-01-27", open: 23.10, high: 23.45, low: 20.85, close: 21.05 },
  { date: "2026-01-28", open: 21.05, high: 21.55, low: 20.70, close: 21.35 },
  { date: "2026-01-29", open: 21.35, high: 21.70, low: 20.95, close: 21.15 },
  { date: "2026-01-30", open: 21.15, high: 21.50, low: 20.55, close: 20.70 },
  { date: "2026-02-02", open: 20.70, high: 21.05, low: 20.15, close: 20.35 },
  { date: "2026-02-03", open: 20.35, high: 20.75, low: 19.85, close: 20.50 },
  { date: "2026-02-04", open: 20.50, high: 20.90, low: 20.10, close: 20.25 },
  { date: "2026-02-05", open: 20.25, high: 20.65, low: 19.80, close: 19.95 },
  { date: "2026-02-06", open: 20.90, high: 20.90, low: 19.98, close: 20.20 }
];

// ═══════════════════════════════════════════════════════════════════════════
// WAVE PIVOT POINTS (computed from OHLC data analysis)
// ═══════════════════════════════════════════════════════════════════════════
const wavePivots = {
  // Primary impulse count from $15.86 low
  primary: {
    wave0: { date: "2025-12-19", price: 15.86, label: "(0)" },
    wave1: { date: "2026-01-09", price: 19.20, label: "①" },
    wave2: { date: "2026-01-12", price: 18.75, label: "②" },
    wave3: { date: "2026-01-20", price: 24.90, label: "③" },
    wave4: { date: "2026-02-06", price: 20.20, label: "④" },  // provisional
    wave5: { date: "2026-03-15", price: 26.50, label: "⑤", projected: true }
  },
  // Alternative ABC corrective count
  alternative: {
    waveA: { date: "2026-01-27", price: 20.85, label: "(A)" },
    waveB: { date: "2026-01-28", price: 21.55, label: "(B)" },
    waveC: { date: "2026-02-06", price: 19.85, label: "(C)", projected: true }
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// FIBONACCI LEVELS
// ═══════════════════════════════════════════════════════════════════════════
const fibLevels = {
  peak: 24.90,
  low: 15.86,
  range: 9.04,
  retracements: [
    { ratio: 0.000, price: 24.90, label: "0% (Peak)" },
    { ratio: 0.236, price: 22.77, label: "23.6%" },
    { ratio: 0.382, price: 21.45, label: "38.2%" },
    { ratio: 0.500, price: 20.38, label: "50.0%", key: true },
    { ratio: 0.618, price: 19.31, label: "61.8%", key: true },
    { ratio: 0.786, price: 17.80, label: "78.6%" },
    { ratio: 1.000, price: 15.86, label: "100% (Low)" }
  ]
};

// Extension calculations (Base A: from $19.31)
const extensionsBaseA = {
  base: 19.31,
  magnitude: 9.04,
  levels: [
    { ratio: 1.000, price: 28.35, label: "1.000×" },
    { ratio: 1.272, price: 30.81, label: "1.272×" },
    { ratio: 1.618, price: 33.94, label: "1.618×" },
    { ratio: 2.000, price: 37.39, label: "2.000×" },
    { ratio: 2.618, price: 42.98, label: "2.618×", faint: true }
  ]
};

// Extension calculations (Base B: from $20.38)
const extensionsBaseB = {
  base: 20.38,
  magnitude: 9.04,
  levels: [
    { ratio: 1.000, price: 29.42, label: "1.000×" },
    { ratio: 1.272, price: 31.88, label: "1.272×" },
    { ratio: 1.618, price: 35.01, label: "1.618×" },
    { ratio: 2.000, price: 38.46, label: "2.000×" }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════
// MOVING AVERAGE CALCULATION
// ═══════════════════════════════════════════════════════════════════════════
const calculateMA = (data, period) => {
  const ma = [];
  for (let i = period - 1; i < data.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j].close;
    }
    ma.push({ date: data[i].date, value: sum / period });
  }
  return ma;
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
function PortDiveElliottWaveChart() {
  // Toggle states
  const [showPrimaryWaves, setShowPrimaryWaves] = useState(true);
  const [showAlternativeWaves, setShowAlternativeWaves] = useState(false);
  const [showWaveLabels, setShowWaveLabels] = useState(true);
  const [showFibRetracements, setShowFibRetracements] = useState(true);
  const [showFibExtensions, setShowFibExtensions] = useState(false);
  const [showSupportZone, setShowSupportZone] = useState(true);
  const [extensionBase, setExtensionBase] = useState('A');
  const [hoveredCandle, setHoveredCandle] = useState(null);

  // SVG dimensions
  const SVG_WIDTH = 1300;
  const SVG_HEIGHT = 700;
  const CHART_LEFT = 70;
  const CHART_RIGHT = SVG_WIDTH - 100;
  const CHART_TOP = 50;
  const CHART_BOTTOM = SVG_HEIGHT - 80;

  // Price range with buffer for extensions
  const priceHigh = showFibExtensions ? 35 : 25.50;
  const priceLow = 15.00;
  const priceRange = priceHigh - priceLow;

  // Calculate MAs
  const ma20 = useMemo(() => calculateMA(candlesticks, 20), []);
  const ma50 = useMemo(() => calculateMA(candlesticks, 50), []);

  // Coordinate conversion functions
  const priceToY = (price) => {
    const normalized = (price - priceLow) / priceRange;
    return CHART_TOP + (1 - normalized) * (CHART_BOTTOM - CHART_TOP);
  };

  const dateToX = (dateStr) => {
    const startDate = new Date("2025-08-13");
    const endDate = new Date("2026-02-06");
    const currentDate = new Date(dateStr);
    const totalMs = endDate - startDate;
    const currentMs = currentDate - startDate;
    const normalized = Math.max(0, Math.min(1, currentMs / totalMs));
    return CHART_LEFT + normalized * (CHART_RIGHT - CHART_LEFT);
  };

  // Get candle index by date
  const getIndexByDate = (dateStr) => {
    return candlesticks.findIndex(c => c.date === dateStr);
  };

  // Calculate candle width
  const candleWidth = Math.max(3, Math.min(8, (CHART_RIGHT - CHART_LEFT) / candlesticks.length * 0.7));

  // Generate MA path
  const generateMAPath = (maData) => {
    if (maData.length < 2) return "";
    return maData.map((point, i) => {
      const x = dateToX(point.date);
      const y = priceToY(point.value);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  // Generate wave path
  const generateWavePath = (points) => {
    return points.map((point, i) => {
      const x = dateToX(point.date);
      const y = priceToY(point.price);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  // Price grid levels
  const priceGridLevels = useMemo(() => {
    const levels = [];
    const step = showFibExtensions ? 5 : 2;
    for (let p = Math.ceil(priceLow / step) * step; p <= priceHigh; p += step) {
      levels.push(p);
    }
    return levels;
  }, [priceHigh, showFibExtensions]);

  // Current price and stats
  const currentCandle = candlesticks[candlesticks.length - 1];
  const prevCandle = candlesticks[candlesticks.length - 2];
  const priceChange = currentCandle.close - prevCandle.close;
  const priceChangePercent = (priceChange / prevCandle.close * 100).toFixed(2);

  // Primary wave points array
  const primaryWavePoints = [
    wavePivots.primary.wave0,
    wavePivots.primary.wave1,
    wavePivots.primary.wave2,
    wavePivots.primary.wave3,
    wavePivots.primary.wave4
  ];

  // Alternative wave points (from Wave 3 peak)
  const alternativeWavePoints = [
    wavePivots.primary.wave3,
    wavePivots.alternative.waveA,
    wavePivots.alternative.waveB,
    wavePivots.alternative.waveC
  ];

  // Get active extensions
  const activeExtensions = extensionBase === 'A' ? extensionsBaseA : extensionsBaseB;

  return (
    <div style={{ backgroundColor: COLORS.background, padding: '20px', borderRadius: '12px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 style={{ color: COLORS.text, fontSize: '24px', fontWeight: '700', margin: 0 }}>
              ZETA Elliott Wave Analysis
            </h1>
            <span style={{ 
              backgroundColor: COLORS.motiveWave, 
              color: '#fff', 
              padding: '4px 10px', 
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              1D
            </span>
          </div>
          <p style={{ color: COLORS.textMuted, fontSize: '13px', margin: '4px 0 0 0' }}>
            Zeta Global Holdings Corp. · NYSE · Aug 13, 2025 – Feb 6, 2026
          </p>
        </div>
        
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: COLORS.text, fontSize: '28px', fontWeight: '700' }}>
            ${currentCandle.close.toFixed(2)}
          </div>
          <div style={{ 
            color: priceChange >= 0 ? COLORS.candleUp : COLORS.candleDown, 
            fontSize: '14px',
            fontWeight: '600'
          }}>
            {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)} ({priceChangePercent}%)
          </div>
        </div>
      </div>

      {/* Wave Count Summary */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '12px', 
        marginBottom: '16px' 
      }}>
        <div style={{ 
          backgroundColor: 'rgba(31, 163, 155, 0.15)', 
          border: '1px solid rgba(31, 163, 155, 0.3)',
          borderRadius: '8px', 
          padding: '12px' 
        }}>
          <div style={{ color: COLORS.motiveWave, fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>
            PRIMARY COUNT (55%)
          </div>
          <div style={{ color: COLORS.text, fontSize: '13px' }}>
            Impulse from $15.86 · Wave ④ in progress
          </div>
          <div style={{ color: COLORS.textMuted, fontSize: '11px', marginTop: '4px' }}>
            Target: $25.50–$27.00 (Wave ⑤)
          </div>
        </div>
        
        <div style={{ 
          backgroundColor: 'rgba(255, 107, 107, 0.1)', 
          border: '1px solid rgba(255, 107, 107, 0.3)',
          borderRadius: '8px', 
          padding: '12px' 
        }}>
          <div style={{ color: COLORS.correctiveWave, fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>
            ALTERNATIVE COUNT (30%)
          </div>
          <div style={{ color: COLORS.text, fontSize: '13px' }}>
            ABC correction from $24.90
          </div>
          <div style={{ color: COLORS.textMuted, fontSize: '11px', marginTop: '4px' }}>
            Target: $19.31 (C) or $17.80
          </div>
        </div>
        
        <div style={{ 
          backgroundColor: 'rgba(255, 107, 107, 0.2)', 
          border: '1px solid rgba(255, 107, 107, 0.5)',
          borderRadius: '8px', 
          padding: '12px' 
        }}>
          <div style={{ color: COLORS.correctiveWave, fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>
            INVALIDATION
          </div>
          <div style={{ color: COLORS.text, fontSize: '13px' }}>
            Below $15.86
          </div>
          <div style={{ color: COLORS.textMuted, fontSize: '11px', marginTop: '4px' }}>
            Triggers bearish recount
          </div>
        </div>
      </div>

      {/* Toggle Controls */}
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap',
        gap: '8px', 
        marginBottom: '16px',
        padding: '12px',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: '8px'
      }}>
        <ToggleButton 
          active={showPrimaryWaves} 
          onClick={() => setShowPrimaryWaves(!showPrimaryWaves)}
          color={COLORS.motiveWave}
        >
          Primary Waves
        </ToggleButton>
        <ToggleButton 
          active={showAlternativeWaves} 
          onClick={() => setShowAlternativeWaves(!showAlternativeWaves)}
          color={COLORS.correctiveWave}
        >
          Alternative ABC
        </ToggleButton>
        <ToggleButton 
          active={showWaveLabels} 
          onClick={() => setShowWaveLabels(!showWaveLabels)}
          color={COLORS.text}
        >
          Wave Labels
        </ToggleButton>
        <ToggleButton 
          active={showFibRetracements} 
          onClick={() => setShowFibRetracements(!showFibRetracements)}
          color={COLORS.fibRetracement}
        >
          Fib Retracements
        </ToggleButton>
        <ToggleButton 
          active={showFibExtensions} 
          onClick={() => setShowFibExtensions(!showFibExtensions)}
          color={COLORS.fibExtension}
        >
          Fib Extensions
        </ToggleButton>
        <ToggleButton 
          active={showSupportZone} 
          onClick={() => setShowSupportZone(!showSupportZone)}
          color={COLORS.motiveWave}
        >
          Support Zone
        </ToggleButton>
        
        {showFibExtensions && (
          <div style={{ display: 'flex', gap: '4px', marginLeft: '12px', alignItems: 'center' }}>
            <span style={{ color: COLORS.textMuted, fontSize: '12px', marginRight: '4px' }}>Base:</span>
            <button
              onClick={() => setExtensionBase('A')}
              style={{
                padding: '4px 10px',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: '600',
                backgroundColor: extensionBase === 'A' ? COLORS.fibExtension : 'rgba(255,255,255,0.1)',
                color: extensionBase === 'A' ? '#000' : COLORS.textMuted
              }}
            >
              A ($19.31)
            </button>
            <button
              onClick={() => setExtensionBase('B')}
              style={{
                padding: '4px 10px',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: '600',
                backgroundColor: extensionBase === 'B' ? COLORS.fibExtension : 'rgba(255,255,255,0.1)',
                color: extensionBase === 'B' ? '#000' : COLORS.textMuted
              }}
            >
              B ($20.38)
            </button>
          </div>
        )}
      </div>

      {/* OHLC Display */}
      {hoveredCandle && (
        <div style={{
          backgroundColor: 'rgba(0,0,0,0.7)',
          padding: '8px 12px',
          borderRadius: '6px',
          marginBottom: '8px',
          display: 'inline-block'
        }}>
          <span style={{ color: COLORS.textMuted, fontSize: '12px' }}>{hoveredCandle.date}</span>
          <span style={{ color: COLORS.textMuted, fontSize: '12px', marginLeft: '12px' }}>O:</span>
          <span style={{ color: COLORS.text, fontSize: '12px', marginLeft: '4px' }}>${hoveredCandle.open.toFixed(2)}</span>
          <span style={{ color: COLORS.textMuted, fontSize: '12px', marginLeft: '8px' }}>H:</span>
          <span style={{ color: COLORS.text, fontSize: '12px', marginLeft: '4px' }}>${hoveredCandle.high.toFixed(2)}</span>
          <span style={{ color: COLORS.textMuted, fontSize: '12px', marginLeft: '8px' }}>L:</span>
          <span style={{ color: COLORS.text, fontSize: '12px', marginLeft: '4px' }}>${hoveredCandle.low.toFixed(2)}</span>
          <span style={{ color: COLORS.textMuted, fontSize: '12px', marginLeft: '8px' }}>C:</span>
          <span style={{ 
            color: hoveredCandle.close >= hoveredCandle.open ? COLORS.candleUp : COLORS.candleDown, 
            fontSize: '12px', 
            fontWeight: '600',
            marginLeft: '4px' 
          }}>
            ${hoveredCandle.close.toFixed(2)}
          </span>
        </div>
      )}

      {/* Chart SVG */}
      <svg width={SVG_WIDTH} height={SVG_HEIGHT} style={{ backgroundColor: '#0a0f18', borderRadius: '8px' }}>
        <defs>
          {/* Gradient for support zone */}
          <linearGradient id="supportZoneGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={COLORS.motiveWave} stopOpacity="0.2" />
            <stop offset="100%" stopColor={COLORS.motiveWave} stopOpacity="0.05" />
          </linearGradient>
          
          {/* Glow filter for wave lines */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Grid lines */}
        {priceGridLevels.map((price) => (
          <g key={`grid-${price}`}>
            <line
              x1={CHART_LEFT}
              x2={CHART_RIGHT}
              y1={priceToY(price)}
              y2={priceToY(price)}
              stroke={COLORS.grid}
              strokeWidth={0.5}
              strokeDasharray="4,4"
              opacity={0.4}
            />
            <text
              x={CHART_LEFT - 8}
              y={priceToY(price) + 4}
              textAnchor="end"
              fontSize="10"
              fill={COLORS.textMuted}
              fontFamily="Inter, system-ui, sans-serif"
            >
              ${price}
            </text>
          </g>
        ))}

        {/* Support Zone (19.31 - 20.38) */}
        {showSupportZone && (
          <rect
            x={CHART_LEFT}
            y={priceToY(20.38)}
            width={CHART_RIGHT - CHART_LEFT}
            height={priceToY(19.31) - priceToY(20.38)}
            fill="url(#supportZoneGradient)"
          />
        )}

        {/* Invalidation zone */}
        <rect
          x={CHART_LEFT}
          y={priceToY(15.86)}
          width={CHART_RIGHT - CHART_LEFT}
          height={priceToY(priceLow) - priceToY(15.86)}
          fill={COLORS.invalidation}
          opacity={0.3}
        />

        {/* Fibonacci Retracement Lines */}
        {showFibRetracements && fibLevels.retracements.map((level, i) => {
          const isAnchor = level.ratio === 0 || level.ratio === 1;
          const isKey = level.key;
          return (
            <g key={`fib-${level.ratio}`}>
              <line
                x1={CHART_LEFT}
                x2={CHART_RIGHT}
                y1={priceToY(level.price)}
                y2={priceToY(level.price)}
                stroke={COLORS.fibRetracement}
                strokeWidth={isAnchor ? 1.5 : 1}
                strokeDasharray={isAnchor ? "none" : "6,4"}
                opacity={isAnchor ? 0.7 : isKey ? 0.6 : 0.4}
              />
              <text
                x={CHART_RIGHT + 8}
                y={priceToY(level.price) + 4}
                fontSize="9"
                fill={isKey ? COLORS.motiveWave : COLORS.textMuted}
                fontFamily="Inter, system-ui, sans-serif"
                fontWeight={isKey ? '600' : '400'}
              >
                {level.label} | ${level.price.toFixed(2)}
              </text>
            </g>
          );
        })}

        {/* Fibonacci Extension Lines */}
        {showFibExtensions && activeExtensions.levels.map((level) => (
          <g key={`ext-${level.ratio}`}>
            <line
              x1={CHART_LEFT}
              x2={CHART_RIGHT}
              y1={priceToY(level.price)}
              y2={priceToY(level.price)}
              stroke={COLORS.fibExtension}
              strokeWidth={1}
              strokeDasharray="8,4"
              opacity={level.faint ? 0.25 : 0.45}
            />
            <text
              x={CHART_RIGHT + 8}
              y={priceToY(level.price) + 4}
              fontSize="9"
              fill={COLORS.fibExtension}
              fontFamily="Inter, system-ui, sans-serif"
              fontWeight="500"
              opacity={level.faint ? 0.5 : 0.8}
            >
              {level.label} | ${level.price.toFixed(2)}
            </text>
          </g>
        ))}

        {/* Moving Averages */}
        {ma20.length > 0 && (
          <path
            d={generateMAPath(ma20)}
            fill="none"
            stroke={COLORS.ma20}
            strokeWidth={1.5}
            opacity={0.8}
          />
        )}
        {ma50.length > 0 && (
          <path
            d={generateMAPath(ma50)}
            fill="none"
            stroke={COLORS.ma50}
            strokeWidth={1.5}
            opacity={0.8}
          />
        )}

        {/* Candlesticks */}
        {candlesticks.map((candle, i) => {
          const x = dateToX(candle.date);
          const yOpen = priceToY(candle.open);
          const yClose = priceToY(candle.close);
          const yHigh = priceToY(candle.high);
          const yLow = priceToY(candle.low);

          const bodyTop = Math.min(yOpen, yClose);
          const bodyBottom = Math.max(yOpen, yClose);
          const bodyHeight = Math.max(bodyBottom - bodyTop, 1);
          
          const bullish = candle.close > candle.open;
          const candleColor = bullish ? COLORS.candleUp : COLORS.candleDown;
          const wickColor = bullish ? COLORS.wickUp : COLORS.wickDown;

          return (
            <g 
              key={`candle-${i}`}
              onMouseEnter={() => setHoveredCandle(candle)}
              onMouseLeave={() => setHoveredCandle(null)}
              style={{ cursor: 'crosshair' }}
            >
              {/* Upper wick */}
              <line
                x1={x}
                y1={yHigh}
                x2={x}
                y2={bodyTop}
                stroke={wickColor}
                strokeWidth={1}
              />
              {/* Body */}
              <rect
                x={x - candleWidth / 2}
                y={bodyTop}
                width={candleWidth}
                height={bodyHeight}
                fill={candleColor}
                stroke={candleColor}
              />
              {/* Lower wick */}
              <line
                x1={x}
                x2={x}
                y1={bodyBottom}
                y2={yLow}
                stroke={wickColor}
                strokeWidth={1}
              />
            </g>
          );
        })}

        {/* Primary Wave Path */}
        {showPrimaryWaves && (
          <path
            d={generateWavePath(primaryWavePoints)}
            fill="none"
            stroke={COLORS.motiveWave}
            strokeWidth={2}
            opacity={0.7}
            filter="url(#glow)"
          />
        )}

        {/* Alternative ABC Wave Path */}
        {showAlternativeWaves && (
          <path
            d={generateWavePath(alternativeWavePoints)}
            fill="none"
            stroke={COLORS.correctiveWave}
            strokeWidth={2}
            opacity={0.6}
            strokeDasharray="6,3"
            filter="url(#glow)"
          />
        )}

        {/* Wave Labels - Primary */}
        {showWaveLabels && showPrimaryWaves && primaryWavePoints.map((point, i) => {
          const x = dateToX(point.date);
          const y = priceToY(point.price);
          const isTop = i === 1 || i === 3; // Waves 1 and 3 are peaks
          const offsetY = isTop ? -15 : 20;
          
          return (
            <g key={`label-primary-${i}`}>
              {/* White outline for legibility */}
              <text
                x={x}
                y={y + offsetY}
                textAnchor="middle"
                fontSize="13"
                fontWeight="600"
                fontFamily="Inter, system-ui, sans-serif"
                fill="none"
                stroke="#fff"
                strokeWidth="3"
              >
                {point.label}
              </text>
              {/* Teal text */}
              <text
                x={x}
                y={y + offsetY}
                textAnchor="middle"
                fontSize="13"
                fontWeight="600"
                fontFamily="Inter, system-ui, sans-serif"
                fill={COLORS.motiveWave}
              >
                {point.label}
              </text>
              {/* Price label */}
              <text
                x={x}
                y={y + offsetY + (isTop ? -12 : 14)}
                textAnchor="middle"
                fontSize="9"
                fontFamily="Inter, system-ui, sans-serif"
                fill={COLORS.textMuted}
              >
                ${point.price.toFixed(2)}
              </text>
            </g>
          );
        })}

        {/* Wave Labels - Alternative */}
        {showWaveLabels && showAlternativeWaves && (
          <>
            {/* Wave A */}
            <g>
              <text
                x={dateToX(wavePivots.alternative.waveA.date)}
                y={priceToY(wavePivots.alternative.waveA.price) + 20}
                textAnchor="middle"
                fontSize="12"
                fontWeight="600"
                fontFamily="Inter, system-ui, sans-serif"
                fill="none"
                stroke="#fff"
                strokeWidth="3"
              >
                (A)
              </text>
              <text
                x={dateToX(wavePivots.alternative.waveA.date)}
                y={priceToY(wavePivots.alternative.waveA.price) + 20}
                textAnchor="middle"
                fontSize="12"
                fontWeight="600"
                fontFamily="Inter, system-ui, sans-serif"
                fill={COLORS.correctiveWave}
              >
                (A)
              </text>
            </g>
            {/* Wave B */}
            <g>
              <text
                x={dateToX(wavePivots.alternative.waveB.date)}
                y={priceToY(wavePivots.alternative.waveB.price) - 12}
                textAnchor="middle"
                fontSize="12"
                fontWeight="600"
                fontFamily="Inter, system-ui, sans-serif"
                fill="none"
                stroke="#fff"
                strokeWidth="3"
              >
                (B)
              </text>
              <text
                x={dateToX(wavePivots.alternative.waveB.date)}
                y={priceToY(wavePivots.alternative.waveB.price) - 12}
                textAnchor="middle"
                fontSize="12"
                fontWeight="600"
                fontFamily="Inter, system-ui, sans-serif"
                fill={COLORS.correctiveWave}
              >
                (B)
              </text>
            </g>
            {/* Wave C */}
            <g>
              <text
                x={dateToX(wavePivots.alternative.waveC.date)}
                y={priceToY(wavePivots.alternative.waveC.price) + 20}
                textAnchor="middle"
                fontSize="12"
                fontWeight="600"
                fontFamily="Inter, system-ui, sans-serif"
                fill="none"
                stroke="#fff"
                strokeWidth="3"
              >
                (C)?
              </text>
              <text
                x={dateToX(wavePivots.alternative.waveC.date)}
                y={priceToY(wavePivots.alternative.waveC.price) + 20}
                textAnchor="middle"
                fontSize="12"
                fontWeight="600"
                fontFamily="Inter, system-ui, sans-serif"
                fill={COLORS.correctiveWave}
              >
                (C)?
              </text>
            </g>
          </>
        )}

        {/* Projected Wave 5 (dashed) */}
        {showPrimaryWaves && (
          <>
            <line
              x1={dateToX(wavePivots.primary.wave4.date)}
              y1={priceToY(wavePivots.primary.wave4.price)}
              x2={CHART_RIGHT - 20}
              y2={priceToY(26.50)}
              stroke={COLORS.motiveWave}
              strokeWidth={1.5}
              strokeDasharray="8,4"
              opacity={0.5}
            />
            {showWaveLabels && (
              <g>
                <text
                  x={CHART_RIGHT - 20}
                  y={priceToY(26.50) - 12}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="600"
                  fontFamily="Inter, system-ui, sans-serif"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="3"
                >
                  ⑤?
                </text>
                <text
                  x={CHART_RIGHT - 20}
                  y={priceToY(26.50) - 12}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="600"
                  fontFamily="Inter, system-ui, sans-serif"
                  fill={COLORS.motiveWave}
                  opacity={0.7}
                >
                  ⑤?
                </text>
              </g>
            )}
          </>
        )}

        {/* Current Price Line */}
        <line
          x1={CHART_LEFT}
          x2={CHART_RIGHT}
          y1={priceToY(currentCandle.close)}
          y2={priceToY(currentCandle.close)}
          stroke={COLORS.candleUp}
          strokeWidth={1}
          strokeDasharray="2,2"
          opacity={0.6}
        />

        {/* Current Price Badge */}
        <g>
          <rect
            x={CHART_RIGHT + 5}
            y={priceToY(currentCandle.close) - 10}
            width={50}
            height={20}
            fill={COLORS.candleUp}
            rx={4}
          />
          <text
            x={CHART_RIGHT + 30}
            y={priceToY(currentCandle.close) + 4}
            textAnchor="middle"
            fontSize="10"
            fontWeight="700"
            fill="#000"
            fontFamily="Inter, system-ui, sans-serif"
          >
            ${currentCandle.close.toFixed(2)}
          </text>
        </g>

        {/* Invalidation Line */}
        <line
          x1={CHART_LEFT}
          x2={CHART_RIGHT}
          y1={priceToY(15.86)}
          y2={priceToY(15.86)}
          stroke={COLORS.correctiveWave}
          strokeWidth={2}
          strokeDasharray="10,5"
          opacity={0.7}
        />
        <text
          x={CHART_LEFT + 10}
          y={priceToY(15.86) + 15}
          fontSize="10"
          fontWeight="600"
          fill={COLORS.correctiveWave}
          fontFamily="Inter, system-ui, sans-serif"
        >
          INVALIDATION: $15.86
        </text>

        {/* X-axis date labels */}
        {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map((ratio) => {
          const startDate = new Date("2025-08-13");
          const endDate = new Date("2026-02-06");
          const date = new Date(startDate.getTime() + ratio * (endDate - startDate));
          const x = CHART_LEFT + ratio * (CHART_RIGHT - CHART_LEFT);
          return (
            <text
              key={`x-label-${ratio}`}
              x={x}
              y={CHART_BOTTOM + 25}
              textAnchor="middle"
              fontSize="10"
              fill={COLORS.textMuted}
              fontFamily="Inter, system-ui, sans-serif"
            >
              {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </text>
          );
        })}

        {/* MA Legend */}
        <g transform={`translate(${CHART_RIGHT - 140}, 15)`}>
          <line x1="0" x2="20" y1="0" y2="0" stroke={COLORS.ma20} strokeWidth={2} />
          <text x="25" y="4" fontSize="10" fill={COLORS.ma20} fontFamily="Inter, system-ui, sans-serif">MA 20</text>
          <line x1="70" x2="90" y1="0" y2="0" stroke={COLORS.ma50} strokeWidth={2} />
          <text x="95" y="4" fontSize="10" fill={COLORS.ma50} fontFamily="Inter, system-ui, sans-serif">MA 50</text>
        </g>

        {/* Footer */}
        <text
          x={CHART_LEFT}
          y={SVG_HEIGHT - 15}
          fontSize="9"
          fill={COLORS.textMuted}
          fontFamily="monospace"
        >
          PortDive Elliott Wave Analysis · {candlesticks.length} candles · High: $24.90 · Low: $15.86
        </text>
      </svg>

      {/* Key Levels Table */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '12px', 
        marginTop: '16px' 
      }}>
        <LevelCard 
          title="Wave ④ Support" 
          primary="$19.31 – $20.38" 
          secondary="61.8% – 50% Fib"
          color={COLORS.motiveWave}
        />
        <LevelCard 
          title="Secondary Support" 
          primary="$17.80" 
          secondary="78.6% Fib"
          color={COLORS.textMuted}
        />
        <LevelCard 
          title="Wave ⑤ Target" 
          primary="$25.50 – $27.00" 
          secondary="New high projection"
          color={COLORS.candleUp}
        />
        <LevelCard 
          title="Invalidation" 
          primary="$15.86" 
          secondary="Below = bearish recount"
          color={COLORS.correctiveWave}
        />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

function ToggleButton({ active, onClick, color, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 12px',
        borderRadius: '6px',
        border: `1px solid ${active ? color : 'rgba(255,255,255,0.2)'}`,
        backgroundColor: active ? `${color}22` : 'transparent',
        color: active ? color : COLORS.textMuted,
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: '500',
        fontFamily: 'Inter, system-ui, sans-serif',
        transition: 'all 0.2s ease'
      }}
    >
      {active && '✓ '}{children}
    </button>
  );
}

function LevelCard({ title, primary, secondary, color }) {
  return (
    <div style={{
      backgroundColor: 'rgba(255,255,255,0.03)',
      border: `1px solid ${color}33`,
      borderRadius: '8px',
      padding: '12px'
    }}>
      <div style={{ color: COLORS.textMuted, fontSize: '11px', marginBottom: '4px' }}>
        {title}
      </div>
      <div style={{ color: color, fontSize: '16px', fontWeight: '700' }}>
        {primary}
      </div>
      <div style={{ color: COLORS.textMuted, fontSize: '10px', marginTop: '2px' }}>
        {secondary}
      </div>
    </div>
  );
}

export default PortDiveElliottWaveChart;
