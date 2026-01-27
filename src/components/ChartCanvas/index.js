import React, {
  useState,
  useMemo,
  useCallback,
  memo,
  useRef,
  useEffect,
  createContext,
  useContext,
} from "react";
import { PORTDIVE_THEME } from "@site/src/components/PortDiveTheme";

// ============================================================================
// CHART CONTEXT - Exposes chart dimensions and scale functions to overlays
// ============================================================================
const ChartContext = createContext(null);

export function useChartContext() {
  const context = useContext(ChartContext);
  if (!context) {
    throw new Error("useChartContext must be used within ChartCanvas");
  }
  return context;
}

// ============================================================================
// CHART CANVAS COMPONENT - OHLCV Data Only
// ============================================================================
const ChartCanvas = memo(
  ({ data, theme, isDarkMode, containerWidth, children }) => {
    // Responsive dimensions
    const W = Math.max(800, containerWidth || 1000);
    const H = 600;
    const M = { t: 60, r: 90, b: 80, l: 70 };

    // Projection space (25% extra for future projection)
    const projectionBars = Math.floor(data.length * 0.25);
    const totalBars = data.length + projectionBars;

    const cW = W - M.l - M.r;
    const cH = H - M.t - M.b - 60;
    const vH = 50;

    const processedData = useMemo(
      () => data.map((d) => ({ ...d, date: new Date(d.timestamp * 1000) })),
      [data],
    );

    const pMin = useMemo(
      () => Math.min(...data.map((d) => d.low)) * 0.9,
      [data],
    );
    const pMax = useMemo(
      () => Math.max(...data.map((d) => d.high), 150) * 1.08,
      [data],
    );
    const vMax = useMemo(() => Math.max(...data.map((d) => d.volume)), [data]);

    const priceToY = useCallback(
      (p) => M.t + cH * (1 - (p - pMin) / (pMax - pMin)),
      [pMin, pMax, cH],
    );
    const idxToX = useCallback(
      (i) => M.l + (i + 0.5) * (cW / totalBars),
      [cW, totalBars],
    );
    const candleW = Math.max(2.5, Math.min(5, cW / totalBars - 1.5));

    // Moving averages from OHLCV data
    const ma50 = useMemo(
      () =>
        data
          .map((d, idx) =>
            d["50_MA"] != null ? { idx, ma: d["50_MA"] } : null,
          )
          .filter(Boolean),
      [data],
    );
    const ma200 = useMemo(
      () =>
        data
          .map((d, idx) =>
            d["200_MA"] != null ? { idx, ma: d["200_MA"] } : null,
          )
          .filter(Boolean),
      [data],
    );

    const priceGrid = [20, 40, 60, 80, 100, 120, 140, 160].filter(
      (p) => p >= pMin && p <= pMax,
    );

    const monthMarkers = useMemo(() => {
      const markers = [];
      let lastMonth = null;
      processedData.forEach((d, i) => {
        const month = d.date.getMonth();
        const year = d.date.getFullYear();
        if (month !== lastMonth) {
          markers.push({
            i,
            label: d.date.toLocaleDateString("en-US", { month: "short" }),
            year: year,
            showYear: month === 0 || i === 0,
          });
          lastMonth = month;
        }
      });

      // Add projection months
      const lastDate = processedData[processedData.length - 1]?.date;
      if (lastDate) {
        const projMonths = ["Feb", "Mar", "Apr", "May", "Jun"];
        projMonths.forEach((m, idx) => {
          markers.push({
            i: data.length + (idx + 1) * Math.floor(projectionBars / 5),
            label: m,
            year: 2026,
            isProjection: true,
          });
        });
      }
      return markers;
    }, [processedData, data.length, projectionBars]);

    const currentPrice = data[data.length - 1]?.close || 0;
    const prevClose = data[data.length - 2]?.close || currentPrice;

    // Chart context value for overlays
    const chartContext = useMemo(
      () => ({
        W,
        H,
        M,
        cW,
        cH,
        vH,
        priceToY,
        idxToX,
        candleW,
        pMin,
        pMax,
        data,
        processedData,
        projectionBars,
        totalBars,
        currentPrice,
        theme,
        isDarkMode,
      }),
      [
        W,
        H,
        cW,
        cH,
        vH,
        priceToY,
        idxToX,
        candleW,
        pMin,
        pMax,
        data,
        processedData,
        projectionBars,
        totalBars,
        currentPrice,
        theme,
        isDarkMode,
      ],
    );

    const aspectRatio = W / H;

    return (
      <ChartContext.Provider value={chartContext}>
        <svg
          width="100%"
          viewBox={`0 0 ${W} ${H}`}
          style={{
            background: theme.surface,
            borderRadius: "12px",
            border: `1px solid ${theme.border}`,
            display: "block",
            aspectRatio: `${aspectRatio}`,
            height: "auto",
            maxHeight: `${H}px`,
          }}
        >
          <defs>
            {/* Shadow filter for labels */}
            <filter
              id="labelShadow"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.3" />
            </filter>
            {/* Gradient for projection zone */}
            <linearGradient
              id="projectionGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor={theme.surface} stopOpacity="0" />
              <stop
                offset="100%"
                stopColor={PORTDIVE_THEME.primary}
                stopOpacity="0.05"
              />
            </linearGradient>
            {/* Target zone gradients for overlays */}
            <linearGradient
              id="primaryTargetZoneGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop
                offset="0%"
                stopColor={PORTDIVE_THEME.primary}
                stopOpacity="0.12"
              />
              <stop
                offset="100%"
                stopColor={PORTDIVE_THEME.primaryLight}
                stopOpacity="0.02"
              />
            </linearGradient>
            <linearGradient
              id="secondaryTargetZoneGradient"
              x1="0%"
              y1="100%"
              x2="0%"
              y2="0%"
            >
              <stop
                offset="0%"
                stopColor={PORTDIVE_THEME.secondaryLight}
                stopOpacity="0.12"
              />
              <stop
                offset="100%"
                stopColor={PORTDIVE_THEME.secondary}
                stopOpacity="0.02"
              />
            </linearGradient>
          </defs>

          {/* Projection zone background */}
          <rect
            x={idxToX(data.length - 1)}
            y={M.t}
            width={cW - (idxToX(data.length - 1) - M.l)}
            height={cH + vH + 10}
            fill="url(#projectionGradient)"
          />

          {/* Price Grid */}
          {priceGrid.map((p) => (
            <g key={p}>
              <line
                x1={M.l}
                x2={W - M.r}
                y1={priceToY(p)}
                y2={priceToY(p)}
                stroke={theme.grid}
                strokeWidth="1"
              />
              <text
                x={M.l - 12}
                y={priceToY(p) + 4}
                textAnchor="end"
                fill={theme.textSecondary}
                fontSize="12"
                fontFamily="system-ui, -apple-system, sans-serif"
                fontWeight="500"
              >
                ${p}
              </text>
            </g>
          ))}

          {/* Month markers */}
          {monthMarkers
            .filter((_, i) => i % 2 === 0 || monthMarkers.length < 15)
            .map(({ i, label, year, showYear, isProjection }) => (
              <g key={`${label}-${i}`}>
                <line
                  x1={idxToX(i)}
                  x2={idxToX(i)}
                  y1={M.t}
                  y2={H - M.b}
                  stroke={isProjection ? PORTDIVE_THEME.primary : theme.grid}
                  strokeWidth="1"
                  strokeDasharray={isProjection ? "4,4" : ""}
                  opacity={isProjection ? 0.3 : 1}
                />
                <text
                  x={idxToX(i)}
                  y={H - M.b + 22}
                  textAnchor="middle"
                  fill={
                    isProjection ? PORTDIVE_THEME.primary : theme.textSecondary
                  }
                  fontSize="12"
                  fontWeight="500"
                  fontFamily="system-ui, -apple-system, sans-serif"
                  opacity={isProjection ? 0.7 : 1}
                >
                  {label}
                </text>
                {showYear && (
                  <text
                    x={idxToX(i)}
                    y={H - M.b + 38}
                    textAnchor="middle"
                    fill={theme.textMuted}
                    fontSize="11"
                    fontFamily="system-ui, -apple-system, sans-serif"
                  >
                    {year}
                  </text>
                )}
              </g>
            ))}

          {/* Moving Averages */}
          {ma50.length > 1 && (
            <path
              d={`M ${ma50.map(({ idx, ma }) => `${idxToX(idx)},${priceToY(ma)}`).join(" L ")}`}
              fill="none"
              stroke={PORTDIVE_THEME.movingAverage.fast}
              strokeWidth="2.5"
              opacity={0.7}
            />
          )}
          {ma200.length > 1 && (
            <path
              d={`M ${ma200.map(({ idx, ma }) => `${idxToX(idx)},${priceToY(ma)}`).join(" L ")}`}
              fill="none"
              stroke={PORTDIVE_THEME.movingAverage.slow}
              strokeWidth="2.5"
              opacity={0.6}
            />
          )}

          {/* Candlesticks */}
          {processedData.map((d, i) => {
            const x = idxToX(i);
            const isGreen = d.close >= d.open;
            const bodyColor = isGreen
              ? PORTDIVE_THEME.candleUp
              : PORTDIVE_THEME.candleDown;
            const yO = priceToY(d.open),
              yC = priceToY(d.close);
            const yH = priceToY(d.high),
              yL = priceToY(d.low);
            const bodyHeight = Math.max(Math.abs(yC - yO), 1);

            return (
              <g key={i}>
                <line
                  x1={x}
                  y1={yH}
                  x2={x}
                  y2={yL}
                  stroke={bodyColor}
                  strokeWidth={1.5}
                />
                <rect
                  x={x - candleW / 2}
                  y={Math.min(yO, yC)}
                  width={candleW}
                  height={bodyHeight}
                  fill={bodyColor}
                  rx={0.5}
                />
              </g>
            );
          })}

          {/* Overlay children render here (wave counts, fibonacci, etc.) */}
          {children}

          {/* Volume section */}
          <rect
            x={M.l}
            y={H - M.b - vH - 5}
            width={cW}
            height={vH + 5}
            rx={4}
            fill="none"
          />
          {processedData.map((d, i) => {
            const x = idxToX(i);
            const h = (d.volume / vMax) * vH * 0.85;
            const isGreen = d.close >= d.open;
            return (
              <rect
                key={`vol-${i}`}
                x={x - candleW / 2}
                y={H - M.b - h - 2}
                width={candleW}
                height={h}
                fill={
                  isGreen ? PORTDIVE_THEME.volume.up : PORTDIVE_THEME.volume.down
                }
                rx={0.5}
              />
            );
          })}

          {/* Current price marker */}
          <g>
            <line
              x1={idxToX(data.length - 1) + candleW}
              x2={W - M.r + 70}
              y1={priceToY(currentPrice)}
              y2={priceToY(currentPrice)}
              stroke={
                currentPrice >= prevClose
                  ? PORTDIVE_THEME.candleUp
                  : PORTDIVE_THEME.candleDown
              }
              strokeWidth={1.5}
              strokeDasharray="4,3"
            />
            <rect
              x={W - M.r + 4}
              y={priceToY(currentPrice) - 14}
              width={70}
              height={28}
              rx={6}
              fill={
                currentPrice >= prevClose
                  ? PORTDIVE_THEME.candleUp
                  : PORTDIVE_THEME.candleDown
              }
            />
            <text
              x={W - M.r + 39}
              y={priceToY(currentPrice) + 5}
              textAnchor="middle"
              fill="#fff"
              fontSize="13"
              fontWeight="700"
              fontFamily="system-ui, -apple-system, sans-serif"
            >
              ${currentPrice.toFixed(2)}
            </text>
          </g>

          {/* MA Legend */}
          <g transform={`translate(${M.l + 15}, ${M.t + 20})`}>
            <rect
              x={-8}
              y={-12}
              width={160}
              height={28}
              rx={6}
              fill={theme.surface}
              opacity={0.9}
            />
            {ma50.length > 1 && (
              <>
                <line
                  x1="0"
                  y1="0"
                  x2="20"
                  y2="0"
                  stroke={PORTDIVE_THEME.movingAverage.fast}
                  strokeWidth="2.5"
                />
                <text
                  x="26"
                  y="4"
                  fill={theme.textSecondary}
                  fontSize="11"
                  fontWeight="500"
                >
                  50-MA
                </text>
              </>
            )}
            {ma200.length > 1 && (
              <>
                <line
                  x1="75"
                  y1="0"
                  x2="95"
                  y2="0"
                  stroke={PORTDIVE_THEME.movingAverage.slow}
                  strokeWidth="2.5"
                />
                <text
                  x="101"
                  y="4"
                  fill={theme.textSecondary}
                  fontSize="11"
                  fontWeight="500"
                >
                  200-MA
                </text>
              </>
            )}
          </g>

          {/* Projection zone label */}
          <g
            transform={`translate(${idxToX(data.length + 10)}, ${H - M.b - vH - 20})`}
          >
            <rect
              x={-40}
              y={-10}
              width={80}
              height={18}
              rx={4}
              fill={PORTDIVE_THEME.primary}
              opacity={0.15}
            />
            <text
              x="0"
              y="3"
              textAnchor="middle"
              fill={PORTDIVE_THEME.primary}
              fontSize="10"
              fontWeight="600"
            >
              PROJECTION
            </text>
          </g>
        </svg>
      </ChartContext.Provider>
    );
  },
);

ChartCanvas.displayName = "ChartCanvas";

export { ChartCanvas };
export default ChartCanvas;
