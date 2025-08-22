'use client';
import React, { useEffect, useRef, useState } from 'react';
import { CrosshairConfig } from '../types/crosshair';

export const BACKGROUNDS = [
  { name: 'Black', path: '/images/dark.svg' },
  { name: 'White', path: '/images/light.svg' },
  { name: 'Dust 2', path: '/images/dust.jpg' },
  { name: 'Nuke', path: '/images/nuke.jpg' },
  { name: 'Overpass', path: '/images/overpass.jpg' }
];

interface CrosshairCanvasProps {
  crosshairConfig: CrosshairConfig;
  background?: string;
}

const CrosshairCanvas: React.FC<CrosshairCanvasProps> = ({
  crosshairConfig,
  background = BACKGROUNDS[0].path
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 400 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Check if desktop on mount
    setIsDesktop(window.innerWidth > 1024);
  }, []);

  // Handle resize and check if desktop
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const height = Math.min(400, width * 0.5);
        setCanvasSize({ width, height });
      }
      // Update desktop check on resize
      setIsDesktop(window.innerWidth > 1024);
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [isMounted]);

  // Draw crosshair part
  const drawCrosshairPart = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    outlineOffsets: { xy: number; wh: number },
    outlineSettings: { enabled: boolean; value: number }
  ) => {
    // Draw main part
    ctx.fillRect(x, y, width, height);
    
    // Draw outline if enabled
    if (outlineSettings.enabled && outlineSettings.value !== 0) {
      if (outlineSettings.value < 1) {
        ctx.beginPath();
        ctx.moveTo(x - outlineOffsets.xy, y + height);
        ctx.lineTo(x - outlineOffsets.xy, y - outlineOffsets.xy);
        ctx.lineTo(x + width, y - outlineOffsets.xy);
        ctx.stroke();
      } else {
        ctx.strokeRect(
          x - outlineOffsets.xy,
          y - outlineOffsets.xy,
          width + outlineOffsets.wh,
          height + outlineOffsets.wh
        );
      }
    }
  };

  // Function to draw crosshair on a canvas
  const drawCrosshair = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, scale: number = 1) => {
    const hex = crosshairConfig.color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const alpha = crosshairConfig.alpha / 255;
    
    ctx.save();
    ctx.strokeStyle = '#000';
    ctx.globalAlpha = 0.03;

    const outlineSettings = {
      enabled: crosshairConfig.outline,
      value: crosshairConfig.outlineThickness
    };
    const outlineSize = Math.max(1, Math.floor(outlineSettings.value * scale));
    const outlineOffsets = {
      xy: outlineSize * 0.5,
      wh: outlineSize * 1
    };

    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.lineWidth = outlineSize;
    ctx.globalAlpha = alpha;

    const thickness = Math.max(1, Math.floor((crosshairConfig.thickness + 0.2222) / 0.4444) * scale);
    const length = Math.floor((crosshairConfig.size + 0.2222) / 0.4445) * scale;

    const xPos = centerX - Math.floor(thickness / 2);
    const yPos = centerY - Math.floor(thickness / 2);

    let gap: number;
    if (crosshairConfig.shape === 'classic static') {
      gap = ((crosshairConfig.gap < -4 ? -Math.floor(-crosshairConfig.gap) : Math.floor(crosshairConfig.gap)) + 4) * scale;
    } else if (crosshairConfig.shape === 'classic' || crosshairConfig.shape === 't') {
      gap = ((crosshairConfig.gap < 0 ? -Math.floor(-crosshairConfig.gap) : Math.floor(crosshairConfig.gap)) + 4 + 1) * scale;
    } else {
      gap = ((crosshairConfig.gap < -4 ? -Math.floor(-crosshairConfig.gap) : Math.floor(crosshairConfig.gap)) + 4) * scale;
    }

    const isTStyle = crosshairConfig.shape === 't';

    if (length > 0) {
      drawCrosshairPart(ctx, xPos + thickness + gap, yPos, length, thickness, outlineOffsets, outlineSettings);
      drawCrosshairPart(ctx, xPos - gap - length, yPos, length, thickness, outlineOffsets, outlineSettings);
      
      if (!isTStyle) {
        drawCrosshairPart(ctx, xPos, yPos - gap - length, thickness, length, outlineOffsets, outlineSettings);
      }
      
      drawCrosshairPart(ctx, xPos, yPos + thickness + gap, thickness, length, outlineOffsets, outlineSettings);
    }

    if (crosshairConfig.centerDot) {
      drawCrosshairPart(ctx, xPos, yPos, thickness, thickness, outlineOffsets, outlineSettings);
    }

    ctx.restore();
  };

  // Draw main crosshair (hide when hovering on desktop)
  useEffect(() => {
    if (!isMounted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Only draw center crosshair if not hovering (or if on mobile)
    if (!isHovering || !isDesktop) {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      drawCrosshair(ctx, centerX, centerY);
    }

  }, [crosshairConfig, isMounted, canvasSize, isHovering, isDesktop]);

  // Draw cursor crosshair
  useEffect(() => {
    if (!isMounted || !isHovering || !isDesktop) return;

    const canvas = cursorCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size for cursor
    canvas.width = 100;
    canvas.height = 100;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw crosshair for cursor at full size
    drawCrosshair(ctx, 50, 50, 1);

  }, [crosshairConfig, isMounted, isHovering, isDesktop]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDesktop) return; // Don't track mouse on mobile
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseEnter = () => {
    if (isDesktop) {
      setIsHovering(true);
    }
  };

  const handleMouseLeave = () => {
    if (isDesktop) {
      setIsHovering(false);
    }
  };

  if (!isMounted) {
    return (
      <div style={{
        width: '100%',
        height: '400px',
        background: '#1e1e2e',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ color: '#6b6b80' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={{
        width: '100%',
        height: `${canvasSize.height}px`,
        position: 'relative',
        borderRadius: '8px',
        overflow: 'hidden',
        background: '#2E3440',
        border: '1px solid #434C5E',
        cursor: (isHovering && isDesktop) ? 'none' : 'default'
      }}
    >
      {/* Background */}
      {background && background !== '/images/dark.svg' && (
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.8,
          pointerEvents: 'none'
        }} />
      )}

      {/* Main Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          imageRendering: 'pixelated',
          pointerEvents: 'none'
        }}
      />

      {/* Cursor Crosshair - Only show on desktop when hovering */}
      {isHovering && isDesktop && (
        <canvas
          ref={cursorCanvasRef}
          style={{
            position: 'absolute',
            left: mousePos.x - 50,
            top: mousePos.y - 50,
            width: '100px',
            height: '100px',
            pointerEvents: 'none',
            imageRendering: 'pixelated',
            zIndex: 100
          }}
        />
      )}

      {/* Style indicator */}
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        padding: '4px 8px',
        background: 'rgba(0, 0, 0, 0.7)',
        borderRadius: '4px',
        fontSize: '10px',
        color: '#fff',
        fontFamily: 'monospace',
        pointerEvents: 'none'
      }}>
        {crosshairConfig.shape === 't' ? 'T-STYLE' : crosshairConfig.shape === 'classic static' ? 'CLASSIC STATIC' : 'CLASSIC'}
      </div>

      {/* Hover indicator - Only show on desktop */}
      {isDesktop && (
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          padding: '4px 8px',
          background: 'rgba(0, 0, 0, 0.7)',
          borderRadius: '4px',
          fontSize: '10px',
          color: '#fff',
          fontFamily: 'monospace',
          pointerEvents: 'none'
        }}>
          Hover to see crosshair
        </div>
      )}
    </div>
  );
};

export default CrosshairCanvas;