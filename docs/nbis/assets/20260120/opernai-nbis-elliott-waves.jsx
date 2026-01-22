import React, { useState } from 'react';

const NBISElliottWaveChart = () => {
  const [showMotiveWaves, setShowMotiveWaves] = useState(true);
  const [showCorrectiveWaves, setShowCorrectiveWaves] = useState(true);
  const [showFibRetracements, setShowFibRetracements] = useState(true);
  const [showFibExtensions, setShowFibExtensions] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [showScenarios, setShowScenarios] = useState(true);
  const [hoveredWave, setHoveredWave] = useState(null);

  // Chart dimensions
  const chartWidth = 1400;
  const chartHeight = 750;
  const marginLeft = 60;
  const marginRight = 120;
  const marginTop = 50;
  const marginBottom = 60;
  const plotWidth = chartWidth - marginLeft - marginRight;
  const plotHeight = chartHeight - marginTop - marginBottom;

  // Price range (extended for projections)
  const priceHigh = 165;
  const priceLow = 12;
  const priceRange = priceHigh - priceLow;

  // Time range representation (normalized 0-100%)
  const timeStart = 0;
  const timeEnd = 100;

  // Helper functions
  const priceToY = (price) => marginTop + ((priceHigh - price) / priceRange) * plotHeight;
  const timeToX = (pct) => marginLeft + (pct / 100) * plotWidth;

  // Primary degree wave coordinates (1)-(2)-(3)
  const primaryWaves = {
    wave1Start: { time: 0, price: 14.09, label: 'Start' },
    wave1End: { time: 55, price: 141.10, label: '(1)' },
    wave2End: { time: 78, price: 75.25, label: '(2)' },
    wave3Current: { time: 92, price: 108.73, label: '(3)' },
    // Projections
    wave3Target1: { time: 100, price: 141.10, label: 'T1' },
    wave3Target2: { time: 108, price: 153.74, label: '0.618×' },
  };

  // Corrective sub-waves within (2)
  const correctiveWaves = {
    waveA: { time: 65, price: 100.00, label: 'A' },
    waveB: { time: 72, price: 120.00, label: 'B' },
    waveC: { time: 78, price: 75.25, label: 'C' },
  };

  // Fibonacci retracement levels (Wave 1: $14.09 → $141.10)
  const wave1Range = 141.10 - 14.09; // $127.01
  const fibRetracements = [
    { level: 0, price: 141.10, label: '0%', solid: true },
    { level: 0.236, price: 141.10 - (wave1Range * 0.236), label: '23.6%' },
    { level: 0.382, price: 141.10 - (wave1Range * 0.382), label: '38.2%', key: true },
    { level: 0.5, price: 141.10 - (wave1Range * 0.5), label: '50%' },
    { level: 0.618, price: 141.10 - (wave1Range * 0.618), label: '61.8%' },
    { level: 0.786, price: 141.10 - (wave1Range * 0.786), label: '78.6%' },
    { level: 1, price: 14.09, label: '100%', solid: true },
  ];

  // Fibonacci extensions for Wave (3) from $75.25
  const fibExtensions = [
    { ratio: 0.618, price: 75.25 + (wave1Range * 0.618), label: '0.618×', primary: true },
    { ratio: 1.0, price: 75.25 + wave1Range, label: '1.0×' },
    { ratio: 1.618, price: 75.25 + (wave1Range * 1.618), label: '1.618×' },
  ];

  // Key support/resistance levels
  const keyLevels = {
    riskPivot: 92.58,
    invalidation: 75.25,
    resistance1: 110.47,
    resistance2: 134.93,
    resistance3: 141.10,
  };

  // Simplified candlestick data representing the price action
  const candleData = [
    // Early accumulation ($14-$25)
    { time: 0, o: 14, h: 16, l: 14.09, c: 15, green: true },
    { time: 3, o: 15, h: 18, l: 14.5, c: 17, green: true },
    { time: 6, o: 17, h: 22, l: 16, c: 21, green: true },
    { time: 9, o: 21, h: 26, l: 20, c: 25, green: true },
    // Rally phase
    { time: 12, o: 25, h: 32, l: 24, c: 31, green: true },
    { time: 15, o: 31, h: 38, l: 30, c: 36, green: true },
    { time: 18, o: 36, h: 45, l: 35, c: 44, green: true },
    { time: 21, o: 44, h: 52, l: 42, c: 50, green: true },
    { time: 24, o: 50, h: 58, l: 48, c: 56, green: true },
    { time: 27, o: 56, h: 65, l: 54, c: 63, green: true },
    { time: 30, o: 63, h: 72, l: 61, c: 70, green: true },
    { time: 33, o: 70, h: 78, l: 68, c: 76, green: true },
    { time: 36, o: 76, h: 85, l: 74, c: 83, green: true },
    { time: 39, o: 83, h: 92, l: 80, c: 90, green: true },
    { time: 42, o: 90, h: 102, l: 88, c: 100, green: true },
    { time: 45, o: 100, h: 115, l: 98, c: 112, green: true },
    { time: 48, o: 112, h: 128, l: 110, c: 125, green: true },
    { time: 51, o: 125, h: 138, l: 122, c: 135, green: true },
    { time: 55, o: 135, h: 141.10, l: 132, c: 140, green: true }, // Wave (1) peak
    // Wave (2) correction - A leg
    { time: 57, o: 140, h: 141, l: 125, c: 128, green: false },
    { time: 59, o: 128, h: 130, l: 115, c: 118, green: false },
    { time: 61, o: 118, h: 120, l: 105, c: 108, green: false },
    { time: 63, o: 108, h: 112, l: 98, c: 100, green: false },
    // Wave (2) correction - B leg
    { time: 65, o: 100, h: 115, l: 98, c: 112, green: true },
    { time: 67, o: 112, h: 122, l: 110, c: 120, green: true },
    // Wave (2) correction - C leg
    { time: 69, o: 120, h: 122, l: 105, c: 108, green: false },
    { time: 71, o: 108, h: 110, l: 92, c: 95, green: false },
    { time: 73, o: 95, h: 98, l: 82, c: 85, green: false },
    { time: 75, o: 85, h: 88, l: 78, c: 80, green: false },
    { time: 78, o: 80, h: 82, l: 75.25, c: 77, green: false }, // Wave (2) low
    // Wave (3) impulse beginning
    { time: 80, o: 77, h: 85, l: 76, c: 83, green: true },
    { time: 82, o: 83, h: 92, l: 81, c: 90, green: true },
    { time: 84, o: 90, h: 98, l: 88, c: 96, green: true },
    { time: 86, o: 96, h: 102, l: 94, c: 100, green: true },
    { time: 88, o: 100, h: 106, l: 98, c: 104, green: true },
    { time: 90, o: 104, h: 110, l: 102, c: 108, green: true },
    { time: 92, o: 108, h: 110.47, l: 106, c: 108.73, green: true }, // Current
  ];

  // Price grid lines
  const priceGridLines = [20, 40, 60, 80, 100, 120, 140, 160];

  // Colors
  const colors = {
    teal: '#1FA39B',
    coral: '#FF6B6B',
    brightTeal: '#00D9D9',
    candleGreen: '#2dd4bf',
    candleRed: '#fb7185',
    wickGreen: '#1ebfaa',
    wickRed: '#fa4d66',
    text: '#F5F5F5',
    textMuted: '#888888',
    gridLine: 'rgba(255,255,255,0.08)',
    background: '#0D1B2A',
    panelBg: 'rgba(0,0,0,0.4)',
  };

  // Wave info for tooltip
  const waveInfo = {
    '(1)': { name: 'Wave (1) Complete', price: '$141.10', date: 'Oct 14', move: '+901%', desc: 'Primary impulse from secular low' },
    '(2)': { name: 'Wave (2) Complete', price: '$75.25', date: 'Dec 23', move: '-46.7%', desc: 'A-B-C corrective structure' },
    '(3)': { name: 'Wave (3) In Progress', price: '$108.73', date: 'Current', move: '+44.5%', desc: 'Third wave impulse developing' },
    'A': { name: 'Wave A', price: '$100.00', date: 'Nov', move: '-29%', desc: 'Impulsive decline' },
    'B': { name: 'Wave B', price: '$120.00', date: 'Nov-Dec', move: '+20%', desc: 'Corrective bounce' },
    'C': { name: 'Wave C', price: '$75.25', date: 'Dec 23', move: '-37%', desc: 'Terminal decline' },
  };

  return (
    <div style={{ 
      backgroundColor: colors.background, 
      padding: '24px', 
      borderRadius: '12px',
      fontFamily: 'Inter, system-ui, sans-serif',
      maxWidth: '1450px'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: '20px',
        paddingBottom: '16px',
        borderBottom: `1px solid ${colors.teal}30`
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h2 style={{ 
              color: colors.text, 
              margin: 0, 
              fontSize: '26px',
              fontWeight: 600
            }}>
              <span style={{ color: colors.teal }}>NBIS</span> Elliott Wave Analysis
            </h2>
            <span style={{
              backgroundColor: `${colors.teal}20`,
              color: colors.teal,
              padding: '4px 10px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 500
            }}>
              PRIMARY DEGREE
            </span>
          </div>
          <p style={{ color: colors.textMuted, margin: '6px 0 0 0', fontSize: '14px' }}>
            Nebius Group N.V. • NASDAQ • 1D • 2026-01-20
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            justifyContent: 'flex-end'
          }}>
            <span style={{ color: colors.text, fontSize: '32px', fontWeight: 600 }}>
              $108.73
            </span>
            <span style={{ 
              color: colors.candleGreen, 
              fontSize: '16px',
              backgroundColor: 'rgba(45, 212, 191, 0.15)',
              padding: '6px 14px',
              borderRadius: '6px',
              fontWeight: 500
            }}>
              +4.66%
            </span>
          </div>
          <p style={{ color: colors.textMuted, margin: '4px 0 0 0', fontSize: '13px' }}>
            Wave (3) in progress from $75.25
          </p>
        </div>
      </div>

      {/* Controls */}
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        {[
          { label: 'Primary Waves', state: showMotiveWaves, setter: setShowMotiveWaves, color: colors.teal },
          { label: 'Corrective (A-B-C)', state: showCorrectiveWaves, setter: setShowCorrectiveWaves, color: colors.coral },
          { label: 'Fib Retracements', state: showFibRetracements, setter: setShowFibRetracements, color: colors.teal },
          { label: 'Fib Extensions', state: showFibExtensions, setter: setShowFibExtensions, color: colors.brightTeal },
          { label: 'Labels', state: showLabels, setter: setShowLabels, color: colors.text },
          { label: 'Scenarios', state: showScenarios, setter: setShowScenarios, color: '#FFD700' },
        ].map(({ label, state, setter, color }) => (
          <button
            key={label}
            onClick={() => setter(!state)}
            style={{
              background: state ? `${color}15` : 'transparent',
              border: `1px solid ${state ? color : '#444'}`,
              color: state ? color : '#555',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500,
              transition: 'all 0.2s ease'
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <svg 
        width={chartWidth} 
        height={chartHeight}
        style={{ backgroundColor: colors.background, borderRadius: '8px' }}
      >
        {/* Grid lines */}
        {priceGridLines.map((price) => (
          <g key={price}>
            <line
              x1={marginLeft}
              y1={priceToY(price)}
              x2={chartWidth - marginRight}
              y2={priceToY(price)}
              stroke={colors.gridLine}
              strokeWidth={1}
            />
            <text
              x={chartWidth - marginRight + 8}
              y={priceToY(price) + 4}
              fill={colors.textMuted}
              fontSize={11}
            >
              ${price}
            </text>
          </g>
        ))}

        {/* Fibonacci Retracement Lines */}
        {showFibRetracements && fibRetracements.map((fib, i) => (
          <g key={`fib-ret-${i}`}>
            <line
              x1={marginLeft}
              y1={priceToY(fib.price)}
              x2={chartWidth - marginRight}
              y2={priceToY(fib.price)}
              stroke={colors.teal}
              strokeWidth={fib.solid ? 1.5 : 1}
              strokeDasharray={fib.solid ? 'none' : '6,4'}
              opacity={fib.solid ? 0.7 : fib.key ? 0.6 : 0.4}
            />
            <rect
              x={chartWidth - marginRight + 4}
              y={priceToY(fib.price) - 10}
              width={108}
              height={18}
              fill={colors.background}
              opacity={0.9}
            />
            <text
              x={chartWidth - marginRight + 8}
              y={priceToY(fib.price) + 4}
              fill={fib.key ? colors.teal : colors.textMuted}
              fontSize={10}
              fontWeight={fib.key ? 600 : 400}
            >
              {fib.label} | ${fib.price.toFixed(2)}
            </text>
          </g>
        ))}

        {/* Fibonacci Extension Lines */}
        {showFibExtensions && fibExtensions.filter(ext => ext.price <= priceHigh).map((ext, i) => (
          <g key={`fib-ext-${i}`}>
            <line
              x1={timeToX(78)}
              y1={priceToY(ext.price)}
              x2={chartWidth - marginRight}
              y2={priceToY(ext.price)}
              stroke={colors.brightTeal}
              strokeWidth={ext.primary ? 1.5 : 1}
              strokeDasharray="8,4"
              opacity={ext.primary ? 0.7 : 0.45}
            />
            <rect
              x={timeToX(78) - 2}
              y={priceToY(ext.price) - 18}
              width={90}
              height={16}
              fill={colors.background}
              opacity={0.9}
            />
            <text
              x={timeToX(78)}
              y={priceToY(ext.price) - 6}
              fill={colors.brightTeal}
              fontSize={11}
              fontWeight={ext.primary ? 600 : 400}
            >
              {ext.label} | ${ext.price.toFixed(2)}
            </text>
          </g>
        ))}

        {/* Key Level Lines */}
        {showFibRetracements && (
          <>
            {/* Risk Pivot */}
            <line
              x1={marginLeft}
              y1={priceToY(keyLevels.riskPivot)}
              x2={chartWidth - marginRight}
              y2={priceToY(keyLevels.riskPivot)}
              stroke="#FFA500"
              strokeWidth={1.5}
              strokeDasharray="4,4"
              opacity={0.6}
            />
            <text
              x={marginLeft + 10}
              y={priceToY(keyLevels.riskPivot) - 6}
              fill="#FFA500"
              fontSize={10}
              fontWeight={600}
            >
              Risk Pivot: $92.58
            </text>

            {/* Invalidation */}
            <line
              x1={marginLeft}
              y1={priceToY(keyLevels.invalidation)}
              x2={chartWidth - marginRight}
              y2={priceToY(keyLevels.invalidation)}
              stroke={colors.coral}
              strokeWidth={2}
              strokeDasharray="6,3"
              opacity={0.7}
            />
            <text
              x={marginLeft + 10}
              y={priceToY(keyLevels.invalidation) + 14}
              fill={colors.coral}
              fontSize={10}
              fontWeight={600}
            >
              Invalidation: $75.25
            </text>
          </>
        )}

        {/* Candlesticks */}
        {candleData.map((candle, i) => {
          const x = timeToX(candle.time);
          const candleWidth = 7;
          const bodyTop = priceToY(Math.max(candle.o, candle.c));
          const bodyBottom = priceToY(Math.min(candle.o, candle.c));
          const bodyHeight = Math.max(bodyBottom - bodyTop, 1);
          const wickTop = priceToY(candle.h);
          const wickBottom = priceToY(candle.l);
          const fillColor = candle.green ? colors.candleGreen : colors.candleRed;
          const wickColor = candle.green ? colors.wickGreen : colors.wickRed;

          return (
            <g key={i}>
              <line
                x1={x}
                y1={wickTop}
                x2={x}
                y2={wickBottom}
                stroke={wickColor}
                strokeWidth={1.5}
              />
              <rect
                x={x - candleWidth / 2}
                y={bodyTop}
                width={candleWidth}
                height={bodyHeight}
                fill={fillColor}
                rx={1}
              />
            </g>
          );
        })}

        {/* Primary Wave Lines (1)-(2)-(3) */}
        {showMotiveWaves && (
          <g>
            {/* Wave (1) line */}
            <path
              d={`
                M ${timeToX(primaryWaves.wave1Start.time)} ${priceToY(primaryWaves.wave1Start.price)}
                L ${timeToX(primaryWaves.wave1End.time)} ${priceToY(primaryWaves.wave1End.price)}
              `}
              fill="none"
              stroke={colors.teal}
              strokeWidth={2.5}
              opacity={0.8}
            />
            {/* Wave (2) line */}
            <path
              d={`
                M ${timeToX(primaryWaves.wave1End.time)} ${priceToY(primaryWaves.wave1End.price)}
                L ${timeToX(primaryWaves.wave2End.time)} ${priceToY(primaryWaves.wave2End.price)}
              `}
              fill="none"
              stroke={colors.teal}
              strokeWidth={2.5}
              opacity={0.8}
            />
            {/* Wave (3) line (in progress) */}
            <path
              d={`
                M ${timeToX(primaryWaves.wave2End.time)} ${priceToY(primaryWaves.wave2End.price)}
                L ${timeToX(primaryWaves.wave3Current.time)} ${priceToY(primaryWaves.wave3Current.price)}
              `}
              fill="none"
              stroke={colors.teal}
              strokeWidth={2.5}
              opacity={0.8}
            />
            {/* Wave (3) projection (dashed) */}
            <path
              d={`
                M ${timeToX(primaryWaves.wave3Current.time)} ${priceToY(primaryWaves.wave3Current.price)}
                L ${timeToX(100)} ${priceToY(153.74)}
              `}
              fill="none"
              stroke={colors.teal}
              strokeWidth={2}
              strokeDasharray="8,6"
              opacity={0.4}
            />
          </g>
        )}

        {/* Corrective Sub-waves (A-B-C) within Wave (2) */}
        {showCorrectiveWaves && (
          <g>
            <path
              d={`
                M ${timeToX(primaryWaves.wave1End.time)} ${priceToY(primaryWaves.wave1End.price)}
                L ${timeToX(correctiveWaves.waveA.time)} ${priceToY(correctiveWaves.waveA.price)}
                L ${timeToX(correctiveWaves.waveB.time)} ${priceToY(correctiveWaves.waveB.price)}
                L ${timeToX(correctiveWaves.waveC.time)} ${priceToY(correctiveWaves.waveC.price)}
              `}
              fill="none"
              stroke={colors.coral}
              strokeWidth={1.5}
              opacity={0.6}
              strokeLinejoin="round"
            />
          </g>
        )}

        {/* Wave Labels */}
        {showLabels && (
          <g>
            {/* Primary wave labels */}
            {showMotiveWaves && (
              <>
                {/* (1) label */}
                <g
                  onMouseEnter={() => setHoveredWave('(1)')}
                  onMouseLeave={() => setHoveredWave(null)}
                  style={{ cursor: 'pointer' }}
                >
                  <circle
                    cx={timeToX(primaryWaves.wave1End.time)}
                    cy={priceToY(primaryWaves.wave1End.price) - 20}
                    r={16}
                    fill={hoveredWave === '(1)' ? colors.teal : `${colors.teal}30`}
                    stroke={colors.teal}
                    strokeWidth={2}
                  />
                  <text
                    x={timeToX(primaryWaves.wave1End.time)}
                    y={priceToY(primaryWaves.wave1End.price) - 15}
                    fill={colors.text}
                    fontSize={13}
                    fontWeight={600}
                    textAnchor="middle"
                  >
                    (1)
                  </text>
                </g>

                {/* (2) label */}
                <g
                  onMouseEnter={() => setHoveredWave('(2)')}
                  onMouseLeave={() => setHoveredWave(null)}
                  style={{ cursor: 'pointer' }}
                >
                  <circle
                    cx={timeToX(primaryWaves.wave2End.time)}
                    cy={priceToY(primaryWaves.wave2End.price) + 22}
                    r={16}
                    fill={hoveredWave === '(2)' ? colors.teal : `${colors.teal}30`}
                    stroke={colors.teal}
                    strokeWidth={2}
                  />
                  <text
                    x={timeToX(primaryWaves.wave2End.time)}
                    y={priceToY(primaryWaves.wave2End.price) + 27}
                    fill={colors.text}
                    fontSize={13}
                    fontWeight={600}
                    textAnchor="middle"
                  >
                    (2)
                  </text>
                </g>

                {/* (3) label */}
                <g
                  onMouseEnter={() => setHoveredWave('(3)')}
                  onMouseLeave={() => setHoveredWave(null)}
                  style={{ cursor: 'pointer' }}
                >
                  <circle
                    cx={timeToX(primaryWaves.wave3Current.time)}
                    cy={priceToY(primaryWaves.wave3Current.price) - 20}
                    r={16}
                    fill={hoveredWave === '(3)' ? colors.brightTeal : `${colors.brightTeal}30`}
                    stroke={colors.brightTeal}
                    strokeWidth={2}
                  />
                  <text
                    x={timeToX(primaryWaves.wave3Current.time)}
                    y={priceToY(primaryWaves.wave3Current.price) - 15}
                    fill={colors.text}
                    fontSize={13}
                    fontWeight={600}
                    textAnchor="middle"
                  >
                    (3)
                  </text>
                </g>
              </>
            )}

            {/* Corrective wave labels */}
            {showCorrectiveWaves && (
              <>
                {['waveA', 'waveB', 'waveC'].map((key) => {
                  const point = correctiveWaves[key];
                  const isTop = key === 'waveB';
                  const yOffset = isTop ? -16 : 18;
                  const label = key.replace('wave', '');

                  return (
                    <g
                      key={key}
                      onMouseEnter={() => setHoveredWave(label)}
                      onMouseLeave={() => setHoveredWave(null)}
                      style={{ cursor: 'pointer' }}
                    >
                      <circle
                        cx={timeToX(point.time)}
                        cy={priceToY(point.price) + yOffset}
                        r={12}
                        fill={hoveredWave === label ? colors.coral : `${colors.coral}30`}
                        stroke={colors.coral}
                        strokeWidth={1.5}
                      />
                      <text
                        x={timeToX(point.time)}
                        y={priceToY(point.price) + yOffset + 4}
                        fill={colors.text}
                        fontSize={11}
                        fontWeight={600}
                        textAnchor="middle"
                      >
                        {label}
                      </text>
                    </g>
                  );
                })}
              </>
            )}
          </g>
        )}

        {/* Current price marker */}
        <g>
          <line
            x1={timeToX(92)}
            y1={priceToY(108.73)}
            x2={chartWidth - marginRight}
            y2={priceToY(108.73)}
            stroke={colors.brightTeal}
            strokeWidth={1}
            strokeDasharray="3,3"
            opacity={0.8}
          />
          <rect
            x={chartWidth - marginRight + 2}
            y={priceToY(108.73) - 10}
            width={52}
            height={20}
            fill={colors.brightTeal}
            rx={3}
          />
          <text
            x={chartWidth - marginRight + 28}
            y={priceToY(108.73) + 4}
            fill={colors.background}
            fontSize={11}
            fontWeight={600}
            textAnchor="middle"
          >
            $108.73
          </text>
        </g>

        {/* Scenario Callouts */}
        {showScenarios && (
          <g>
            {/* Base case */}
            <rect
              x={chartWidth - marginRight - 260}
              y={marginTop + 10}
              width={250}
              height={50}
              fill={colors.panelBg}
              stroke={colors.teal}
              strokeWidth={1}
              rx={6}
              opacity={0.95}
            />
            <text
              x={chartWidth - marginRight - 250}
              y={marginTop + 28}
              fill={colors.teal}
              fontSize={11}
              fontWeight={600}
            >
              BASE CASE:
            </text>
            <text
              x={chartWidth - marginRight - 250}
              y={marginTop + 44}
              fill={colors.text}
              fontSize={10}
            >
              (3) developing; break &gt; $110.5 targets $134.9–$141.1
            </text>

            {/* Alternate */}
            <rect
              x={chartWidth - marginRight - 260}
              y={marginTop + 70}
              width={250}
              height={50}
              fill={colors.panelBg}
              stroke={colors.coral}
              strokeWidth={1}
              rx={6}
              opacity={0.95}
            />
            <text
              x={chartWidth - marginRight - 250}
              y={marginTop + 88}
              fill={colors.coral}
              fontSize={11}
              fontWeight={600}
            >
              ALTERNATE:
            </text>
            <text
              x={chartWidth - marginRight - 250}
              y={marginTop + 104}
              fill={colors.text}
              fontSize={10}
            >
              Loss of $92.6 increases odds of deeper correction
            </text>
          </g>
        )}

        {/* Time axis labels */}
        {['Start', 'Wave (1)', 'Wave (2)', 'Current'].map((label, i) => {
          const positions = [0, 55, 78, 92];
          return (
            <text
              key={label}
              x={timeToX(positions[i])}
              y={chartHeight - 25}
              fill={colors.textMuted}
              fontSize={10}
              textAnchor="middle"
            >
              {label}
            </text>
          );
        })}
      </svg>

      {/* Info Panels */}
      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        marginTop: '20px',
        flexWrap: 'wrap'
      }}>
        {/* Legend */}
        <div style={{
          backgroundColor: colors.panelBg,
          border: `1px solid ${colors.teal}40`,
          borderRadius: '8px',
          padding: '16px',
          minWidth: '180px'
        }}>
          <h4 style={{ color: colors.text, margin: '0 0 12px 0', fontSize: '13px', fontWeight: 600 }}>Legend</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '28px', height: '3px', backgroundColor: colors.teal, borderRadius: '2px' }}></div>
              <span style={{ color: '#bbb', fontSize: '12px' }}>Primary Waves (1)-(2)-(3)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '28px', height: '3px', backgroundColor: colors.coral, borderRadius: '2px' }}></div>
              <span style={{ color: '#bbb', fontSize: '12px' }}>Corrective (A-B-C)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '28px', height: '2px', backgroundColor: colors.teal, opacity: 0.5, borderRadius: '2px' }}></div>
              <span style={{ color: '#bbb', fontSize: '12px' }}>Fib Retracements</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '28px', height: '2px', backgroundColor: colors.brightTeal, opacity: 0.6, borderRadius: '2px' }}></div>
              <span style={{ color: '#bbb', fontSize: '12px' }}>Fib Extensions</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '28px', height: '2px', backgroundColor: '#FFA500', opacity: 0.6, borderRadius: '2px' }}></div>
              <span style={{ color: '#bbb', fontSize: '12px' }}>Risk Pivot</span>
            </div>
          </div>
        </div>

        {/* Wave Tooltip */}
        {hoveredWave && waveInfo[hoveredWave] && (
          <div style={{
            backgroundColor: colors.panelBg,
            border: `1px solid ${['A', 'B', 'C'].includes(hoveredWave) ? colors.coral : colors.teal}`,
            borderRadius: '8px',
            padding: '16px',
            minWidth: '200px',
            animation: 'fadeIn 0.2s ease'
          }}>
            <h4 style={{ 
              color: ['A', 'B', 'C'].includes(hoveredWave) ? colors.coral : colors.teal, 
              margin: '0 0 10px 0', 
              fontSize: '14px',
              fontWeight: 600
            }}>
              {waveInfo[hoveredWave].name}
            </h4>
            <div style={{ color: '#aaa', fontSize: '12px', lineHeight: 1.8 }}>
              <div>Price: <span style={{ color: colors.text, fontWeight: 500 }}>{waveInfo[hoveredWave].price}</span></div>
              <div>Date: <span style={{ color: colors.text }}>{waveInfo[hoveredWave].date}</span></div>
              <div>Move: <span style={{ 
                color: waveInfo[hoveredWave].move.includes('+') ? colors.candleGreen : colors.candleRed,
                fontWeight: 500
              }}>{waveInfo[hoveredWave].move}</span></div>
              <div style={{ marginTop: '6px', color: '#888', fontStyle: 'italic' }}>{waveInfo[hoveredWave].desc}</div>
            </div>
          </div>
        )}

        {/* Key Levels */}
        <div style={{
          backgroundColor: colors.panelBg,
          border: `1px solid ${colors.teal}40`,
          borderRadius: '8px',
          padding: '16px',
          minWidth: '200px'
        }}>
          <h4 style={{ color: colors.text, margin: '0 0 12px 0', fontSize: '13px', fontWeight: 600 }}>Key Levels</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#888' }}>Extension 0.618×</span>
              <span style={{ color: colors.brightTeal, fontWeight: 600 }}>$153.74</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#888' }}>Wave (1) High</span>
              <span style={{ color: colors.text }}>$141.10</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#888' }}>Resistance</span>
              <span style={{ color: colors.text }}>$134.93</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#888' }}>Near Target</span>
              <span style={{ color: colors.text }}>$110.47</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid #333' }}>
              <span style={{ color: '#FFA500' }}>Risk Pivot (38.2%)</span>
              <span style={{ color: '#FFA500', fontWeight: 600 }}>$92.58</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: colors.coral }}>Invalidation</span>
              <span style={{ color: colors.coral, fontWeight: 600 }}>$75.25</span>
            </div>
          </div>
        </div>

        {/* Wave Count Summary */}
        <div style={{
          backgroundColor: colors.panelBg,
          border: `1px solid ${colors.teal}40`,
          borderRadius: '8px',
          padding: '16px',
          flex: 1,
          minWidth: '300px'
        }}>
          <h4 style={{ color: colors.text, margin: '0 0 12px 0', fontSize: '13px', fontWeight: 600 }}>Primary Count Summary</h4>
          <div style={{ fontSize: '12px', lineHeight: 1.7 }}>
            <p style={{ color: '#bbb', margin: '0 0 10px 0' }}>
              <span style={{ color: colors.teal, fontWeight: 600 }}>Wave (1):</span> Complete at $141.10 (+901% from $14.09 secular low)
            </p>
            <p style={{ color: '#bbb', margin: '0 0 10px 0' }}>
              <span style={{ color: colors.coral, fontWeight: 600 }}>Wave (2):</span> Complete A-B-C correction to $75.25 (46.7% retrace of Wave 1)
            </p>
            <p style={{ color: '#bbb', margin: '0' }}>
              <span style={{ color: colors.brightTeal, fontWeight: 600 }}>Wave (3):</span> In progress from $75.25, current $108.73. 
              Near-term resistance at $110.47 → $134.93 → $141.10. 
              Primary extension target: <span style={{ color: colors.brightTeal }}>$153.74</span> (0.618× of Wave 1)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NBISElliottWaveChart;
