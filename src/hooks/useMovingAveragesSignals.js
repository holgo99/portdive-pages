// src/hooks/useMovingAveragesSignals.js
/**
 * Moving Averages Signals Context and Hook
 *
 * Provides computed MA crossover signals (Golden Cross, Death Cross, Alignment)
 * to child components. Consumes OHLCV data from OHLCVDataProvider.
 *
 * @example
 * // In TickerLayout (wrap inside OHLCVDataProvider):
 * <TickerConfigProvider config={nbisConfig}>
 *   <OHLCVDataProvider ticker="NBIS" timeframe="1D">
 *     <MovingAveragesSignalsProvider daysToShow={60}>
 *       <MovingAveragesDashboard />
 *       <AIMovingAveragesSignalsResolver />
 *     </MovingAveragesSignalsProvider>
 *   </OHLCVDataProvider>
 * </TickerConfigProvider>
 *
 * // In child component:
 * const { smaSignal, emaSignal, recentData } = useMovingAveragesSignals();
 */

import { createContext, useContext, useMemo } from "react";
import { useOHLCVData } from "./useOHLCVData";

// ============================================================================
// SIGNAL DETECTION UTILITIES
// ============================================================================

/**
 * Signal type definitions for crossover detection
 */
export const SIGNAL_TYPES = {
  GOLDEN_CROSS: {
    type: "GOLDEN_CROSS",
    label: "Golden Cross",
    description: "50 MA crossed above 200 MA - Bullish signal",
    color: "teal",
  },
  DEATH_CROSS: {
    type: "DEATH_CROSS",
    label: "Death Cross",
    description: "50 MA crossed below 200 MA - Bearish signal",
    color: "coral",
  },
  BULLISH_ALIGNMENT: {
    type: "BULLISH_ALIGNMENT",
    label: "Bullish Alignment",
    description: "50 MA above 200 MA - Uptrend intact",
    color: "teal",
  },
  BEARISH_ALIGNMENT: {
    type: "BEARISH_ALIGNMENT",
    label: "Bearish Alignment",
    description: "50 MA below 200 MA - Downtrend intact",
    color: "coral",
  },
};

/**
 * Check for Golden Cross / Death Cross or current alignment
 *
 * Golden Cross: Short-term MA (50) crosses above long-term MA (200)
 * Death Cross: Short-term MA (50) crosses below long-term MA (200)
 *
 * @param {Array} data - OHLCV data array with MA values
 * @param {string} ma50Key - Key for 50-period MA (e.g., "50_MA" or "50_EMA")
 * @param {string} ma200Key - Key for 200-period MA (e.g., "200_MA" or "200_EMA")
 * @returns {Object|null} Signal object or null if insufficient data
 */
export function checkGoldenCross(data, ma50Key, ma200Key) {
  if (!data || data.length < 2) return null;

  const latest = data[data.length - 1];
  const previous = data[data.length - 2];

  const latestMA50 = latest?.[ma50Key];
  const latestMA200 = latest?.[ma200Key];
  const prevMA50 = previous?.[ma50Key];
  const prevMA200 = previous?.[ma200Key];

  if (
    latestMA50 == null ||
    latestMA200 == null ||
    prevMA50 == null ||
    prevMA200 == null
  ) {
    return null;
  }

  // Golden Cross: 50 MA crosses above 200 MA
  if (prevMA50 <= prevMA200 && latestMA50 > latestMA200) {
    return { ...SIGNAL_TYPES.GOLDEN_CROSS };
  }

  // Death Cross: 50 MA crosses below 200 MA
  if (prevMA50 >= prevMA200 && latestMA50 < latestMA200) {
    return { ...SIGNAL_TYPES.DEATH_CROSS };
  }

  // Check current position (alignment, no crossover)
  if (latestMA50 > latestMA200) {
    return { ...SIGNAL_TYPES.BULLISH_ALIGNMENT };
  }

  return { ...SIGNAL_TYPES.BEARISH_ALIGNMENT };
}

// ============================================================================
// CONTEXT
// ============================================================================

const defaultSignalsContext = {
  smaSignal: null,
  emaSignal: null,
  recentData: [],
  latestData: null,
  daysToShow: 60,
  isLoading: true,
};

const MovingAveragesSignalsContext = createContext(null);

// ============================================================================
// PROVIDER
// ============================================================================

/**
 * Provider component for Moving Averages Signals
 *
 * Must be wrapped inside OHLCVDataProvider to access OHLCV data.
 *
 * @param {Object} props
 * @param {number} [props.daysToShow=60] - Number of recent days to analyze
 * @param {React.ReactNode} props.children - Child components
 */
export function MovingAveragesSignalsProvider({ daysToShow = 60, children }) {
  const ohlcvContext = useOHLCVData();
  const { data } = ohlcvContext;

  const contextValue = useMemo(() => {
    // Handle no data case
    if (!data || data.length === 0) {
      return {
        smaSignal: null,
        emaSignal: null,
        recentData: [],
        latestData: null,
        daysToShow,
        isLoading: !ohlcvContext.error, // Loading if no error
      };
    }

    // Get recent data slice
    const recentData = data.slice(-daysToShow);
    const latestData = data[data.length - 1];

    // Compute crossover signals
    const smaSignal = checkGoldenCross(recentData, "50_MA", "200_MA");
    const emaSignal = checkGoldenCross(recentData, "50_EMA", "200_EMA");

    return {
      smaSignal,
      emaSignal,
      recentData,
      latestData,
      daysToShow,
      isLoading: false,
    };
  }, [data, daysToShow, ohlcvContext.error]);

  return (
    <MovingAveragesSignalsContext.Provider value={contextValue}>
      {children}
    </MovingAveragesSignalsContext.Provider>
  );
}

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Hook to access Moving Averages Signals from context
 *
 * Returns null if used outside of MovingAveragesSignalsProvider.
 * This allows components to fall back to props when no provider is present.
 *
 * @returns {Object|null} Signals context or null if outside provider
 */
export function useMovingAveragesSignals() {
  return useContext(MovingAveragesSignalsContext);
}

/**
 * Hook to access Moving Averages Signals with required provider
 *
 * Throws an error if used outside of MovingAveragesSignalsProvider.
 * Use this when the provider is required for the component to function.
 *
 * @returns {Object} Signals context
 * @throws {Error} If used outside of MovingAveragesSignalsProvider
 */
export function useMovingAveragesSignalsRequired() {
  const context = useContext(MovingAveragesSignalsContext);

  if (context === null) {
    throw new Error(
      "useMovingAveragesSignalsRequired must be used within a MovingAveragesSignalsProvider. " +
        "Wrap your component tree with <MovingAveragesSignalsProvider>."
    );
  }

  return context;
}

export default MovingAveragesSignalsProvider;
