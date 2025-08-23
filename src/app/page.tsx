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
    const [isDesktop, setIsDesktop] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Check if we're on desktop or mobile
    useEffect(() => {
        const checkScreenSize = () => {
            setIsDesktop(window.innerWidth > 1024);
            setIsMobile(window.innerWidth < 640);
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
            {/* Modern Responsive Header */}
            <header style={{
                background: 'linear-gradient(180deg, rgba(10, 10, 15, 0.95) 0%, rgba(10, 10, 15, 0.85) 100%)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(139, 92, 246, 0.1)',
                top: 0,
                zIndex: 50,
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
            }}>
                <div style={{
                    maxWidth: '1920px',
                    margin: '0 auto',
                    padding: isMobile ? '0 16px' : '0 24px'
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: isMobile ? 'column' : 'row',
                        justifyContent: 'space-between',
                        alignItems: isMobile ? 'stretch' : 'center',
                        gap: isMobile ? '16px' : '24px',
                        padding: isMobile ? '16px 0' : '0',
                        minHeight: isMobile ? 'auto' : '80px'
                    }}>
                        {/* Logo/Brand */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: isMobile ? '12px' : '16px',
                            flex: isMobile ? 'none' : '1 1 auto'
                        }}>
                            {/* Logo Icon */}
                            <div style={{
                                width: isMobile ? '40px' : '48px',
                                height: isMobile ? '40px' : '48px',
                                minWidth: isMobile ? '40px' : '48px',
                                background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                                borderRadius: isMobile ? '10px' : '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)',
                                position: 'relative'
                            }}>
                                <svg 
                                    width={isMobile ? "22" : "28"} 
                                    height={isMobile ? "22" : "28"} 
                                    viewBox="0 0 24 24" 
                                    fill="none"
                                >
                                    <circle cx="12" cy="12" r="2" fill="white"/>
                                    <rect x="11" y="3" width="2" height="5" fill="white"/>
                                    <rect x="11" y="16" width="2" height="5" fill="white"/>
                                    <rect x="3" y="11" width="5" height="2" fill="white"/>
                                    <rect x="16" y="11" width="5" height="2" fill="white"/>
                                </svg>
                            </div>
                            
                            {/* Brand Text */}
                            <div style={{ flex: '1 1 auto' }}>
                                <h1 style={{
                                    fontSize: isMobile ? '18px' : '24px',
                                    fontWeight: '700',
                                    color: '#ffffff',
                                    margin: 0,
                                    letterSpacing: '-0.02em',
                                    lineHeight: 1.2
                                }}>
                                    {isMobile ? 'CS2 Crosshair' : 'CS2 Crosshair Generator'}
                                </h1>
                                {!isMobile && (
                                    <p style={{
                                        fontSize: '13px',
                                        color: '#71717a',
                                        margin: 0,
                                        marginTop: '4px',
                                        letterSpacing: '0.02em'
                                    }}>
                                        Create and customize your perfect crosshair
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Right Section */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            justifyContent: isMobile ? 'stretch' : 'flex-end',
                            flexWrap: 'wrap'
                        }}>

                            {/* GitHub Button */}
                            <button
                                onClick={() => window.open('https://github.com/omar-anwari/CS-Crosshair-Gen', '_blank')}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: isMobile ? '10px 16px' : '10px 18px',
                                    background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: '#ffffff',
                                    fontSize: isMobile ? '13px' : '14px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)',
                                    flex: isMobile ? '1' : 'none',
                                    justifyContent: 'center'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(139, 92, 246, 0.3)';
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                                </svg>
                                <span>{isMobile ? 'Star on GitHub' : 'Star on GitHub'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div style={{ 
                maxWidth: '1920px', 
                margin: '0 auto', 
                padding: isMobile ? '24px 16px' : '32px 24px 24px' 
            }}>
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
                            padding: isMobile ? '16px' : '20px',
                            border: '1px solid rgba(139, 92, 246, 0.1)',
                        }}>
                            <CrosshairCanvas 
                                crosshairConfig={crosshairConfig} 
                                background={background} 
                            />
                        </div>

                        {/* Background Selector Section */}
                        <div style={{
                            background: '#16161f',
                            borderRadius: '8px',
                            padding: isMobile ? '16px' : '20px',
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

                        {/* Console Commands and Pro Crosshairs Side by Side */}
                        {isDesktop && (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '24px'
                            }}>
                                {/* Console Commands Section */}
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

                                {/* Pro Crosshairs Section */}
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
                            padding: isMobile ? '16px' : '20px',
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
                            padding: isMobile ? '16px' : '20px',
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
                            padding: isMobile ? '16px' : '20px',
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

                        {/* Console Commands for Mobile */}
                        {!isDesktop && (
                            <>
                                <div style={{
                                    background: '#16161f',
                                    borderRadius: '8px',
                                    padding: isMobile ? '16px' : '20px',
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
                                    padding: isMobile ? '16px' : '20px',
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
        </div>
    );
};

export default Page;