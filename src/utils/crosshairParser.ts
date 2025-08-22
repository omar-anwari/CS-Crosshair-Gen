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

function sumArray(arr: number[]): number {
    return arr.reduce((a, b) => a + b, 0);
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

function bytesToShareCode(bytes: Uint8Array | number[]): string {
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
    const expectedChecksum = sumArray(Array.from(bytes.slice(1))) % 256;
    if (bytes[0] !== expectedChecksum) {
        console.warn('Checksum mismatch, but continuing to decode');
    }
    
    // Parse gap
    const gap = decodeSignedByte(bytes[2]) / 10;
    
    // Decode color - the color index is in the lower 3 bits of byte 10
    const colorIndex = bytes[10] & 0x07;
    let red = bytes[4];
    let green = bytes[5];
    let blue = bytes[6];
    
    // Only use custom RGB if color index is not 5
    if (colorIndex !== 5) {
        if (colorIndex >= 0 && colorIndex < predefinedColors.length) {
            [red, green, blue] = predefinedColors[colorIndex];
        } else {
            // Default to green if invalid index
            red = 0;
            green = 255;
            blue = 0;
        }
    }
    // If colorIndex is 5, use the custom RGB values from bytes 4-6
    
    const crosshair: Crosshair = {
        gap: gap,
        outline: (bytes[3] & 0xFF) / 2,
        outlineThickness: (bytes[3] & 0xFF) / 2,
        red: red,
        green: green,
        blue: blue,
        alpha: bytes[7],
        splitDistance: bytes[8] & 0x7F,
        followRecoil: (bytes[8] & 0x80) !== 0,
        fixedCrosshairGap: decodeSignedByte(bytes[9]) / 10,
        color: colorIndex,
        outlineEnabled: (bytes[10] & 0x08) === 0x08,
        innerSplitAlpha: ((bytes[10] >> 4) & 0x0F) / 10,
        outerSplitAlpha: (bytes[11] & 0x0F) / 10,
        splitSizeRatio: ((bytes[11] >> 4) & 0x0F) / 10,
        thickness: (bytes[12] & 0x3F) / 10,
        style: (bytes[13] & 0x0E) >> 1,
        centerDotEnabled: (bytes[13] & 0x10) === 0x10,
        centerDot: (bytes[13] & 0x10) === 0x10,
        deployedWeaponGapEnabled: (bytes[13] & 0x20) === 0x20,
        alphaEnabled: (bytes[13] & 0x40) === 0x40,
        tStyleEnabled: (bytes[13] & 0x80) === 0x80,
        length: (((bytes[15] & 0x1F) << 8) + bytes[14]) / 10,
        size: (((bytes[15] & 0x1F) << 8) + bytes[14]) / 10,
        minDistance: 0
    };
    
    console.log('Decoded crosshair:', {
        gap: crosshair.gap,
        fixedCrosshairGap: crosshair.fixedCrosshairGap,
        size: crosshair.length,
        thickness: crosshair.thickness,
        style: crosshair.style,
        centerDot: crosshair.centerDotEnabled
    });
    
    return crosshair;
}

export function encodeCrosshair(crosshair: any): string {
    const bytes: number[] = [0, 1]; // Checksum placeholder and version
    
    // Encode gap
    bytes.push(encodeSignedByte(Math.round(crosshair.gap * 10)));
    
    // Encode outline thickness
    bytes.push(Math.floor(crosshair.outline * 2));
    
    // Encode RGB colors
    bytes.push(crosshair.red);
    bytes.push(crosshair.green);
    bytes.push(crosshair.blue);
    
    // Encode alpha
    bytes.push(crosshair.alpha);
    
    // Encode split distance and follow recoil
    bytes.push((crosshair.splitDistance & 0x7F) | (crosshair.followRecoil ? 0x80 : 0));
    
    // Encode fixed crosshair gap
    bytes.push(encodeSignedByte(Math.round(crosshair.fixedCrosshairGap * 10)));
    
    // Encode color index, outline enabled, and inner split alpha
    bytes.push(
        crosshair.color | 
        (crosshair.outlineEnabled ? 0x08 : 0) | 
        (Math.round(crosshair.innerSplitAlpha * 10) << 4)
    );
    
    // Encode outer split alpha and split size ratio
    bytes.push(
        (Math.round(crosshair.outerSplitAlpha * 10) & 0x0F) |
        (Math.round(crosshair.splitSizeRatio * 10) << 4)
    );
    
    // Encode thickness
    bytes.push(Math.round(crosshair.thickness * 10));
    
    // Encode style and flags
    bytes.push(
        ((crosshair.style & 0x07) << 1) |
        (crosshair.centerDotEnabled ? 0x10 : 0) |
        (crosshair.deployedWeaponGapEnabled ? 0x20 : 0) |
        (crosshair.alphaEnabled ? 0x40 : 0) |
        (crosshair.tStyleEnabled ? 0x80 : 0)
    );
    
    // Encode length/size
    bytes.push(Math.round(crosshair.length * 10) % 256);
    bytes.push(Math.floor(Math.round(crosshair.length * 10) / 256));
    
    // Reserved bytes
    bytes.push(0);
    bytes.push(0);
    
    // Calculate and set checksum
    bytes[0] = calculateChecksum(bytes);
    
    return bytesToShareCode(bytes);
}

export function convertToUIConfig(crosshair: Crosshair): CrosshairConfig {
    // Convert RGB (0-255) to hex color
    const toHex = (n: number) => n.toString(16).padStart(2, '0');
    const color = `#${toHex(crosshair.red)}${toHex(crosshair.green)}${toHex(crosshair.blue)}`;
    
    // Map CS2 style to UI shape
    type ShapeType = CrosshairConfig['shape'];
    const shapeMap: { [key: number]: ShapeType } = {
        0: 'default',
        1: 'default static',
        2: 'classic',
        3: 'classic dynamic',
        4: 'classic static',
        5: 'legacy'
    };
    
    return {
        color: color,
        size: crosshair.length || crosshair.size || 2.5,
        thickness: crosshair.thickness || 0.5,
        gap: crosshair.gap || 0,
        outline: crosshair.outlineEnabled || false,
        outlineThickness: crosshair.outline || 1,
        centerDot: crosshair.centerDotEnabled || crosshair.centerDot || false,
        shape: shapeMap[crosshair.style] || 'classic static',
        alpha: crosshair.alpha || 255
    };
}

export function convertFromUIConfig(config: CrosshairConfig): Crosshair {
    // Convert hex color to RGB
    const hex = config.color.replace('#', '');
    const red = parseInt(hex.substr(0, 2), 16);
    const green = parseInt(hex.substr(2, 2), 16);
    const blue = parseInt(hex.substr(4, 2), 16);
    
    // Determine color index
    let colorIndex = 5; // Default to custom
    for (let i = 0; i < predefinedColors.length; i++) {
        const [pr, pg, pb] = predefinedColors[i];
        if (red === pr && green === pg && blue === pb) {
            colorIndex = i;
            break;
        }
    }
    
    // Map UI shape to CS2 style
    const styleMap: { [key in CrosshairConfig['shape']]: number } = {
        'default': 0,
        'default static': 1,
        'classic': 2,
        'classic dynamic': 3,
        'classic static': 4,
        'legacy': 5,
        't': 4 // Default t to classic static
    };
    
    return {
        gap: config.gap,
        outline: config.outlineThickness,
        outlineThickness: config.outlineThickness,
        red: red,
        green: green,
        blue: blue,
        alpha: config.alpha,
        splitDistance: 7,
        followRecoil: false,
        fixedCrosshairGap: 3,
        color: colorIndex,
        outlineEnabled: config.outline,
        innerSplitAlpha: 1,
        outerSplitAlpha: 0.5,
        splitSizeRatio: 0.3,
        thickness: config.thickness,
        style: styleMap[config.shape] || 4,
        centerDotEnabled: config.centerDot,
        centerDot: config.centerDot,
        deployedWeaponGapEnabled: false,
        alphaEnabled: true,
        tStyleEnabled: false,
        length: config.size,
        size: config.size,
        minDistance: 0
    };
}

export function parseCS2Code(code: string): CrosshairConfig | null {
    try {
        const crosshair = decodeCrosshairShareCode(code);
        return convertToUIConfig(crosshair);
    } catch (error) {
        console.error('Failed to parse CS2 code:', error);
        return null;
    }
}

export function generateConsoleCommands(crosshair: Crosshair): string[] {
    const commands = [
        `cl_crosshairgap "${crosshair.gap}"`,
        `cl_crosshair_outlinethickness "${crosshair.outline}"`,
        `cl_crosshaircolor_r "${crosshair.red}"`,
        `cl_crosshaircolor_g "${crosshair.green}"`,
        `cl_crosshaircolor_b "${crosshair.blue}"`,
        `cl_crosshairalpha "${crosshair.alpha}"`,
        `cl_crosshair_dynamic_splitdist "${crosshair.splitDistance}"`,
        `cl_crosshair_recoil "${crosshair.followRecoil ? '1' : '0'}"`,
        `cl_fixedcrosshairgap "${crosshair.fixedCrosshairGap}"`,
        `cl_crosshaircolor "${crosshair.color}"`,
        `cl_crosshair_drawoutline "${crosshair.outlineEnabled ? '1' : '0'}"`,
        `cl_crosshair_dynamic_splitalpha_innermod "${crosshair.innerSplitAlpha || 1}"`,
        `cl_crosshair_dynamic_splitalpha_outermod "${crosshair.outerSplitAlpha || 0.5}"`,
        `cl_crosshair_dynamic_maxdist_splitratio "${crosshair.splitSizeRatio || 0.3}"`,
        `cl_crosshairthickness "${crosshair.thickness}"`,
        `cl_crosshairdot "${crosshair.centerDotEnabled ? '1' : '0'}"`,
        `cl_crosshairgap_useweaponvalue "${crosshair.deployedWeaponGapEnabled ? '1' : '0'}"`,
        `cl_crosshairusealpha "${crosshair.alphaEnabled ? '1' : '0'}"`,
        `cl_crosshair_t "${crosshair.tStyleEnabled ? '1' : '0'}"`,
        `cl_crosshairstyle "${crosshair.style}"`,
        `cl_crosshairsize "${crosshair.length}"`,
    ];
    
    return commands;
}
