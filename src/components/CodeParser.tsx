'use client';
import React, { useState } from 'react';
import { decodeCrosshairShareCode, convertToUIConfig } from '../utils/crosshairParser';
import { CrosshairConfig } from '../types/crosshair';

interface CodeParserProps {
    onConfigParsed: (config: CrosshairConfig) => void;
}

const CodeParser: React.FC<CodeParserProps> = ({ onConfigParsed }) => {
    const [shareCode, setShareCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleParse = () => {
        try {
            setError('');
            setSuccess(false);
            
            const trimmedCode = shareCode.trim();
            if (!trimmedCode) {
                setError('Please enter a share code');
                return;
            }

            // Decode the share code
            const crosshair = decodeCrosshairShareCode(trimmedCode);
            
            // Log for debugging
            console.log('Decoded crosshair:', crosshair);
            
            // Convert to UI config
            const uiConfig = convertToUIConfig(crosshair);
            
            // Log for debugging
            console.log('UI Config:', uiConfig);
            
            // Pass to parent
            onConfigParsed(uiConfig);
            
            setSuccess(true);
            setTimeout(() => setSuccess(false), 2000);
        } catch (err) {
            console.error('Parse error:', err);
            setError('Invalid share code format');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleParse();
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
                <input
                    type="text"
                    value={shareCode}
                    onChange={(e) => setShareCode(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="CSGO-xxxxx-xxxxx-xxxxx-xxxxx-xxxxx"
                    style={{
                        flex: 1,
                        padding: '10px 12px',
                        background: '#1e1e2e',
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                        borderRadius: '6px',
                        color: '#e4e4e7',
                        fontSize: '14px',
                        fontFamily: 'monospace',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.5)';
                    }}
                    onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.2)';
                    }}
                />
                <button
                    onClick={handleParse}
                    style={{
                        padding: '10px 20px',
                        background: '#8b5cf6',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#7c3aed';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#8b5cf6';
                    }}
                >
                    Import
                </button>
            </div>
            
            {error && (
                <div style={{
                    padding: '8px 12px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '6px',
                    color: '#ef4444',
                    fontSize: '13px'
                }}>
                    {error}
                </div>
            )}
            
            {success && (
                <div style={{
                    padding: '8px 12px',
                    background: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: '6px',
                    color: '#22c55e',
                    fontSize: '13px'
                }}>
                    ✓ Crosshair imported successfully!
                </div>
            )}
        </div>
    );
};

export default CodeParser;
