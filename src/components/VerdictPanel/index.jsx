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

import ReactMarkdown from "react-markdown";
import styles from "./styles.module.css";

/**
 * Create custom markdown components with conditional styling
 * based on whether we're in a motive or corrective wave
 */
const createMarkdownComponents = (isCorrective) => {
  // Track current section context for styling
  let currentSection = null;

  return {
    h2: ({ node, children, ...props }) => {
      const text = String(children);

      // Detect Validation/Invalidation sections
      if (text.includes("Validation")) {
        currentSection = "validation";
      } else if (text.includes("Invalidation")) {
        currentSection = "invalidation";
      } else {
        currentSection = null;
      }

      // Apply section-specific classes
      let sectionClass = styles.verdictTitle;

      if (currentSection === "validation") {
        sectionClass += isCorrective
          ? ` ${styles.sectionWarning}`
          : ` ${styles.sectionSuccess}`;
      } else if (currentSection === "invalidation") {
        sectionClass += isCorrective
          ? ` ${styles.sectionSuccess}`
          : ` ${styles.sectionWarning}`;
      }

      return (
        <h2 className={sectionClass} data-section={currentSection} {...props}>
          {children}
        </h2>
      );
    },
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
};

/**
 * VerdictPanel Component
 * @param {string} verdict - Markdown string with analysis verdict
 * @param {boolean} isCorrective - If true, displays coral/warning color scheme for corrective waves
 * @param {string} className - Optional CSS class names
 *
 * Color Logic:
 * - Motive Waves (isCorrective=false): Validation=primary(teal), Invalidation=secondary(coral)
 * - Corrective Waves (isCorrective=true): Validation=secondary(coral), Invalidation=primary(teal)
 */
export default function VerdictPanel({
  verdict,
  isCorrective = false,
  className = "",
}) {
  const wrapperClass = `${styles.verdictPanelWrapper} ${
    isCorrective ? styles.verdictPanelCorrective : ""
  } ${className}`;

  const markdownComponents = createMarkdownComponents(isCorrective);

  return (
    <div className={wrapperClass}>
      {/* Main content */}
      <div className={styles.verdictContent}>
        <ReactMarkdown components={markdownComponents}>{verdict}</ReactMarkdown>
      </div>

      {/* Footer badge */}
      <div className={styles.verdictFooter}>
        <span className={styles.verdictBadge}>
          {isCorrective ? "⚠️ " : "✓ "}
          Analysis Verdict
        </span>
      </div>
    </div>
  );
}
