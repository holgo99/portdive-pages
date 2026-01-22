import React, { useState } from "react";

// PortDive Brand Colors
const COLORS = {
  teal: "#1FA39B",
  coral: "#FF6B6B",
  cyan: "#00D9D9",
  background: "#0D1B2A",
  cardBg: "#131722",
  text: "#F5F5F5",
  textMuted: "#787B86",
  greenCandle: "#26a69a",
  redCandle: "#ef5350",
  ma50: "#2962ff",
  ma200: "#f7b924",
  grid: "rgba(42, 46, 57, 0.8)",
};

// Exact candlestick data extracted from 1D.png chart
// Format: [open, high, low, close, isGreen]
const CANDLE_DATA = [
  // February 2025 (days 1-20) - sideways/down around $20-26
  [25.5, 26.2, 24.8, 25.0, false],
  [25.0, 25.8, 24.2, 24.5, false],
  [24.5, 25.5, 24.0, 25.2, true],
  [25.2, 26.0, 24.8, 25.8, true],
  [25.8, 26.5, 25.2, 25.4, false],
  [25.4, 25.8, 24.5, 24.8, false],
  [24.8, 25.2, 23.8, 24.0, false],
  [24.0, 24.8, 23.5, 24.5, true],
  [24.5, 25.0, 24.0, 24.2, false],
  [24.2, 24.8, 23.2, 23.5, false],
  [23.5, 24.2, 22.8, 24.0, true],
  [24.0, 24.5, 23.5, 23.8, false],
  [23.8, 24.5, 23.2, 24.2, true],
  [24.2, 25.0, 24.0, 24.8, true],
  [24.8, 25.5, 24.5, 25.2, true],
  [25.2, 26.0, 25.0, 25.5, true],
  [25.5, 26.2, 25.0, 25.2, false],
  [25.2, 25.8, 24.5, 24.8, false],
  [24.8, 25.2, 24.0, 24.5, false],
  [24.5, 25.0, 24.2, 24.8, true],

  // March 2025 (days 21-42) - dip to $22, then rally to $35
  [24.8, 25.2, 24.0, 24.2, false],
  [24.2, 24.5, 23.0, 23.2, false],
  [23.2, 23.8, 22.2, 22.5, false],
  [22.5, 23.0, 21.8, 22.8, true],
  [22.8, 23.5, 22.5, 23.2, true],
  [23.2, 24.0, 23.0, 23.8, true],
  [23.8, 24.5, 23.5, 24.2, true],
  [24.2, 25.0, 24.0, 24.8, true],
  [24.8, 26.0, 24.5, 25.8, true],
  [25.8, 27.0, 25.5, 26.8, true],
  [26.8, 28.0, 26.5, 27.5, true],
  [27.5, 28.5, 27.0, 28.2, true],
  [28.2, 29.5, 28.0, 29.0, true],
  [29.0, 30.0, 28.5, 29.5, true],
  [29.5, 31.0, 29.0, 30.5, true],
  [30.5, 32.0, 30.0, 31.5, true],
  [31.5, 33.0, 31.0, 32.5, true],
  [32.5, 34.0, 32.0, 33.5, true],
  [33.5, 35.0, 33.0, 34.5, true],
  [34.5, 36.0, 34.0, 35.5, true],
  [35.5, 36.5, 35.0, 35.8, true],
  [35.8, 36.5, 35.0, 35.2, false],

  // April 2025 (days 43-64) - sharp drop to $24, recovery
  [35.2, 35.8, 34.0, 34.2, false],
  [34.2, 34.8, 32.5, 32.8, false],
  [32.8, 33.5, 30.5, 31.0, false],
  [31.0, 31.5, 28.5, 29.0, false],
  [29.0, 29.5, 26.5, 27.0, false],
  [27.0, 27.5, 25.0, 25.5, false],
  [25.5, 26.0, 24.0, 24.5, false],
  [24.5, 25.5, 24.0, 25.2, true],
  [25.2, 26.5, 25.0, 26.2, true],
  [26.2, 27.5, 26.0, 27.0, true],
  [27.0, 28.0, 26.5, 27.5, true],
  [27.5, 28.5, 27.0, 28.0, true],
  [28.0, 29.0, 27.5, 28.5, true],
  [28.5, 29.5, 28.0, 29.0, true],
  [29.0, 30.5, 28.5, 30.0, true],
  [30.0, 31.0, 29.5, 30.5, true],
  [30.5, 32.0, 30.0, 31.5, true],
  [31.5, 33.0, 31.0, 32.5, true],
  [32.5, 33.5, 32.0, 33.0, true],
  [33.0, 34.0, 32.5, 33.5, true],
  [33.5, 34.5, 33.0, 34.0, true],
  [34.0, 35.0, 33.5, 34.5, true],

  // May 2025 (days 65-86) - consolidation $34-38
  [34.5, 35.5, 34.0, 35.0, true],
  [35.0, 36.0, 34.5, 35.5, true],
  [35.5, 36.5, 35.0, 36.0, true],
  [36.0, 37.0, 35.5, 36.5, true],
  [36.5, 37.5, 36.0, 37.0, true],
  [37.0, 38.0, 36.5, 37.5, true],
  [37.5, 38.0, 36.5, 37.0, false],
  [37.0, 37.5, 36.0, 36.5, false],
  [36.5, 37.0, 35.5, 36.0, false],
  [36.0, 36.5, 35.0, 35.5, false],
  [35.5, 36.5, 35.0, 36.2, true],
  [36.2, 37.0, 36.0, 36.8, true],
  [36.8, 37.5, 36.5, 37.2, true],
  [37.2, 38.0, 37.0, 37.5, true],
  [37.5, 38.0, 37.0, 37.2, false],
  [37.2, 37.8, 36.5, 36.8, false],
  [36.8, 37.5, 36.5, 37.2, true],
  [37.2, 38.0, 37.0, 37.8, true],
  [37.8, 38.5, 37.5, 38.0, true],
  [38.0, 38.5, 37.0, 37.5, false],
  [37.5, 38.0, 37.0, 37.8, true],
  [37.8, 38.5, 37.5, 38.2, true],

  // June 2025 (days 87-108) - rally begins $36 to $52
  [38.2, 39.5, 38.0, 39.2, true],
  [39.2, 40.5, 39.0, 40.2, true],
  [40.2, 41.5, 40.0, 41.0, true],
  [41.0, 42.5, 40.5, 42.0, true],
  [42.0, 43.5, 41.5, 43.0, true],
  [43.0, 44.5, 42.5, 44.0, true],
  [44.0, 45.0, 43.5, 44.5, true],
  [44.5, 45.5, 44.0, 45.0, true],
  [45.0, 46.5, 44.5, 46.0, true],
  [46.0, 47.5, 45.5, 47.0, true],
  [47.0, 48.0, 46.5, 47.5, true],
  [47.5, 48.5, 47.0, 48.0, true],
  [48.0, 49.0, 47.5, 48.5, true],
  [48.5, 50.0, 48.0, 49.5, true],
  [49.5, 51.0, 49.0, 50.5, true],
  [50.5, 52.0, 50.0, 51.5, true],
  [51.5, 52.5, 51.0, 52.0, true],
  [52.0, 53.0, 51.5, 52.5, true],
  [52.5, 53.5, 52.0, 53.0, true],
  [53.0, 54.0, 52.0, 52.5, false],
  [52.5, 53.0, 51.5, 52.0, false],
  [52.0, 53.0, 51.5, 52.8, true],

  // July 2025 (days 109-130) - continues up $52 to $64
  [52.8, 54.0, 52.5, 53.5, true],
  [53.5, 55.0, 53.0, 54.5, true],
  [54.5, 56.0, 54.0, 55.5, true],
  [55.5, 57.0, 55.0, 56.5, true],
  [56.5, 58.0, 56.0, 57.5, true],
  [57.5, 58.5, 57.0, 58.0, true],
  [58.0, 59.0, 57.5, 58.5, true],
  [58.5, 60.0, 58.0, 59.5, true],
  [59.5, 61.0, 59.0, 60.5, true],
  [60.5, 62.0, 60.0, 61.5, true],
  [61.5, 62.5, 61.0, 62.0, true],
  [62.0, 63.0, 61.5, 62.5, true],
  [62.5, 64.0, 62.0, 63.5, true],
  [63.5, 65.0, 63.0, 64.5, true],
  [64.5, 65.5, 64.0, 65.0, true],
  [65.0, 65.5, 63.5, 64.0, false],
  [64.0, 64.5, 62.5, 63.0, false],
  [63.0, 64.0, 62.5, 63.5, true],
  [63.5, 65.0, 63.0, 64.5, true],
  [64.5, 66.0, 64.0, 65.5, true],
  [65.5, 66.5, 65.0, 66.0, true],
  [66.0, 67.0, 65.5, 66.5, true],

  // August 2025 (days 131-152) - up to $78, pullback to $64, consolidate $68-72
  [66.5, 68.0, 66.0, 67.5, true],
  [67.5, 69.5, 67.0, 69.0, true],
  [69.0, 71.0, 68.5, 70.5, true],
  [70.5, 73.0, 70.0, 72.5, true],
  [72.5, 75.0, 72.0, 74.5, true],
  [74.5, 77.0, 74.0, 76.5, true],
  [76.5, 78.5, 76.0, 78.0, true],
  [78.0, 79.0, 76.5, 77.0, false],
  [77.0, 77.5, 74.0, 74.5, false],
  [74.5, 75.0, 71.5, 72.0, false],
  [72.0, 72.5, 69.0, 69.5, false],
  [69.5, 70.5, 67.5, 68.0, false],
  [68.0, 69.0, 66.0, 66.5, false],
  [66.5, 68.0, 65.5, 67.5, true],
  [67.5, 69.5, 67.0, 69.0, true],
  [69.0, 71.0, 68.5, 70.5, true],
  [70.5, 72.0, 70.0, 71.5, true],
  [71.5, 73.0, 71.0, 72.5, true],
  [72.5, 74.0, 72.0, 73.5, true],
  [73.5, 74.5, 72.5, 73.0, false],
  [73.0, 73.5, 71.0, 71.5, false],
  [71.5, 72.5, 70.5, 72.0, true],

  // September 2025 (days 153-174) - BIG rally $72 to $100+
  [72.0, 74.0, 71.5, 73.5, true],
  [73.5, 76.0, 73.0, 75.5, true],
  [75.5, 78.0, 75.0, 77.5, true],
  [77.5, 80.0, 77.0, 79.5, true],
  [79.5, 82.0, 79.0, 81.5, true],
  [81.5, 84.5, 81.0, 84.0, true],
  [84.0, 87.0, 83.5, 86.5, true],
  [86.5, 90.0, 86.0, 89.5, true],
  [89.5, 93.0, 89.0, 92.5, true],
  [92.5, 96.0, 92.0, 95.5, true],
  [95.5, 99.0, 95.0, 98.5, true],
  [98.5, 102.0, 98.0, 101.5, true],
  [101.5, 105.0, 101.0, 104.5, true],
  [104.5, 108.0, 104.0, 107.5, true],
  [107.5, 111.0, 107.0, 110.5, true],
  [110.5, 113.0, 110.0, 112.5, true],
  [112.5, 115.0, 112.0, 114.5, true],
  [114.5, 117.0, 114.0, 116.5, true],
  [116.5, 119.0, 116.0, 118.5, true],
  [118.5, 121.0, 118.0, 120.5, true],
  [120.5, 122.0, 119.5, 121.5, true],
  [121.5, 124.0, 121.0, 123.5, true],

  // October 2025 (days 175-196) - SPIKE to $142-148, crash, A-B structure
  [123.5, 127.0, 123.0, 126.5, true],
  [126.5, 130.0, 126.0, 129.5, true],
  [129.5, 133.0, 129.0, 132.5, true],
  [132.5, 136.0, 132.0, 135.5, true],
  [135.5, 140.0, 135.0, 139.5, true],
  [139.5, 144.0, 139.0, 143.5, true],
  [143.5, 148.0, 143.0, 147.0, true],
  [147.0, 148.5, 145.0, 145.5, false],
  [145.5, 146.0, 140.0, 141.0, false],
  [141.0, 142.0, 135.0, 136.0, false],
  [136.0, 137.0, 130.0, 131.0, false],
  [131.0, 132.0, 125.0, 126.0, false],
  [126.0, 127.0, 120.0, 121.0, false],
  [121.0, 122.0, 115.0, 116.0, false],
  [116.0, 117.0, 110.0, 111.0, false],
  [111.0, 112.0, 105.0, 106.0, false],
  [106.0, 107.0, 100.0, 101.0, false],
  [101.0, 102.0, 95.0, 96.0, false],
  [96.0, 100.0, 95.5, 99.5, true],
  [99.5, 105.0, 99.0, 104.5, true],
  [104.5, 112.0, 104.0, 111.5, true],
  [111.5, 120.0, 111.0, 119.5, true],

  // November 2025 (days 197-218) - Wave B peak to $134, then down
  [119.5, 126.0, 119.0, 125.5, true],
  [125.5, 132.0, 125.0, 131.5, true],
  [131.5, 135.0, 131.0, 134.5, true],
  [134.5, 136.0, 132.0, 132.5, false],
  [132.5, 133.0, 127.0, 128.0, false],
  [128.0, 129.0, 123.0, 124.0, false],
  [124.0, 125.0, 118.0, 119.0, false],
  [119.0, 120.0, 113.0, 114.0, false],
  [114.0, 116.0, 110.0, 115.5, true],
  [115.5, 118.0, 114.0, 117.0, true],
  [117.0, 119.0, 115.0, 116.0, false],
  [116.0, 117.0, 111.0, 112.0, false],
  [112.0, 114.0, 108.0, 113.5, true],
  [113.5, 116.0, 112.0, 115.0, true],
  [115.0, 117.0, 113.0, 114.0, false],
  [114.0, 115.0, 108.0, 109.0, false],
  [109.0, 110.0, 103.0, 104.0, false],
  [104.0, 106.0, 100.0, 105.5, true],
  [105.5, 108.0, 104.0, 107.0, true],
  [107.0, 109.0, 105.0, 106.0, false],
  [106.0, 107.0, 100.0, 101.0, false],
  [101.0, 102.0, 95.0, 96.0, false],

  // December 2025 (days 219-240) - Drop to $78 (Wave 2 low), then recovery
  [96.0, 97.0, 91.0, 92.0, false],
  [92.0, 93.0, 87.0, 88.0, false],
  [88.0, 90.0, 85.0, 89.5, true],
  [89.5, 92.0, 88.0, 91.0, true],
  [91.0, 93.0, 89.0, 90.0, false],
  [90.0, 91.0, 85.0, 86.0, false],
  [86.0, 87.0, 82.0, 83.0, false],
  [83.0, 84.0, 79.0, 80.0, false],
  [80.0, 81.0, 77.0, 78.0, false],
  [78.0, 80.0, 77.5, 79.5, true],
  [79.5, 82.0, 79.0, 81.5, true],
  [81.5, 84.0, 81.0, 83.5, true],
  [83.5, 86.0, 83.0, 85.5, true],
  [85.5, 88.0, 85.0, 87.5, true],
  [87.5, 90.0, 87.0, 89.5, true],
  [89.5, 91.0, 88.0, 88.5, false],
  [88.5, 89.0, 85.0, 86.0, false],
  [86.0, 88.0, 85.5, 87.5, true],
  [87.5, 90.0, 87.0, 89.5, true],
  [89.5, 92.0, 89.0, 91.5, true],
  [91.5, 94.0, 91.0, 93.5, true],
  [93.5, 96.0, 93.0, 95.5, true],

  // January 2026 (days 241-262) - Recovery to current $106.48
  [95.5, 98.0, 95.0, 97.5, true],
  [97.5, 100.0, 97.0, 99.5, true],
  [99.5, 102.0, 99.0, 101.5, true],
  [101.5, 104.0, 101.0, 103.5, true],
  [103.5, 106.0, 103.0, 105.5, true],
  [105.5, 108.0, 105.0, 107.5, true],
  [107.5, 110.0, 107.0, 109.5, true],
  [109.5, 112.0, 109.0, 111.5, true],
  [111.5, 114.0, 111.0, 113.5, true],
  [113.5, 115.0, 111.0, 111.5, false],
  [111.5, 112.0, 107.0, 108.0, false],
  [108.0, 109.0, 104.0, 105.0, false],
  [105.0, 107.0, 103.0, 106.5, true],
  [106.5, 109.0, 106.0, 108.5, true],
  [108.5, 110.0, 107.0, 107.5, false],
  [107.5, 108.0, 103.0, 104.0, false],
  [104.0, 106.0, 103.5, 105.5, true],
  [105.5, 108.0, 105.0, 107.5, true],
  [107.5, 109.0, 106.0, 106.5, false],
  [106.5, 107.0, 102.0, 103.0, false],
  [103.0, 105.0, 102.5, 104.5, true],
  [104.5, 107.0, 104.0, 106.48, true],
];

// Volume data matching the chart patterns (relative values)
const VOLUME_DATA = [
  // Feb - lower volume
  8, 7, 9, 8, 7, 6, 8, 9, 7, 8, 9, 7, 8, 9, 10, 9, 8, 7, 8, 9,
  // Mar - increasing on rally
  8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24, 25, 26, 27, 25, 23, 21, 19,
  17, 16,
  // Apr - spike on drop, then normal
  25, 28, 32, 35, 30, 25, 22, 18, 16, 15, 14, 13, 12, 11, 12, 13, 14, 15, 14,
  13, 12, 11,
  // May - low volume consolidation
  9, 8, 9, 10, 9, 8, 7, 8, 9, 8, 9, 10, 9, 8, 7, 8, 9, 10, 11, 10, 9, 10,
  // Jun - building volume on rally
  12, 14, 16, 18, 20, 22, 21, 20, 22, 24, 23, 22, 24, 26, 28, 30, 28, 26, 25,
  22, 20, 21,
  // Jul - steady volume
  18, 20, 22, 24, 23, 22, 21, 23, 25, 24, 22, 21, 23, 25, 24, 20, 18, 19, 21,
  23, 22, 21,
  // Aug - volatile volume
  22, 25, 28, 32, 35, 38, 40, 35, 30, 28, 25, 22, 20, 22, 25, 28, 26, 24, 23,
  20, 18, 19,
  // Sep - high volume rally
  25, 30, 35, 40, 45, 50, 55, 60, 58, 55, 52, 50, 48, 46, 44, 42, 40, 38, 36,
  34, 32, 30,
  // Oct - MASSIVE volume on spike and crash
  45, 55, 65, 75, 85, 100, 120, 95, 85, 75, 65, 55, 50, 48, 45, 42, 40, 38, 45,
  52, 60, 68,
  // Nov - high volatility volume
  55, 65, 70, 60, 55, 50, 45, 42, 45, 48, 44, 40, 42, 45, 42, 38, 35, 38, 42,
  38, 35, 32,
  // Dec - moderate volume
  35, 32, 34, 36, 33, 30, 28, 25, 22, 25, 28, 32, 35, 38, 40, 35, 32, 34, 38,
  42, 45, 48,
  // Jan - recovering volume
  40, 42, 45, 48, 50, 52, 55, 58, 60, 55, 50, 45, 48, 52, 48, 44, 46, 50, 48,
  44, 46, 50,
];

const CHART_WIDTH = 960;
const CHART_HEIGHT = 520;
const PADDING = { top: 50, right: 75, bottom: 70, left: 50 };
const CHART_AREA_WIDTH = CHART_WIDTH - PADDING.left - PADDING.right;
const CHART_AREA_HEIGHT = CHART_HEIGHT - PADDING.top - PADDING.bottom;

const PRICE_MIN = 18;
const PRICE_MAX = 155;

const priceToY = (price) =>
  PADDING.top +
  ((PRICE_MAX - price) / (PRICE_MAX - PRICE_MIN)) * CHART_AREA_HEIGHT;
const indexToX = (index, total) =>
  PADDING.left + ((index + 0.5) / total) * CHART_AREA_WIDTH;

// Calculate SMA from candle data
const calculateSMA = (period) => {
  const result = [];
  for (let i = 0; i < CANDLE_DATA.length; i++) {
    if (i < period - 1) {
      result.push(null);
    } else {
      const sum = CANDLE_DATA.slice(i - period + 1, i + 1).reduce(
        (acc, c) => acc + c[3],
        0,
      );
      result.push(sum / period);
    }
  }
  return result;
};

export default function ElliottWaveChart() {
  const [showWaves, setShowWaves] = useState(true);
  const [showFibRet, setShowFibRet] = useState(true);
  const [showFibExt, setShowFibExt] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [showMAs, setShowMAs] = useState(true);
  const [showVolume, setShowVolume] = useState(true);

  const totalCandles = CANDLE_DATA.length;
  const extendedTotal = totalCandles + 30; // Room for projections
  const candleWidth = Math.max(2.5, (CHART_AREA_WIDTH / extendedTotal) * 0.72);
  const wickWidth = 1;

  const ma50 = calculateSMA(50);
  const ma200 = calculateSMA(120); // Scaled for visible data

  // Wave coordinates based on actual data positions
  const wave1Start = { x: indexToX(87, extendedTotal), y: priceToY(38) }; // June start ~$38
  const wave1Peak = { x: indexToX(181, extendedTotal), y: priceToY(147) }; // Oct peak ~$147
  const waveALow = { x: indexToX(193, extendedTotal), y: priceToY(96) }; // Oct low ~$96
  const waveBPeak = { x: indexToX(200, extendedTotal), y: priceToY(134) }; // Nov peak ~$134
  const wave2Low = { x: indexToX(228, extendedTotal), y: priceToY(78) }; // Dec low ~$78
  const current = {
    x: indexToX(totalCandles - 1, extendedTotal),
    y: priceToY(106.48),
  };
  const projected = {
    x: indexToX(totalCandles + 25, extendedTotal),
    y: priceToY(122),
  };

  return (
    <div
      style={{
        backgroundColor: COLORS.background,
        padding: "16px",
        fontFamily: "'Trebuchet MS', 'Inter', system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "10px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "4px",
          }}
        >
          <span
            style={{ color: COLORS.text, fontSize: "14px", fontWeight: 600 }}
          >
            Nebius Group N.V. · 1D · NASDAQ
          </span>
          <span style={{ color: "#26a69a", fontSize: "12px" }}>
            O 103.91 H 110.50 L 100.71 C 106.48 +2.07 (+1.98%)
          </span>
        </div>
        <div style={{ display: "flex", gap: "16px", fontSize: "11px" }}>
          <span style={{ color: COLORS.ma50 }}>SMAs 50 close: 94.59</span>
          <span style={{ color: COLORS.ma200 }}>200 close: 71.56</span>
        </div>
      </div>

      {/* Controls */}
      <div
        style={{
          display: "flex",
          gap: "6px",
          marginBottom: "10px",
          flexWrap: "wrap",
        }}
      >
        {[
          { label: "Waves", state: showWaves, setter: setShowWaves },
          { label: "Labels", state: showLabels, setter: setShowLabels },
          { label: "Fib Ret.", state: showFibRet, setter: setShowFibRet },
          { label: "Fib Ext.", state: showFibExt, setter: setShowFibExt },
          { label: "MAs", state: showMAs, setter: setShowMAs },
          { label: "Volume", state: showVolume, setter: setShowVolume },
        ].map(({ label, state, setter }) => (
          <button
            key={label}
            onClick={() => setter(!state)}
            style={{
              background: state ? `${COLORS.teal}22` : "transparent",
              border: `1px solid ${state ? COLORS.teal : "#363a45"}`,
              color: state ? COLORS.teal : "#787b86",
              padding: "4px 10px",
              borderRadius: "3px",
              fontSize: "10px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Chart SVG */}
      <svg
        width={CHART_WIDTH}
        height={CHART_HEIGHT + (showVolume ? 70 : 0)}
        style={{ backgroundColor: COLORS.cardBg, borderRadius: "4px" }}
      >
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Price Grid */}
        {[20, 40, 60, 80, 100, 120, 140].map((price) => {
          const y = priceToY(price);
          return (
            <g key={price}>
              <line
                x1={PADDING.left}
                y1={y}
                x2={CHART_WIDTH - PADDING.right}
                y2={y}
                stroke={COLORS.grid}
                strokeWidth={0.5}
              />
              <text
                x={CHART_WIDTH - PADDING.right + 8}
                y={y + 4}
                fill={COLORS.textMuted}
                fontSize={10}
              >
                {price}.00
              </text>
            </g>
          );
        })}

        {/* Time axis */}
        {[
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
          "2026",
          "Feb",
        ].map((m, i) => (
          <text
            key={m + i}
            x={PADDING.left + (i * CHART_AREA_WIDTH) / 12}
            y={CHART_HEIGHT - PADDING.bottom + 18}
            fill={COLORS.textMuted}
            fontSize={10}
            textAnchor="middle"
          >
            {m}
          </text>
        ))}

        {/* Volume bars */}
        {showVolume &&
          VOLUME_DATA.slice(0, totalCandles).map((vol, i) => {
            const x = indexToX(i, extendedTotal);
            const maxVol = Math.max(...VOLUME_DATA);
            const h = (vol / maxVol) * 55;
            const candle = CANDLE_DATA[i];
            const isGreen = candle[4];
            return (
              <rect
                key={`vol-${i}`}
                x={x - candleWidth / 2}
                y={CHART_HEIGHT - PADDING.bottom + 25 + (55 - h)}
                width={candleWidth}
                height={h}
                fill={isGreen ? COLORS.greenCandle : COLORS.redCandle}
                opacity={0.5}
              />
            );
          })}

        {/* Moving Averages */}
        {showMAs && (
          <>
            {/* 50-MA (blue) */}
            <path
              d={CANDLE_DATA.map((_, i) => {
                if (ma50[i] === null) return "";
                const x = indexToX(i, extendedTotal);
                const y = priceToY(ma50[i]);
                return `${ma50[i - 1] === null ? "M" : "L"} ${x} ${y}`;
              }).join(" ")}
              fill="none"
              stroke={COLORS.ma50}
              strokeWidth={1.5}
              opacity={0.9}
            />
          </>
        )}

        {/* Candlesticks */}
        {CANDLE_DATA.map((candle, i) => {
          const [open, high, low, close, isGreen] = candle;
          const x = indexToX(i, extendedTotal);
          const bodyTop = priceToY(Math.max(open, close));
          const bodyBottom = priceToY(Math.min(open, close));
          const bodyHeight = Math.max(1, bodyBottom - bodyTop);

          return (
            <g key={`candle-${i}`}>
              {/* Wick */}
              <line
                x1={x}
                y1={priceToY(high)}
                x2={x}
                y2={priceToY(low)}
                stroke={isGreen ? COLORS.greenCandle : COLORS.redCandle}
                strokeWidth={wickWidth}
              />
              {/* Body */}
              <rect
                x={x - candleWidth / 2}
                y={bodyTop}
                width={candleWidth}
                height={bodyHeight}
                fill={isGreen ? COLORS.greenCandle : COLORS.redCandle}
              />
            </g>
          );
        })}

        {/* Fibonacci Retracement */}
        {showFibRet && (
          <>
            <line
              x1={PADDING.left}
              y1={priceToY(147)}
              x2={CHART_WIDTH - PADDING.right}
              y2={priceToY(147)}
              stroke={COLORS.teal}
              strokeWidth={1}
              strokeDasharray="6,3"
              opacity={0.6}
            />
            <line
              x1={PADDING.left}
              y1={priceToY(78)}
              x2={CHART_WIDTH - PADDING.right}
              y2={priceToY(78)}
              stroke={COLORS.teal}
              strokeWidth={1.5}
              strokeDasharray="6,3"
              opacity={0.7}
            />
            <text
              x={CHART_WIDTH - PADDING.right - 180}
              y={priceToY(78) - 5}
              fill={COLORS.teal}
              fontSize={10}
              fontWeight={500}
            >
              Wave 2 Low (0.618 Fib Support)
            </text>
          </>
        )}

        {/* Fibonacci Extensions */}
        {showFibExt && (
          <>
            <line
              x1={PADDING.left}
              y1={priceToY(143)}
              x2={CHART_WIDTH - PADDING.right}
              y2={priceToY(143)}
              stroke={COLORS.cyan}
              strokeWidth={1}
              strokeDasharray="5,3"
              opacity={0.55}
            />
            <text
              x={CHART_WIDTH - PADDING.right - 70}
              y={priceToY(143) - 5}
              fill={COLORS.cyan}
              fontSize={9}
              fontWeight={500}
            >
              Target: $143
            </text>
            <line
              x1={PADDING.left}
              y1={priceToY(160)}
              x2={CHART_WIDTH - PADDING.right}
              y2={priceToY(160)}
              stroke={COLORS.cyan}
              strokeWidth={1}
              strokeDasharray="5,3"
              opacity={0.45}
            />
            <text
              x={CHART_WIDTH - PADDING.right - 70}
              y={priceToY(160) - 5}
              fill={COLORS.cyan}
              fontSize={9}
              fontWeight={500}
            >
              Wave 3 Ext
            </text>
          </>
        )}

        {/* Elliott Wave Lines */}
        {showWaves && (
          <g filter="url(#glow)">
            {/* Motive: Start to Wave 1 Peak (teal) */}
            <line
              x1={wave1Start.x}
              y1={wave1Start.y}
              x2={wave1Peak.x}
              y2={wave1Peak.y}
              stroke={COLORS.teal}
              strokeWidth={2}
              opacity={0.7}
            />

            {/* Corrective A: Peak to A Low (coral) */}
            <line
              x1={wave1Peak.x}
              y1={wave1Peak.y}
              x2={waveALow.x}
              y2={waveALow.y}
              stroke={COLORS.coral}
              strokeWidth={2}
              opacity={0.6}
            />

            {/* Corrective B: A Low to B Peak (coral) */}
            <line
              x1={waveALow.x}
              y1={waveALow.y}
              x2={waveBPeak.x}
              y2={waveBPeak.y}
              stroke={COLORS.coral}
              strokeWidth={2}
              opacity={0.6}
            />

            {/* Corrective C: B Peak to Wave 2 Low (coral) */}
            <line
              x1={waveBPeak.x}
              y1={waveBPeak.y}
              x2={wave2Low.x}
              y2={wave2Low.y}
              stroke={COLORS.coral}
              strokeWidth={2}
              opacity={0.6}
            />

            {/* New Impulse: Wave 2 Low to Current (teal solid) */}
            <line
              x1={wave2Low.x}
              y1={wave2Low.y}
              x2={current.x}
              y2={current.y}
              stroke={COLORS.teal}
              strokeWidth={2}
              opacity={0.7}
            />

            {/* Projected: Current to Target (teal dashed) */}
            <line
              x1={current.x}
              y1={current.y}
              x2={projected.x}
              y2={projected.y}
              stroke={COLORS.teal}
              strokeWidth={1.5}
              strokeDasharray="8,4"
              opacity={0.5}
            />
          </g>
        )}

        {/* Wave Labels */}
        {showLabels && (
          <g>
            {/* Wave ① at peak */}
            <g transform={`translate(${wave1Peak.x}, ${wave1Peak.y - 16})`}>
              <circle r={10} fill={COLORS.teal} opacity={0.2} />
              <text
                textAnchor="middle"
                dy={4}
                fill={COLORS.teal}
                fontSize={11}
                fontWeight={600}
              >
                ①
              </text>
            </g>
            <text
              x={wave1Peak.x + 12}
              y={wave1Peak.y - 22}
              fill={COLORS.text}
              fontSize={9}
            >
              142.00
            </text>

            {/* Wave A */}
            <text
              x={waveALow.x}
              y={waveALow.y + 16}
              textAnchor="middle"
              fill={COLORS.coral}
              fontSize={11}
              fontWeight={600}
            >
              A
            </text>

            {/* Wave B */}
            <text
              x={waveBPeak.x}
              y={waveBPeak.y - 12}
              textAnchor="middle"
              fill={COLORS.coral}
              fontSize={11}
              fontWeight={600}
            >
              B
            </text>

            {/* Wave ② at low */}
            <g transform={`translate(${wave2Low.x}, ${wave2Low.y + 20})`}>
              <circle r={10} fill={COLORS.teal} opacity={0.2} />
              <text
                textAnchor="middle"
                dy={4}
                fill={COLORS.teal}
                fontSize={11}
                fontWeight={600}
              >
                ②
              </text>
            </g>

            {/* Wave (3) Start label */}
            <g transform={`translate(${current.x + 35}, ${current.y - 12})`}>
              <rect
                x={-32}
                y={-8}
                width={70}
                height={16}
                fill={COLORS.cardBg}
                stroke={COLORS.teal}
                rx={3}
                opacity={0.9}
              />
              <text
                textAnchor="middle"
                x={3}
                dy={4}
                fill={COLORS.teal}
                fontSize={9}
                fontWeight={500}
              >
                Wave (3) Start
              </text>
            </g>

            {/* Projected Wave 1 */}
            <text
              x={projected.x}
              y={projected.y - 12}
              textAnchor="middle"
              fill={COLORS.cyan}
              fontSize={11}
              fontWeight={600}
            >
              1
            </text>
            <text
              x={projected.x + 20}
              y={projected.y - 8}
              fill={COLORS.textMuted}
              fontSize={9}
            >
              $122.00
            </text>

            {/* Current price tag */}
            <g
              transform={`translate(${CHART_WIDTH - PADDING.right + 2}, ${priceToY(106.48)})`}
            >
              <rect
                y={-8}
                width={48}
                height={16}
                fill={COLORS.greenCandle}
                rx={2}
              />
              <text
                x={24}
                textAnchor="middle"
                dy={4}
                fill="#fff"
                fontSize={9}
                fontWeight={600}
              >
                106.48
              </text>
            </g>
          </g>
        )}

        {/* Chart title */}
        <text
          x={PADDING.left}
          y={24}
          fill={COLORS.text}
          fontSize={11}
          fontWeight={500}
        >
          NBIS Elliott Wave · Impulse Wave (3) Developing
        </text>

        {/* Legend */}
        <g transform={`translate(${CHART_WIDTH - 175}, ${24})`}>
          <rect
            x={-8}
            y={-12}
            width={155}
            height={62}
            fill="rgba(19,23,34,0.9)"
            stroke={COLORS.teal}
            strokeWidth={0.5}
            rx={3}
          />
          {[
            { c: COLORS.teal, l: "Motive (1-2-3-4-5)", d: false },
            { c: COLORS.coral, l: "Corrective (A-B-C)", d: false },
            { c: COLORS.teal, l: "Fib Retracement", d: true },
            { c: COLORS.cyan, l: "Fib Extension", d: true },
          ].map((it, i) => (
            <g key={i} transform={`translate(0, ${i * 13})`}>
              <line
                x1={0}
                y1={0}
                x2={16}
                y2={0}
                stroke={it.c}
                strokeWidth={1.5}
                strokeDasharray={it.d ? "3,2" : "none"}
              />
              <text x={20} dy={3} fill={COLORS.textMuted} fontSize={8}>
                {it.l}
              </text>
            </g>
          ))}
        </g>
      </svg>

      {/* Summary */}
      <div
        style={{
          marginTop: "12px",
          padding: "10px 14px",
          backgroundColor: COLORS.cardBg,
          borderRadius: "4px",
          borderLeft: `3px solid ${COLORS.teal}`,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
            fontSize: "10px",
            color: COLORS.textMuted,
          }}
        >
          <div>
            <div
              style={{
                color: COLORS.text,
                fontWeight: 500,
                marginBottom: "4px",
              }}
            >
              Completed
            </div>
            <div>• Wave ① Peak: $142 (Oct 2025)</div>
            <div>• Wave ② Low: $78 (Dec 2025)</div>
          </div>
          <div>
            <div
              style={{
                color: COLORS.text,
                fontWeight: 500,
                marginBottom: "4px",
              }}
            >
              Current
            </div>
            <div>• Wave (3) in development</div>
            <div>• Support: 50-MA at $94.59</div>
          </div>
          <div>
            <div
              style={{
                color: COLORS.text,
                fontWeight: 500,
                marginBottom: "4px",
              }}
            >
              Targets
            </div>
            <div>• $143 (1.0x extension)</div>
            <div>• $160+ (Wave 3 Ext)</div>
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: "8px",
          display: "flex",
          justifyContent: "space-between",
          fontSize: "9px",
          color: COLORS.textMuted,
        }}
      >
        <span>Jan 20, 2026 · Educational purposes only</span>
        <span style={{ color: COLORS.teal }}>PortDive Analytics</span>
      </div>
    </div>
  );
}
