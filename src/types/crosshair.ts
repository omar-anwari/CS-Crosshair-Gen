export interface CrosshairConfig {
    color: string;
    size: number;
    thickness: number;
    gap: number;
    outline: boolean;
    outlineThickness: number;
    centerDot: boolean;
    shape: 'classic static' | 'classic' | 't' | 'default' | 'default static' | 'classic dynamic' | 'legacy';
    alpha: number;
}

export interface Crosshair {
    gap: number;
    outline: number;
    outlineThickness?: number;
    red: number;
    green: number;
    blue: number;
    alpha: number;
    splitDistance: number;
    followRecoil: boolean;
    fixedCrosshairGap: number;
    color: number;
    outlineEnabled: boolean;
    innerSplitAlpha: number;
    outerSplitAlpha: number;
    splitSizeRatio: number;
    thickness: number;
    style: number;
    centerDotEnabled: boolean;
    centerDot?: boolean;
    deployedWeaponGapEnabled: boolean;
    alphaEnabled: boolean;
    tStyleEnabled: boolean;
    length: number;
    size?: number;
    minDistance?: number;
}