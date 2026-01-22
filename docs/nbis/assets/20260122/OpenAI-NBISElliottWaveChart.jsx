import React, { useState, useMemo, useCallback, memo, useRef, useEffect } from 'react';

// ============================================================================
// OHLCV DATA - DO NOT MODIFY VALUES
// ============================================================================
const OHLCV_DATA = [
  { index: 0, timestamp: 1743773400, open: 20.78, high: 21.0992, low: 18.98, close: 20.29, volume: 14053016 },
  { index: 1, timestamp: 1744032600, open: 18.74, high: 21.9, low: 18.31, close: 21.05, volume: 12653701 },
  { index: 2, timestamp: 1744119000, open: 22.52, high: 22.75, low: 19.66, close: 20.06, volume: 11102224 },
  { index: 3, timestamp: 1744205400, open: 20.52, high: 23.9968, low: 18.8905, close: 23.46, volume: 17685383 },
  { index: 4, timestamp: 1744291800, open: 22.765, high: 22.82, low: 20.41, close: 21.04, volume: 8709488 },
  { index: 5, timestamp: 1744378200, open: 21.0, high: 21.665, low: 20.2601, close: 21.51, volume: 5470245 },
  { index: 6, timestamp: 1744637400, open: 22.32, high: 22.778, low: 20.51, close: 20.73, volume: 6090954 },
  { index: 7, timestamp: 1744723800, open: 21.31, high: 21.58, low: 20.8028, close: 21.33, volume: 4681536 },
  { index: 8, timestamp: 1744810200, open: 20.63, high: 21.305, low: 20.51, close: 21.08, volume: 4473320 },
  { index: 9, timestamp: 1744896600, open: 21.32, high: 21.85, low: 21.0215, close: 21.53, volume: 3973038 },
  { index: 10, timestamp: 1745242200, open: 21.24, high: 21.35, low: 20.25, close: 20.72, volume: 4267868 },
  { index: 11, timestamp: 1745328600, open: 21.15, high: 22.035, low: 21.02, close: 21.86, volume: 4708692 },
  { index: 12, timestamp: 1745415000, open: 23.25, high: 23.7861, low: 22.55, close: 22.96, volume: 7948988 },
  { index: 13, timestamp: 1745501400, open: 23.085, high: 24.6189, low: 22.932, close: 24.46, volume: 5588660 },
  { index: 14, timestamp: 1745587800, open: 24.57, high: 25.08, low: 23.86, close: 24.48, volume: 5825710 },
  { index: 15, timestamp: 1745847000, open: 24.205, high: 24.5994, low: 23.31, close: 24.11, volume: 3609706 },
  { index: 16, timestamp: 1745933400, open: 24.11, high: 24.415, low: 23.7, close: 23.86, volume: 3404823 },
  { index: 17, timestamp: 1746019800, open: 22.5, high: 22.8, low: 21.4501, close: 22.73, volume: 6099431 },
  { index: 18, timestamp: 1746106200, open: 25.025, high: 25.71, low: 23.92, close: 23.925, volume: 7475342 },
  { index: 19, timestamp: 1746192600, open: 24.65, high: 25.6162, low: 24.39, close: 25.4, volume: 6124608 },
  { index: 20, timestamp: 1746451800, open: 24.6, high: 24.66, low: 23.73, close: 23.8, volume: 4599858 },
  { index: 21, timestamp: 1746538200, open: 23.3, high: 25.07, low: 23.25, close: 25.04, volume: 6024079 },
  { index: 22, timestamp: 1746624600, open: 27.55, high: 27.87, low: 26.26, close: 27.45, volume: 17899382 },
  { index: 23, timestamp: 1746711000, open: 27.84, high: 28.59, low: 27.3, close: 28.22, volume: 6853824 },
  { index: 24, timestamp: 1746797400, open: 28.35, high: 29.08, low: 27.2, close: 28.27, volume: 8477340 },
  { index: 25, timestamp: 1747056600, open: 32.32, high: 33.73, low: 31.13, close: 33.34, volume: 16292632 },
  { index: 26, timestamp: 1747143000, open: 33.34, high: 35.98, low: 32.88, close: 35.27, volume: 13897455 },
  { index: 27, timestamp: 1747229400, open: 35.675, high: 36.65, low: 34.45, close: 36.12, volume: 12529740 },
  { index: 28, timestamp: 1747315800, open: 35.07, high: 36.79, low: 34.88, close: 35.79, volume: 11205645 },
  { index: 29, timestamp: 1747402200, open: 36.345, high: 38.14, low: 36.1923, close: 37.32, volume: 16647174 },
  { index: 30, timestamp: 1747661400, open: 35.8, high: 37.93, low: 35.68, close: 37.56, volume: 11035773 },
  { index: 31, timestamp: 1747747800, open: 38.12, high: 41.45, low: 36.4201, close: 39.14, volume: 31145816 },
  { index: 32, timestamp: 1747834200, open: 38.7, high: 41.4, low: 38.25, close: 38.92, volume: 17302414 },
  { index: 33, timestamp: 1747920600, open: 39.04, high: 39.55, low: 37.0, close: 37.8, volume: 10928706 },
  { index: 34, timestamp: 1748007000, open: 36.2, high: 39.2, low: 35.8, close: 38.59, volume: 10378906 },
  { index: 35, timestamp: 1748352600, open: 39.57, high: 40.09, low: 38.03, close: 39.82, volume: 9224286 },
  { index: 36, timestamp: 1748439000, open: 40.15, high: 40.9, low: 38.7, close: 39.6, volume: 7801825 },
  { index: 37, timestamp: 1748525400, open: 41.25, high: 41.8, low: 37.6, close: 38.04, volume: 11234109 },
  { index: 38, timestamp: 1748611800, open: 37.47, high: 38.18, low: 36.01, close: 36.75, volume: 8109474 },
  { index: 39, timestamp: 1748871000, open: 34.825, high: 36.04, low: 34.72, close: 36.02, volume: 17309160 },
  { index: 40, timestamp: 1748957400, open: 36.66, high: 37.98, low: 35.72, close: 37.27, volume: 12101564 },
  { index: 41, timestamp: 1749043800, open: 37.935, high: 40.4, low: 37.12, close: 39.39, volume: 14745612 },
  { index: 42, timestamp: 1749130200, open: 41.42, high: 49.73, low: 41.3999, close: 46.3, volume: 59116979 },
  { index: 43, timestamp: 1749216600, open: 46.295, high: 48.57, low: 45.41, close: 48.28, volume: 19955731 },
  { index: 44, timestamp: 1749475800, open: 50.265, high: 55.04, low: 49.54, close: 52.58, volume: 33822167 },
  { index: 45, timestamp: 1749562200, open: 51.0, high: 52.59, low: 49.15, close: 52.51, volume: 21894621 },
  { index: 46, timestamp: 1749648600, open: 52.52, high: 53.26, low: 49.83, close: 50.57, volume: 14439358 },
  { index: 47, timestamp: 1749735000, open: 50.265, high: 51.97, low: 48.82, close: 50.28, volume: 12573598 },
  { index: 48, timestamp: 1749821400, open: 48.64, high: 49.73, low: 46.88, close: 47.13, volume: 14336538 },
  { index: 49, timestamp: 1750080600, open: 48.0, high: 51.82, low: 47.89, close: 50.46, volume: 14505281 },
  { index: 50, timestamp: 1750167000, open: 49.85, high: 50.06, low: 47.66, close: 48.33, volume: 11504780 },
  { index: 51, timestamp: 1750253400, open: 48.625, high: 50.35, low: 47.69, close: 48.32, volume: 10999792 },
  { index: 52, timestamp: 1750426200, open: 48.66, high: 49.74, low: 46.88, close: 47.97, volume: 12670677 },
  { index: 53, timestamp: 1750685400, open: 47.0, high: 48.3, low: 45.02, close: 47.48, volume: 12396039 },
  { index: 54, timestamp: 1750771800, open: 49.0, high: 53.0, low: 48.98, close: 51.02, volume: 18080885 },
  { index: 55, timestamp: 1750858200, open: 53.275, high: 54.59, low: 48.05, close: 48.52, volume: 14092802 },
  { index: 56, timestamp: 1750944600, open: 49.57, high: 53.16, low: 48.54, close: 52.6, volume: 11533054 },
  { index: 57, timestamp: 1751031000, open: 53.01, high: 53.42, low: 50.6001, close: 51.84, volume: 8978070 },
  { index: 58, timestamp: 1751290200, open: 53.34, high: 55.7499, low: 52.15, close: 55.33, volume: 13852466 },
  { index: 59, timestamp: 1751376600, open: 54.6, high: 55.38, low: 49.766, close: 50.31, volume: 14286389 },
  { index: 60, timestamp: 1751463000, open: 50.255, high: 51.2, low: 48.882, close: 49.97, volume: 8151086 },
  { index: 61, timestamp: 1751549400, open: 50.99, high: 50.99, low: 49.8, close: 50.25, volume: 5143329 },
  { index: 62, timestamp: 1751895000, open: 49.325, high: 49.3348, low: 47.22, close: 47.84, volume: 9432634 },
  { index: 63, timestamp: 1751981400, open: 48.1, high: 48.55, low: 46.65, close: 47.1, volume: 8447779 },
  { index: 64, timestamp: 1752067800, open: 47.4, high: 48.8, low: 45.81, close: 46.05, volume: 10148670 },
  { index: 65, timestamp: 1752154200, open: 46.5, high: 47.235, low: 45.25, close: 46.43, volume: 8475988 },
  { index: 66, timestamp: 1752240600, open: 46.515, high: 47.605, low: 43.89, close: 44.3, volume: 9198213 },
  { index: 67, timestamp: 1752499800, open: 48.93, high: 52.21, low: 48.8, close: 51.95, volume: 24405126 },
  { index: 68, timestamp: 1752586200, open: 52.325, high: 55.43, low: 51.02, close: 53.53, volume: 18454809 },
  { index: 69, timestamp: 1752672600, open: 53.58, high: 53.6499, low: 50.12, close: 53.31, volume: 11106696 },
  { index: 70, timestamp: 1752759000, open: 53.81, high: 56.16, low: 52.7115, close: 53.69, volume: 10876380 },
  { index: 71, timestamp: 1752845400, open: 54.65, high: 54.8, low: 51.01, close: 52.79, volume: 9593830 },
  { index: 72, timestamp: 1753104600, open: 53.71, high: 58.1643, low: 51.88, close: 52.37, volume: 19795712 },
  { index: 73, timestamp: 1753191000, open: 52.15, high: 52.3, low: 49.0, close: 51.01, volume: 9913873 },
  { index: 74, timestamp: 1753277400, open: 51.2, high: 52.04, low: 50.44, close: 51.88, volume: 7288526 },
  { index: 75, timestamp: 1753363800, open: 53.28, high: 53.78, low: 51.02, close: 52.16, volume: 7220664 },
  { index: 76, timestamp: 1753450200, open: 52.52, high: 52.76, low: 51.32, close: 51.37, volume: 6237591 },
  { index: 77, timestamp: 1753709400, open: 51.69, high: 52.805, low: 50.554324, close: 52.75, volume: 8599545 },
  { index: 78, timestamp: 1753795800, open: 53.29, high: 54.7, low: 50.0, close: 50.4, volume: 10638297 },
  { index: 79, timestamp: 1753882200, open: 50.88, high: 52.5, low: 50.25, close: 51.29, volume: 8009413 },
  { index: 80, timestamp: 1753968600, open: 53.33, high: 57.13, low: 52.9, close: 54.43, volume: 22905485 },
  { index: 81, timestamp: 1754055000, open: 51.97, high: 53.73, low: 50.0982, close: 52.0, volume: 11719087 },
  { index: 82, timestamp: 1754314200, open: 52.99, high: 54.53, low: 52.88, close: 54.17, volume: 7096068 },
  { index: 83, timestamp: 1754400600, open: 55.845, high: 56.45, low: 53.5379, close: 55.17, volume: 8585128 },
  { index: 84, timestamp: 1754487000, open: 55.89, high: 55.89, low: 53.95, close: 55.09, volume: 9731086 },
  { index: 85, timestamp: 1754573400, open: 64.37, high: 70.54, low: 63.38, close: 65.31, volume: 44064989 },
  { index: 86, timestamp: 1754659800, open: 68.175, high: 71.49, low: 66.45, close: 68.78, volume: 18451904 },
  { index: 87, timestamp: 1754919000, open: 69.9, high: 75.9601, low: 69.16, close: 70.24, volume: 21552712 },
  { index: 88, timestamp: 1755005400, open: 73.425, high: 75.9188, low: 72.0, close: 75.33, volume: 16162726 },
  { index: 89, timestamp: 1755091800, open: 75.08, high: 75.21, low: 69.08, close: 70.63, volume: 18701875 },
  { index: 90, timestamp: 1755178200, open: 69.75, high: 71.52, low: 67.1, close: 68.46, volume: 13114024 },
  { index: 91, timestamp: 1755264600, open: 68.3, high: 71.97, low: 67.31, close: 71.62, volume: 9237569 },
  { index: 92, timestamp: 1755523800, open: 71.44, high: 72.59, low: 68.27, close: 72.54, volume: 10006986 },
  { index: 93, timestamp: 1755610200, open: 71.75, high: 71.75, low: 66.2, close: 67.19, volume: 12276289 },
  { index: 94, timestamp: 1755696600, open: 65.185, high: 67.5, low: 62.01, close: 67.47, volume: 14162843 },
  { index: 95, timestamp: 1755783000, open: 68.26, high: 68.26, low: 65.45, close: 66.18, volume: 8019247 },
  { index: 96, timestamp: 1755869400, open: 65.51, high: 69.68, low: 64.6108, close: 68.98, volume: 11017169 },
  { index: 97, timestamp: 1756128600, open: 69.46, high: 70.74, low: 67.25, close: 70.02, volume: 7898724 },
  { index: 98, timestamp: 1756215000, open: 70.29, high: 72.8, low: 69.31, close: 70.48, volume: 7516543 },
  { index: 99, timestamp: 1756301400, open: 71.5, high: 71.798, low: 68.652, close: 70.1, volume: 6471437 },
  { index: 100, timestamp: 1756387800, open: 70.93, high: 73.5, low: 70.2, close: 72.04, volume: 8909357 },
  { index: 101, timestamp: 1756474200, open: 71.545, high: 71.69, low: 67.6, close: 68.32, volume: 7594332 },
  { index: 102, timestamp: 1756819800, open: 65.9, high: 67.879, low: 64.11, close: 65.72, volume: 9332965 },
  { index: 103, timestamp: 1756906200, open: 66.88, high: 67.0, low: 64.8314, close: 65.65, volume: 6506241 },
  { index: 104, timestamp: 1756992600, open: 65.445, high: 66.5, low: 64.41, close: 64.91, volume: 5473282 },
  { index: 105, timestamp: 1757079000, open: 66.5, high: 67.39, low: 63.26, close: 65.47, volume: 5811679 },
  { index: 106, timestamp: 1757338200, open: 64.67, high: 66.64, low: 63.8, close: 64.06, volume: 23049975 },
  { index: 107, timestamp: 1757424600, open: 97.2, high: 98.6799, low: 86.12, close: 95.72, volume: 88378298 },
  { index: 108, timestamp: 1757511000, open: 91.64, high: 100.51, low: 91.0, close: 93.39, volume: 44690602 },
  { index: 109, timestamp: 1757597400, open: 92.67, high: 93.87, low: 88.415, close: 89.19, volume: 37580632 },
  { index: 110, timestamp: 1757683800, open: 91.19, high: 92.0, low: 86.78, close: 90.41, volume: 22844686 },
  { index: 111, timestamp: 1757943000, open: 92.61, high: 94.42, low: 88.84, close: 90.96, volume: 19391494 },
  { index: 112, timestamp: 1758029400, open: 91.2, high: 91.3, low: 88.02, close: 89.43, volume: 11737329 },
  { index: 113, timestamp: 1758115800, open: 91.67, high: 95.0, low: 88.83, close: 94.08, volume: 24500303 },
  { index: 114, timestamp: 1758202200, open: 95.075, high: 97.68, low: 92.03, close: 94.12, volume: 18068457 },
  { index: 115, timestamp: 1758288600, open: 94.14, high: 99.55, low: 93.25, close: 99.31, volume: 18649279 },
  { index: 116, timestamp: 1758547800, open: 101.95, high: 108.58, low: 98.52, close: 106.6, volume: 24365232 },
  { index: 117, timestamp: 1758634200, open: 108.04, high: 109.98, low: 104.25, close: 107.8, volume: 16693468 },
  { index: 118, timestamp: 1758720600, open: 109.135, high: 114.85, low: 104.85, close: 113.23, volume: 25341223 },
  { index: 119, timestamp: 1758807000, open: 108.055, high: 114.08, low: 105.88, close: 107.94, volume: 19658801 },
  { index: 120, timestamp: 1758893400, open: 109.93, high: 109.99, low: 102.8, close: 107.7, volume: 14915089 },
  { index: 121, timestamp: 1759152600, open: 109.38, high: 112.52, low: 108.33, close: 110.22, volume: 12067011 },
  { index: 122, timestamp: 1759239000, open: 113.445, high: 117.65, low: 111.66, close: 112.27, volume: 20425090 },
  { index: 123, timestamp: 1759325400, open: 111.715, high: 115.88, low: 109.76, close: 115.61, volume: 12008096 },
  { index: 124, timestamp: 1759411800, open: 123.77, high: 126.74, low: 118.57, close: 125.87, volume: 26887671 },
  { index: 125, timestamp: 1759498200, open: 127.235, high: 132.9792, low: 123.6, close: 127.98, volume: 21351332 },
  { index: 126, timestamp: 1759757400, open: 132.4, high: 135.76, low: 124.93, close: 124.94, volume: 16311053 },
  { index: 127, timestamp: 1759843800, open: 127.825, high: 128.28, low: 115.72, close: 117.7, volume: 19573994 },
  { index: 128, timestamp: 1759930200, open: 121.2, high: 125.31, low: 117.5, close: 122.0, volume: 18005901 },
  { index: 129, timestamp: 1760016600, open: 120.98, high: 133.32, low: 119.87, close: 132.64, volume: 18124575 },
  { index: 130, timestamp: 1760103000, open: 134.95, high: 141.1, low: 128.01, close: 129.58, volume: 28268503 },
  { index: 131, timestamp: 1760362200, open: 135.21, high: 138.53, low: 132.65, close: 135.46, volume: 12788929 },
  { index: 132, timestamp: 1760448600, open: 132.0, high: 133.7843, low: 125.75, close: 128.15, volume: 13109232 },
  { index: 133, timestamp: 1760535000, open: 131.9, high: 131.99, low: 122.2, close: 125.83, volume: 11708320 },
  { index: 134, timestamp: 1760621400, open: 128.09, high: 130.97, low: 122.02, close: 123.04, volume: 14207745 },
  { index: 135, timestamp: 1760707800, open: 118.06, high: 120.5734, low: 110.88, close: 113.44, volume: 21366533 },
  { index: 136, timestamp: 1760967000, open: 116.79, high: 117.47, low: 107.51, close: 109.0, volume: 17799474 },
  { index: 137, timestamp: 1761053400, open: 107.88, high: 108.18, low: 101.4, close: 104.28, volume: 18455857 },
  { index: 138, timestamp: 1761139800, open: 106.675, high: 107.8, low: 94.63, close: 98.62, volume: 26631501 },
  { index: 139, timestamp: 1761226200, open: 100.33, high: 106.62, low: 99.46, close: 106.16, volume: 15803826 },
  { index: 140, timestamp: 1761312600, open: 111.16, high: 117.45, low: 110.01, close: 117.26, volume: 17411914 },
  { index: 141, timestamp: 1761571800, open: 120.91, high: 126.5, low: 120.11, close: 125.43, volume: 16809794 },
  { index: 142, timestamp: 1761658200, open: 126.435, high: 129.03, low: 120.78, close: 121.83, volume: 13455547 },
  { index: 143, timestamp: 1761744600, open: 124.28, high: 125.95, low: 117.5, close: 125.1, volume: 13952790 },
  { index: 144, timestamp: 1761831000, open: 121.2, high: 128.44, low: 117.76, close: 124.18, volume: 12204384 },
  { index: 145, timestamp: 1761917400, open: 126.64, high: 132.1499, low: 126.3, close: 130.82, volume: 13389040 },
  { index: 146, timestamp: 1762180200, open: 134.0, high: 134.93, low: 119.7501, close: 120.47, volume: 17247025 },
  { index: 147, timestamp: 1762266600, open: 112.355, high: 116.78, low: 109.0, close: 110.54, volume: 17818197 },
  { index: 148, timestamp: 1762353000, open: 113.64, high: 118.21, low: 111.43, close: 117.0, volume: 13977675 },
  { index: 149, timestamp: 1762439400, open: 119.55, high: 121.0, low: 108.41, close: 109.44, volume: 17314423 },
  { index: 150, timestamp: 1762525800, open: 104.5, high: 111.3, low: 101.26, close: 111.28, volume: 17614072 },
  { index: 151, timestamp: 1762785000, open: 115.18, high: 118.37, low: 108.72, close: 109.95, volume: 21363592 },
  { index: 152, timestamp: 1762871400, open: 114.13, high: 114.56, low: 99.83, close: 102.22, volume: 45261131 },
  { index: 153, timestamp: 1762957800, open: 104.2, high: 105.6499, low: 91.71, close: 94.36, volume: 35913483 },
  { index: 154, timestamp: 1763044200, open: 90.89, high: 91.48, low: 84.5, close: 88.63, volume: 41803017 },
  { index: 155, timestamp: 1763130600, open: 82.36, high: 89.0, low: 82.0, close: 83.54, volume: 31947972 },
  { index: 156, timestamp: 1763389800, open: 83.82, high: 89.65, low: 83.59, close: 85.98, volume: 23478713 },
  { index: 157, timestamp: 1763476200, open: 83.78, high: 93.69, low: 81.71, close: 90.54, volume: 26661640 },
  { index: 158, timestamp: 1763562600, open: 93.005, high: 96.72, low: 91.8, close: 95.07, volume: 22040586 },
  { index: 159, timestamp: 1763649000, open: 99.43, high: 102.69, low: 84.21, close: 84.64, volume: 35775660 },
  { index: 160, timestamp: 1763735400, open: 85.55, high: 88.74, low: 78.21, close: 83.26, volume: 34963167 },
  { index: 161, timestamp: 1763994600, open: 86.23, high: 93.0, low: 85.15, close: 91.9, volume: 51066797 },
  { index: 162, timestamp: 1764081000, open: 89.29, high: 91.28, low: 84.7211, close: 88.88, volume: 15021195 },
  { index: 163, timestamp: 1764167400, open: 93.85, high: 95.634, low: 90.76, close: 94.69, volume: 13544965 },
  { index: 164, timestamp: 1764340200, open: 96.55, high: 97.08, low: 93.4402, close: 94.87, volume: 6018834 },
  { index: 165, timestamp: 1764599400, open: 91.45, high: 101.6, low: 89.01, close: 100.15, volume: 14462853 },
  { index: 166, timestamp: 1764685800, open: 100.36, high: 102.95, low: 96.06, close: 96.45, volume: 11332667 },
  { index: 167, timestamp: 1764772200, open: 95.02, high: 99.06, low: 91.0, close: 98.92, volume: 11307490 },
  { index: 168, timestamp: 1764858600, open: 99.07, high: 103.84, low: 97.47, close: 102.8, volume: 11234128 },
  { index: 169, timestamp: 1764945000, open: 100.34, high: 101.35, low: 96.2, close: 98.04, volume: 13041137 },
  { index: 170, timestamp: 1765204200, open: 97.29, high: 100.5, low: 95.3, close: 100.33, volume: 8737775 },
  { index: 171, timestamp: 1765290600, open: 98.09, high: 100.8826, low: 96.1, close: 96.41, volume: 10059983 },
  { index: 172, timestamp: 1765377000, open: 95.73, high: 97.09, low: 92.2, close: 93.59, volume: 10080735 },
  { index: 173, timestamp: 1765463400, open: 89.2, high: 95.45, low: 86.7, close: 94.28, volume: 11896082 },
  { index: 174, timestamp: 1765549800, open: 93.31, high: 95.65, low: 86.2, close: 87.69, volume: 14990621 },
  { index: 175, timestamp: 1765809000, open: 88.1, high: 88.24, low: 80.0635, close: 81.14, volume: 17138596 },
  { index: 176, timestamp: 1765895400, open: 79.575, high: 81.56, low: 76.88, close: 80.95, volume: 13847810 },
  { index: 177, timestamp: 1766068200, open: 84.09, high: 84.3, low: 75.25, close: 75.45, volume: 17064073 },
  { index: 178, timestamp: 1766068200, open: 79.05, high: 80.35, low: 77.01, close: 78.09, volume: 10345822 },
  { index: 179, timestamp: 1766154600, open: 80.65, high: 90.54, low: 80.1601, close: 89.46, volume: 17558701 },
  { index: 180, timestamp: 1766413800, open: 92.97, high: 95.9, low: 91.1, close: 93.23, volume: 11303103 },
  { index: 181, timestamp: 1766500200, open: 90.31, high: 92.97, low: 88.31, close: 90.03, volume: 8885717 },
  { index: 182, timestamp: 1766586600, open: 90.23, high: 91.42, low: 88.65, close: 91.13, volume: 3338007 },
  { index: 183, timestamp: 1766759400, open: 91.51, high: 91.62, low: 86.74, close: 87.59, volume: 6234606 },
  { index: 184, timestamp: 1767018600, open: 84.45, high: 88.61, low: 84.29, close: 86.04, volume: 8076086 },
  { index: 185, timestamp: 1767105000, open: 86.375, high: 86.96, low: 84.56, close: 85.17, volume: 5802313 },
  { index: 186, timestamp: 1767191400, open: 85.37, high: 86.47, low: 82.9, close: 83.705, volume: 7055872 },
  { index: 187, timestamp: 1767364200, open: 86.985, high: 90.76, low: 86.01, close: 89.95, volume: 9099505 },
  { index: 188, timestamp: 1767623400, open: 95.0, high: 95.44, low: 90.89, close: 92.83, volume: 10025590 },
  { index: 189, timestamp: 1767709800, open: 95.715, high: 100.68, low: 90.94, close: 100.24, volume: 18739584 },
  { index: 190, timestamp: 1767796200, open: 99.01, high: 102.35, low: 95.56, close: 96.21, volume: 10185837 },
  { index: 191, timestamp: 1767882600, open: 96.79, high: 102.54, low: 96.0211, close: 97.3, volume: 12952014 },
  { index: 192, timestamp: 1767969000, open: 98.895, high: 104.97, low: 97.1, close: 97.93, volume: 11735268 },
  { index: 193, timestamp: 1768228200, open: 98.32, high: 108.6799, low: 96.55, close: 107.33, volume: 16033466 },
  { index: 194, timestamp: 1768314600, open: 107.33, high: 107.9499, low: 103.92, close: 105.43, volume: 10405206 },
  { index: 195, timestamp: 1768401000, open: 105.78, high: 106.6999, low: 99.383, close: 101.98, volume: 10468048 },
  { index: 196, timestamp: 1768487400, open: 104.555, high: 108.13, low: 101.1, close: 103.885, volume: 11190850 },
  { index: 197, timestamp: 1768573800, open: 105.995, high: 110.5, low: 100.71, close: 108.73, volume: 15674397 },
  { index: 198, timestamp: 1768919400, open: 101.83, high: 104.47, low: 98.34, close: 99.29, volume: 16768594 },
  { index: 199, timestamp: 1769005800, open: 101.09, high: 102.4, low: 93.1, close: 98.87, volume: 15470530 },
];

// ============================================================================
// PORTDIVE BRAND COLORS - LOCKED (DO NOT CHANGE)
// ============================================================================
const PORTDIVE_COLORS = {
  light: {
    bg: '#f8faf9',
    surface: '#ffffff',
    surfaceAlt: '#f0f4f2',
    text: '#0a1a1f',
    textSecondary: '#5a6570',
    textMuted: '#8a9199',
    border: 'rgba(10, 26, 31, 0.12)',
    grid: 'rgba(10, 26, 31, 0.06)',
    hover: 'rgba(31, 163, 155, 0.08)',
  },
  dark: {
    bg: '#0a1a1f',
    surface: '#0f2028',
    surfaceAlt: '#142830',
    text: '#f8faf9',
    textSecondary: '#a8b4bc',
    textMuted: '#6a7a84',
    border: 'rgba(248, 250, 249, 0.12)',
    grid: 'rgba(248, 250, 249, 0.04)',
    hover: 'rgba(31, 163, 155, 0.15)',
  },
  primary: '#1FA39B',
  primaryLight: '#25b8ae',
  secondary: '#FF6B6B',
  secondaryLight: '#FF8E8E',
  candleUp: '#1FA39B',
  candleDown: '#FF6B6B',
  volume: { up: 'rgba(31, 163, 155, 0.45)', down: 'rgba(255, 107, 107, 0.45)' },
  movingAverage: { fast: '#1FA39B', slow: '#A84B2F' },
  fibonacci: { primary: '#1FA39B', extension: '#00D9D9' },
  invalidation: '#FF6B6B',
  target: '#1FA39B',
  altCount: '#FF6B6B',
};

// ============================================================================
// WAVE COUNT CONFIGURATIONS
// ============================================================================
const WAVE_COUNTS = {
  primary: {
    id: 'primary',
    label: 'Primary',
    probability: '60%',
    color: PORTDIVE_COLORS.primary,
    pivots: {
      wave1Start: { idx: 1, price: 18.31 },
      wave1Peak: { idx: 58, price: 55.75, label: '①' },
      wave2Low: { idx: 66, price: 43.89, label: '②' },
      wave3Peak: { idx: 130, price: 141.10, label: '③' },
      wave4Low: { idx: 177, price: 75.25, label: '④' },
    },
    minorWaves: {
      minorIPeak: { idx: 197, price: 110.50, label: 'i' },
      minorIILow: { idx: 199, price: 93.10, label: 'ii' },
    },
    projectedTarget: 135.83,
  },
  alt1: {
    id: 'alt1',
    label: 'Alt 3 Extension',
    probability: '30%',
    color: PORTDIVE_COLORS.secondary,
    pivots: {
      wave1Start: { idx: 1, price: 18.31 },
      wave1Peak: { idx: 58, price: 55.75, label: '①' },
      wave2Low: { idx: 66, price: 43.89, label: '②' },
      wave3ExtPeak: { idx: 130, price: 141.10, label: '③ ext' },
      wave4Low: { idx: 177, price: 75.25, label: '④' },
    },
    minorWaves: {},
    projectedTarget: 165.00,
    description: 'Wave 3 extended count',
  },
  alt2: {
    id: 'alt2',
    label: 'Alt Flat',
    probability: '10%',
    color: '#F59E0B',
    pivots: {
      wave1Start: { idx: 1, price: 18.31 },
      waveAPeak: { idx: 130, price: 141.10, label: 'A' },
      waveBLow: { idx: 177, price: 75.25, label: 'B' },
    },
    minorWaves: {},
    projectedTarget: 95.00,
    description: 'Flat correction scenario',
  },
};

// ============================================================================
// PORTDIVE LOGO COMPONENT
// ============================================================================
const PortDiveLogo = memo(({ size = 32, showWordmark = false, theme }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={PORTDIVE_COLORS.primaryLight} />
          <stop offset="100%" stopColor={PORTDIVE_COLORS.primary} />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="none" stroke="url(#logoGradient)" strokeWidth="4" />
      <circle cx="35" cy="42" r="5" fill={PORTDIVE_COLORS.primary} />
      <circle cx="65" cy="42" r="5" fill={PORTDIVE_COLORS.primary} />
      <path d="M32 58 Q50 75 68 58" fill="none" stroke={PORTDIVE_COLORS.primary} strokeWidth="4" strokeLinecap="round" />
    </svg>
    {showWordmark && (
      <span style={{
        fontSize: size * 0.6,
        fontWeight: 700,
        color: PORTDIVE_COLORS.primary,
        letterSpacing: '-0.02em',
      }}>
        PortDive
      </span>
    )}
  </div>
));

// ============================================================================
// CHECKBOX TOGGLE COMPONENT (Styled like screenshot)
// ============================================================================
const CheckboxToggle = memo(({ label, checked, onChange, color = PORTDIVE_COLORS.primary, theme }) => (
  <label
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      cursor: 'pointer',
      padding: '8px 14px',
      borderRadius: '6px',
      background: checked ? `${color}15` : 'transparent',
      border: `1px solid ${checked ? color : theme.border}`,
      transition: 'all 0.15s ease',
      userSelect: 'none',
    }}
  >
    <span
      style={{
        width: '18px',
        height: '18px',
        borderRadius: '4px',
        border: `2px solid ${checked ? color : theme.textMuted}`,
        background: checked ? color : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.15s ease',
        flexShrink: 0,
      }}
    >
      {checked && (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2.5 6L5 8.5L9.5 3.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
    <span
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '13px',
        fontWeight: 500,
        color: checked ? color : theme.textSecondary,
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: color,
        opacity: checked ? 1 : 0.5,
      }} />
      {label}
    </span>
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
    />
  </label>
));

// ============================================================================
// WAVE COUNT SELECTOR BUTTONS
// ============================================================================
const WaveCountButton = memo(({ count, active, onClick, theme }) => {
  const isAlt = count.id === 'alt1';

  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      style={{
        padding: '12px 16px',
        borderRadius: '8px',
        border: active ? `2px solid ${count.color}` : `1px solid ${theme.border}`,
        background: active
          ? (isAlt ? `linear-gradient(135deg, ${count.color} 0%, ${PORTDIVE_COLORS.secondaryLight} 100%)` : `${count.color}18`)
          : 'transparent',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.2s ease',
        flex: '1 1 auto',
        minWidth: '120px',
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '8px',
      }}>
        <span style={{
          color: active ? (isAlt ? '#fff' : count.color) : theme.text,
          fontWeight: 600,
          fontSize: '13px',
        }}>
          {count.label}
        </span>
        <span style={{
          color: active && isAlt ? 'rgba(255,255,255,0.85)' : theme.textSecondary,
          fontSize: '11px',
          fontWeight: 500,
        }}>
          {count.probability}
        </span>
      </div>
    </button>
  );
});

// ============================================================================
// CHART CANVAS COMPONENT - REDESIGNED
// ============================================================================
const ChartCanvas = memo(({
  data,
  analysisState,
  activeWaveCount,
  theme,
  isDarkMode,
  containerWidth,
}) => {
  // Responsive dimensions - increased height
  const W = Math.max(800, containerWidth || 1000);
  const H = 600; // Increased from 450
  const M = { t: 60, r: 90, b: 80, l: 70 };

  // Add projection space (25% extra for future projection to June 2026)
  const projectionBars = Math.floor(data.length * 0.25);
  const totalBars = data.length + projectionBars;

  const cW = W - M.l - M.r;
  const cH = H - M.t - M.b - 60; // More space for volume
  const vH = 50; // Taller volume section

  const processedData = useMemo(() => data.map(d => ({ ...d, date: new Date(d.timestamp * 1000) })), [data]);
  const pMin = useMemo(() => Math.min(...data.map(d => d.low)) * 0.90, [data]);
  const pMax = useMemo(() => Math.max(...data.map(d => d.high), 150) * 1.08, [data]); // Extended for projections
  const vMax = useMemo(() => Math.max(...data.map(d => d.volume)), [data]);

  const priceToY = useCallback(p => M.t + cH * (1 - (p - pMin) / (pMax - pMin)), [pMin, pMax, cH]);
  const idxToX = useCallback(i => M.l + (i + 0.5) * (cW / totalBars), [cW, totalBars]);
  const candleW = Math.max(2.5, Math.min(5, cW / totalBars - 1.5));

  const calcMA = useCallback((period) => {
    const result = [];
    for (let i = period - 1; i < data.length; i++) {
      let sum = 0;
      for (let j = i - period + 1; j <= i; j++) sum += data[j].close;
      result.push({ idx: i, ma: sum / period });
    }
    return result;
  }, [data]);

  const ma50 = useMemo(() => calcMA(50), [calcMA]);
  const ma200 = useMemo(() => calcMA(200), [calcMA]);

  // Get active wave count configuration
  const activeCount = WAVE_COUNTS[activeWaveCount] || WAVE_COUNTS.primary;

  const fibLevels = useMemo(() => {
    const peak = 141.10, low = 75.25, range = peak - low;
    return [
      { ratio: 0, price: peak, label: '0%', key: true },
      { ratio: 0.236, price: peak - range * 0.236, label: '23.6%' },
      { ratio: 0.382, price: peak - range * 0.382, label: '38.2%' },
      { ratio: 0.5, price: peak - range * 0.5, label: '50%' },
      { ratio: 0.618, price: peak - range * 0.618, label: '61.8%', key: true },
      { ratio: 0.786, price: peak - range * 0.786, label: '78.6%' },
      { ratio: 1, price: low, label: '100%', key: true },
    ];
  }, []);

  const fibExtensions = useMemo(() => {
    const wave1Length = 55.75 - 18.31, wave4Low = 75.25;
    return [
      { ratio: 1.0, price: wave4Low + wave1Length * 1.0, label: '1.0×' },
      { ratio: 1.272, price: wave4Low + wave1Length * 1.272, label: '1.272×' },
      { ratio: 1.618, price: wave4Low + wave1Length * 1.618, label: '1.618×', key: true },
    ];
  }, []);

  const priceGrid = [20, 40, 60, 80, 100, 120, 140, 160].filter(p => p >= pMin && p <= pMax);

  const monthMarkers = useMemo(() => {
    const markers = [];
    let lastMonth = null;
    processedData.forEach((d, i) => {
      const month = d.date.getMonth();
      const year = d.date.getFullYear();
      if (month !== lastMonth) {
        markers.push({
          i,
          label: d.date.toLocaleDateString('en-US', { month: 'short' }),
          year: year,
          showYear: month === 0 || i === 0,
        });
        lastMonth = month;
      }
    });

    // Add projection months (Feb-Jun 2026)
    const lastDate = processedData[processedData.length - 1]?.date;
    if (lastDate) {
      const projMonths = ['Feb', 'Mar', 'Apr', 'May', 'Jun'];
      projMonths.forEach((m, idx) => {
        markers.push({
          i: data.length + (idx + 1) * Math.floor(projectionBars / 5),
          label: m,
          year: 2026,
          isProjection: true,
        });
      });
    }
    return markers;
  }, [processedData, data.length, projectionBars]);

  const currentPrice = data[data.length - 1]?.close || 98.87;

  // Wave label pill renderer with collision avoidance
  const renderWaveLabel = useCallback((x, y, label, above, color, isMinor = false) => {
    const size = isMinor ? 20 : 26;
    const fontSize = isMinor ? 12 : 14;
    const yOffset = above ? -(size + 8) : (size + 8);

    return (
      <g key={`label-${label}`}>
        {/* Connection line */}
        <line
          x1={x} y1={y}
          x2={x} y2={y + (above ? -8 : 8)}
          stroke={color}
          strokeWidth={1.5}
          strokeDasharray={isMinor ? "3,2" : ""}
        />
        {/* Label pill */}
        <ellipse
          cx={x} cy={y + yOffset}
          rx={size * 0.55} ry={size * 0.45}
          fill={color}
          filter="url(#labelShadow)"
        />
        <text
          x={x} y={y + yOffset + (fontSize * 0.35)}
          textAnchor="middle"
          fill="#fff"
          fontSize={fontSize}
          fontWeight="700"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          {label}
        </text>
      </g>
    );
  }, []);

  return (
    <svg
      width="100%"
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      style={{
        background: theme.surface,
        borderRadius: '12px',
        border: `1px solid ${theme.border}`,
        display: 'block',
      }}
    >
      <defs>
        {/* Shadow filter for labels */}
        <filter id="labelShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.3" />
        </filter>
        {/* Gradient for projection zone */}
        <linearGradient id="projectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={theme.surface} stopOpacity="0" />
          <stop offset="100%" stopColor={PORTDIVE_COLORS.primary} stopOpacity="0.05" />
        </linearGradient>
        {/* Target zone gradient */}
        <linearGradient id="targetZoneGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={PORTDIVE_COLORS.primary} stopOpacity="0.12" />
          <stop offset="100%" stopColor={PORTDIVE_COLORS.primary} stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Projection zone background */}
      <rect
        x={idxToX(data.length - 1)}
        y={M.t}
        width={cW - (idxToX(data.length - 1) - M.l)}
        height={cH + vH + 10}
        fill="url(#projectionGradient)"
      />

      {/* Price Grid - Cleaner with fewer lines */}
      {priceGrid.map(p => (
        <g key={p}>
          <line
            x1={M.l} x2={W - M.r}
            y1={priceToY(p)} y2={priceToY(p)}
            stroke={theme.grid}
            strokeWidth="1"
          />
          <text
            x={M.l - 12} y={priceToY(p) + 4}
            textAnchor="end"
            fill={theme.textSecondary}
            fontSize="12"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="500"
          >
            ${p}
          </text>
        </g>
      ))}

      {/* Month markers - Improved readability */}
      {monthMarkers.filter((_, i) => i % 2 === 0 || monthMarkers.length < 15).map(({ i, label, year, showYear, isProjection }) => (
        <g key={`${label}-${i}`}>
          <line
            x1={idxToX(i)} x2={idxToX(i)}
            y1={M.t} y2={H - M.b}
            stroke={isProjection ? PORTDIVE_COLORS.primary : theme.grid}
            strokeWidth="1"
            strokeDasharray={isProjection ? "4,4" : ""}
            opacity={isProjection ? 0.3 : 1}
          />
          <text
            x={idxToX(i)} y={H - M.b + 22}
            textAnchor="middle"
            fill={isProjection ? PORTDIVE_COLORS.primary : theme.textSecondary}
            fontSize="12"
            fontWeight="500"
            fontFamily="system-ui, -apple-system, sans-serif"
            opacity={isProjection ? 0.7 : 1}
          >
            {label}
          </text>
          {showYear && (
            <text
              x={idxToX(i)} y={H - M.b + 38}
              textAnchor="middle"
              fill={theme.textMuted}
              fontSize="11"
              fontFamily="system-ui, -apple-system, sans-serif"
            >
              {year}
            </text>
          )}
        </g>
      ))}

      {/* Fibonacci Retracement - Improved visibility */}
      {analysisState.showFibRetracements && fibLevels.map(({ ratio, price, label, key }) => {
        const y = priceToY(price);
        return (
          <g key={`fib-${ratio}`}>
            <line
              x1={M.l} x2={W - M.r - 60}
              y1={y} y2={y}
              stroke={PORTDIVE_COLORS.fibonacci.primary}
              strokeWidth={key ? 1.5 : 1}
              strokeDasharray={key ? '' : '6,4'}
              opacity={key ? 0.5 : 0.25}
            />
            <rect
              x={W - M.r - 58}
              y={y - 10}
              width={50}
              height={20}
              rx={4}
              fill={theme.surface}
              stroke={PORTDIVE_COLORS.fibonacci.primary}
              strokeWidth={1}
              opacity={0.9}
            />
            <text
              x={W - M.r - 33} y={y + 4}
              textAnchor="middle"
              fill={PORTDIVE_COLORS.fibonacci.primary}
              fontSize="10"
              fontWeight="600"
              fontFamily="system-ui, -apple-system, sans-serif"
            >
              {label}
            </text>
          </g>
        );
      })}

      {/* Fibonacci Extensions */}
      {analysisState.showFibExtensions && fibExtensions.map(({ ratio, price, label, key }) => {
        const y = priceToY(price);
        if (y < M.t - 20 || y > H - M.b) return null;
        return (
          <g key={`ext-${ratio}`}>
            <line
              x1={idxToX(data.length * 0.8)} x2={W - M.r}
              y1={y} y2={y}
              stroke={PORTDIVE_COLORS.fibonacci.extension}
              strokeWidth={key ? 2 : 1}
              strokeDasharray="8,4"
              opacity={key ? 0.6 : 0.35}
            />
            <rect
              x={W - M.r + 4}
              y={y - 12}
              width={65}
              height={24}
              rx={4}
              fill={key ? PORTDIVE_COLORS.fibonacci.extension : theme.surface}
              stroke={PORTDIVE_COLORS.fibonacci.extension}
              strokeWidth={1}
              opacity={0.95}
            />
            <text
              x={W - M.r + 36} y={y + 4}
              textAnchor="middle"
              fill={key ? '#fff' : PORTDIVE_COLORS.fibonacci.extension}
              fontSize="10"
              fontWeight="600"
              fontFamily="system-ui, -apple-system, sans-serif"
            >
              {label} ${price.toFixed(0)}
            </text>
          </g>
        );
      })}

      {/* Target band */}
      {analysisState.showTargetBand && (
        <g>
          <rect
            x={idxToX(data.length - 20)}
            y={priceToY(145)}
            width={cW - (idxToX(data.length - 20) - M.l) - 60}
            height={priceToY(125) - priceToY(145)}
            fill="url(#targetZoneGradient)"
            rx={4}
          />
          <text
            x={idxToX(data.length + projectionBars * 0.5)}
            y={priceToY(140)}
            textAnchor="middle"
            fill={PORTDIVE_COLORS.primary}
            fontSize="11"
            fontWeight="600"
            opacity={0.8}
          >
            TARGET ZONE
          </text>
        </g>
      )}

      {/* Invalidation line */}
      {analysisState.showInvalidationLevel && (
        <g>
          <line
            x1={M.l} x2={W - M.r}
            y1={priceToY(75.25)} y2={priceToY(75.25)}
            stroke={PORTDIVE_COLORS.secondary}
            strokeWidth="2"
            strokeDasharray="10,5"
            opacity={0.7}
          />
          <rect
            x={M.l + 5}
            y={priceToY(75.25) - 20}
            width={130}
            height={18}
            rx={4}
            fill={PORTDIVE_COLORS.secondary}
            opacity={0.9}
          />
          <text
            x={M.l + 70} y={priceToY(75.25) - 8}
            textAnchor="middle"
            fill="#fff"
            fontSize="10"
            fontWeight="700"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            INVALIDATION $75.25
          </text>
        </g>
      )}

      {/* Moving Averages - Thicker lines */}
      {ma50.length > 1 && (
        <path
          d={`M ${ma50.map(({ idx, ma }) => `${idxToX(idx)},${priceToY(ma)}`).join(' L ')}`}
          fill="none"
          stroke={PORTDIVE_COLORS.movingAverage.fast}
          strokeWidth="2.5"
          opacity={0.7}
        />
      )}
      {ma200.length > 1 && (
        <path
          d={`M ${ma200.map(({ idx, ma }) => `${idxToX(idx)},${priceToY(ma)}`).join(' L ')}`}
          fill="none"
          stroke={PORTDIVE_COLORS.movingAverage.slow}
          strokeWidth="2.5"
          opacity={0.6}
        />
      )}

      {/* Candlesticks - Crisp rendering */}
      {processedData.map((d, i) => {
        const x = idxToX(i);
        const isGreen = d.close >= d.open;
        const bodyColor = isGreen ? PORTDIVE_COLORS.candleUp : PORTDIVE_COLORS.candleDown;
        const yO = priceToY(d.open), yC = priceToY(d.close);
        const yH = priceToY(d.high), yL = priceToY(d.low);
        const bodyHeight = Math.max(Math.abs(yC - yO), 1);

        return (
          <g key={i}>
            {/* Wick */}
            <line
              x1={x} y1={yH} x2={x} y2={yL}
              stroke={bodyColor}
              strokeWidth={1.5}
            />
            {/* Body */}
            <rect
              x={x - candleW / 2}
              y={Math.min(yO, yC)}
              width={candleW}
              height={bodyHeight}
              fill={bodyColor}
              rx={0.5}
            />
          </g>
        );
      })}

      {/* Wave lines based on active count */}
      {analysisState.showMotiveWaves && (
        <g>
          {activeWaveCount === 'primary' && (
            <>
              {/* Primary wave path */}
              <path
                d={`M ${idxToX(activeCount.pivots.wave1Start.idx)},${priceToY(activeCount.pivots.wave1Start.price)}
                    L ${idxToX(activeCount.pivots.wave1Peak.idx)},${priceToY(activeCount.pivots.wave1Peak.price)}
                    L ${idxToX(activeCount.pivots.wave2Low.idx)},${priceToY(activeCount.pivots.wave2Low.price)}
                    L ${idxToX(activeCount.pivots.wave3Peak.idx)},${priceToY(activeCount.pivots.wave3Peak.price)}
                    L ${idxToX(activeCount.pivots.wave4Low.idx)},${priceToY(activeCount.pivots.wave4Low.price)}`}
                fill="none"
                stroke={activeCount.color}
                strokeWidth="2.5"
                opacity="0.8"
                strokeLinejoin="round"
              />
              {/* Wave labels */}
              {renderWaveLabel(
                idxToX(activeCount.pivots.wave1Peak.idx),
                priceToY(activeCount.pivots.wave1Peak.price),
                activeCount.pivots.wave1Peak.label,
                true,
                activeCount.color
              )}
              {renderWaveLabel(
                idxToX(activeCount.pivots.wave2Low.idx),
                priceToY(activeCount.pivots.wave2Low.price),
                activeCount.pivots.wave2Low.label,
                false,
                activeCount.color
              )}
              {renderWaveLabel(
                idxToX(activeCount.pivots.wave3Peak.idx),
                priceToY(activeCount.pivots.wave3Peak.price),
                activeCount.pivots.wave3Peak.label,
                true,
                activeCount.color
              )}
              {renderWaveLabel(
                idxToX(activeCount.pivots.wave4Low.idx),
                priceToY(activeCount.pivots.wave4Low.price),
                activeCount.pivots.wave4Low.label,
                false,
                activeCount.color
              )}
            </>
          )}

          {activeWaveCount === 'alt1' && (
            <>
              {/* Alt 1 wave path */}
              <path
                d={`M ${idxToX(activeCount.pivots.wave1Start.idx)},${priceToY(activeCount.pivots.wave1Start.price)}
                    L ${idxToX(activeCount.pivots.wave1Peak.idx)},${priceToY(activeCount.pivots.wave1Peak.price)}
                    L ${idxToX(activeCount.pivots.wave2Low.idx)},${priceToY(activeCount.pivots.wave2Low.price)}
                    L ${idxToX(activeCount.pivots.wave3ExtPeak.idx)},${priceToY(activeCount.pivots.wave3ExtPeak.price)}
                    L ${idxToX(activeCount.pivots.wave4Low.idx)},${priceToY(activeCount.pivots.wave4Low.price)}`}
                fill="none"
                stroke={activeCount.color}
                strokeWidth="2.5"
                opacity="0.8"
                strokeLinejoin="round"
              />
              {/* Wave labels */}
              {renderWaveLabel(
                idxToX(activeCount.pivots.wave1Peak.idx),
                priceToY(activeCount.pivots.wave1Peak.price),
                activeCount.pivots.wave1Peak.label,
                true,
                activeCount.color
              )}
              {renderWaveLabel(
                idxToX(activeCount.pivots.wave2Low.idx),
                priceToY(activeCount.pivots.wave2Low.price),
                activeCount.pivots.wave2Low.label,
                false,
                activeCount.color
              )}
              {renderWaveLabel(
                idxToX(activeCount.pivots.wave3ExtPeak.idx),
                priceToY(activeCount.pivots.wave3ExtPeak.price),
                activeCount.pivots.wave3ExtPeak.label,
                true,
                activeCount.color
              )}
              {renderWaveLabel(
                idxToX(activeCount.pivots.wave4Low.idx),
                priceToY(activeCount.pivots.wave4Low.price),
                activeCount.pivots.wave4Low.label,
                false,
                activeCount.color
              )}
            </>
          )}

          {activeWaveCount === 'alt2' && (
            <>
              {/* Alt 2 wave path (Flat correction) */}
              <path
                d={`M ${idxToX(activeCount.pivots.wave1Start.idx)},${priceToY(activeCount.pivots.wave1Start.price)}
                    L ${idxToX(activeCount.pivots.waveAPeak.idx)},${priceToY(activeCount.pivots.waveAPeak.price)}
                    L ${idxToX(activeCount.pivots.waveBLow.idx)},${priceToY(activeCount.pivots.waveBLow.price)}`}
                fill="none"
                stroke={activeCount.color}
                strokeWidth="2.5"
                opacity="0.8"
                strokeLinejoin="round"
              />
              {renderWaveLabel(
                idxToX(activeCount.pivots.waveAPeak.idx),
                priceToY(activeCount.pivots.waveAPeak.price),
                activeCount.pivots.waveAPeak.label,
                true,
                activeCount.color
              )}
              {renderWaveLabel(
                idxToX(activeCount.pivots.waveBLow.idx),
                priceToY(activeCount.pivots.waveBLow.price),
                activeCount.pivots.waveBLow.label,
                false,
                activeCount.color
              )}
            </>
          )}
        </g>
      )}

      {/* Minor waves - Only for primary count */}
      {analysisState.showCorrectiveWaves && activeWaveCount === 'primary' && activeCount.minorWaves && (
        <g>
          <path
            d={`M ${idxToX(activeCount.pivots.wave4Low.idx)},${priceToY(activeCount.pivots.wave4Low.price)}
                L ${idxToX(activeCount.minorWaves.minorIPeak.idx)},${priceToY(activeCount.minorWaves.minorIPeak.price)}
                L ${idxToX(activeCount.minorWaves.minorIILow.idx)},${priceToY(activeCount.minorWaves.minorIILow.price)}
                L ${idxToX(data.length - 1)},${priceToY(currentPrice)}`}
            fill="none"
            stroke={activeCount.color}
            strokeWidth="1.5"
            strokeDasharray="6,4"
            opacity="0.7"
          />
          {renderWaveLabel(
            idxToX(activeCount.minorWaves.minorIPeak.idx),
            priceToY(activeCount.minorWaves.minorIPeak.price),
            activeCount.minorWaves.minorIPeak.label,
            true,
            activeCount.color,
            true
          )}
          {renderWaveLabel(
            idxToX(activeCount.minorWaves.minorIILow.idx),
            priceToY(activeCount.minorWaves.minorIILow.price),
            activeCount.minorWaves.minorIILow.label,
            false,
            activeCount.color,
            true
          )}
        </g>
      )}

      {/* Projected Wave 5 path */}
      {analysisState.showMotiveWaves && activeWaveCount === 'primary' && (
        <g>
          <path
            d={`M ${idxToX(data.length - 1)},${priceToY(currentPrice)}
                L ${idxToX(data.length + projectionBars * 0.7)},${priceToY(activeCount.projectedTarget)}`}
            fill="none"
            stroke={activeCount.color}
            strokeWidth="2"
            strokeDasharray="8,6"
            opacity="0.5"
          />
          {/* Wave 5 projected label */}
          <g>
            <ellipse
              cx={idxToX(data.length + projectionBars * 0.7)}
              cy={priceToY(activeCount.projectedTarget) - 28}
              rx={16} ry={14}
              fill={activeCount.color}
              opacity={0.6}
              filter="url(#labelShadow)"
            />
            <text
              x={idxToX(data.length + projectionBars * 0.7)}
              y={priceToY(activeCount.projectedTarget) - 23}
              textAnchor="middle"
              fill="#fff"
              fontSize="14"
              fontWeight="700"
            >
              ⑤
            </text>
            <text
              x={idxToX(data.length + projectionBars * 0.7)}
              y={priceToY(activeCount.projectedTarget) - 8}
              textAnchor="middle"
              fill={activeCount.color}
              fontSize="10"
              fontWeight="600"
              opacity={0.8}
            >
              ${activeCount.projectedTarget}
            </text>
          </g>
        </g>
      )}

      {/* Volume section */}
      <rect
        x={M.l} y={H - M.b - vH - 5}
        width={cW} height={vH + 5}
        fill={isDarkMode ? '#081015' : '#f5f7f6'}
        rx={4}
      />
      {processedData.map((d, i) => {
        const x = idxToX(i);
        const h = (d.volume / vMax) * vH * 0.85;
        const isGreen = d.close >= d.open;
        return (
          <rect
            key={`vol-${i}`}
            x={x - candleW / 2}
            y={H - M.b - h - 2}
            width={candleW}
            height={h}
            fill={isGreen ? PORTDIVE_COLORS.volume.up : PORTDIVE_COLORS.volume.down}
            rx={0.5}
          />
        );
      })}

      {/* Current price marker */}
      <g>
        <line
          x1={idxToX(data.length - 1) + candleW} x2={W - M.r + 70}
          y1={priceToY(currentPrice)} y2={priceToY(currentPrice)}
          stroke={currentPrice >= data[data.length - 2]?.close ? PORTDIVE_COLORS.candleUp : PORTDIVE_COLORS.candleDown}
          strokeWidth={1.5}
          strokeDasharray="4,3"
        />
        <rect
          x={W - M.r + 4} y={priceToY(currentPrice) - 14}
          width={70} height={28}
          rx={6}
          fill={currentPrice >= data[data.length - 2]?.close ? PORTDIVE_COLORS.candleUp : PORTDIVE_COLORS.candleDown}
        />
        <text
          x={W - M.r + 39} y={priceToY(currentPrice) + 5}
          textAnchor="middle"
          fill="#fff"
          fontSize="13"
          fontWeight="700"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          ${currentPrice.toFixed(2)}
        </text>
      </g>

      {/* PortDive Logo Watermark */}
      <g transform={`translate(${W - 100}, ${M.t + 15})`} opacity={0.4}>
        <circle cx="18" cy="18" r="16" fill="none" stroke={PORTDIVE_COLORS.primary} strokeWidth="2" />
        <circle cx="12" cy="15" r="2.5" fill={PORTDIVE_COLORS.primary} />
        <circle cx="24" cy="15" r="2.5" fill={PORTDIVE_COLORS.primary} />
        <path d="M10 22 Q18 30 26 22" fill="none" stroke={PORTDIVE_COLORS.primary} strokeWidth="2" strokeLinecap="round" />
        <text x="42" y="23" fill={PORTDIVE_COLORS.primary} fontSize="12" fontWeight="700">PortDive</text>
      </g>

      {/* MA Legend - Cleaner */}
      <g transform={`translate(${M.l + 15}, ${M.t + 20})`}>
        <rect x={-8} y={-12} width={160} height={28} rx={6} fill={theme.surface} opacity={0.9} />
        <line x1="0" y1="0" x2="20" y2="0" stroke={PORTDIVE_COLORS.movingAverage.fast} strokeWidth="2.5" />
        <text x="26" y="4" fill={theme.textSecondary} fontSize="11" fontWeight="500">50-MA</text>
        <line x1="75" y1="0" x2="95" y2="0" stroke={PORTDIVE_COLORS.movingAverage.slow} strokeWidth="2.5" />
        <text x="101" y="4" fill={theme.textSecondary} fontSize="11" fontWeight="500">200-MA</text>
      </g>

      {/* Projection zone label */}
      <g transform={`translate(${idxToX(data.length + 5)}, ${H - M.b - vH - 20})`}>
        <rect x={-40} y={-10} width={80} height={18} rx={4} fill={PORTDIVE_COLORS.primary} opacity={0.15} />
        <text x="0" y="3" textAnchor="middle" fill={PORTDIVE_COLORS.primary} fontSize="10" fontWeight="600">
          PROJECTION
        </text>
      </g>
    </svg>
  );
});

// ============================================================================
// MAIN COMPONENT - REFACTORED
// ============================================================================
export default function NBISElliottWaveChart({ colorMode = 'dark' }) {
  // Use Docusaurus colorMode prop or default to dark
  const isDarkMode = colorMode === 'dark';
  const theme = isDarkMode ? PORTDIVE_COLORS.dark : PORTDIVE_COLORS.light;

  const [activeWaveCount, setActiveWaveCount] = useState('primary');
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(1000);

  const [analysisState, setAnalysisState] = useState({
    showMotiveWaves: true,
    showCorrectiveWaves: true,
    showFibRetracements: true,
    showFibExtensions: true,
    showInvalidationLevel: true,
    showTargetBand: true,
  });

  // Responsive container width
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const toggleAnalysis = useCallback((key) => {
    setAnalysisState(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  // Handle wave count change - this now actually updates the chart
  const handleWaveCountChange = useCallback((countId) => {
    setActiveWaveCount(countId);
  }, []);

  const currentPrice = OHLCV_DATA[OHLCV_DATA.length - 1].close;
  const prevClose = OHLCV_DATA[OHLCV_DATA.length - 2].close;
  const priceChange = ((currentPrice - prevClose) / prevClose) * 100;
  const activeCount = WAVE_COUNTS[activeWaveCount] || WAVE_COUNTS.primary;

  return (
    <div
      ref={containerRef}
      style={{
        background: theme.bg,
        padding: '24px',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
        color: theme.text,
        borderRadius: '16px',
        maxWidth: '100%',
      }}
    >
      {/* Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <PortDiveLogo size={40} showWordmark={true} theme={theme} />
          <div style={{ borderLeft: `2px solid ${theme.border}`, paddingLeft: '16px' }}>
            <h1 style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: 700,
              color: theme.text,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}>
              NBIS Elliott Wave Analysis
              <span style={{
                fontSize: '11px',
                padding: '4px 10px',
                background: theme.surfaceAlt,
                borderRadius: '6px',
                color: theme.textSecondary,
                fontWeight: 600,
                border: `1px solid ${theme.border}`,
              }}>
                1D
              </span>
            </h1>
            <p style={{
              margin: '6px 0 0',
              fontSize: '13px',
              color: theme.textSecondary,
            }}>
              Apr 2025 → Jun 2026 (Projection) | Target: ${activeCount.projectedTarget.toFixed(2)} | ATH: $141.10
            </p>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <div style={{
            padding: '12px 20px',
            borderRadius: '10px',
            background: `linear-gradient(135deg, ${PORTDIVE_COLORS.primary} 0%, ${PORTDIVE_COLORS.primaryLight} 100%)`,
            color: '#fff',
            fontSize: '22px',
            fontWeight: 700,
            boxShadow: '0 4px 12px rgba(31, 163, 155, 0.3)',
          }}>
            ${currentPrice.toFixed(2)}
            <span style={{
              fontSize: '12px',
              marginLeft: '8px',
              opacity: 0.9,
              fontWeight: 500,
            }}>
              {priceChange >= 0 ? '↑' : '↓'} {Math.abs(priceChange).toFixed(2)}%
            </span>
          </div>
        </div>
      </header>

      {/* Wave Count Selector */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '20px',
        padding: '16px',
        background: theme.surface,
        borderRadius: '12px',
        border: `1px solid ${theme.border}`,
        flexWrap: 'wrap',
      }}>
        <div style={{
          fontSize: '11px',
          color: theme.textSecondary,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          marginRight: '8px',
        }}>
          Wave Count
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', flex: 1 }}>
          {Object.values(WAVE_COUNTS).map(count => (
            <WaveCountButton
              key={count.id}
              count={count}
              active={activeWaveCount === count.id}
              onClick={() => handleWaveCountChange(count.id)}
              theme={theme}
            />
          ))}
        </div>
      </div>

      {/* Overlay Toggle Controls - Redesigned as checkboxes */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        marginBottom: '20px',
        padding: '16px',
        background: theme.surface,
        borderRadius: '12px',
        border: `1px solid ${theme.border}`,
        alignItems: 'center',
      }}>
        <CheckboxToggle
          label="Motive Waves (65%)"
          checked={analysisState.showMotiveWaves}
          onChange={() => toggleAnalysis('showMotiveWaves')}
          color={PORTDIVE_COLORS.primary}
          theme={theme}
        />
        <CheckboxToggle
          label="Corrective (25%)"
          checked={analysisState.showCorrectiveWaves}
          onChange={() => toggleAnalysis('showCorrectiveWaves')}
          color={PORTDIVE_COLORS.secondary}
          theme={theme}
        />
        <CheckboxToggle
          label="Fib Retracement"
          checked={analysisState.showFibRetracements}
          onChange={() => toggleAnalysis('showFibRetracements')}
          color={PORTDIVE_COLORS.primary}
          theme={theme}
        />
        <CheckboxToggle
          label="Fib Extension"
          checked={analysisState.showFibExtensions}
          onChange={() => toggleAnalysis('showFibExtensions')}
          color={PORTDIVE_COLORS.fibonacci.extension}
          theme={theme}
        />
      </div>

      {/* Main Chart */}
      <div style={{
        marginBottom: '24px',
        width: '100%',
      }}>
        <ChartCanvas
          data={OHLCV_DATA}
          analysisState={analysisState}
          activeWaveCount={activeWaveCount}
          theme={theme}
          isDarkMode={isDarkMode}
          containerWidth={containerWidth - 48} // Account for padding
        />
      </div>

      {/* Footer Legend */}
      <footer style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '24px',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        background: theme.surface,
        borderRadius: '12px',
        border: `1px solid ${theme.border}`,
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '20px',
              height: '4px',
              background: PORTDIVE_COLORS.primary,
              borderRadius: '2px',
            }} />
            <span style={{ fontSize: '12px', color: theme.textSecondary, fontWeight: 500 }}>
              Primary (60%)
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '20px',
              height: '4px',
              background: PORTDIVE_COLORS.secondary,
              borderRadius: '2px',
            }} />
            <span style={{ fontSize: '12px', color: theme.textSecondary, fontWeight: 500 }}>
              Alt #1 (30%)
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '20px',
              height: '4px',
              background: PORTDIVE_COLORS.fibonacci.extension,
              borderRadius: '2px',
            }} />
            <span style={{ fontSize: '12px', color: theme.textSecondary, fontWeight: 500 }}>
              Extensions
            </span>
          </div>
        </div>

        <div style={{
          fontSize: '12px',
          color: theme.textSecondary,
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
        }}>
          <span>
            <span style={{ color: PORTDIVE_COLORS.primary, fontWeight: 600 }}>Target:</span> ${activeCount.projectedTarget.toFixed(2)}
          </span>
          <span>
            <span style={{ color: PORTDIVE_COLORS.secondary, fontWeight: 600 }}>Invalidation:</span> $75.25
          </span>
        </div>
      </footer>

      {/* Attribution */}
      <div style={{
        marginTop: '16px',
        textAlign: 'center',
        fontSize: '11px',
        color: theme.textMuted,
      }}>
        PortDive Elliott Wave Analysis • {OHLCV_DATA.length} daily candles • Projection to Jun 2026 • Last updated: Jan 22, 2026
      </div>
    </div>
  );
}
