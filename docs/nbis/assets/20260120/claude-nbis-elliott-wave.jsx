import React, { useState } from 'react';

const NBISElliottWaveChart = () => {
  const [showMotiveWaves, setShowMotiveWaves] = useState(true);
  const [showCorrectiveWaves, setShowCorrectiveWaves] = useState(true);
  const [showFibRetracements, setShowFibRetracements] = useState(true);
  const [showFibExtensions, setShowFibExtensions] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [hoveredWave, setHoveredWave] = useState(null);

  // Chart dimensions
  const chartWidth = 1400;
  const chartHeight = 700;
  const marginLeft = 60;
  const marginRight = 80;
  const marginTop = 40;
  const marginBottom = 60;
  const plotWidth = chartWidth - marginLeft - marginRight;
  const plotHeight = chartHeight - marginTop - marginBottom;

  // Price range
  const priceHigh = 156;
  const priceLow = 48;
  const priceRange = priceHigh - priceLow;

  // Time range (Aug 6 - Jan 24 = ~172 days)
  const totalDays = 172;

  // Helper functions
  const priceToY = (price) => marginTop + ((priceHigh - price) / priceRange) * plotHeight;
  const dayToX = (day) => marginLeft + (day / totalDays) * plotWidth;

  // Wave coordinates based on the analysis
  const wavePoints = {
    // Motive waves (Wave 5 of larger degree)
    start: { day: 0, price: 50.10, label: 'Start' },
    wave1: { day: 25, price: 68.00, label: '①' },
    wave2: { day: 38, price: 54.00, label: '②' },
    wave3: { day: 75, price: 141.20, label: '③' }, // Oct 14 ATH
    wave4: { day: 88, price: 68.00, label: '④' },
    wave5: { day: 98, price: 134.64, label: '⑤' }, // Nov 4 - truncated 5th
    // Corrective waves
    waveA: { day: 142, price: 75.25, label: '(A)' },
    waveB: { day: 165, price: 110.47, label: '(B)' },
    waveC: { day: 195, price: 65.00, label: '(C)?' },
  };

  // Fibonacci levels (based on $141.20 ATH to $75.25 low)
  const fibLevels = {
    retracements: [
      { level: 0, price: 141.20, label: '0%' },
      { level: 0.236, price: 125.64, label: '23.6%' },
      { level: 0.382, price: 116.01, label: '38.2%' },
      { level: 0.5, price: 108.23, label: '50%', highlight: true },
      { level: 0.618, price: 100.44, label: '61.8%' },
      { level: 0.786, price: 89.36, label: '78.6%' },
      { level: 1, price: 75.25, label: '100%' },
    ],
    extensions: [
      { ratio: 0.618, price: 75.30, label: '0.618×' },
      { ratio: 1.0, price: 50.15, label: '1.0×' },
    ],
  };

  // Candlestick data (simplified representation of key price action)
  const candleData = [
    // August - early accumulation
    { day: 0, o: 52, h: 54, l: 50.1, c: 53, green: true },
    { day: 5, o: 53, h: 58, l: 52, c: 57, green: true },
    { day: 10, o: 57, h: 62, l: 56, c: 61, green: true },
    { day: 15, o: 61, h: 66, l: 60, c: 65, green: true },
    { day: 20, o: 65, h: 69, l: 64, c: 67, green: true },
    { day: 25, o: 67, h: 70, l: 65, c: 68, green: true }, // Wave 1 peak
    { day: 30, o: 68, h: 68, l: 58, c: 59, green: false },
    { day: 35, o: 59, h: 60, l: 54, c: 55, green: false },
    { day: 38, o: 55, h: 56, l: 54, c: 54, green: false }, // Wave 2 low
    // September - October rally (Wave 3)
    { day: 42, o: 54, h: 65, l: 53, c: 64, green: true },
    { day: 48, o: 64, h: 78, l: 63, c: 77, green: true },
    { day: 54, o: 77, h: 92, l: 76, c: 90, green: true },
    { day: 60, o: 90, h: 108, l: 88, c: 105, green: true },
    { day: 66, o: 105, h: 122, l: 103, c: 120, green: true },
    { day: 72, o: 120, h: 132, l: 118, c: 130, green: true },
    { day: 75, o: 130, h: 141.2, l: 128, c: 141.2, green: true }, // Wave 3 peak - Oct 14 ATH
    // Wave 4 correction
    { day: 78, o: 141, h: 142, l: 115, c: 118, green: false },
    { day: 82, o: 118, h: 120, l: 95, c: 98, green: false },
    { day: 85, o: 98, h: 100, l: 72, c: 75, green: false },
    { day: 88, o: 75, h: 78, l: 68, c: 70, green: false }, // Wave 4 low
    // Wave 5 (truncated - fails to exceed Wave 3)
    { day: 91, o: 70, h: 95, l: 68, c: 92, green: true },
    { day: 94, o: 92, h: 125, l: 90, c: 122, green: true },
    { day: 98, o: 122, h: 136, l: 120, c: 134.64, green: true }, // Wave 5 - Nov 4 (truncated)
    // Wave A decline
    { day: 102, o: 138, h: 140, l: 125, c: 127, green: false },
    { day: 108, o: 127, h: 130, l: 118, c: 120, green: false },
    { day: 114, o: 120, h: 125, l: 108, c: 110, green: false },
    { day: 120, o: 110, h: 115, l: 100, c: 102, green: false },
    { day: 126, o: 102, h: 108, l: 88, c: 90, green: false },
    { day: 132, o: 90, h: 95, l: 78, c: 80, green: false },
    { day: 138, o: 80, h: 82, l: 75, c: 77, green: false },
    { day: 142, o: 77, h: 78, l: 75.25, c: 76, green: false }, // Wave A low
    // Wave B rally
    { day: 146, o: 76, h: 88, l: 75, c: 86, green: true },
    { day: 150, o: 86, h: 95, l: 84, c: 93, green: true },
    { day: 154, o: 93, h: 100, l: 91, c: 98, green: true },
    { day: 158, o: 98, h: 105, l: 96, c: 103, green: true },
    { day: 162, o: 103, h: 110, l: 100, c: 108, green: true },
    { day: 165, o: 108, h: 110.47, l: 106, c: 108.34, green: true }, // Current
  ];

  // Price grid lines
  const priceGridLines = [52, 60, 68, 76, 84, 92, 100, 108, 116, 124, 132, 140, 148];

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
    gridLine: 'rgba(255,255,255,0.1)',
    background: '#0D1B2A',
  };

  // Wave info for tooltip
  const waveInfo = {
    '①': { name: 'Wave 1', price: '$68.00', date: 'Aug 25', move: '+35.7%' },
    '②': { name: 'Wave 2', price: '$54.00', date: 'Sep 8', move: '-20.6%' },
    '③': { name: 'Wave 3 (ATH)', price: '$141.20', date: 'Oct 14', move: '+161%' },
    '④': { name: 'Wave 4', price: '$68.00', date: 'Oct 25', move: '-52.1%' },
    '⑤': { name: 'Wave 5 (Truncated)', price: '$134.64', date: 'Nov 4', move: '+98%' },
    '(A)': { name: 'Wave A', price: '$75.25', date: 'Dec 23', move: '-44.1%' },
    '(B)': { name: 'Wave B (Active)', price: '$110.47', date: 'Jan 17', move: '+46.8%' },
    '(C)?': { name: 'Wave C (Projected)', price: '$50-$75', date: 'TBD', move: 'Projected' },
  };

  return (
    <div style={{ 
      backgroundColor: colors.background, 
      padding: '20px', 
      borderRadius: '12px',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '16px',
        paddingBottom: '16px',
        borderBottom: `1px solid ${colors.teal}30`
      }}>
        <div>
          <h2 style={{ 
            color: colors.text, 
            margin: 0, 
            fontSize: '24px',
            fontWeight: 600
          }}>
            <span style={{ color: colors.teal }}>NBIS</span> Elliott Wave Analysis
          </h2>
          <p style={{ color: '#888', margin: '4px 0 0 0', fontSize: '14px' }}>
            Nebius Group N.V. • NASDAQ • 1D • Jan 20, 2026
          </p>
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px' 
        }}>
          <span style={{ color: colors.text, fontSize: '28px', fontWeight: 600 }}>
            $108.34
          </span>
          <span style={{ 
            color: colors.candleGreen, 
            fontSize: '16px',
            backgroundColor: 'rgba(45, 212, 191, 0.15)',
            padding: '4px 12px',
            borderRadius: '6px'
          }}>
            +4.66%
          </span>
        </div>
      </div>

      {/* Controls */}
      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        marginBottom: '16px',
        flexWrap: 'wrap'
      }}>
        {[
          { label: 'Motive Waves', state: showMotiveWaves, setter: setShowMotiveWaves, color: colors.teal },
          { label: 'Corrective Waves', state: showCorrectiveWaves, setter: setShowCorrectiveWaves, color: colors.coral },
          { label: 'Fib Retracements', state: showFibRetracements, setter: setShowFibRetracements, color: colors.teal },
          { label: 'Fib Extensions', state: showFibExtensions, setter: setShowFibExtensions, color: colors.brightTeal },
          { label: 'Labels', state: showLabels, setter: setShowLabels, color: colors.text },
        ].map(({ label, state, setter, color }) => (
          <button
            key={label}
            onClick={() => setter(!state)}
            style={{
              background: state ? `${color}20` : 'transparent',
              border: `1px solid ${state ? color : '#444'}`,
              color: state ? color : '#666',
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
              fill="#666"
              fontSize={11}
            >
              ${price}
            </text>
          </g>
        ))}

        {/* Candlesticks */}
        {candleData.map((candle, i) => {
          const x = dayToX(candle.day);
          const candleWidth = 8;
          const bodyTop = priceToY(Math.max(candle.o, candle.c));
          const bodyBottom = priceToY(Math.min(candle.o, candle.c));
          const bodyHeight = Math.max(bodyBottom - bodyTop, 1);
          const wickTop = priceToY(candle.h);
          const wickBottom = priceToY(candle.l);
          const fillColor = candle.green ? colors.candleGreen : colors.candleRed;
          const wickColor = candle.green ? colors.wickGreen : colors.wickRed;

          return (
            <g key={i}>
              {/* Wick */}
              <line
                x1={x}
                y1={wickTop}
                x2={x}
                y2={wickBottom}
                stroke={wickColor}
                strokeWidth={1.5}
              />
              {/* Body */}
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

        {/* Fibonacci Retracements */}
        {showFibRetracements && fibLevels.retracements.map((fib, i) => (
          <g key={`fib-${i}`}>
            <line
              x1={dayToX(98)}
              y1={priceToY(fib.price)}
              x2={chartWidth - marginRight}
              y2={priceToY(fib.price)}
              stroke={colors.teal}
              strokeWidth={fib.level === 0 || fib.level === 1 ? 1.5 : 1}
              strokeDasharray={fib.level === 0 || fib.level === 1 ? 'none' : '6,4'}
              opacity={fib.highlight ? 0.8 : fib.level === 0 || fib.level === 1 ? 0.7 : 0.4}
            />
            <text
              x={chartWidth - marginRight + 8}
              y={priceToY(fib.price) + 4}
              fill={fib.highlight ? colors.teal : '#888'}
              fontSize={10}
              fontWeight={fib.highlight ? 600 : 400}
            >
              {fib.label} | ${fib.price.toFixed(2)}
            </text>
          </g>
        ))}

        {/* Fibonacci Extensions (projected) */}
        {showFibExtensions && fibLevels.extensions.map((ext, i) => (
          <g key={`ext-${i}`}>
            <line
              x1={dayToX(142)}
              y1={priceToY(ext.price)}
              x2={chartWidth - marginRight}
              y2={priceToY(ext.price)}
              stroke={colors.brightTeal}
              strokeWidth={1}
              strokeDasharray="6,4"
              opacity={0.45}
            />
            <text
              x={dayToX(150)}
              y={priceToY(ext.price) - 6}
              fill={colors.brightTeal}
              fontSize={10}
              opacity={0.8}
            >
              {ext.label} | ${ext.price.toFixed(2)}
            </text>
          </g>
        ))}

        {/* Motive Wave Lines (1-2-3-4-5) */}
        {showMotiveWaves && (
          <g>
            <path
              d={`
                M ${dayToX(wavePoints.start.day)} ${priceToY(wavePoints.start.price)}
                L ${dayToX(wavePoints.wave1.day)} ${priceToY(wavePoints.wave1.price)}
                L ${dayToX(wavePoints.wave2.day)} ${priceToY(wavePoints.wave2.price)}
                L ${dayToX(wavePoints.wave3.day)} ${priceToY(wavePoints.wave3.price)}
                L ${dayToX(wavePoints.wave4.day)} ${priceToY(wavePoints.wave4.price)}
                L ${dayToX(wavePoints.wave5.day)} ${priceToY(wavePoints.wave5.price)}
              `}
              fill="none"
              stroke={colors.teal}
              strokeWidth={2}
              opacity={0.7}
              strokeLinejoin="round"
            />
          </g>
        )}

        {/* Corrective Wave Lines (A-B-C) */}
        {showCorrectiveWaves && (
          <g>
            <path
              d={`
                M ${dayToX(wavePoints.wave5.day)} ${priceToY(wavePoints.wave5.price)}
                L ${dayToX(wavePoints.waveA.day)} ${priceToY(wavePoints.waveA.price)}
                L ${dayToX(wavePoints.waveB.day)} ${priceToY(wavePoints.waveB.price)}
              `}
              fill="none"
              stroke={colors.coral}
              strokeWidth={2}
              opacity={0.6}
              strokeLinejoin="round"
            />
            {/* Projected C wave (dashed) */}
            <path
              d={`
                M ${dayToX(wavePoints.waveB.day)} ${priceToY(wavePoints.waveB.price)}
                L ${dayToX(wavePoints.waveC.day)} ${priceToY(wavePoints.waveC.price)}
              `}
              fill="none"
              stroke={colors.coral}
              strokeWidth={2}
              strokeDasharray="8,6"
              opacity={0.4}
            />
          </g>
        )}

        {/* Wave Labels */}
        {showLabels && (
          <g>
            {/* Motive wave labels */}
            {showMotiveWaves && ['wave1', 'wave2', 'wave3', 'wave4', 'wave5'].map((key) => {
              const point = wavePoints[key];
              const isTop = ['wave1', 'wave3', 'wave5'].includes(key);
              const yOffset = isTop ? -15 : 20;
              
              return (
                <g 
                  key={key}
                  onMouseEnter={() => setHoveredWave(point.label)}
                  onMouseLeave={() => setHoveredWave(null)}
                  style={{ cursor: 'pointer' }}
                >
                  <circle
                    cx={dayToX(point.day)}
                    cy={priceToY(point.price) + yOffset}
                    r={14}
                    fill={hoveredWave === point.label ? colors.teal : `${colors.teal}30`}
                    stroke={colors.teal}
                    strokeWidth={1.5}
                  />
                  <text
                    x={dayToX(point.day)}
                    y={priceToY(point.price) + yOffset + 5}
                    fill={colors.text}
                    fontSize={12}
                    fontWeight={600}
                    textAnchor="middle"
                  >
                    {point.label}
                  </text>
                </g>
              );
            })}
            
            {/* Corrective wave labels */}
            {showCorrectiveWaves && ['waveA', 'waveB', 'waveC'].map((key) => {
              const point = wavePoints[key];
              const isTop = key === 'waveB';
              const yOffset = isTop ? -15 : 20;
              const isProjected = key === 'waveC';
              
              return (
                <g 
                  key={key}
                  onMouseEnter={() => setHoveredWave(point.label)}
                  onMouseLeave={() => setHoveredWave(null)}
                  style={{ cursor: 'pointer' }}
                >
                  <circle
                    cx={dayToX(point.day)}
                    cy={priceToY(point.price) + yOffset}
                    r={14}
                    fill={hoveredWave === point.label ? colors.coral : `${colors.coral}30`}
                    stroke={colors.coral}
                    strokeWidth={1.5}
                    strokeDasharray={isProjected ? '4,2' : 'none'}
                    opacity={isProjected ? 0.6 : 1}
                  />
                  <text
                    x={dayToX(point.day)}
                    y={priceToY(point.price) + yOffset + 4}
                    fill={colors.text}
                    fontSize={11}
                    fontWeight={600}
                    textAnchor="middle"
                    opacity={isProjected ? 0.7 : 1}
                  >
                    {point.label}
                  </text>
                </g>
              );
            })}
          </g>
        )}

        {/* Current price line */}
        <line
          x1={marginLeft}
          y1={priceToY(108.34)}
          x2={chartWidth - marginRight}
          y2={priceToY(108.34)}
          stroke={colors.brightTeal}
          strokeWidth={1}
          strokeDasharray="3,3"
          opacity={0.6}
        />

        {/* Date labels */}
        {['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'].map((month, i) => (
          <text
            key={month}
            x={marginLeft + (i * plotWidth / 5.5)}
            y={chartHeight - 20}
            fill="#666"
            fontSize={12}
          >
            {month}
          </text>
        ))}
      </svg>

      {/* Legend and Info Panel */}
      <div style={{ 
        display: 'flex', 
        gap: '24px', 
        marginTop: '16px',
        flexWrap: 'wrap'
      }}>
        {/* Legend */}
        <div style={{
          backgroundColor: 'rgba(0,0,0,0.3)',
          border: `1px solid ${colors.teal}40`,
          borderRadius: '8px',
          padding: '16px',
          minWidth: '200px'
        }}>
          <h4 style={{ color: colors.text, margin: '0 0 12px 0', fontSize: '14px' }}>Legend</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '24px', height: '3px', backgroundColor: colors.teal, borderRadius: '2px' }}></div>
              <span style={{ color: '#aaa', fontSize: '12px' }}>Motive Waves (①②③④⑤)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '24px', height: '3px', backgroundColor: colors.coral, borderRadius: '2px' }}></div>
              <span style={{ color: '#aaa', fontSize: '12px' }}>Corrective Waves (A-B-C)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '24px', height: '3px', backgroundColor: colors.teal, opacity: 0.5, borderRadius: '2px' }}></div>
              <span style={{ color: '#aaa', fontSize: '12px' }}>Fib Retracements</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '24px', height: '3px', backgroundColor: colors.brightTeal, opacity: 0.5, borderRadius: '2px' }}></div>
              <span style={{ color: '#aaa', fontSize: '12px' }}>Fib Extensions (C targets)</span>
            </div>
          </div>
        </div>

        {/* Wave Info Tooltip */}
        {hoveredWave && waveInfo[hoveredWave] && (
          <div style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            border: `1px solid ${hoveredWave.includes('(') ? colors.coral : colors.teal}`,
            borderRadius: '8px',
            padding: '16px',
            minWidth: '180px'
          }}>
            <h4 style={{ 
              color: hoveredWave.includes('(') ? colors.coral : colors.teal, 
              margin: '0 0 8px 0', 
              fontSize: '14px' 
            }}>
              {waveInfo[hoveredWave].name}
            </h4>
            <div style={{ color: '#aaa', fontSize: '12px', lineHeight: 1.6 }}>
              <div>Price: <span style={{ color: colors.text }}>{waveInfo[hoveredWave].price}</span></div>
              <div>Date: <span style={{ color: colors.text }}>{waveInfo[hoveredWave].date}</span></div>
              <div>Move: <span style={{ 
                color: waveInfo[hoveredWave].move.includes('+') ? colors.candleGreen : 
                       waveInfo[hoveredWave].move.includes('-') ? colors.candleRed : colors.text 
              }}>{waveInfo[hoveredWave].move}</span></div>
            </div>
          </div>
        )}

        {/* Key Levels */}
        <div style={{
          backgroundColor: 'rgba(0,0,0,0.3)',
          border: `1px solid ${colors.teal}40`,
          borderRadius: '8px',
          padding: '16px',
          minWidth: '200px'
        }}>
          <h4 style={{ color: colors.text, margin: '0 0 12px 0', fontSize: '14px' }}>Key Levels</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#888' }}>ATH (③)</span>
              <span style={{ color: colors.text }}>$141.20</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#888' }}>Truncated ⑤</span>
              <span style={{ color: colors.text }}>$134.64</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#888' }}>38.2% Fib</span>
              <span style={{ color: colors.teal }}>$116.01</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: colors.brightTeal }}>50% (Current)</span>
              <span style={{ color: colors.brightTeal }}>$108.23</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#888' }}>61.8% Fib</span>
              <span style={{ color: colors.text }}>$100.44</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#888' }}>Wave (A) Low</span>
              <span style={{ color: colors.coral }}>$75.25</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#888' }}>C Target Zone</span>
              <span style={{ color: colors.coral }}>$50-$75</span>
            </div>
          </div>
        </div>

        {/* Analysis Summary */}
        <div style={{
          backgroundColor: 'rgba(0,0,0,0.3)',
          border: `1px solid ${colors.teal}40`,
          borderRadius: '8px',
          padding: '16px',
          flex: 1,
          minWidth: '280px'
        }}>
          <h4 style={{ color: colors.text, margin: '0 0 12px 0', fontSize: '14px' }}>Analysis Summary</h4>
          <p style={{ color: '#aaa', fontSize: '12px', lineHeight: 1.6, margin: 0 }}>
            <span style={{ color: colors.teal, fontWeight: 600 }}>Primary Count (45%):</span> Wave B of Expanded Flat correction. 
            Note: Wave ⑤ was truncated (failed to exceed Wave ③ ATH at $141.20).
            Currently testing 50% Fibonacci retracement at $108.23. 
            If B completes near $116 (38.2%), Wave C targets $50-$75.
          </p>
          <p style={{ color: '#aaa', fontSize: '12px', lineHeight: 1.6, margin: '8px 0 0 0' }}>
            <span style={{ color: colors.coral, fontWeight: 600 }}>Invalidation:</span> Above $141.20 (new ATH) invalidates correction count.
            Below $75.24 suggests deeper correction.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NBISElliottWaveChart;
