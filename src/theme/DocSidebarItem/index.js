import React from "react";
import DocSidebarItem from "@theme-original/DocSidebarItem";
import useBaseUrl from "@docusaurus/useBaseUrl";

export default function DocSidebarItemWrapper(props) {
  const iconPath = props.item?.customProps?.icon;
  const iconUrl = iconPath ? useBaseUrl(iconPath) : null;

  if (!iconUrl) {
    return <DocSidebarItem {...props} />;
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline", // Aligns icon bottom to text baseline
        marginLeft: "0.5rem", // Matches theme-doc-sidebar-item padding-left for level 0
      }}
    >
      <img
        src={iconUrl}
        alt=""
        style={{
          width: "1rem",
          height: "1rem",
          flexShrink: 0, // Prevents icon from shrinking
          marginRight: "0", // Space between icon and text (matches theme spacing.sm)
        }}
      />
      <DocSidebarItem {...props} />
    </div>
  );
}
