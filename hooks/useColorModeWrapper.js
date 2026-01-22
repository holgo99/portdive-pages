import { useEffect, useState } from "react";

export function useColorModeWrapper() {
  const [colorMode, setColorMode] = useState("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only import and use on client-side
    import("@docusaurus/theme-classic").then(
      ({ useColorMode: useDocusaurusColorMode }) => {
        const { colorMode: mode } = useDocusaurusColorMode();
        setColorMode(mode);
        setMounted(true);
      },
    );
  }, []);

  if (!mounted) return { colorMode: "dark" };

  return {
    colorMode,
  };
}
