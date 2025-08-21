'use client';
import React, { useState, useEffect } from 'react';
import { CrosshairConfig } from '../types/crosshair';
import { encodeCrosshair, convertFromUIConfig } from '../utils/crosshairParser';

interface ShareCodeProps {
    config: CrosshairConfig;
}

const ShareCode: React.FC<ShareCodeProps> = ({ config }) => {
    const [shareCode, setShareCode] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        try {
            const crosshair = convertFromUIConfig(config);
            const code = encodeCrosshair(crosshair);
            setShareCode(code);
        } catch (err) {
            setShareCode('');
        }
    }, [config]);

    const handleCopy = () => {
        navigator.clipboard.writeText(shareCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div>
            <input
                type="text"
                value={shareCode}
                readOnly
                style={{
                    width: '100%',
                    padding: '10px',
                    background: '#1e1e2e',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '13px',
                    marginBottom: '12px'
                }}
            />
            <button
                onClick={handleCopy}
                style={{
                    width: '100%',
                    padding: '10px',
                    background: copied ? '#10b981' : '#8b5cf6',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                }}
            >
                {copied ? 'Copied!' : 'Copy'}
            </button>
        </div>
    );
};

export default ShareCode;
