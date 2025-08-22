'use client';
import React, { useState, useEffect } from 'react';
import CrosshairCanvas, { BACKGROUNDS } from '../components/CrosshairCanvas';
import CrosshairControls from '../components/CrosshairControls';
import CodeParser from '../components/CodeParser';
import BackgroundSelector from '../components/BackgroundSelector';
import ShareCode from '../components/ShareCode';
import ConsoleCommands from '../components/ConsoleCommands';
import ProCrosshairs from '../components/ProCrosshairs';
import { CrosshairConfig } from '../types/crosshair';

const Page = () => {
    // Initialize with a proper default config
    const [crosshairConfig, setCrosshairConfig] = useState<CrosshairConfig>({
        color: '#00ff00',
        size: 2.5,
        thickness: 0.5,
        gap: -1,
        outline: true,
        outlineThickness: 1,
        centerDot: false,
        shape: 'classic static',
        alpha: 200
    });

    const [background, setBackground] = useState(BACKGROUNDS[0].path);
    const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop' | 'large' | 'xlarge'>('desktop');

    // Check screen size for responsive layout
    useEffect(() => {
        const checkScreenSize = () => {
            const width = window.innerWidth;
            if (width < 768) setScreenSize('mobile');
            else if (width < 1024) setScreenSize('tablet');
            else if (width < 1440) setScreenSize('desktop');
            else if (width < 2560) setScreenSize('large');
            else setScreenSize('xlarge');
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const handleConfigChange = (newConfig: CrosshairConfig) => {
        setCrosshairConfig(newConfig);
    };

    const handleCodeParsed = (parsedConfig: CrosshairConfig) => {
        setCrosshairConfig(parsedConfig);
    };

    const isXLarge = screenSize === 'xlarge';
    const isLarge = screenSize === 'large' || isXLarge;
    const isDesktop = screenSize === 'desktop' || isLarge;
    const isTablet = screenSize === 'tablet';

    // Dynamic sizing based on viewport
    const getMaxWidth = () => {
        if (isXLarge) return '95vw';
        if (screenSize === 'large') return '90vw';
        if (screenSize === 'desktop') return '1400px';
        return '100%';
    };

    const getGridColumns = () => {
        if (isXLarge) return '1.5fr 600px 600px';
        if (screenSize === 'large') return '1fr 500px 450px';
        if (screenSize === 'desktop') return '1fr 420px';
        return '1fr';
    };

    const getPadding = () => {
        if (isXLarge) return '60px';
        if (screenSize === 'large') return '40px';
        if (screenSize === 'desktop') return '24px';
        return '20px';
    };

    const getGap = () => {
        if (isXLarge) return '40px';
        if (screenSize === 'large') return '32px';
        return '24px';
    };

    return (
        <div className="min-h-screen" style={{ 
            background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)',
        }}>
            {/* Header - Portainer Style */}
            <div style={{
                background: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
            }}>
                <div style={{
                    maxWidth: getMaxWidth(),
                    margin: '0 auto',
                    padding: `0 ${getPadding()}`
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        height: isDesktop ? '60px' : '56px',
                    }}>
                        {/* Left side - Title and Badge */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px'
                        }}>
                            {/* Logo/Icon */}
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '6px',
                                background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '18px',
                                fontWeight: 'bold',
                                color: 'white',
                                boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)'
                            }}>
                                ⊹
                            </div>
                            
                            {/* Title */}
                            <h1 style={{
                                fontSize: isDesktop ? '20px' : '18px',
                                fontWeight: '600',
                                color: '#ffffff',
                                margin: 0,
                                letterSpacing: '-0.01em',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }}>
                                CS2 Crosshair Generator
                                <span style={{
                                    padding: '3px 8px',
                                    background: 'rgba(139, 92, 246, 0.15)',
                                    border: '1px solid rgba(139, 92, 246, 0.3)',
                                    borderRadius: '4px',
                                    fontSize: '11px',
                                    fontWeight: '500',
                                    color: '#a78bfa',
                                    letterSpacing: '0.02em'
                                }}>
                                    BETA
                                </span>
                            </h1>
                        </div>

                        {/* Right side - Stats/Info */}
                        <div style={{
                            display: isDesktop ? 'flex' : 'none',
                            alignItems: 'center',
                            gap: '24px'
                        }}>
                            {/* Current Style Indicator */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '6px 12px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                borderRadius: '6px',
                                border: '1px solid rgba(255, 255, 255, 0.08)'
                            }}>
                                <div style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: crosshairConfig.color,
                                    boxShadow: `0 0 8px ${crosshairConfig.color}40`
                                }} />
                                <span style={{
                                    fontSize: '12px',
                                    color: '#9ca3af',
                                    textTransform: 'capitalize'
                                }}>
                                    {crosshairConfig.shape}
                                </span>
                            </div>

                            {/* Version Badge */}
                            <div style={{
                                fontSize: '11px',
                                color: '#6b7280',
                                fontFamily: 'monospace',
                                opacity: 0.8
                            }}>
                                v2.0.0
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Container */}
            <div style={{ 
                padding: `${getGap()} ${getPadding()}`,
                paddingTop: getGap()
            }}>
                <div style={{ 
                    maxWidth: getMaxWidth(), 
                    margin: '0 auto'
                }}>
                    {/* Optional Subtitle/Description */}
                    <div style={{
                        marginBottom: getGap(),
                        padding: `12px 16px`,
                        background: 'rgba(139, 92, 246, 0.05)',
                        border: '1px solid rgba(139, 92, 246, 0.1)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <div style={{
                            width: '4px',
                            height: '24px',
                            background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                            borderRadius: '2px'
                        }} />
                        <p style={{
                            fontSize: isDesktop ? '14px' : '13px',
                            color: '#9ca3af',
                            margin: 0
                        }}>
                            Create and customize your perfect crosshair with real-time preview and pro player configurations
                        </p>
                    </div>

                    {/* Main Content - Multi Column Layout */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: getGridColumns(),
                        gap: getGap(),
                        marginBottom: getGap()
                    }}>
                        {/* Left Column - Preview and Background */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: getGap()
                        }}>
                            {/* Preview Section - Larger on bigger screens */}
                            <div style={{
                                background: '#16161f',
                                borderRadius: isXLarge ? '16px' : isLarge ? '12px' : '8px',
                                padding: isXLarge ? '32px' : isLarge ? '24px' : '20px',
                                border: '1px solid rgba(139, 92, 246, 0.1)',
                                boxShadow: isXLarge ? '0 20px 40px rgba(0, 0, 0, 0.3)' : '0 10px 30px rgba(0, 0, 0, 0.2)'
                            }}>
                                <div style={{
                                    minHeight: isXLarge ? '600px' : isLarge ? '500px' : '400px'
                                }}>
                                    <CrosshairCanvas 
                                        crosshairConfig={crosshairConfig} 
                                        background={background} 
                                    />
                                </div>
                            </div>

                            {/* Background Selector Section */}
                            <div style={{
                                background: '#16161f',
                                borderRadius: isXLarge ? '16px' : isLarge ? '12px' : '8px',
                                padding: isXLarge ? '32px' : isLarge ? '24px' : '20px',
                                border: '1px solid rgba(139, 92, 246, 0.1)'
                            }}>
                                <h2 style={{
                                    fontSize: isXLarge ? '14px' : isLarge ? '12px' : '11px',
                                    fontWeight: '600',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    color: '#6b6b80',
                                    marginBottom: isXLarge ? '24px' : isLarge ? '20px' : '16px'
                                }}>
                                    BACKGROUND
                                </h2>
                                <BackgroundSelector 
                                    onSelect={setBackground}
                                    currentBackground={background}
                                />
                            </div>

                            {/* Console Commands and Pro Crosshairs Side by Side */}
                            {isDesktop && (
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: isLarge ? '1fr 1fr' : '1fr',
                                    gap: getGap()
                                }}>
                                    {/* Console Commands Section */}
                                    <div style={{
                                        background: '#16161f',
                                        borderRadius: isXLarge ? '16px' : isLarge ? '12px' : '8px',
                                        padding: isXLarge ? '32px' : isLarge ? '24px' : '20px',
                                        border: '1px solid rgba(139, 92, 246, 0.1)'
                                    }}>
                                        <h2 style={{
                                            fontSize: isXLarge ? '14px' : isLarge ? '12px' : '11px',
                                            fontWeight: '600',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                            color: '#6b6b80',
                                            marginBottom: isXLarge ? '24px' : isLarge ? '20px' : '16px'
                                        }}>
                                            CONSOLE COMMANDS
                                        </h2>
                                        <ConsoleCommands config={crosshairConfig} />
                                    </div>

                                    {/* Pro Crosshairs Section - Only on large screens in left column */}
                                    {isLarge && (
                                        <div style={{
                                            background: '#16161f',
                                            borderRadius: isXLarge ? '16px' : '12px',
                                            padding: isXLarge ? '32px' : '24px',
                                            border: '1px solid rgba(139, 92, 246, 0.1)'
                                        }}>
                                            <h2 style={{
                                                fontSize: isXLarge ? '14px' : '12px',
                                                fontWeight: '600',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em',
                                                color: '#6b6b80',
                                                marginBottom: isXLarge ? '24px' : '20px'
                                            }}>
                                                PRO CROSSHAIRS
                                            </h2>
                                            <ProCrosshairs onSelectCrosshair={handleCodeParsed} />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Middle Column - Controls (only on large screens) */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: getGap()
                        }}>
                            {/* Customize Section */}
                            <div style={{
                                background: '#16161f',
                                borderRadius: isXLarge ? '16px' : isLarge ? '12px' : '8px',
                                padding: isXLarge ? '32px' : isLarge ? '24px' : '20px',
                                border: '1px solid rgba(139, 92, 246, 0.1)',
                                minHeight: isXLarge ? '700px' : 'auto'
                            }}>
                                <h2 style={{
                                    fontSize: isXLarge ? '14px' : isLarge ? '12px' : '11px',
                                    fontWeight: '600',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    color: '#6b6b80',
                                    marginBottom: isXLarge ? '24px' : isLarge ? '20px' : '16px'
                                }}>
                                    CUSTOMIZE
                                </h2>
                                <CrosshairControls 
                                    config={crosshairConfig}
                                    onConfigChange={handleConfigChange}
                                />
                            </div>

                            {/* Pro Crosshairs for desktop (not large) */}
                            {isDesktop && !isLarge && (
                                <div style={{
                                    background: '#16161f',
                                    borderRadius: '8px',
                                    padding: '20px',
                                    border: '1px solid rgba(139, 92, 246, 0.1)'
                                }}>
                                    <h2 style={{
                                        fontSize: '11px',
                                        fontWeight: '600',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        color: '#6b6b80',
                                        marginBottom: '16px'
                                    }}>
                                        PRO CROSSHAIRS
                                    </h2>
                                    <ProCrosshairs onSelectCrosshair={handleCodeParsed} />
                                </div>
                            )}
                        </div>

                        {/* Right Column - Import/Export (only on large screens) */}
                        {isLarge && (
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: getGap()
                            }}>
                                {/* Import Code Section */}
                                <div style={{
                                    background: '#16161f',
                                    borderRadius: isXLarge ? '16px' : '12px',
                                    padding: isXLarge ? '32px' : '24px',
                                    border: '1px solid rgba(139, 92, 246, 0.1)'
                                }}>
                                    <h2 style={{
                                        fontSize: isXLarge ? '14px' : '12px',
                                        fontWeight: '600',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        color: '#6b6b80',
                                        marginBottom: isXLarge ? '24px' : '20px'
                                    }}>
                                        IMPORT CODE
                                    </h2>
                                    <CodeParser onConfigParsed={handleCodeParsed} />
                                </div>

                                {/* Share Code Section */}
                                <div style={{
                                    background: '#16161f',
                                    borderRadius: isXLarge ? '16px' : '12px',
                                    padding: isXLarge ? '32px' : '24px',
                                    border: '1px solid rgba(139, 92, 246, 0.1)'
                                }}>
                                    <h2 style={{
                                        fontSize: isXLarge ? '14px' : '12px',
                                        fontWeight: '600',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        color: '#6b6b80',
                                        marginBottom: isXLarge ? '24px' : '20px'
                                    }}>
                                        SHARE CODE
                                    </h2>
                                    <ShareCode config={crosshairConfig} />
                                </div>

                                {/* Settings Summary for XLarge screens */}
                                {isXLarge && (
                                    <div style={{
                                        background: '#16161f',
                                        borderRadius: '16px',
                                        padding: '32px',
                                        border: '1px solid rgba(139, 92, 246, 0.1)'
                                    }}>
                                        <h2 style={{
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                            color: '#6b6b80',
                                            marginBottom: '24px'
                                        }}>
                                            CURRENT SETTINGS
                                        </h2>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 1fr',
                                            gap: '16px',
                                            fontSize: '14px'
                                        }}>
                                            <div>
                                                <span style={{ color: '#6b6b80' }}>Style:</span>
                                                <span style={{ color: '#ffffff', marginLeft: '8px' }}>
                                                    {crosshairConfig.shape}
                                                </span>
                                            </div>
                                            <div>
                                                <span style={{ color: '#6b6b80' }}>Color:</span>
                                                <span style={{ color: crosshairConfig.color, marginLeft: '8px' }}>
                                                    {crosshairConfig.color}
                                                </span>
                                            </div>
                                            <div>
                                                <span style={{ color: '#6b6b80' }}>Size:</span>
                                                <span style={{ color: '#ffffff', marginLeft: '8px' }}>
                                                    {crosshairConfig.size}
                                                </span>
                                            </div>
                                            <div>
                                                <span style={{ color: '#6b6b80' }}>Thickness:</span>
                                                <span style={{ color: '#ffffff', marginLeft: '8px' }}>
                                                    {crosshairConfig.thickness}
                                                </span>
                                            </div>
                                            <div>
                                                <span style={{ color: '#6b6b80' }}>Gap:</span>
                                                <span style={{ color: '#ffffff', marginLeft: '8px' }}>
                                                    {crosshairConfig.gap}
                                                </span>
                                            </div>
                                            <div>
                                                <span style={{ color: '#6b6b80' }}>Opacity:</span>
                                                <span style={{ color: '#ffffff', marginLeft: '8px' }}>
                                                    {Math.round((crosshairConfig.alpha / 255) * 100)}%
                                                </span>
                                            </div>
                                            <div>
                                                <span style={{ color: '#6b6b80' }}>Outline:</span>
                                                <span style={{ color: '#ffffff', marginLeft: '8px' }}>
                                                    {crosshairConfig.outline ? 'Yes' : 'No'}
                                                </span>
                                            </div>
                                            <div>
                                                <span style={{ color: '#6b6b80' }}>Center Dot:</span>
                                                <span style={{ color: '#ffffff', marginLeft: '8px' }}>
                                                    {crosshairConfig.centerDot ? 'Yes' : 'No'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Import/Export for non-large screens */}
                        {!isLarge && (
                            <>
                                {/* Import Code Section */}
                                <div style={{
                                    background: '#16161f',
                                    borderRadius: '8px',
                                    padding: '20px',
                                    border: '1px solid rgba(139, 92, 246, 0.1)',
                                    gridColumn: isDesktop ? 'span 2' : 'span 1'
                                }}>
                                    <h2 style={{
                                        fontSize: '11px',
                                        fontWeight: '600',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        color: '#6b6b80',
                                        marginBottom: '16px'
                                    }}>
                                        IMPORT CODE
                                    </h2>
                                    <CodeParser onConfigParsed={handleCodeParsed} />
                                </div>

                                {/* Share Code Section */}
                                <div style={{
                                    background: '#16161f',
                                    borderRadius: '8px',
                                    padding: '20px',
                                    border: '1px solid rgba(139, 92, 246, 0.1)',
                                    gridColumn: isDesktop ? 'span 2' : 'span 1'
                                }}>
                                    <h2 style={{
                                        fontSize: '11px',
                                        fontWeight: '600',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        color: '#6b6b80',
                                        marginBottom: '16px'
                                    }}>
                                        SHARE CODE
                                    </h2>
                                    <ShareCode config={crosshairConfig} />
                                </div>
                            </>
                        )}

                        {/* Console Commands and Pro Crosshairs for Mobile/Tablet */}
                        {!isDesktop && (
                            <>
                                <div style={{
                                    background: '#16161f',
                                    borderRadius: '8px',
                                    padding: '20px',
                                    border: '1px solid rgba(139, 92, 246, 0.1)'
                                }}>
                                    <h2 style={{
                                        fontSize: '11px',
                                        fontWeight: '600',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        color: '#6b6b80',
                                        marginBottom: '16px'
                                    }}>
                                        CONSOLE COMMANDS
                                    </h2>
                                    <ConsoleCommands config={crosshairConfig} />
                                </div>

                                <div style={{
                                    background: '#16161f',
                                    borderRadius: '8px',
                                    padding: '20px',
                                    border: '1px solid rgba(139, 92, 246, 0.1)'
                                }}>
                                    <h2 style={{
                                        fontSize: '11px',
                                        fontWeight: '600',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        color: '#6b6b80',
                                        marginBottom: '16px'
                                    }}>
                                        PRO CROSSHAIRS
                                    </h2>
                                    <ProCrosshairs onSelectCrosshair={handleCodeParsed} />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer style={{
                textAlign: 'center',
                marginTop: isXLarge ? '80px' : isLarge ? '60px' : '40px',
                paddingTop: isXLarge ? '40px' : isLarge ? '32px' : '24px',
                paddingBottom: isXLarge ? '40px' : isLarge ? '32px' : '24px',
                borderTop: '1px solid rgba(139, 92, 246, 0.1)',
                maxWidth: getMaxWidth(),
                margin: `${isXLarge ? '80px' : isLarge ? '60px' : '40px'} auto 0`
            }}>
                <p style={{
                    color: '#6b6b80',
                    fontSize: isXLarge ? '16px' : isLarge ? '14px' : '12px'
                }}>
                    CS2 Crosshair Generator © Omar Anwari 2025 | Not affiliated with Valve Corporation
                </p>
            </footer>
        </div>
    );
};

export default Page;