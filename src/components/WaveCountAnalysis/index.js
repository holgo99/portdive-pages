// src/components/WaveCountAnalysis/index.js
/**
 * Wave Count Analysis Component
 *
 * Displays Elliott Wave analysis with selector, chart, and analysis card.
 * Consumes ticker config from parent TickerConfigProvider context.
 *
 * @example
 * // Wrap with NBISLayout (or TickerConfigProvider) in MDX:
 * <NBISLayout>
 *   <WaveCountAnalysis />
 * </NBISLayout>
 */

import React from "react";
import { WaveCountSelector } from "@site/src/components/WaveCountSelector";
// import NBISElliottWaveChartWrapper from "@site/docs/nbis/assets/20260122/NBISElliottWaveChartWrapper.jsx";

export function WaveCountAnalysis() {
  return (
    <div style={{ padding: "2rem 0" }}>
      <WaveCountSelector
        showProbability={true}
        onScenarioChange={(id) => {
          console.log("Selected:", id);
        }}
      />
      {/* <NBISElliottWaveChartWrapper /> */}
    </div>
  );
}
