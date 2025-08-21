'use client';
import React, { useState, useEffect } from 'react';
import { CrosshairConfig } from '../types/crosshair';
import { convertFromUIConfig, generateConsoleCommands } from '../utils/crosshairParser';

interface ConsoleCommandsProps {
    config: CrosshairConfig;
}

const ConsoleCommands: React.FC<ConsoleCommandsProps> = ({ config }) => {
    const [commands, setCommands] = useState<string[]>([]);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        try {
            const crosshair = convertFromUIConfig(config);
            const cmds = generateConsoleCommands(crosshair);
            setCommands(cmds);
        } catch (err) {
            setCommands([]);
        }
    }, [config]);

    const handleCopyAll = () => {
        const allCommands = commands.join('\n');
        navigator.clipboard.writeText(allCommands);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleCopyCommand = (command: string) => {
        navigator.clipboard.writeText(command);
    };

    return (
        <div>
            <div style={{
                background: '#1e1e2e',
                borderRadius: '6px',
                padding: '12px',
                maxHeight: '300px',
                overflowY: 'auto',
                marginBottom: '12px',
                fontFamily: 'monospace',
                fontSize: '12px',
                lineHeight: '1.8'
            }}>
                {commands.map((cmd, index) => (
                    <div 
                        key={index} 
                        style={{ 
                            color: '#e4e4e7',
                            marginBottom: '6px',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            background: 'rgba(139, 92, 246, 0.05)',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                        onClick={() => handleCopyCommand(cmd)}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(139, 92, 246, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(139, 92, 246, 0.05)';
                        }}
                        title="Click to copy"
                    >
                        <span>{cmd}</span>
                        <span style={{
                            fontSize: '10px',
                            color: '#6b6b80',
                            marginLeft: '8px'
                        }}>
                            Click to copy
                        </span>
                    </div>
                ))}
            </div>
            <button
                onClick={handleCopyAll}
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
                {copied ? 'Copied All Commands!' : 'Copy All Commands'}
            </button>
        </div>
    );
};

export default ConsoleCommands;