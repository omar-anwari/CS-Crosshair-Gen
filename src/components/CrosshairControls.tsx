'use client';
import React, { useState } from 'react';
import { CrosshairConfig } from '../types/crosshair';

interface CrosshairControlsProps {
    config: CrosshairConfig;
    onConfigChange: (config: CrosshairConfig) => void;
}

// Default config to use if none is provided
const DEFAULT_CONFIG: CrosshairConfig = {
    color: '#00ff00',
    size: 2.5,
    thickness: 0.5,
    gap: -1,
    outline: true,
    outlineThickness: 1,
    centerDot: false,
    shape: 'classic',
    alpha: 200
};

const CrosshairControls: React.FC<CrosshairControlsProps> = ({ config, onConfigChange }) => {
    const [showColorPicker, setShowColorPicker] = useState(false);
    
    // Use default config if config is undefined
    const safeConfig = config || DEFAULT_CONFIG;

    const handleChange = (key: keyof CrosshairConfig, value: any) => {
        onConfigChange({
            ...safeConfig,
            [key]: value
        });
    };

    const colors = [
        { hex: '#00ff00', name: 'Green' },
        { hex: '#ffff00', name: 'Yellow' },
        { hex: '#00ffff', name: 'Cyan' },
        { hex: '#ff00ff', name: 'Magenta' },
        { hex: '#ffffff', name: 'White' },
        { hex: '#ff0000', name: 'Red' },
        { hex: '#0000ff', name: 'Blue' },
        { hex: '#ffa500', name: 'Orange' }
    ];

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
        }}>
            {/* Color Selection */}
            <div>
                <label style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: '#a1a1aa',
                    marginBottom: '12px'
                }}>
                    COLOR
                </label>
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(4, 1fr)', 
                    gap: '8px',
                    marginBottom: '12px'
                }}>
                    {colors.map((color) => (
                        <button
                            key={color.hex}
                            onClick={() => handleChange('color', color.hex)}
                            style={{
                                width: '100%',
                                height: '32px',
                                borderRadius: '6px',
                                background: color.hex,
                                border: safeConfig.color === color.hex ? '2px solid #8b5cf6' : '1px solid rgba(255,255,255,0.2)',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            title={color.name}
                        />
                    ))}
                </div>
                
                {/* Custom Color */}
                <div style={{ position: 'relative' }}>
                    <div
                        onClick={() => setShowColorPicker(!showColorPicker)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '8px',
                            background: '#1e1e2e',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            border: '1px solid rgba(139, 92, 246, 0.2)'
                        }}
                    >
                        <div style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '4px',
                            background: safeConfig.color,
                            border: '1px solid rgba(255,255,255,0.2)'
                        }} />
                        <span style={{ color: '#e4e4e7', fontSize: '14px' }}>
                            Custom Color: {safeConfig.color.toUpperCase()}
                        </span>
                    </div>
                    
                    {showColorPicker && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            marginTop: '8px',
                            zIndex: 10
                        }}>
                            <input
                                type="color"
                                value={safeConfig.color}
                                onChange={(e) => handleChange('color', e.target.value)}
                                style={{
                                    width: '200px',
                                    height: '40px',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    zIndex: 10
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Shape Selection */}
            <div>
                <label style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: '#a1a1aa',
                    marginBottom: '12px'
                }}>
                    STYLE
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    {['classic static', 'classic', 't-style'].map((shape) => (
                        <button
                            key={shape}
                            onClick={() => handleChange('shape', shape === 't-style' ? 't' : shape)}
                            style={{
                                padding: '12px 16px',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '500',
                                transition: 'all 0.2s',
                                cursor: 'pointer',
                                background: safeConfig.shape === (shape === 't-style' ? 't' : shape) ? '#8b5cf6' : '#1e1e2e',
                                color: safeConfig.shape === (shape === 't-style' ? 't' : shape) ? '#ffffff' : '#a1a1aa',
                                border: 'none'
                            }}
                            onMouseEnter={(e) => {
                                if (safeConfig.shape !== (shape === 't-style' ? 't' : shape)) {
                                    e.currentTarget.style.background = '#27272a';
                                    e.currentTarget.style.color = '#e4e4e7';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (safeConfig.shape !== (shape === 't-style' ? 't' : shape)) {
                                    e.currentTarget.style.background = '#1e1e2e';
                                    e.currentTarget.style.color = '#a1a1aa';
                                }
                            }}
                        >
                            {shape.charAt(0).toUpperCase() + shape.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Length Slider */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <label style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: '#a1a1aa'
                    }}>
                        LENGTH
                    </label>
                    <span style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#8b5cf6'
                    }}>
                        {safeConfig.size}
                    </span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={safeConfig.size}
                    onChange={(e) => handleChange('size', parseFloat(e.target.value))}
                    style={{ width: '100%' }}
                />
            </div>

            {/* Thickness Slider */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <label style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: '#a1a1aa'
                    }}>
                        THICKNESS
                    </label>
                    <span style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#8b5cf6'
                    }}>
                        {safeConfig.thickness}
                    </span>
                </div>
                <input
                    type="range"
                    min="0.1"
                    max="6"
                    step="0.1"
                    value={safeConfig.thickness}
                    onChange={(e) => handleChange('thickness', parseFloat(e.target.value))}
                    style={{ width: '100%' }}
                />
            </div>

            {/* Gap Slider */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <label style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: '#a1a1aa'
                    }}>
                        GAP
                    </label>
                    <span style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#8b5cf6'
                    }}>
                        {safeConfig.gap}
                    </span>
                </div>
                <input
                    type="range"
                    min="-5"
                    max="5"
                    step="0.5"
                    value={safeConfig.gap}
                    onChange={(e) => handleChange('gap', parseFloat(e.target.value))}
                    style={{ width: '100%' }}
                />
            </div>

            {/* Alpha Slider */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <label style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: '#a1a1aa'
                    }}>
                        OPACITY
                    </label>
                    <span style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#8b5cf6'
                    }}>
                        {Math.round((safeConfig.alpha / 255) * 100)}%
                    </span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="255"
                    step="5"
                    value={safeConfig.alpha}
                    onChange={(e) => handleChange('alpha', parseInt(e.target.value))}
                    style={{ width: '100%' }}
                />
            </div>

            {/* Outline Toggle */}
            <div>
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '8px 0'
                }}>
                    <label style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#e4e4e7'
                    }}>
                        Outline
                    </label>
                    <button
                        onClick={() => handleChange('outline', !safeConfig.outline)}
                        style={{
                            width: '48px',
                            height: '26px',
                            borderRadius: '13px',
                            background: safeConfig.outline ? '#8b5cf6' : '#27272a',
                            border: 'none',
                            cursor: 'pointer',
                            position: 'relative',
                            transition: 'background 0.3s'
                        }}
                    >
                        <div style={{
                            position: 'absolute',
                            top: '3px',
                            left: safeConfig.outline ? '25px' : '3px',
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            background: '#ffffff',
                            transition: 'left 0.3s'
                        }} />
                    </button>
                </div>

                {/* Outline Thickness Slider - Only show when outline is enabled */}
                {safeConfig.outline && (
                    <div style={{ marginTop: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <label style={{
                                fontSize: '12px',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                color: '#a1a1aa'
                            }}>
                                OUTLINE THICKNESS
                            </label>
                            <span style={{
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#8b5cf6'
                            }}>
                                {safeConfig.outlineThickness}
                            </span>
                        </div>
                        <input
                            type="range"
                            min="0.5"
                            max="3"
                            step="0.5"
                            value={safeConfig.outlineThickness}
                            onChange={(e) => handleChange('outlineThickness', parseFloat(e.target.value))}
                            style={{ width: '100%' }}
                        />
                    </div>
                )}
            </div>

            {/* Center Dot Toggle */}
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: '8px 0'
            }}>
                <label style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#e4e4e7'
                }}>
                    Center Dot
                </label>
                <button
                    onClick={() => handleChange('centerDot', !safeConfig.centerDot)}
                    style={{
                        width: '48px',
                        height: '26px',
                        borderRadius: '13px',
                        background: safeConfig.centerDot ? '#8b5cf6' : '#27272a',
                        border: 'none',
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'background 0.3s'
                    }}
                >
                    <div style={{
                        position: 'absolute',
                        top: '3px',
                        left: safeConfig.centerDot ? '25px' : '3px',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: '#ffffff',
                        transition: 'left 0.3s'
                    }} />
                </button>
            </div>
        </div>
    );
};

export default CrosshairControls;