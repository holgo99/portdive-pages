import React, { useState } from 'react';

const NBISElliottWaveChart = () => {
  const [showMotiveWaves, setShowMotiveWaves] = useState(true);
  const [showCorrectiveWaves, setShowCorrectiveWaves] = useState(true);
  const [showWaveLabels, setShowWaveLabels] = useState(true);
  const [showFibRetracements, setShowFibRetracements] = useState(true);
  const [showFibExtensions, setShowFibExtensions] = useState(true);
  const [showProjections, setShowProjections] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [hoveredWave, setHoveredWave] = useState(null);

  // Chart dimensions
  const chartWidth = 1400;
  const chartHeight = 720;
  const marginLeft = 55;
  const marginRight = 145;
  const marginTop = 60;
  const marginBottom = 55;
  const plotWidth = chartWidth - marginLeft - marginRight;
  const plotHeight = chartHeight - marginTop - marginBottom;

  // Price range (Weekly view Feb 2024 - Mar 2026)
  const priceHigh = 165;
  const priceLow = 60;
  const priceRange = priceHigh - priceLow;

  // Time range: ~104 weeks (Feb 2024 - Mar 2026)
  const totalWeeks = 110;

  // Helper functions
  const priceToY = (price) => marginTop + ((priceHigh - price) / priceRange) * plotHeight;
  const weekToX = (week) => marginLeft + (week / totalWeeks) * plotWidth;

  // Wave coordinates based on Grok analysis
  // Cycle (I) - Completed 5-wave impulse
  const motiveWaves = {
    start: { week: 0, price: 65.00, label: 'Start', date: 'Feb 2024' },
    wave1: { week: 18, price: 95.00, label: '①', date: 'Jun 2024' },
    wave2: { week: 28, price: 72.00, label: '②', date: 'Aug 2024' },
    wave3: { week: 48, price: 138.00, label: '③', date: 'Jan 2025' },
    wave4: { week: 58, price: 115.00, label: '④', date: 'Mar 2025' },
    wave5: { week: 78, price: 153.00, label: '⑤', date: 'Aug 2025' },
  };

  // Cycle (II) - Ongoing A-B-C correction
  const correctiveWaves = {
    waveA: { week: 92, price: 76.00, label: '(A)', date: 'Nov 2025' },
    waveB: { week: 100, price: 108.73, label: '(B)', date: 'Jan 2026' },
    waveC: { week: 115, price: 89.00, label: '(C)', date: 'Mar 2026', projected: true },
  };

  // Fibonacci Retracement (Cycle I high to Wave A low)
  const fibPeak = 153.00;
  const fibLow = 76.00;
  const fibRange = fibPeak - fibLow; // $77

  const fibRetracements = [
    { level: 0, price: 153.00, label: '0% (Peak)', solid: true },
    { level: 0.236, price: fibPeak - (fibRange * 0.236), label: '23.6%' },
    { level: 0.382, price: fibPeak - (fibRange * 0.382), label: '38.2%' },
    { level: 0.5, price: fibPeak - (fibRange * 0.5), label: '50%' },
    { level: 0.618, price: fibPeak - (fibRange * 0.618), label: '61.8%', highlight: true },
    { level: 0.786, price: fibPeak - (fibRange * 0.786), label: '78.6%' },
    { level: 1, price: 76.00, label: '100% (Low)', solid: true },
  ];

  // Fibonacci Extensions from projected (C) low (~$89) for Cycle (III)
  const extBase = 89.00;
  const cycleIMagnitude = 153 - 65; // ~$88 (full cycle I move)

  const fibExtensions = [
    { ratio: '1.0×', price: extBase + (cycleIMagnitude * 1.0), label: '1.0×' },
    { ratio: '1.272×', price: extBase + (cycleIMagnitude * 1.272), label: '1.272×' },
    { ratio: '1.618×', price: extBase + (cycleIMagnitude * 1.618), label: '1.618×', primary: true },
  ];

  // Weekly candlestick data (simplified representation)
  const candleData = [
    // Feb-Apr 2024 (Start of cycle)
    { week: 0, o: 65, h: 70, l: 64, c: 68, green: true },
    { week: 2, o: 68, h: 75, l: 66, c: 73, green: true },
    { week: 4, o: 73, h: 80, l: 71, c: 78, green: true },
    { week: 6, o: 78, h: 85, l: 76, c: 83, green: true },
    { week: 8, o: 83, h: 88, l: 80, c: 86, green: true },
    // May-Jul 2024 (Wave 1 peak)
    { week: 12, o: 86, h: 92, l: 84, c: 90, green: true },
    { week: 16, o: 90, h: 96, l: 88, c: 94, green: true },
    { week: 18, o: 94, h: 95, l: 90, c: 92, green: false },
    // Aug-Sep 2024 (Wave 2 low)
    { week: 22, o: 92, h: 94, l: 82, c: 84, green: false },
    { week: 26, o: 84, h: 86, l: 74, c: 76, green: false },
    { week: 28, o: 76, h: 78, l: 72, c: 74, green: false },
    // Oct-Dec 2024 (Wave 3 rally)
    { week: 32, o: 74, h: 88, l: 72, c: 86, green: true },
    { week: 36, o: 86, h: 100, l: 84, c: 98, green: true },
    { week: 40, o: 98, h: 115, l: 96, c: 112, green: true },
    { week: 44, o: 112, h: 128, l: 110, c: 125, green: true },
    { week: 48, o: 125, h: 140, l: 122, c: 138, green: true },
    // Jan-Mar 2025 (Wave 4 correction)
    { week: 52, o: 138, h: 142, l: 125, c: 128, green: false },
    { week: 56, o: 128, h: 132, l: 118, c: 120, green: false },
    { week: 58, o: 120, h: 122, l: 115, c: 118, green: false },
    // Apr-Aug 2025 (Wave 5 to peak)
    { week: 62, o: 118, h: 130, l: 116, c: 128, green: true },
    { week: 66, o: 128, h: 142, l: 126, c: 140, green: true },
    { week: 70, o: 140, h: 150, l: 138, c: 148, green: true },
    { week: 74, o: 148, h: 155, l: 145, c: 152, green: true },
    { week: 78, o: 152, h: 153, l: 145, c: 148, green: false },
    // Sep-Nov 2025 (Wave A decline)
    { week: 82, o: 148, h: 150, l: 130, c: 132, green: false },
    { week: 86, o: 132, h: 135, l: 105, c: 108, green: false },
    { week: 90, o: 108, h: 112, l: 78, c: 82, green: false },
    { week: 92, o: 82, h: 85, l: 76, c: 78, green: false },
    // Dec 2025 - Jan 2026 (Wave B bounce)
    { week: 94, o: 78, h: 92, l: 76, c: 90, green: true },
    { week: 96, o: 90, h: 102, l: 88, c: 98, green: true },
    { week: 98, o: 98, h: 110, l: 95, c: 105, green: true },
    { week: 100, o: 105, h: 112, l: 102, c: 108.73, green: true },
  ];

  // Price grid lines
  const priceGridLines = [70, 80, 90, 100, 110, 120, 130, 140, 150, 160];

  // Colors (PortDive Brand)
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
    gridLine: 'rgba(255,255,255,0.05)',
    background: '#0D1B2A',
    panelBg: 'rgba(0,0,0,0.5)',
  };

  // Wave info for tooltips
  const waveInfo = {
    '①': { name: 'Wave ① (Cycle I)', price: '$95.00', date: 'Jun 2024', move: '+46.2%', character: 'Initial impulse leg' },
    '②': { name: 'Wave ② (Cycle I)', price: '$72.00', date: 'Aug 2024', move: '-24.2%', character: 'Deep correction' },
    '③': { name: 'Wave ③ (Cycle I)', price: '$138.00', date: 'Jan 2025', move: '+91.7%', character: 'Extended wave (strongest)' },
    '④': { name: 'Wave ④ (Cycle I)', price: '$115.00', date: 'Mar 2025', move: '-16.7%', character: 'Shallow correction' },
    '⑤': { name: 'Wave ⑤ (Cycle I)', price: '$153.00', date: 'Aug 2025', move: '+33.0%', character: 'Cycle top (completed)' },
    '(A)': { name: 'Wave (A) (Cycle II)', price: '$76.00', date: 'Nov 2025', move: '-50.3%', character: 'Sharp corrective decline' },
    '(B)': { name: 'Wave (B) (Cycle II)', price: '$108.73', date: 'Jan 2026', move: '+43.1%', character: 'Counter-trend bounce (current)' },
    '(C)': { name: 'Wave (C) (Cycle II)', price: '$89.00', date: 'Mar 2026', move: '-18.1%', character: 'Projected: 61.8% retrace target' },
  };

  return (
    <div style={{ 
      backgroundColor: colors.background, 
      padding: '20px', 
      borderRadius: '12px',
      fontFamily: 'Inter, system-ui, sans-serif',
      maxWidth: '1450px'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: '16px',
        paddingBottom: '14px',
        borderBottom: `1px solid ${colors.teal}25`
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <h2 style={{ color: colors.text, margin: 0, fontSize: '22px', fontWeight: 600 }}>
              <span style={{ color: colors.teal }}>NBIS</span> Elliott Wave Analysis
            </h2>
            <span style={{
              backgroundColor: `${colors.teal}20`,
              color: colors.teal,
              padding: '3px 10px',
              borderRadius: '4px',
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.5px'
            }}>
              CYCLE (I) COMPLETE
            </span>
            <span style={{
              backgroundColor: `${colors.coral}20`,
              color: colors.coral,
              padding: '3px 10px',
              borderRadius: '4px',
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.5px'
            }}>
              CYCLE (II) A-B-C IN PROGRESS
            </span>
          </div>
          <p style={{ color: colors.textMuted, margin: 0, fontSize: '12px' }}>
            Nebius Group N.V. • NASDAQ • 1W • Feb 2024 – Mar 2026
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'flex-end' }}>
            <span style={{ color: colors.text, fontSize: '26px', fontWeight: 600 }}>$108.73</span>
            <span style={{ 
              color: colors.candleGreen, 
              fontSize: '13px',
              backgroundColor: 'rgba(45, 212, 191, 0.12)',
              padding: '4px 10px',
              borderRadius: '5px',
              fontWeight: 500
            }}>
              +4.66%
            </span>
          </div>
          <p style={{ color: colors.textMuted, margin: '3px 0 0 0', fontSize: '11px' }}>
            Wave (B) near completion • (C) target: <span style={{ color: colors.coral, fontWeight: 600 }}>$85–$92</span>
          </p>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
        {[
          { label: 'Motive (①-⑤)', state: showMotiveWaves, setter: setShowMotiveWaves, color: colors.teal },
          { label: 'Corrective (A-B-C)', state: showCorrectiveWaves, setter: setShowCorrectiveWaves, color: colors.coral },
          { label: 'Wave Labels', state: showWaveLabels, setter: setShowWaveLabels, color: colors.text },
          { label: 'Fib Retracement', state: showFibRetracements, setter: setShowFibRetracements, color: colors.teal },
          { label: 'Fib Extensions', state: showFibExtensions, setter: setShowFibExtensions, color: colors.brightTeal },
          { label: 'Projections', state: showProjections, setter: setShowProjections, color: colors.brightTeal },
          { label: 'Legend', state: showLegend, setter: setShowLegend, color: colors.text },
        ].map(({ label, state, setter, color }) => (
          <button
            key={label}
            onClick={() => setter(!state)}
            style={{
              background: state ? `${color}12` : 'transparent',
              border: `1px solid ${state ? color : '#333'}`,
              color: state ? color : '#555',
              padding: '6px 12px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: 500,
              transition: 'all 0.15s ease'
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
        style={{ backgroundColor: colors.background, borderRadius: '6px' }}
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
              x={chartWidth - marginRight + 6}
              y={priceToY(price) + 4}
              fill={colors.textMuted}
              fontSize={10}
            >
              ${price}
            </text>
          </g>
        ))}

        {/* Fibonacci Retracement Lines */}
        {showFibRetracements && fibRetracements.map((fib, i) => (
          <g key={`fib-ret-${i}`}>
            <line
              x1={weekToX(78)}
              y1={priceToY(fib.price)}
              x2={chartWidth - marginRight}
              y2={priceToY(fib.price)}
              stroke={colors.teal}
              strokeWidth={fib.solid ? 1.5 : 1}
              strokeDasharray={fib.solid ? 'none' : '4,4'}
              opacity={fib.solid ? 0.7 : (fib.highlight ? 0.6 : 0.4)}
            />
            <rect
              x={chartWidth - marginRight + 2}
              y={priceToY(fib.price) - 7}
              width={135}
              height={14}
              fill={colors.background}
              opacity={0.95}
            />
            <text
              x={chartWidth - marginRight + 6}
              y={priceToY(fib.price) + 4}
              fill={fib.highlight ? colors.teal : colors.textMuted}
              fontSize={9}
              fontWeight={fib.highlight || fib.solid ? 600 : 400}
            >
              {fib.label} | ${fib.price.toFixed(2)}
            </text>
          </g>
        ))}

        {/* Fibonacci Extension Lines (for Cycle III projection) */}
        {showFibExtensions && showProjections && fibExtensions.filter(e => e.price <= priceHigh + 20).map((ext, i) => (
          <g key={`fib-ext-${i}`}>
            <line
              x1={weekToX(115)}
              y1={priceToY(Math.min(ext.price, priceHigh))}
              x2={chartWidth - marginRight}
              y2={priceToY(Math.min(ext.price, priceHigh))}
              stroke={colors.brightTeal}
              strokeWidth={ext.primary ? 1.5 : 1}
              strokeDasharray="4,4"
              opacity={ext.primary ? 0.55 : 0.35}
            />
          </g>
        ))}

        {/* Target Zone Highlight (61.8% area) */}
        {showFibRetracements && (
          <rect
            x={weekToX(100)}
            y={priceToY(95)}
            width={weekToX(120) - weekToX(100)}
            height={priceToY(82) - priceToY(95)}
            fill={colors.coral}
            opacity={0.08}
            rx={4}
          />
        )}

        {/* Candlesticks */}
        {candleData.map((candle, i) => {
          const x = weekToX(candle.week);
          const candleWidth = 10;
          const bodyTop = priceToY(Math.max(candle.o, candle.c));
          const bodyBottom = priceToY(Math.min(candle.o, candle.c));
          const bodyHeight = Math.max(bodyBottom - bodyTop, 1);
          const wickTop = priceToY(candle.h);
          const wickBottom = priceToY(candle.l);
          const fillColor = candle.green ? colors.candleGreen : colors.candleRed;
          const wickColor = candle.green ? colors.wickGreen : colors.wickRed;

          return (
            <g key={i}>
              <line x1={x} y1={wickTop} x2={x} y2={wickBottom} stroke={wickColor} strokeWidth={1.5} />
              <rect x={x - candleWidth / 2} y={bodyTop} width={candleWidth} height={bodyHeight} fill={fillColor} rx={1} />
            </g>
          );
        })}

        {/* Motive Wave Lines (Cycle I: ①-②-③-④-⑤) */}
        {showMotiveWaves && (
          <g>
            {/* Start → ① */}
            <line
              x1={weekToX(motiveWaves.start.week)} y1={priceToY(motiveWaves.start.price)}
              x2={weekToX(motiveWaves.wave1.week)} y2={priceToY(motiveWaves.wave1.price)}
              stroke={colors.teal} strokeWidth={2} opacity={0.6}
            />
            {/* ① → ② */}
            <line
              x1={weekToX(motiveWaves.wave1.week)} y1={priceToY(motiveWaves.wave1.price)}
              x2={weekToX(motiveWaves.wave2.week)} y2={priceToY(motiveWaves.wave2.price)}
              stroke={colors.teal} strokeWidth={2} opacity={0.6}
            />
            {/* ② → ③ */}
            <line
              x1={weekToX(motiveWaves.wave2.week)} y1={priceToY(motiveWaves.wave2.price)}
              x2={weekToX(motiveWaves.wave3.week)} y2={priceToY(motiveWaves.wave3.price)}
              stroke={colors.teal} strokeWidth={2.5} opacity={0.7}
            />
            {/* ③ → ④ */}
            <line
              x1={weekToX(motiveWaves.wave3.week)} y1={priceToY(motiveWaves.wave3.price)}
              x2={weekToX(motiveWaves.wave4.week)} y2={priceToY(motiveWaves.wave4.price)}
              stroke={colors.teal} strokeWidth={2} opacity={0.6}
            />
            {/* ④ → ⑤ */}
            <line
              x1={weekToX(motiveWaves.wave4.week)} y1={priceToY(motiveWaves.wave4.price)}
              x2={weekToX(motiveWaves.wave5.week)} y2={priceToY(motiveWaves.wave5.price)}
              stroke={colors.teal} strokeWidth={2} opacity={0.6}
            />
          </g>
        )}

        {/* Corrective Wave Lines (Cycle II: A-B-C) */}
        {showCorrectiveWaves && (
          <g>
            {/* ⑤ → (A) */}
            <line
              x1={weekToX(motiveWaves.wave5.week)} y1={priceToY(motiveWaves.wave5.price)}
              x2={weekToX(correctiveWaves.waveA.week)} y2={priceToY(correctiveWaves.waveA.price)}
              stroke={colors.coral} strokeWidth={2} opacity={0.6}
            />
            {/* (A) → (B) */}
            <line
              x1={weekToX(correctiveWaves.waveA.week)} y1={priceToY(correctiveWaves.waveA.price)}
              x2={weekToX(correctiveWaves.waveB.week)} y2={priceToY(correctiveWaves.waveB.price)}
              stroke={colors.coral} strokeWidth={2} opacity={0.6}
            />
            {/* (B) → (C) projected */}
            <line
              x1={weekToX(correctiveWaves.waveB.week)} y1={priceToY(correctiveWaves.waveB.price)}
              x2={weekToX(correctiveWaves.waveC.week)} y2={priceToY(correctiveWaves.waveC.price)}
              stroke={colors.coral} strokeWidth={2} strokeDasharray="8,5" opacity={0.5}
            />
          </g>
        )}

        {/* Projected Cycle III (from C low upward) */}
        {showProjections && (
          <g>
            <line
              x1={weekToX(correctiveWaves.waveC.week)} y1={priceToY(correctiveWaves.waveC.price)}
              x2={weekToX(130)} y2={priceToY(145)}
              stroke={colors.brightTeal} strokeWidth={2} strokeDasharray="6,4" opacity={0.4}
            />
            {/* New ① label at projection start */}
            <circle
              cx={weekToX(correctiveWaves.waveC.week) + 8}
              cy={priceToY(correctiveWaves.waveC.price) - 5}
              r={10}
              fill={`${colors.brightTeal}30`}
              stroke={colors.brightTeal}
              strokeWidth={1.5}
              strokeDasharray="3,2"
            />
            <text
              x={weekToX(correctiveWaves.waveC.week) + 8}
              y={priceToY(correctiveWaves.waveC.price) - 1}
              fill={colors.brightTeal}
              fontSize={9}
              fontWeight={600}
              textAnchor="middle"
            >
              ①
            </text>
            <text
              x={weekToX(125)}
              y={priceToY(140)}
              fill={colors.brightTeal}
              fontSize={9}
              fontWeight={500}
              opacity={0.7}
            >
              Cycle (III)
            </text>
          </g>
        )}

        {/* Motive Wave Labels */}
        {showWaveLabels && showMotiveWaves && (
          <g>
            {Object.entries(motiveWaves).filter(([k]) => k !== 'start').map(([key, wave]) => {
              const isTop = ['wave1', 'wave3', 'wave5'].includes(key);
              const yOffset = isTop ? -18 : 20;

              return (
                <g
                  key={key}
                  onMouseEnter={() => setHoveredWave(wave.label)}
                  onMouseLeave={() => setHoveredWave(null)}
                  style={{ cursor: 'pointer' }}
                >
                  <circle
                    cx={weekToX(wave.week)}
                    cy={priceToY(wave.price) + yOffset}
                    r={14}
                    fill={hoveredWave === wave.label ? colors.teal : `${colors.teal}20`}
                    stroke={colors.teal}
                    strokeWidth={2}
                  />
                  <text
                    x={weekToX(wave.week)}
                    y={priceToY(wave.price) + yOffset + 5}
                    fill={colors.text}
                    fontSize={12}
                    fontWeight={600}
                    textAnchor="middle"
                  >
                    {wave.label}
                  </text>
                </g>
              );
            })}
          </g>
        )}

        {/* Corrective Wave Labels */}
        {showWaveLabels && showCorrectiveWaves && (
          <g>
            {Object.entries(correctiveWaves).map(([key, wave]) => {
              const isTop = key === 'waveB';
              const yOffset = isTop ? -18 : 20;

              return (
                <g
                  key={key}
                  onMouseEnter={() => setHoveredWave(wave.label)}
                  onMouseLeave={() => setHoveredWave(null)}
                  style={{ cursor: 'pointer' }}
                >
                  <circle
                    cx={weekToX(wave.week)}
                    cy={priceToY(wave.price) + yOffset}
                    r={14}
                    fill={hoveredWave === wave.label ? colors.coral : `${colors.coral}20`}
                    stroke={colors.coral}
                    strokeWidth={2}
                    strokeDasharray={wave.projected ? '4,2' : 'none'}
                  />
                  <text
                    x={weekToX(wave.week)}
                    y={priceToY(wave.price) + yOffset + 5}
                    fill={colors.text}
                    fontSize={11}
                    fontWeight={600}
                    textAnchor="middle"
                    opacity={wave.projected ? 0.7 : 1}
                  >
                    {wave.label}
                  </text>
                </g>
              );
            })}
          </g>
        )}

        {/* Current Price Line */}
        <g>
          <line
            x1={weekToX(100)}
            y1={priceToY(108.73)}
            x2={chartWidth - marginRight}
            y2={priceToY(108.73)}
            stroke={colors.brightTeal}
            strokeWidth={1}
            strokeDasharray="3,3"
            opacity={0.6}
          />
          <rect
            x={chartWidth - marginRight + 2}
            y={priceToY(108.73) - 10}
            width={55}
            height={20}
            fill={colors.brightTeal}
            rx={3}
          />
          <text
            x={chartWidth - marginRight + 30}
            y={priceToY(108.73) + 4}
            fill={colors.background}
            fontSize={10}
            fontWeight={600}
            textAnchor="middle"
          >
            $108.73
          </text>
        </g>

        {/* Legend Box */}
        {showLegend && (
          <g>
            <rect
              x={chartWidth - marginRight - 260}
              y={marginTop + 10}
              width={250}
              height={88}
              fill={colors.panelBg}
              stroke={colors.teal}
              strokeWidth={1}
              rx={5}
              opacity={0.95}
            />
            <text x={chartWidth - marginRight - 250} y={marginTop + 28} fill={colors.teal} fontSize={10} fontWeight={600}>
              — Cycle (I) Complete (①②③④⑤)
            </text>
            <text x={chartWidth - marginRight - 250} y={marginTop + 44} fill={colors.coral} fontSize={10} fontWeight={600}>
              — Cycle (II) A-B-C (in progress)
            </text>
            <text x={chartWidth - marginRight - 250} y={marginTop + 60} fill={colors.brightTeal} fontSize={10} fontWeight={600}>
              — — Cycle (III) Projected
            </text>
            <text x={chartWidth - marginRight - 250} y={marginTop + 78} fill={colors.text} fontSize={9}>
              (C) Target: $85–$92 (61.8% zone)
            </text>
            <text x={chartWidth - marginRight - 250} y={marginTop + 92} fill={colors.textMuted} fontSize={9}>
              (III) Primary: $231 (1.618× ext)
            </text>
          </g>
        )}

        {/* Time axis labels */}
        {[
          { week: 0, label: 'Feb 24' },
          { week: 26, label: 'Aug 24' },
          { week: 52, label: 'Feb 25' },
          { week: 78, label: 'Aug 25' },
          { week: 100, label: 'Jan 26' },
        ].map(({ week, label }) => (
          <text
            key={week}
            x={weekToX(week)}
            y={chartHeight - 18}
            fill={colors.textMuted}
            fontSize={10}
            textAnchor="middle"
          >
            {label}
          </text>
        ))}
      </svg>

      {/* Info Panels */}
      <div style={{ display: 'flex', gap: '14px', marginTop: '16px', flexWrap: 'wrap' }}>
        {/* Legend */}
        <div style={{
          backgroundColor: colors.panelBg,
          border: `1px solid ${colors.teal}25`,
          borderRadius: '6px',
          padding: '12px',
          minWidth: '150px'
        }}>
          <h4 style={{ color: colors.text, margin: '0 0 8px 0', fontSize: '11px', fontWeight: 600 }}>Legend</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[
              { color: colors.teal, label: 'Motive (①-⑤)' },
              { color: colors.coral, label: 'Corrective (A-B-C)' },
              { color: colors.brightTeal, label: 'Projected (III)', dashed: true },
              { color: colors.teal, label: 'Fib Retrace', dashed: true },
            ].map(({ color, label, dashed }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ 
                  width: '18px', 
                  height: '2px', 
                  backgroundColor: color,
                  background: dashed ? `repeating-linear-gradient(90deg, ${color}, ${color} 3px, transparent 3px, transparent 6px)` : color
                }}></div>
                <span style={{ color: '#999', fontSize: '10px' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Wave Tooltip */}
        {hoveredWave && waveInfo[hoveredWave] && (
          <div style={{
            backgroundColor: colors.panelBg,
            border: `1px solid ${hoveredWave.includes('(') ? colors.coral : colors.teal}`,
            borderRadius: '6px',
            padding: '12px',
            minWidth: '220px',
          }}>
            <h4 style={{ 
              color: hoveredWave.includes('(') ? colors.coral : colors.teal, 
              margin: '0 0 6px 0', 
              fontSize: '12px', 
              fontWeight: 600 
            }}>
              {waveInfo[hoveredWave].name}
            </h4>
            <div style={{ color: '#aaa', fontSize: '10px', lineHeight: 1.6 }}>
              <div>Price: <span style={{ color: colors.text }}>{waveInfo[hoveredWave].price}</span></div>
              <div>Date: <span style={{ color: colors.text }}>{waveInfo[hoveredWave].date}</span></div>
              <div>Move: <span style={{ 
                color: waveInfo[hoveredWave].move.includes('+') ? colors.candleGreen : colors.candleRed,
                fontWeight: 500
              }}>{waveInfo[hoveredWave].move}</span></div>
              <div style={{ marginTop: '4px', color: '#777', fontStyle: 'italic', fontSize: '9px' }}>
                {waveInfo[hoveredWave].character}
              </div>
            </div>
          </div>
        )}

        {/* Cycle Structure */}
        <div style={{
          backgroundColor: colors.panelBg,
          border: `1px solid ${colors.teal}25`,
          borderRadius: '6px',
          padding: '12px',
          minWidth: '180px'
        }}>
          <h4 style={{ color: colors.text, margin: '0 0 8px 0', fontSize: '11px', fontWeight: 600 }}>Cycle Structure</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: colors.teal }}>Cycle (I) High</span>
              <span style={{ color: colors.text, fontWeight: 600 }}>$153.00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: colors.coral }}>(A) Low</span>
              <span style={{ color: colors.text }}>$76.00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: colors.coral }}>(B) High</span>
              <span style={{ color: colors.text }}>$108.73</span>
            </div>
            <div style={{ height: '1px', backgroundColor: '#333', margin: '3px 0' }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: colors.coral }}>(C) Target</span>
              <span style={{ color: colors.coral, fontWeight: 600 }}>$85–$92</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: colors.brightTeal }}>(III) Primary</span>
              <span style={{ color: colors.brightTeal, fontWeight: 600 }}>$231</span>
            </div>
          </div>
        </div>

        {/* Analysis Summary */}
        <div style={{
          backgroundColor: colors.panelBg,
          border: `1px solid ${colors.teal}25`,
          borderRadius: '6px',
          padding: '12px',
          flex: 1,
          minWidth: '300px'
        }}>
          <h4 style={{ color: colors.text, margin: '0 0 8px 0', fontSize: '11px', fontWeight: 600 }}>Weekly Analysis Summary</h4>
          <div style={{ fontSize: '10px', lineHeight: 1.55, color: '#bbb' }}>
            <p style={{ margin: '0 0 6px 0' }}>
              <span style={{ color: colors.teal, fontWeight: 600 }}>Cycle (I) Complete:</span> 5-wave impulse from $65 (Feb 2024) to 
              $153 (Aug 2025). Extended Wave ③ reached $138 (+91.7%). Full cycle gain: +135%.
            </p>
            <p style={{ margin: 0 }}>
              <span style={{ color: colors.coral, fontWeight: 600 }}>Cycle (II) A-B-C:</span> Wave (A) completed at $76 (-50.3%). 
              Wave (B) currently at $108.73 (+43.1%), near completion. 
              Wave (C) projected to <span style={{ color: colors.coral }}>$85–$92</span> (61.8% retrace).
              <span style={{ color: colors.brightTeal }}> Cycle (III) target: $231+ (1.618× ext)</span>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '12px',
        paddingTop: '10px',
        borderTop: `1px solid ${colors.teal}15`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{ color: '#444', fontSize: '9px' }}>
          PortDive | Elliott Wave Analysis | NBIS | Weekly | Jan 20, 2026
        </span>
        <span style={{ color: colors.coral, fontSize: '9px', fontWeight: 500 }}>
          Wave (B) near completion • (C) target: $85–$92 • Cycle (III) pending
        </span>
      </div>
    </div>
  );
};

export default NBISElliottWaveChart;
