/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export default function Marquee() {
  const segments = [
    "YEOUBI © 2025",
    "RESPECT THE CULTURE",
    "BUILT FROM EXPRESSION",
  ];
  const repeatedSegments = Array(12).fill(segments).flat();

  return (
    <div id="marquee-banner" className="h-[35px] bg-black border-y border-white/20 flex items-center overflow-hidden shrink-0 select-none">
      <div className="flex whitespace-nowrap overflow-hidden">
        <div className="animate-marquee flex items-center whitespace-nowrap text-[11px] font-bold tracking-widest uppercase py-1">
          {repeatedSegments.map((text, idx) => (
            <span
              id={`marquee-segment-${idx}`}
              key={idx}
              className="flex items-center"
            >
              <span className="px-4 font-sans font-bold text-white">{text}</span>
              <span className="text-[#E8002D] font-sans text-xs">●</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
