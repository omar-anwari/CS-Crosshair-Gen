'use client';
import React, { useState, useEffect } from 'react';
import CrosshairCanvas, { BACKGROUNDS } from '../components/CrosshairCanvas';
import CrosshairControls from '../components/CrosshairControls';
import CodeParser from '../components/CodeParser';
import BackgroundSelector from '../components/BackgroundSelector';
import ShareCode from '../components/ShareCode';
import ConsoleCommands from '../components/ConsoleCommands';
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
    const [isDesktop, setIsDesktop] = useState(false);

    // Check if we're on desktop
    useEffect(() => {
        const checkScreenSize = () => {
            setIsDesktop(window.innerWidth > 1024);
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

    return (
        <div className="min-h-screen" style={{ background: '#0a0a0f' }}>
            {/* Header */}
            <div style={{ 
                padding: '24px 0',
                borderBottom: '1px solid rgba(139, 92, 246, 0.1)',
                marginBottom: '32px'
            }}>
                <h1 style={{
                    textAlign: 'center',
                    fontSize: '24px',
                    fontWeight: '600',
                    color: '#ffffff',
                    letterSpacing: '-0.02em'
                }}>
                    CS2 Crosshair Generator
                </h1>
                <p style={{
                    textAlign: 'center',
                    fontSize: '14px',
                    color: '#6b6b80',
                    marginTop: '8px'
                }}>
                    Create and customize your perfect crosshair
                </p>
            </div>

            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
                {/* Main Content - Two Column Layout on Desktop */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: isDesktop ? '1fr 420px' : '1fr',
                    gap: '24px',
                    marginBottom: '24px'
                }}>
                    {/* Left Column - Preview and Background */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '24px',
                        order: isDesktop ? 1 : 1
                    }}>
                        {/* Preview Section */}
                        <div style={{
                            background: '#16161f',
                            borderRadius: '8px',
                            padding: '20px',
                            border: '1px solid rgba(139, 92, 246, 0.1)',
                            position: isDesktop ? 'sticky' : 'static',
                            top: isDesktop ? '20px' : 'auto'
                        }}>
                            <h2 style={{
                                fontSize: '11px',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                color: '#6b6b80',
                                marginBottom: '16px'
                            }}>
                                PREVIEW
                            </h2>
                            <CrosshairCanvas 
                                crosshairConfig={crosshairConfig} 
                                background={background} 
                            />
                        </div>

                        {/* Background Selection */}
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
                                BACKGROUND
                            </h2>
                            <BackgroundSelector 
                                onSelect={setBackground}
                                currentBackground={background}
                            />
                        </div>

                        {/* Console Commands - Show in left column on desktop */}
                        {isDesktop && (
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
                        )}
                    </div>

                    {/* Right Column - All Settings */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '24px',
                        order: isDesktop ? 2 : 2
                    }}>
                        {/* Customize Section */}
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
                                CUSTOMIZE
                            </h2>
                            <CrosshairControls 
                                config={crosshairConfig}
                                onConfigChange={handleConfigChange}
                            />
                        </div>

                        {/* Import Code Section */}
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
                                IMPORT CODE
                            </h2>
                            <CodeParser onConfigParsed={handleCodeParsed} />
                        </div>

                        {/* Share Code Section */}
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
                                SHARE CODE
                            </h2>
                            <ShareCode config={crosshairConfig} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;