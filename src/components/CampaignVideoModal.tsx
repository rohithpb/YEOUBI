/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { X, Play, Pause, RotateCcw, Volume2, VolumeX, Eye, Radio, Sparkles } from "lucide-react";

interface CampaignVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INSPIRATIONAL_QUOTES = [
  "STAGE 01: THE CONCRETE FLUIDITY",
  "STAGE 02: RESPECT THE CULTURE OR EXIT THE QUEUE",
  "STAGE 03: FABRICS BEYOND BOUNDS, TEXTURES BEYOND FABRICS",
  "STAGE 04: BUILT FROM UNWAVERING EXPRESSIONS // 2025",
  "STAGE 05: RECLAIMING THE BRUTALIST SPACE"
];

export default function CampaignVideoModal({ isOpen, onClose }: CampaignVideoModalProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [frameCode, setFrameCode] = useState(12);
  const [seconds, setSeconds] = useState(4);
  const [activeQuoteIdx, setActiveQuoteIdx] = useState(0);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const audioIntervalRef = useRef<number | null>(null);

  // Maintain ticking lookbook / cinematic timeline metrics
  useEffect(() => {
    let interval: any;
    if (isOpen && isPlaying) {
      interval = setInterval(() => {
        setFrameCode((prev) => {
          let nextFrame = prev + Math.round(speedMultiplier);
          if (nextFrame >= 24) {
            setSeconds((s) => (s + 1) % 60);
            return 0;
          }
          return nextFrame;
        });
      }, 41 / speedMultiplier); // 24 FPS approx
    }
    return () => clearInterval(interval);
  }, [isOpen, isPlaying, speedMultiplier]);

  // Rotate quotes every 4 seconds to give film dialogue vibe
  useEffect(() => {
    let quoteInterval: any;
    if (isOpen && isPlaying) {
      quoteInterval = setInterval(() => {
        setActiveQuoteIdx((prev) => (prev + 1) % INSPIRATIONAL_QUOTES.length);
      }, 3500);
    }
    return () => clearInterval(quoteInterval);
  }, [isOpen, isPlaying]);

  if (!isOpen) return null;

  const handleRewind = () => {
    setSeconds(0);
    setFrameCode(0);
    setActiveQuoteIdx(0);
  };

  const formattedTimecode = `00 : 04 : ${seconds.toString().padStart(2, "0")} : ${frameCode.toString().padStart(2, "0")}`;

  return (
    <div 
      id="campaign-modal-overlay" 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        id="campaign-modal-box"
        className="w-full max-w-5xl bg-black border border-zinc-800 text-white relative shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button
          id="btn-campaign-close"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 p-2 border border-zinc-800 hover:border-white text-zinc-400 hover:text-white transition-all cursor-pointer bg-black/80"
          aria-label="Close Campaign Screen"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Video Sandbox screen: Stylized Technical Canvas */}
        <div className="relative w-full aspect-video bg-zinc-950 flex flex-col justify-between p-6 select-none overflow-hidden">
          
          {/* Animated Scanning Retro Grid lines */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)+50%,rgba(0,0,0,0.25)+50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] opacity-40 bg-[size:100%_4px,6px_100%] pointer-events-none"></div>

          {/* Glitch Film Noise Layer Simulation */}
          {isPlaying && (
            <div className="absolute inset-0 bg-white/[0.02] mix-blend-overlay pointer-events-none animate-pulse"></div>
          )}

          {/* Upper Info Row */}
          <div className="relative z-10 flex justify-between items-start font-mono text-[10px] text-zinc-500">
            <div className="flex items-center space-x-2">
              <span className="flex h-2 w-2 rounded-full bg-red-600 animate-ping"></span>
              <span className="text-white font-bold tracking-widest">CAMPAIGN TRANSMISSION ACTIVE</span>
            </div>
            <div className="text-right space-y-1">
              <div>RESOLUTION: 4K_RAW_FHD</div>
              <div>COCKPIT CODEC: Apple ProRes 422 HQ</div>
              <div>RATE: {speedMultiplier * 24}.00 FPS</div>
            </div>
          </div>

          {/* Focal Crosshairs */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-between px-16 pointer-events-none">
            <div className="text-zinc-800 font-extrabold text-2xl select-none">⎡</div>
            <div className="text-zinc-700 font-normal text-sm tracking-widest bg-black/50 px-2 py-1 border border-zinc-850">
              FOCUS_RETICLE 2.5m
            </div>
            <div className="text-zinc-800 font-extrabold text-2xl select-none">⎤</div>
          </div>

          {/* Moving Dynamic Streetwear Artwork Visual Grid */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none px-6">
            <div className="text-center space-y-3">
              <div className="font-display text-5xl md:text-8xl tracking-[0.25em] text-zinc-820 text-zinc-900/60 leading-none">
                YEOUBI SS25
              </div>
              
              {/* Dynamic Overlay Quote */}
              <div className="font-mono text-zinc-400 font-bold bg-black/80 px-4 py-2 border border-zinc-850 inline-block text-[10px] md:text-xs tracking-[0.2em] uppercase max-w-lg mx-auto">
                {INSPIRATIONAL_QUOTES[activeQuoteIdx]}
              </div>
            </div>

            {/* Faux Equalizer audio visualizer (moves when playing) */}
            <div className="flex items-end justify-center space-x-[2px] h-10 mt-10 opacity-70">
              {Array(36).fill(0).map((_, i) => {
                const randomHeight = isPlaying 
                  ? Math.max(10, Math.sin(frameCode + i) * 30 + 15 + Math.random() * 15)
                  : 6;
                return (
                  <div
                    id={`audio-bar-${i}`}
                    key={i}
                    style={{ height: `${randomHeight}px` }}
                    className="w-[1.5px] bg-red-650 bg-zinc-700 transition-all duration-150"
                  ></div>
                );
              })}
            </div>
          </div>

          {/* Bottom row displays timecode metrics */}
          <div className="relative z-10 flex justify-between items-end font-mono text-[10px] text-zinc-500">
            <div className="space-y-1">
              <div className="flex items-center space-x-1">
                <Radio className="h-3 w-3 text-red-600" />
                <span className="text-zinc-400">AUDIO DECK: 2CH SECURE AUDIO FEED</span>
              </div>
              <div className="text-white font-extrabold">STATUS: {isPlaying ? "STREAMING" : "HALTED"}</div>
            </div>
            
            {/* Live digital rolling frame timeline */}
            <div id="campaign-timecode" className="font-digital text-base md:text-xl text-red-500 font-bold tracking-widest bg-black/90 p-2 border border-zinc-900 select-none">
              {formattedTimecode}
            </div>
          </div>

        </div>

        {/* Media Controls Toolbar */}
        <div className="bg-zinc-950 border-t border-zinc-900 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center space-x-2">
            {/* Play Button */}
            <button
              id="btn-campaign-play"
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-3 bg-white text-black hover:bg-red-600 hover:text-white transition-all cursor-pointer"
              title={isPlaying ? "Pause Tape" : "Play Tape"}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-black" />}
            </button>

            {/* Restart Button */}
            <button
              id="btn-campaign-rewind"
              onClick={handleRewind}
              className="p-3 border border-zinc-800 hover:border-white text-zinc-400 hover:text-white transition-all cursor-pointer"
              title="Rewind Timeline"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            {/* Mute switcher */}
            <button
              id="btn-campaign-mute"
              onClick={() => setIsMuted(!isMuted)}
              className="p-3 border border-zinc-800 hover:border-white text-zinc-400 hover:text-white transition-all cursor-pointer"
              title={isMuted ? "Unmute Synthesizer" : "Mute Synthesizer"}
            >
              {isMuted ? <VolumeX className="h-4 w-4 text-red-600" /> : <Volume2 className="h-4 w-4" />}
            </button>
          </div>

          {/* Timeline progress line bar */}
          <div className="flex-1 w-full mx-4">
            <div className="flex justify-between font-mono text-[8.5px] text-zinc-650 uppercase pb-1">
              <span>REEL_A_SS25_CLIP.MP4</span>
              <span>BUFFER INDEX: 100%</span>
            </div>
            <div className="h-[3px] bg-zinc-900 w-full relative">
              <div 
                className="h-full bg-red-500 transition-all duration-100" 
                style={{ width: `${((seconds * 24 + frameCode) / (60 * 24)) * 1000}%` }}
              ></div>
            </div>
          </div>

          {/* Speed Rate multipliers */}
          <div className="flex items-center space-x-2">
            {( [1, 2, 4] as const).map((multiplier) => (
              <button
                id={`btn-campaign-speed-${multiplier}x`}
                key={multiplier}
                onClick={() => setSpeedMultiplier(multiplier)}
                className={`px-3 py-1 font-mono text-[10px] font-bold border transition-all cursor-pointer ${
                  speedMultiplier === multiplier
                    ? "bg-red-600 text-white border-red-600"
                    : "border-zinc-800 text-zinc-500 hover:border-zinc-500"
                }`}
              >
                {multiplier}X REEL
              </button>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
