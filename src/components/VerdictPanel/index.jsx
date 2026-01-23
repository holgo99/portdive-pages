/**
 * VerdictPanel Component
 * Renders chart analysis verdict with PortDive 2.0 design
 *
 * @component
 * @example
 * import VerdictPanel from '@site/src/components/VerdictPanel';
 *
 * <VerdictPanel
 *   verdict="## Primary scenario plan (rules + invalidation)\n\n**Most likely path (60%):**..."
 * />
 */

import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import styles from "./styles.module.css";

/**
 * Parses markdown string into structured sections
 * @param {string} markdown - Raw markdown content
 * @returns {object} Structured sections with content
 */
const parseVerdictMarkdown = (markdown) => {
  if (!markdown || typeof markdown !== "string") {
    return { title: "No verdict available", sections: [] };
  }

  const lines = markdown.split("\n");
  let title = "";
  const sections = [];
  let currentSection = null;

  for (const line of lines) {
    // Extract h2 as main title
    if (line.startsWith("## ")) {
      title = line.replace("## ", "").trim();
      continue;
    }

    // Extract h3 as section headers
    if (line.startsWith("### ")) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        heading: line.replace("### ", "").trim(),
        content: [],
      };
      continue;
    }

    // Collect content for current section
    if (currentSection) {
      if (line.trim()) {
        currentSection.content.push(line);
      }
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  return { title, sections };
};

/**
 * Custom markdown components with PortDive styling
 */
const markdownComponents = {
  h2: ({ node, ...props }) => <h2 className={styles.verdictTitle} {...props} />,
  h3: ({ node, ...props }) => (
    <h3 className={styles.sectionHeading} {...props} />
  ),
  p: ({ node, ...props }) => <p className={styles.verdictText} {...props} />,
  strong: ({ node, ...props }) => (
    <strong className={styles.verdictStrong} {...props} />
  ),
  ul: ({ node, ...props }) => <ul className={styles.verdictList} {...props} />,
  li: ({ node, ...props }) => (
    <li className={styles.verdictListItem} {...props} />
  ),
  code: ({ node, ...props }) => (
    <code className={styles.verdictCode} {...props} />
  ),
};

/**
 * VerdictPanel Component
 * @param {string} verdict - Markdown string with analysis verdict
 * @param {string} className - Optional CSS class names
 */
export default function VerdictPanel({ verdict, theme, className = "" }) {
  const parsedVerdict = useMemo(() => parseVerdictMarkdown(verdict), [verdict]);

  return (
    <div className={`${styles.verdictPanelWrapper} ${className}`}>
      {/* Header with icon and title */}
      <div className={styles.verdictHeader}>
        <div className={styles.verdictHeaderIcon}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={styles.verdictHeaderIconSvg}
          >
            <path d="M9 12l2 2 4-4" />
            <circle cx="12" cy="12" r="10" />
          </svg>
        </div>
        <h2 className={styles.verdictHeaderTitle}>{parsedVerdict.title}</h2>
      </div>

      {/* Main content */}
      <div className={styles.verdictContent}>
        <ReactMarkdown components={markdownComponents}>{verdict}</ReactMarkdown>
      </div>

      {/* Footer badge */}
      <div className={styles.verdictFooter}>
        <span className={styles.verdictBadge}>Analysis Verdict</span>
      </div>
    </div>
  );
}
