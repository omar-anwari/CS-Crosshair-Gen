'use client';
import React from 'react';
import { BACKGROUNDS } from './CrosshairCanvas';

interface BackgroundSelectorProps {
    onSelect: (background: string) => void;
    currentBackground: string;
}

const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({ onSelect, currentBackground }) => {
    return (
        <div style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap'
        }}>
            {BACKGROUNDS.map((bg) => (
                <button
                    key={bg.name}
                    onClick={() => onSelect(bg.path)}
                    style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '8px',
                        border: currentBackground === bg.path 
                            ? '3px solid #8b5cf6' 
                            : '1px solid rgba(139, 92, 246, 0.2)',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        position: 'relative',
                        padding: 0,
                        background: '#1e1e2e'
                    }}
                    title={bg.name}
                >
                    <div style={{
                        width: '100%',
                        height: '100%',
                        backgroundImage: `url(${bg.path})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }} />
                </button>
            ))}
        </div>
    );
};

export default BackgroundSelector;
