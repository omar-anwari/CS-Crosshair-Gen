// CS2 Crosshair Parser
// Based on the provided code for decoding/encoding crosshair sharecodes
'use client';

import { Crosshair, CrosshairConfig } from '../types/crosshair';

const DICTIONARY = 'ABCDEFGHJKLMNOPQRSTUVWXYZabcdefhijkmnopqrstuvwxyz23456789';
const DICTIONARY_LENGTH = BigInt(DICTIONARY.length);
const SHARECODE_PATTERN = /^CSGO(-?[\w]{5}){5}$/;

// CS2 Crosshair styles
export const CS2_STYLES = {
    DEFAULT: 0,
    DEFAULT_STATIC: 1,
    CLASSIC: 2,
    CLASSIC_DYNAMIC: 3,
    CLASSIC_STATIC: 4,
    LEGACY: 5
};

// Predefined colors matching CS2 exactly
const predefinedColors = [
    [255, 0, 0],    // 0 - Red
    [0, 255, 0],    // 1 - Green (pure green)
    [255, 255, 0],  // 2 - Yellow
    [0, 0, 255],    // 3 - Blue
    [0, 255, 255],  // 4 - Cyan
];

function decodeSignedByte(byte: number): number {
    return byte > 127 ? byte - 256 : byte;
}

function encodeSignedByte(value: number): number {
    return value < 0 ? value + 256 : value;
}

function shareCodeToBytes(shareCode: string): Uint8Array {
    if (!shareCode.match(SHARECODE_PATTERN)) {
        throw new Error('Invalid share code');
    }
    
    // Remove prefix and dashes
    const code = shareCode.replace(/CSGO|-/g, '');
    const chars = Array.from(code).reverse();
    
    let bigNum = BigInt(0);
    for (let i = 0; i < chars.length; i++) {
        bigNum = bigNum * DICTIONARY_LENGTH + BigInt(DICTIONARY.indexOf(chars[i]));
    }
    
    const bytes = new Uint8Array(18);
    for (let i = 17; i >= 0; i--) {
        bytes[i] = Number(bigNum & BigInt(0xFF));
        bigNum >>= BigInt(8);
    }
    
    return bytes;
}

function bytesToShareCode(bytes: Uint8Array): string {
    let bigNum = BigInt(0);
    let multiplier = BigInt(1);
    
    for (let i = bytes.length - 1; i >= 0; i--) {
        bigNum += BigInt(bytes[i]) * multiplier;
        multiplier *= BigInt(256);
    }
    
    let result = '';
    for (let i = 0; i < 25; i++) {
        const remainder = bigNum % DICTIONARY_LENGTH;
        bigNum /= DICTIONARY_LENGTH;
        result += DICTIONARY.charAt(Number(remainder));
    }
    
    return `CSGO-${result.slice(0, 5)}-${result.slice(5, 10)}-${result.slice(10, 15)}-${result.slice(15, 20)}-${result.slice(20, 25)}`;
}

function calculateChecksum(bytes: number[]): number {
    let sum = 0;
    for (let i = 1; i < bytes.length; i++) {
        sum += bytes[i];
    }
    return sum % 256;
}

export function decodeCrosshairShareCode(shareCode: string): Crosshair {
    const bytes = shareCodeToBytes(shareCode);
    
    // Verify checksum (but continue even if it doesn't match)
    const expectedChecksum = Array.from(bytes.slice(1)).reduce((a, b) => a + b, 0) % 256;
    if (bytes[0] !== expectedChecksum) {
        console.warn('Checksum mismatch, but continuing to decode');
    }
    
    // Decode color - the color index is in the lower 3 bits of byte 10
    const colorIndex = bytes[10] & 0x07;
    let red = bytes[4];
    let green = bytes[5];
    let blue = bytes[6];
    
    // Only use custom RGB if color index is 5
    if (colorIndex !== 5 && colorIndex >= 0 && colorIndex < predefinedColors.length) {
        // Use predefined color - CS2 uses pure RGB values
        [red, green, blue] = predefinedColors[colorIndex];
    } else if (colorIndex !== 5) {
        // Default to green if invalid index
        red = 0;
        green = 255;
        blue = 0;
    }
    // If colorIndex is 5, use the custom RGB values from bytes 4-6
    
    // Decode all settings - DO NOT modify the gap value!
    const crosshair = {
        gap: decodeSignedByte(bytes[2]) / 10,  // This should be -1 for your example
        outline: (bytes[3] & 0xFF) / 2,
        red: red,
        green: green,
        blue: blue,
        alpha: bytes[7],
        splitDistance: bytes[8] & 0x7F,
        fixedCrosshairGap: decodeSignedByte(bytes[9]) / 10,  // This should be 3
        color: colorIndex,
        outlineEnabled: (bytes[10] & 0x08) === 0x08,
        outlineThickness: (bytes[3] & 0xFF) / 2,
        centerDot: (bytes[13] & 0x10) === 0x10,
        thickness: (bytes[12] & 0x3F) / 10,
        size: (((bytes[15] & 0x1F) << 8) + bytes[14]) / 10,
        length: (((bytes[15] & 0x1F) << 8) + bytes[14]) / 10,
        style: (bytes[13] & 0x0E) >> 1,
        splitSizeRatio: ((bytes[11] >> 4) & 0x0F) / 10,
        minDistance: 0,
        followRecoil: (bytes[8] & 0x80) === 0x80,
        alphaEnabled: (bytes[13] & 0x40) === 0x40,
        tStyleEnabled: (bytes[13] & 0x80) === 0x80,
        deployedWeaponGapEnabled: (bytes[13] & 0x20) === 0x20,
        innerSplitAlpha: ((bytes[10] >> 4) & 0x0F) / 10,
        outerSplitAlpha: (bytes[11] & 0x0F) / 10,
    };
    
    console.log('Decoded crosshair:', {
        gap: crosshair.gap,
        fixedCrosshairGap: crosshair.fixedCrosshairGap,
        size: crosshair.size,
        thickness: crosshair.thickness,
        style: crosshair.style
    });
    
    return crosshair as any;
}

export function encodeCrosshair(crosshair: any): string {
    const bytes: number[] = [0, 1]; // Checksum placeholder and version
    
    // Determine if we should use custom color or preset
    let useCustomColor = crosshair.color === 5;
    let colorIndex = crosshair.color;
    
    // Check if the RGB matches a preset color
    if (!useCustomColor) {
        for (let i = 0; i < predefinedColors.length; i++) {
            const [pr, pg, pb] = predefinedColors[i];
            if (crosshair.red === pr && crosshair.green === pg && crosshair.blue === pb) {
                colorIndex = i;
                useCustomColor = false;
                break;
            }
        }
        // If no match found, use custom color
        if (colorIndex === crosshair.color && crosshair.color !== 5) {
            useCustomColor = true;
            colorIndex = 5;
        }
    }
    
    bytes.push(encodeSignedByte(Math.round(crosshair.gap * 10)));
    bytes.push(Math.floor((crosshair.outlineThickness || crosshair.outline || 0) * 2));
    bytes.push(crosshair.red);
    bytes.push(crosshair.green);
    bytes.push(crosshair.blue);
    bytes.push(crosshair.alpha);
    bytes.push((crosshair.splitDistance & 0x7F) | (crosshair.followRecoil ? 0x80 : 0));
    bytes.push(encodeSignedByte(Math.round(crosshair.fixedCrosshairGap * 10)));
    bytes.push(
        (colorIndex & 0x07) |
        (crosshair.outlineEnabled ? 0x08 : 0) |
        (Math.round((crosshair.innerSplitAlpha || 1) * 10) << 4)
    );
    bytes.push(
        (Math.round((crosshair.outerSplitAlpha || 0.5) * 10) & 0x0F) |
        (Math.round((crosshair.splitSizeRatio || 0.3) * 10) << 4)
    );
    bytes.push(Math.round(crosshair.thickness * 10));
    bytes.push(
        ((crosshair.style & 0x07) << 1) |
        (crosshair.centerDot ? 0x10 : 0) |
        (crosshair.deployedWeaponGapEnabled ? 0x20 : 0) |
        (crosshair.alphaEnabled !== false ? 0x40 : 0) |
        (crosshair.tStyleEnabled ? 0x80 : 0)
    );
    bytes.push(Math.round(crosshair.size * 10) % 256);
    bytes.push(Math.floor(Math.round(crosshair.size * 10) / 256));
    bytes.push(0);
    bytes.push(0);
    
    // Calculate and set checksum
    bytes[0] = calculateChecksum(bytes);
    
    return bytesToShareCode(new Uint8Array(bytes));
}

export function convertToUIConfig(crosshair: Crosshair): CrosshairConfig {
    const r = Math.min(255, Math.max(0, crosshair.red)).toString(16).padStart(2, '0');
    const g = Math.min(255, Math.max(0, crosshair.green)).toString(16).padStart(2, '0');
    const b = Math.min(255, Math.max(0, crosshair.blue)).toString(16).padStart(2, '0');
    const hexColor = `#${r}${g}${b}`;
    
    let shape: 'classic static' | 'classic' | 't' = 'classic static';
    
    // Check for T-style flag
    if (crosshair.tStyleEnabled) {
        shape = 't';
    } else if (crosshair.style === 4) {
        shape = 'classic static';
    } else if (crosshair.style === 2 || crosshair.style === 3) {
        shape = 'classic';
    }
    
    // Always use the gap value for the UI slider
    // This corresponds to cl_crosshairgap
    const uiConfig = {
        color: hexColor,
        size: crosshair.size || crosshair.length || 1,
        thickness: crosshair.thickness,
        gap: crosshair.gap,  // Always use the gap value (cl_crosshairgap)
        outline: crosshair.outlineEnabled || false,
        outlineThickness: crosshair.outlineThickness || crosshair.outline || 1,
        centerDot: crosshair.centerDot || false,
        shape: shape,
        alpha: crosshair.alpha,
        // Store fixedCrosshairGap separately if needed
        fixedCrosshairGap: crosshair.fixedCrosshairGap
    };
    
    console.log('UI Config:', {
        gap: uiConfig.gap,
        fixedCrosshairGap: uiConfig.fixedCrosshairGap,
        size: uiConfig.size,
        thickness: uiConfig.thickness,
        shape: uiConfig.shape
    });
    
    return uiConfig;
}

export function convertFromUIConfig(config: CrosshairConfig): Crosshair {
    const hex = config.color.replace('#', '');
    const red = parseInt(hex.substr(0, 2), 16);
    const green = parseInt(hex.substr(2, 2), 16);
    const blue = parseInt(hex.substr(4, 2), 16);
    
    let style = CS2_STYLES.CLASSIC_STATIC;
    let tStyleEnabled = false;
    
    if (config.shape === 't') {
        style = CS2_STYLES.CLASSIC_DYNAMIC;
        tStyleEnabled = true;
    } else if (config.shape === 'classic static') {
        style = CS2_STYLES.CLASSIC_STATIC;
    } else if (config.shape === 'classic') {
        style = CS2_STYLES.CLASSIC_DYNAMIC;
    }
    
    // Determine color index
    let colorIndex = 5; // Default to custom
    for (let i = 0; i < predefinedColors.length; i++) {
        const [pr, pg, pb] = predefinedColors[i];
        if (red === pr && green === pg && blue === pb) {
            colorIndex = i;
            break;
        }
    }
    
    // Use the gap value directly from UI
    // For style 4, if we have a stored fixedCrosshairGap, use it
    // Otherwise calculate a reasonable default
    let fixedGapValue: number;
    
    if (style === CS2_STYLES.CLASSIC_STATIC) {
        // If we have a stored fixedCrosshairGap from import, use it
        // Otherwise use a default based on the gap
        fixedGapValue = config.fixedCrosshairGap !== undefined ? config.fixedCrosshairGap : 3;
    } else {
        fixedGapValue = 3;
    }
    
    return {
        gap: config.gap,  // Always use the UI gap value directly
        outline: config.outlineThickness,
        outlineEnabled: config.outline,
        red: red,
        green: green,
        blue: blue,
        alpha: config.alpha,
        splitDistance: 7,
        fixedCrosshairGap: fixedGapValue,
        color: colorIndex,
        outlineThickness: config.outlineThickness,
        centerDot: config.centerDot,
        minDistance: 0,
        thickness: config.thickness,
        size: config.size,
        style: style,
        splitSizeRatio: 0.3,
        tStyleEnabled: tStyleEnabled,
        followRecoil: false,
        alphaEnabled: true,
        deployedWeaponGapEnabled: false,
        innerSplitAlpha: 1,
        outerSplitAlpha: 0.5
    };
}

export function generateConsoleCommands(crosshair: Crosshair): string[] {
    const commands = [
        `cl_crosshairgap "${crosshair.gap}"`,
        `cl_crosshair_outlinethickness "${crosshair.outlineThickness}"`,
        `cl_crosshaircolor_r "${crosshair.red}"`,
        `cl_crosshaircolor_g "${crosshair.green}"`,
        `cl_crosshaircolor_b "${crosshair.blue}"`,
        `cl_crosshairalpha "${crosshair.alpha}"`,
        `cl_crosshair_dynamic_splitdist "${crosshair.splitDistance}"`,
        `cl_crosshair_recoil "${crosshair.followRecoil ? 'true' : 'false'}"`,
        `cl_fixedcrosshairgap "${crosshair.fixedCrosshairGap}"`,
        `cl_crosshaircolor "${crosshair.color}"`,
        `cl_crosshair_drawoutline "${crosshair.outlineEnabled ? 'true' : 'false'}"`,
        `cl_crosshair_dynamic_splitalpha_innermod "${crosshair.innerSplitAlpha || 1}"`,
        `cl_crosshair_dynamic_splitalpha_outermod "${crosshair.outerSplitAlpha || 0.5}"`,
        `cl_crosshair_dynamic_maxdist_splitratio "${crosshair.splitSizeRatio || 0.3}"`,
        `cl_crosshairthickness "${crosshair.thickness}"`,
        `cl_crosshairdot "${crosshair.centerDot ? 'true' : 'false'}"`,
        `cl_crosshairgap_useweaponvalue "${crosshair.deployedWeaponGapEnabled ? 'true' : 'false'}"`,
        `cl_crosshairusealpha "${crosshair.alphaEnabled ? 'true' : 'false'}"`,
        `cl_crosshair_t "${crosshair.tStyleEnabled ? 'true' : 'false'}"`,
        `cl_crosshairstyle "${crosshair.style}"`,
        `cl_crosshairsize "${crosshair.size}"`,
    ];
    
    return commands;
}
