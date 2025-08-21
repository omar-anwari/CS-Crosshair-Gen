export interface CrosshairConfig {
    color: string;
    size: number;
    thickness: number;
    gap: number;  // This will always be cl_crosshairgap value
    outline: boolean;
    outlineThickness: number;
    centerDot: boolean;
    shape: 'classic static' | 'classic' | 't';
    alpha: number;
    // Store fixedCrosshairGap separately
    fixedCrosshairGap?: number;
}

export interface Crosshair {
    gap: number;
    outline: number;  // This is the outline thickness value
    outlineEnabled: boolean;  // This is the boolean flag for whether outline is enabled
    red: number;
    green: number;
    blue: number;
    alpha: number;
    splitDistance: number;
    fixedCrosshairGap: number;
    color: number;
    outlineThickness: number;
    centerDot: boolean;
    minDistance: number;
    thickness: number;
    size: number;
    length?: number;  // Prosettings compatibility
    style: number;
    splitSizeRatio: number;
    // Additional CS2 flags for T-style
    tStyleEnabled?: boolean;
    followRecoil?: boolean;
    alphaEnabled?: boolean;
    deployedWeaponGapEnabled?: boolean;
    innerSplitAlpha?: number;
    outerSplitAlpha?: number;
}

//# sourceMappingURL=crosshair.d.ts.map