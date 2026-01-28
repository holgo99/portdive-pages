/**
 * TickerSelector Component
 * Unified ticker selection and timeframe control header
 *
 * Features:
 * - Ticker icon display with company name
 * - Ticker input for changing symbols
 * - Timeframe dropdown selector
 * - Premium styling with animations
 *
 * @component
 * @example
 * <TickerSelector
 *   ticker="NBIS"
 *   timeframe="1D"
 *   timeframeOptions={["1H", "1D", "1W"]}
 *   onTickerChange={(ticker) => setTicker(ticker)}
 *   onTimeframeChange={(tf) => setTimeframe(tf)}
 *   title="Full Analysis"
 *   subtitle="Apr 2025 → Jun 2026 (Projection)"
 * />
 */

import React, { useState, useRef, useEffect } from "react";
import { TickerIcon } from "@site/src/components/TickerIcon";
import { PORTDIVE_THEME } from "@site/src/components/PortDiveTheme";
import { useTickerConfig } from "@site/src/hooks/useTickerConfig";
import styles from "./styles.module.css";

// ============================================================================
// SVG ICONS
// ============================================================================

const ChevronDownIcon = ({ size = 16 }) => (
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
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const ClockIcon = ({ size = 14 }) => (
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
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const SearchIcon = ({ size = 16 }) => (
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
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

// ============================================================================
// TIMEFRAME DROPDOWN COMPONENT
// ============================================================================

const TimeframeDropdown = ({
  timeframe,
  timeframeOptions,
  onTimeframeChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleSelect = (tf) => {
    onTimeframeChange(tf);
    setIsOpen(false);
  };

  return (
    <div className={styles.timeframeDropdown} ref={dropdownRef}>
      <button
        className={`${styles.timeframeButton} ${isOpen ? styles.open : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <ClockIcon size={14} />
        <span className={styles.timeframeValue}>{timeframe}</span>
        <ChevronDownIcon size={14} />
      </button>

      {isOpen && (
        <div className={styles.timeframeMenu} role="listbox">
          {timeframeOptions.map((tf) => (
            <button
              key={tf}
              className={`${styles.timeframeOption} ${
                tf === timeframe ? styles.selected : ""
              }`}
              onClick={() => handleSelect(tf)}
              role="option"
              aria-selected={tf === timeframe}
            >
              {tf}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function TickerSelector({
  // Ticker props
  ticker,
  tickerIconUrl: tickerIconUrlProp,
  tickerName: tickerNameProp,
  onTickerChange,
  // Timeframe props
  timeframe = "1D",
  timeframeOptions = ["1H", "1D", "1W"],
  onTimeframeChange,
  // Content props
  title,
  subtitle,
  theme = PORTDIVE_THEME,
  // Styling
  className = "",
}) {
  // Get config from context (if available)
  const tickerConfig = useTickerConfig();

  // Merge context with props (props take precedence)
  const displayTicker = ticker || tickerConfig.ticker;
  const tickerName = tickerNameProp || tickerConfig.tickerName;
  const tickerIconUrl = tickerIconUrlProp || tickerConfig.tickerIconUrl;

  const [inputValue, setInputValue] = useState(displayTicker);

  // Update input when ticker prop changes
  useEffect(() => {
    setInputValue(displayTicker);
  }, [displayTicker]);

  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase();
    setInputValue(value);
  };

  const handleInputBlur = () => {
    if (inputValue && inputValue !== displayTicker && onTickerChange) {
      onTickerChange(inputValue);
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.target.blur();
    }
  };

  return (
    <header className={`${styles.tickerSelector} ${className}`.trim()}>
      {/* Left side: Ticker Icon and Name */}
      {/* Desktop version - with wordmark */}
      <div className={`${styles.tickerInfo} ${styles.tickerInfoDesktop}`}>
        <TickerIcon
          tickerIconUrl={tickerIconUrl}
          ticker={displayTicker}
          tickerName={tickerName}
          showWordmark={true}
          theme={theme}
        />
      </div>
      {/* Mobile/Tablet version - without wordmark */}
      <div className={`${styles.tickerInfo} ${styles.tickerInfoMobile}`}>
        <TickerIcon
          tickerIconUrl={tickerIconUrl}
          ticker={displayTicker}
          tickerName={tickerName}
          showWordmark={false}
          theme={theme}
        />
      </div>

      {/* Center: Content section with divider */}
      {(title || subtitle) && (
        <div className={styles.contentSection}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>{title}</h1>
          </div>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      )}

      {/* Right side: Controls */}
      <div className={styles.controlsSection}>
        {/* Ticker Input */}
        {onTickerChange && (
          <div className={styles.tickerInputWrapper}>
            <SearchIcon size={14} />
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyDown={handleInputKeyDown}
              placeholder="TICKER"
              className={styles.tickerInput}
              aria-label="Ticker symbol"
            />
          </div>
        )}

        {/* Timeframe Dropdown */}
        {onTimeframeChange && (
          <TimeframeDropdown
            timeframe={timeframe}
            timeframeOptions={timeframeOptions}
            onTimeframeChange={onTimeframeChange}
          />
        )}
      </div>
    </header>
  );
}

// Also export as TickerHeader for backwards compatibility
export { TickerSelector as TickerHeader };

export default TickerSelector;
