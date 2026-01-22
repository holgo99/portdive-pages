import NBISElliottWaveChart from "./OpenAI-NBISElliottWaveChart.jsx";
//import { useColorModeWrapper } from "@site/hooks/useColorModeWrapper.js";

export default function NBISElliottWaveChartWrapper(props) {
  //const { colorMode } = useColorModeWrapper();
  //return <NBISElliottWaveChart {...props} colorMode={colorMode} />;
  return <NBISElliottWaveChart {...props} colorMode="dark" />;
}
