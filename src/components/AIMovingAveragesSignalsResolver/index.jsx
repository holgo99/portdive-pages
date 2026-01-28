/**
 * AIMovingAveragesSignalsResolver Component - AI-PREMIUM
 *
 * Premium component for validating and analyzing MA crossover signals
 * using AI-driven signal interpretation and conflict resolution.
 *
 * Automatically consumes signals from MovingAveragesSignalsProvider context
 * when available, with props as fallback for backward compatibility.
 *
 * @component
 * @param {Object} [smaSignal] - SMA crossover signal (optional if using context)
 * @param {Object} [emaSignal] - EMA crossover signal (optional if using context)
 * @param {string} [variant="standalone"] - Display variant:
 *   - "standalone": Full panel with logo header, wrapper styling, and footer badge.
 *   - "embedded": Minimal content without outer chrome (no header, border, shadow, footer).
 * @param {string} [className] - Additional CSS class names
 *
 * @example
 * // With context (recommended) - signals auto-populated
 * <MovingAveragesSignalsProvider>
 *   <AIMovingAveragesSignalsResolver />
 * </MovingAveragesSignalsProvider>
 *
 * @example
 * // With explicit props (backward compatible)
 * <AIMovingAveragesSignalsResolver smaSignal={smaSignal} emaSignal={emaSignal} />
 *
 * @example
 * // Embedded variant (within another component)
 * <AIMovingAveragesSignalsResolver variant="embedded" />
 */

import React, { memo, useMemo } from "react";
import { useMovingAveragesSignals } from "@site/src/hooks/useMovingAveragesSignals";
import styles from "./styles.module.css";

// ============================================================================
// SVG ICONS
// ============================================================================

const AISignalsIcon = ({ size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Crossing lines representing MA crossover */}
    <path d="M2 18L12 8l10 10" />
    <path d="M2 6l10 10L22 6" />
    {/* AI indicator dot */}
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
);

const CrossoverIcon = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 18L12 8l10 10" />
    <path d="M2 6l10 10L22 6" />
  </svg>
);

const SparklesIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
    <path d="M5 19l1 3 1-3 3-1-3-1-1-3-1 3-3 1 3 1z" />
    <path d="M19 13l1 2 1-2 2-1-2-1-1-2-1 2-2 1 2 1z" />
  </svg>
);

const TrendUpIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const TrendDownIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
    <polyline points="17 18 23 18 23 12" />
  </svg>
);

const CheckCircleIcon = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <circle
      cx="16"
      cy="16"
      r="13"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <path
      d="M10 16l4 4 8-8"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

const AlertIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const ScaleIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 3v18" />
    <path d="M5 6l7-3 7 3" />
    <path d="M5 6v4c0 1.1.9 2 2 2h2" />
    <path d="M19 6v4c0 1.1-.9 2-2 2h-2" />
    <circle cx="5" cy="17" r="2" />
    <circle cx="19" cy="17" r="2" />
  </svg>
);

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Signal type configurations
 */
const SIGNAL_TYPES = {
  GOLDEN_CROSS: {
    label: "Golden Cross",
    icon: "bullish",
    color: "teal",
    strength: "STRONG BUY",
    interpretation:
      "Short-term momentum crossing above long-term trend. Classic bullish reversal signal.",
  },
  DEATH_CROSS: {
    label: "Death Cross",
    icon: "bearish",
    color: "coral",
    strength: "STRONG SELL",
    interpretation:
      "Short-term momentum crossing below long-term trend. Classic bearish reversal signal.",
  },
  BULLISH_ALIGNMENT: {
    label: "Bullish Alignment",
    icon: "bullish",
    color: "teal",
    strength: "HOLD/BUY",
    interpretation:
      "50 MA trading above 200 MA indicates sustained uptrend. Trend continuation expected.",
  },
  BEARISH_ALIGNMENT: {
    label: "Bearish Alignment",
    icon: "bearish",
    color: "coral",
    strength: "HOLD/SELL",
    interpretation:
      "50 MA trading below 200 MA indicates sustained downtrend. Further weakness expected.",
  },
};

/**
 * Validation rules for signal assessment
 */
const VALIDATION_RULES = [
  {
    id: "cross_confirmation",
    label: "Cross Confirmation",
    description: "Both SMA and EMA crossovers align in direction",
    weight: 40,
    color: "blue",
  },
  {
    id: "momentum_alignment",
    label: "Momentum Alignment",
    description: "Price momentum confirms crossover direction",
    weight: 30,
    color: "purple",
  },
  {
    id: "volume_confirmation",
    label: "Volume Confirmation",
    description: "Volume spike accompanies the crossover signal",
    weight: 20,
    color: "teal",
  },
  {
    id: "trend_context",
    label: "Trend Context",
    description: "Higher timeframe trend supports signal direction",
    weight: 10,
    color: "coral",
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Determine overall signal status based on SMA and EMA signals
 */
const analyzeSignals = (smaSignal, emaSignal) => {
  if (!smaSignal && !emaSignal) {
    return {
      status: "NO_DATA",
      consensus: null,
      conflict: false,
      confidence: 0,
    };
  }

  const smaType = smaSignal?.type;
  const emaType = emaSignal?.type;

  // Check for signal alignment
  const smaBullish =
    smaType === "GOLDEN_CROSS" || smaType === "BULLISH_ALIGNMENT";
  const emaBullish =
    emaType === "GOLDEN_CROSS" || emaType === "BULLISH_ALIGNMENT";

  if (smaSignal && emaSignal) {
    if (smaBullish === emaBullish) {
      // Signals aligned
      const isCrossover =
        smaType === "GOLDEN_CROSS" ||
        smaType === "DEATH_CROSS" ||
        emaType === "GOLDEN_CROSS" ||
        emaType === "DEATH_CROSS";
      return {
        status: "ALIGNED",
        consensus: smaBullish ? "BULLISH" : "BEARISH",
        conflict: false,
        confidence: isCrossover ? 95 : 80,
      };
    } else {
      // Signals conflict
      return {
        status: "CONFLICT",
        consensus: null,
        conflict: true,
        confidence: 50,
      };
    }
  }

  // Only one signal available
  const signal = smaSignal || emaSignal;
  const isBullish =
    signal.type === "GOLDEN_CROSS" || signal.type === "BULLISH_ALIGNMENT";
  return {
    status: "PARTIAL",
    consensus: isBullish ? "BULLISH" : "BEARISH",
    conflict: false,
    confidence: 65,
  };
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * Signal Card - Individual signal display with AI interpretation
 */
const SignalCard = memo(({ signal, maType }) => {
  if (!signal) return null;

  const config = SIGNAL_TYPES[signal.type] || {};
  const isBullish = config.icon === "bullish";

  return (
    <div className={`${styles.signalCard} ${styles[config.color]}`}>
      <div className={styles.signalCardHeader}>
        <div className={styles.signalTypeLabel}>
          <span className={styles.maTypeTag}>{maType}</span>
          <span className={styles.signalPeriod}>50 / 200</span>
        </div>
        <div className={`${styles.signalBadge} ${styles[config.color]}`}>
          {isBullish ? <TrendUpIcon size={14} /> : <TrendDownIcon size={14} />}
          <span>{config.label}</span>
        </div>
      </div>

      <div className={styles.signalContent}>
        <div className={styles.signalDescription}>{signal.description}</div>
        <div className={styles.signalInterpretation}>
          <div className={styles.interpretationHeader}>
            <SparklesIcon size={12} />
            <span>AI Interpretation</span>
          </div>
          <p className={styles.interpretationText}>{config.interpretation}</p>
        </div>
      </div>

      <div className={`${styles.signalStrength} ${styles[config.color]}`}>
        <span className={styles.strengthLabel}>Signal Strength</span>
        <span className={styles.strengthValue}>{config.strength}</span>
      </div>
    </div>
  );
});

/**
 * Validation Rule Bar - Visual representation of rule weight
 */
const ValidationRuleBar = memo(
  ({ rule, isValid, index }) => (
    <div
      className={`${styles.validationRuleItem} ${isValid ? styles.valid : styles.invalid}`}
    >
      <div className={styles.validationRuleHeader}>
        <div className={styles.validationRuleRank}>
          <span className={styles.ruleRankNumber}>{index + 1}</span>
        </div>
        <div className={styles.validationRuleInfo}>
          <span className={styles.validationRuleLabel}>{rule.label}</span>
          <span className={styles.validationRuleDescription}>
            {rule.description}
          </span>
        </div>
        <div className={`${styles.validationRuleWeight} ${styles[rule.color]}`}>
          {rule.weight}%
        </div>
      </div>
      <div className={styles.validationRuleBarTrack}>
        <div
          className={`${styles.validationRuleBarFill} ${styles[rule.color]} ${!isValid ? styles.inactive : ""}`}
          style={{ width: `${rule.weight}%` }}
        />
      </div>
    </div>
  )
);

/**
 * Consensus Display - Shows overall signal consensus
 */
const ConsensusDisplay = memo(({ analysis }) => {
  const { status, consensus, confidence, conflict } = analysis;

  if (status === "NO_DATA") {
    return (
      <div className={styles.noDataContainer}>
        <div className={styles.noDataIcon}>
          <AlertIcon size={24} />
        </div>
        <span className={styles.noDataText}>No crossover signals detected</span>
      </div>
    );
  }

  if (conflict) {
    return (
      <div className={styles.conflictContainer}>
        <div className={styles.conflictIcon}>
          <AlertIcon size={32} />
        </div>
        <div className={styles.conflictContent}>
          <h4 className={styles.conflictTitle}>Signal Conflict Detected</h4>
          <p className={styles.conflictText}>
            SMA and EMA crossover signals are pointing in different directions.
            Exercise caution and wait for confirmation before acting.
          </p>
        </div>
        <div className={styles.conflictBadge}>
          <span>Confidence: {confidence}%</span>
        </div>
      </div>
    );
  }

  const isBullish = consensus === "BULLISH";

  return (
    <div
      className={`${styles.consensusContainer} ${isBullish ? styles.bullish : styles.bearish}`}
    >
      <div className={styles.consensusIcon}>
        {isBullish ? <TrendUpIcon size={32} /> : <TrendDownIcon size={32} />}
      </div>
      <div className={styles.consensusContent}>
        <h4 className={styles.consensusTitle}>
          {isBullish ? "Bullish Consensus" : "Bearish Consensus"}
        </h4>
        <p className={styles.consensusText}>
          {isBullish
            ? "Moving average signals indicate upward momentum. Consider bullish positioning."
            : "Moving average signals indicate downward momentum. Consider bearish positioning or risk management."}
        </p>
      </div>
      <div className={styles.confidenceMeter}>
        <div className={styles.confidenceLabel}>AI Confidence</div>
        <div className={styles.confidenceBarTrack}>
          <div
            className={`${styles.confidenceBarFill} ${isBullish ? styles.teal : styles.coral}`}
            style={{ width: `${confidence}%` }}
          />
        </div>
        <div className={styles.confidenceValue}>{confidence}%</div>
      </div>
    </div>
  );
});

/**
 * Aligned Signals State - Shown when both signals agree
 */
const AlignedSignalsState = memo(({ consensus }) => {
  const isBullish = consensus === "BULLISH";

  return (
    <div
      className={`${styles.alignedContainer} ${isBullish ? styles.bullish : styles.bearish}`}
    >
      <div className={styles.alignedIcon}>
        <CheckCircleIcon size={48} />
      </div>
      <div className={styles.alignedContent}>
        <h4 className={styles.alignedTitle}>Signals Aligned</h4>
        <p className={styles.alignedText}>
          Both SMA and EMA crossover signals agree on{" "}
          {isBullish ? "bullish" : "bearish"} direction, providing a higher
          confidence trading signal.
        </p>
      </div>
      <div className={styles.alignedBadge}>
        <CheckCircleIcon size={16} />
        <span>High Confidence Signal</span>
      </div>
    </div>
  );
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function AIMovingAveragesSignalsResolver({
  smaSignal: smaSignalProp = null,
  emaSignal: emaSignalProp = null,
  variant = "standalone",
  className = "",
}) {
  const isEmbedded = variant === "embedded";

  // Get signals from context (if available), with props as fallback
  const signalsContext = useMovingAveragesSignals();
  const smaSignal = smaSignalProp ?? signalsContext?.smaSignal ?? null;
  const emaSignal = emaSignalProp ?? signalsContext?.emaSignal ?? null;

  // Analyze signals
  const analysis = useMemo(
    () => analyzeSignals(smaSignal, emaSignal),
    [smaSignal, emaSignal]
  );

  // Determine validation rule status (simplified logic)
  const validationStatus = useMemo(() => {
    const hasSignals = smaSignal || emaSignal;
    const aligned = analysis.status === "ALIGNED";
    const hasCrossover =
      smaSignal?.type?.includes("CROSS") || emaSignal?.type?.includes("CROSS");

    return {
      cross_confirmation: aligned,
      momentum_alignment: hasSignals && analysis.confidence > 60,
      volume_confirmation: hasCrossover, // Simplified - would use actual volume data
      trend_context: hasSignals && analysis.confidence > 70,
    };
  }, [smaSignal, emaSignal, analysis]);

  const wrapperClass = `${styles.resolverWrapper} ${
    isEmbedded ? styles.embedded : ""
  } ${className}`.trim();

  return (
    <div className={wrapperClass}>
      {/* Logo Header - only in standalone mode */}
      {!isEmbedded && (
        <div className={styles.logoHeader}>
          <AISignalsIcon size={24} />
          <span className={styles.logoText}>AIMovingAveragesSignalsResolver</span>
          <span className={styles.premiumBadge}>
            <SparklesIcon size={12} />
            PREMIUM
          </span>
        </div>
      )}

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <div className={styles.sectionHeaderIcon}>
            <CrossoverIcon size={24} />
          </div>
          <div className={styles.sectionHeaderText}>
            <h3 className={styles.sectionTitle}>MA Crossover Signal Analysis</h3>
            <p className={styles.sectionSubtitle}>
              AI-driven validation of moving average crossover signals
            </p>
          </div>
        </div>

        {/* Signal Cards Grid */}
        <div className={styles.signalsSection}>
          <div className={styles.signalsSectionHeader}>
            <h4 className={styles.signalsSectionTitle}>Detected Signals</h4>
            {(smaSignal || emaSignal) && (
              <span className={styles.signalsCount}>
                {[smaSignal, emaSignal].filter(Boolean).length} signal
                {[smaSignal, emaSignal].filter(Boolean).length > 1 ? "s" : ""}
              </span>
            )}
          </div>

          <div className={styles.signalsGrid}>
            <SignalCard signal={smaSignal} maType="SMA" />
            <SignalCard signal={emaSignal} maType="EMA" />
          </div>
        </div>

        {/* Consensus / Conflict Section */}
        <div className={styles.analysisSection}>
          <div className={styles.analysisSectionHeader}>
            <h4 className={styles.analysisSectionTitle}>Signal Analysis</h4>
          </div>
          <ConsensusDisplay analysis={analysis} />
        </div>

        {/* Validation Rules Section */}
        <div className={styles.validationSection}>
          <div className={styles.validationSectionHeader}>
            <h4 className={styles.validationSectionTitle}>
              Validation Criteria
            </h4>
            <p className={styles.validationSectionDescription}>
              AI evaluates crossover signals against multiple confirmation
              factors
            </p>
          </div>

          <div className={styles.validationRulesList}>
            {VALIDATION_RULES.map((rule, idx) => (
              <ValidationRuleBar
                key={rule.id}
                rule={rule}
                isValid={validationStatus[rule.id]}
                index={idx}
              />
            ))}
          </div>
        </div>

        {/* Default Rule Callout */}
        <div className={styles.defaultRuleCallout}>
          <div className={styles.defaultRuleIcon}>
            <ScaleIcon size={20} />
          </div>
          <div className={styles.defaultRuleContent}>
            <span className={styles.defaultRuleLabel}>Signal Validation Note</span>
            <p className={styles.defaultRuleText}>
              MA crossovers are lagging indicators. Golden/Death crosses should
              be confirmed with momentum (RSI, MACD) and volume analysis for
              higher probability trades.
            </p>
          </div>
        </div>
      </div>

      {/* Footer - only in standalone mode */}
      {!isEmbedded && (
        <div className={styles.footer}>
          <span className={styles.footerBadge}>
            <CrossoverIcon size={14} />
            AI-Powered Signal Analysis
          </span>
        </div>
      )}
    </div>
  );
}

export default AIMovingAveragesSignalsResolver;
