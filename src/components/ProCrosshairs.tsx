'use client';
import React, { useState } from 'react';
import { CrosshairConfig } from '../types/crosshair';
import { proCrosshairs, ProCrosshair } from '../data/proCrosshairs';
import { parseCS2Code } from '../utils/crosshairParser';

interface ProCrosshairsProps {
    onSelectCrosshair: (config: CrosshairConfig) => void;
}

const ProCrosshairs: React.FC<ProCrosshairsProps> = ({ onSelectCrosshair }) => {
    const [selectedPlayer, setSelectedPlayer] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [copiedCode, setCopiedCode] = useState<string>('');

    const filteredCrosshairs = proCrosshairs.filter(pro =>
        pro.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pro.team?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pro.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (pro: ProCrosshair) => {
        setSelectedPlayer(pro.name);
        const config = parseCS2Code(pro.code);
        if (config) {
            onSelectCrosshair(config);
        }
    };

    const handleCopyCode = (code: string, playerName: string, e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(code);
        setCopiedCode(playerName);
        setTimeout(() => setCopiedCode(''), 2000);
    };

    // Enhanced crosshair preview renderer
    const renderCrosshairPreview = (code: string) => {
        const config = parseCS2Code(code);
        if (!config) return null;

        // Scale for preview
        const scale = 1;
        const containerSize = 50;
        const center = containerSize / 2;
        
        // Calculate pixel sizes
        const gapPixels = Math.max(0, config.gap * scale);
        const sizePixels = config.size * 3 * scale;
        const thicknessPixels = Math.max(1, config.thickness * 2 * scale);
        const outlinePixels = config.outline ? Math.max(1, config.outlineThickness * scale) : 0;
        const dotSize = 2;

        // Calculate if crosshair lines should be visible
        const showLines = gapPixels < sizePixels;

        return (
            <div style={{
                width: `${containerSize}px`,
                height: `${containerSize}px`,
                background: 'radial-gradient(circle, #2a2a3a 0%, #1a1a2a 100%)',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid #2a2a3a'
            }}>
                <svg 
                    width={containerSize} 
                    height={containerSize}
                    style={{ position: 'absolute', top: 0, left: 0 }}
                >
                    {/* Render outline if enabled */}
                    {config.outline && showLines && (
                        <g>
                            {/* Top line outline */}
                            <rect
                                x={center - (thicknessPixels / 2) - outlinePixels}
                                y={center - sizePixels - gapPixels - outlinePixels}
                                width={thicknessPixels + outlinePixels * 2}
                                height={sizePixels + outlinePixels}
                                fill="black"
                                opacity={config.alpha / 255}
                            />
                            {/* Bottom line outline */}
                            <rect
                                x={center - (thicknessPixels / 2) - outlinePixels}
                                y={center + gapPixels}
                                width={thicknessPixels + outlinePixels * 2}
                                height={sizePixels + outlinePixels}
                                fill="black"
                                opacity={config.alpha / 255}
                            />
                            {/* Left line outline */}
                            <rect
                                x={center - sizePixels - gapPixels - outlinePixels}
                                y={center - (thicknessPixels / 2) - outlinePixels}
                                width={sizePixels + outlinePixels}
                                height={thicknessPixels + outlinePixels * 2}
                                fill="black"
                                opacity={config.alpha / 255}
                            />
                            {/* Right line outline */}
                            <rect
                                x={center + gapPixels}
                                y={center - (thicknessPixels / 2) - outlinePixels}
                                width={sizePixels + outlinePixels}
                                height={thicknessPixels + outlinePixels * 2}
                                fill="black"
                                opacity={config.alpha / 255}
                            />
                        </g>
                    )}

                    {/* Render crosshair lines */}
                    {showLines && (
                        <g>
                            {/* Top line */}
                            <rect
                                x={center - (thicknessPixels / 2)}
                                y={center - sizePixels - gapPixels}
                                width={thicknessPixels}
                                height={sizePixels}
                                fill={config.color}
                                opacity={config.alpha / 255}
                            />
                            {/* Bottom line */}
                            <rect
                                x={center - (thicknessPixels / 2)}
                                y={center + gapPixels}
                                width={thicknessPixels}
                                height={sizePixels}
                                fill={config.color}
                                opacity={config.alpha / 255}
                            />
                            {/* Left line */}
                            <rect
                                x={center - sizePixels - gapPixels}
                                y={center - (thicknessPixels / 2)}
                                width={sizePixels}
                                height={thicknessPixels}
                                fill={config.color}
                                opacity={config.alpha / 255}
                            />
                            {/* Right line */}
                            <rect
                                x={center + gapPixels}
                                y={center - (thicknessPixels / 2)}
                                width={sizePixels}
                                height={thicknessPixels}
                                fill={config.color}
                                opacity={config.alpha / 255}
                            />
                        </g>
                    )}

                    {/* Center dot */}
                    {config.centerDot && (
                        <>
                            {/* Dot outline */}
                            {config.outline && (
                                <circle
                                    cx={center}
                                    cy={center}
                                    r={dotSize + outlinePixels}
                                    fill="black"
                                    opacity={config.alpha / 255}
                                />
                            )}
                            {/* Dot */}
                            <circle
                                cx={center}
                                cy={center}
                                r={dotSize}
                                fill={config.color}
                                opacity={config.alpha / 255}
                            />
                        </>
                    )}
                </svg>
            </div>
        );
    };

    return (
        <div>
            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search players, teams, or roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: '#0a0a0f',
                    border: '1px solid #2a2a3a',
                    borderRadius: '4px',
                    color: '#ffffff',
                    fontSize: '14px',
                    marginBottom: '16px',
                    outline: 'none'
                }}
                onFocus={(e) => {
                    e.target.style.borderColor = '#8b5cf6';
                }}
                onBlur={(e) => {
                    e.target.style.borderColor = '#2a2a3a';
                }}
            />

            {/* Pro Crosshairs Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                gap: '12px',
                maxHeight: '300px',
                overflowY: 'auto',
                padding: '2px'
            }}>
                {filteredCrosshairs.map((pro) => (
                    <div
                        key={pro.name}
                        onClick={() => handleSelect(pro)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            padding: '12px',
                            background: selectedPlayer === pro.name ? '#1a1a2a' : '#0a0a0f',
                            border: `1px solid ${selectedPlayer === pro.name ? '#8b5cf6' : '#2a2a3a'}`,
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            gap: '8px',
                            position: 'relative'
                        }}
                        onMouseEnter={(e) => {
                            if (selectedPlayer !== pro.name) {
                                e.currentTarget.style.background = '#1a1a2a';
                                e.currentTarget.style.borderColor = '#3a3a4a';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (selectedPlayer !== pro.name) {
                                e.currentTarget.style.background = '#0a0a0f';
                                e.currentTarget.style.borderColor = '#2a2a3a';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }
                        }}
                    >
                        {/* Selected indicator */}
                        {selectedPlayer === pro.name && (
                            <div style={{
                                position: 'absolute',
                                top: '4px',
                                right: '4px',
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                background: '#8b5cf6',
                                boxShadow: '0 0 8px rgba(139, 92, 246, 0.5)'
                            }} />
                        )}
                        
                        {/* Crosshair Preview */}
                        {renderCrosshairPreview(pro.code)}
                        
                        {/* Player Info */}
                        <div style={{
                            textAlign: 'center',
                            width: '100%'
                        }}>
                            <div style={{
                                color: '#ffffff',
                                fontSize: '13px',
                                fontWeight: '600',
                                marginBottom: '2px'
                            }}>
                                {pro.name}
                            </div>
                            {pro.team && (
                                <div style={{
                                    color: '#8b5cf6',
                                    fontSize: '11px'
                                }}>
                                    {pro.team}
                                </div>
                            )}
                            {pro.role && (
                                <div style={{
                                    color: '#6b6b80',
                                    fontSize: '10px'
                                }}>
                                    {pro.role}
                                </div>
                            )}
                        </div>

                        {/* Copy Button */}
                        <button
                            onClick={(e) => handleCopyCode(pro.code, pro.name, e)}
                            style={{
                                padding: '4px 8px',
                                background: copiedCode === pro.name ? 'rgba(34, 197, 94, 0.1)' : 'rgba(139, 92, 246, 0.1)',
                                border: `1px solid ${copiedCode === pro.name ? 'rgba(34, 197, 94, 0.2)' : 'rgba(139, 92, 246, 0.2)'}`,
                                borderRadius: '4px',
                                color: copiedCode === pro.name ? '#22c55e' : '#8b5cf6',
                                fontSize: '10px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                width: '100%',
                                fontWeight: '500'
                            }}
                            onMouseEnter={(e) => {
                                if (copiedCode !== pro.name) {
                                    e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (copiedCode !== pro.name) {
                                    e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)';
                                }
                            }}
                        >
                            {copiedCode === pro.name ? '✓ Copied!' : 'Copy Code'}
                        </button>
                    </div>
                ))}
            </div>

            {filteredCrosshairs.length === 0 && (
                <div style={{
                    textAlign: 'center',
                    color: '#6b6b80',
                    fontSize: '14px',
                    padding: '20px'
                }}>
                    No players found matching "{searchTerm}"
                </div>
            )}
        </div>
    );
};

export default ProCrosshairs;