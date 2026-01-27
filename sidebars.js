// @ts-check

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 @type {import('@docusaurus/plugin-content-docs').SidebarsConfig}
 */
module.exports = {
  docs: [
    {
      type: "doc",
      id: "overview",
      label: "Overview",
    },
    {
      type: "category",
      label: "NBIS, Nebius Group N.V.",
      items: [
        {
          type: "category",
          label: "Elliott Wave Analysis",
          items: ["nbis/elliott-wave-analysis/nbis-elliot-waves-analysis-1D"],
        },
        {
          type: "category",
          label: "Oscillators Dashboard",
          items: [
            "nbis/oscillators-dashboard/nbis-oscillators-dashboard-1H",
            "nbis/oscillators-dashboard/nbis-oscillators-dashboard-1D",
            "nbis/oscillators-dashboard/nbis-oscillators-dashboard-1W",
          ],
        },
      ],
    },
    // Add NVO section similarly
  ],
};
