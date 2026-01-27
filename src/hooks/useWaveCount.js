// src/hooks/useWaveCount.js
/**
 * Hook and Context for wave count scenario selection
 * Self-contained state management with URL hash sync
 * Supports sharing via URL anchors (e.g., #wave-alt1)
 *
 * @example
 * // Wrap your component tree with the provider:
 * <WaveCountProvider>
 *   <WaveCountSelector />
 *   <WaveCountChartOverlay />
 * </WaveCountProvider>
 *
 * // Then consume in any child component:
 * const { activeId, activeScenario, switchScenario } = useWaveCount();
 */

import {
  useState,
  useCallback,
  useMemo,
  useEffect,
  createContext,
  useContext,
} from "react";
import waveCountData from "@site/data/wave-counts/nbis-wave-counts.json";
import { PORTDIVE_THEME } from "@site/src/components/PortDiveTheme";

// Hash prefix for wave count URLs
const HASH_PREFIX = "wave-";

// Resolve color references to actual values
const resolveColor = (colorRef) => {
  if (!colorRef) return PORTDIVE_THEME.primary;
  if (colorRef.startsWith("PORTDIVE_THEME.")) {
    const key = colorRef.replace("PORTDIVE_THEME.", "");
    return PORTDIVE_THEME[key] || colorRef;
  }
  return colorRef;
};

// Prepare scenario data for display
const prepareScenario = (scenario) => {
  if (!scenario) return null;
  return {
    ...scenario,
    color: resolveColor(scenario.color),
    displayMode: scenario.mode === "MOTIVE" ? "Bullish" : "Corrective",
    probabilityPercent: parseFloat(scenario.probability),
  };
};

// Parse scenario ID from URL hash
const getScenarioFromHash = () => {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash.slice(1); // Remove #
  if (hash.startsWith(HASH_PREFIX)) {
    const scenarioId = hash.slice(HASH_PREFIX.length);
    return waveCountData[scenarioId] ? scenarioId : null;
  }
  return null;
};

// Update URL hash without triggering navigation
const updateHash = (scenarioId) => {
  if (typeof window === "undefined") return;
  const newHash = `#${HASH_PREFIX}${scenarioId}`;
  if (window.location.hash !== newHash) {
    window.history.replaceState(null, "", newHash);
  }
};

// ============================================================================
// CONTEXT
// ============================================================================
const WaveCountContext = createContext(null);

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================
export function WaveCountProvider({ children, defaultId = "primary" }) {
  // Initialize from URL hash if present, otherwise use default
  const [activeId, setActiveId] = useState(() => {
    return getScenarioFromHash() || defaultId;
  });

  const [analysisState, setAnalysisState] = useState({
    showMotiveWaves: true,
    showCorrectiveWaves: true,
    showMinorWaves: true,
    showFibRetracements: false,
    showFibExtensions: true,
    showInvalidationLevel: true,
    showTargetBand: true,
  });

  // Sync URL hash on mount and listen for hash changes
  useEffect(() => {
    // Update hash on initial mount if not already set
    if (!window.location.hash) {
      updateHash(activeId);
    }

    // Handle browser back/forward navigation
    const handleHashChange = () => {
      const scenarioId = getScenarioFromHash();
      if (scenarioId && scenarioId !== activeId) {
        setActiveId(scenarioId);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [activeId]);

  // Prepare all scenarios once
  const items = useMemo(() => {
    return Object.values(waveCountData).map(prepareScenario);
  }, []);

  // Get active scenario
  const activeScenario = useMemo(() => {
    const scenario = waveCountData[activeId];
    return prepareScenario(scenario);
  }, [activeId]);

  // Switch scenario and update URL hash
  const switchScenario = useCallback((scenarioId) => {
    if (waveCountData[scenarioId]) {
      setActiveId(scenarioId);
      updateHash(scenarioId);
    } else {
      console.warn(`Invalid scenario ID: ${scenarioId}`);
    }
  }, []);

  // Toggle analysis state
  const toggleAnalysis = useCallback((key) => {
    setAnalysisState((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const contextValue = useMemo(
    () => ({
      activeId,
      activeScenario,
      items,
      switchScenario,
      analysisState,
      toggleAnalysis,
      isLoading: false,
      error: null,
    }),
    [activeId, activeScenario, items, switchScenario, analysisState, toggleAnalysis],
  );

  return (
    <WaveCountContext.Provider value={contextValue}>
      {children}
    </WaveCountContext.Provider>
  );
}

// ============================================================================
// HOOK
// ============================================================================
/**
 * Hook for accessing wave count context
 * Must be used within a WaveCountProvider
 *
 * @returns {Object} - { activeId, activeScenario, items, switchScenario, analysisState, toggleAnalysis }
 */
export const useWaveCount = () => {
  const context = useContext(WaveCountContext);

  if (!context) {
    throw new Error(
      "useWaveCount must be used within a WaveCountProvider. " +
        "Wrap your component tree with <WaveCountProvider>.",
    );
  }

  return context;
};
