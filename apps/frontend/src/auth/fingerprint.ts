import FingerprintJS from '@fingerprintjs/fingerprintjs';

// Extend Navigator interface to include deviceMemory
declare global {
    interface Navigator {
        deviceMemory?: number;
    }
}

// Extend Window interface to include webkitAudioContext
declare global {
    interface Window {
        webkitAudioContext: typeof AudioContext;
    }
}

interface FingerprintComponents {
    userAgent: string;
    language: string;
    colorDepth: number;
    deviceMemory: number | null;
    hardwareConcurrency: number | null;
    screenResolution: string;
    timezone: string;
    timezoneOffset: number;
    platform: string;
    webglVendor: string | null;
    webglRenderer: string | null;
    webglVersion: string | null;
    canvasHash: string | null;
    audioContext: string | null;
}

// Configuration
const RATE_LIMIT_MS = 0; // seconds
const ROTATION_HOURS = Number(import.meta.env.VITE_FINGERPRINT_ROTATION_HOURS) || 168;
let lastFingerprintTime = 0;

/**
 * Generates a rotation key for fingerprint freshness based on configured duration
 */
function generateRotationKey(): string {
    const date = new Date();
    const hours = Math.floor(date.getTime() / (1000 * 60 * 60));
    // Generate a key that changes every ROTATION_HOURS
    const rotationNumber = Math.floor(hours / ROTATION_HOURS);
    return `${rotationNumber}`;
}

/**
 * Generates a unique fingerprint for the user while respecting privacy and handling browser restrictions
 * @returns Promise<string> - A unique fingerprint string
 */
export async function getFingerprint(): Promise<string> {
    try {
        // Rate limiting
        const now = Date.now();
        if (now - lastFingerprintTime < RATE_LIMIT_MS) {
            throw new Error('Rate limit exceeded');
        }
        lastFingerprintTime = now;

        // Initialize FingerprintJS
        const fp = await FingerprintJS.load();
        
        // Get basic visitor ID
        const result = await fp.get();
        
        // Collect additional components with fallbacks
        const components = await collectFingerprintComponents();
        
        // Use rotation key timestamp instead of current timestamp
        const rotationKey = generateRotationKey();
        const fingerprintData = {
            visitorId: result.visitorId,
            components: components,
            rotationKey: rotationKey
        };
        
        // Convert to string and hash
        const fingerprintString = JSON.stringify(fingerprintData);
        return await hashFingerprint(fingerprintString);
    } catch (error) {
        console.error('Fingerprint generation failed:', error);
        // Fallback to basic fingerprinting
        return await generateBasicFingerprint();
    }
}

/**
 * Collects fingerprint components with privacy considerations
 */
async function collectFingerprintComponents(): Promise<FingerprintComponents> {
    const components: FingerprintComponents = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        colorDepth: window.screen.colorDepth,
        deviceMemory: navigator.deviceMemory || null,
        hardwareConcurrency: navigator.hardwareConcurrency || null,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timezoneOffset: new Date().getTimezoneOffset(),
        platform: (navigator as any).userAgentData?.platform || navigator.userAgent.split('(')[1]?.split(')')[0] || 'unknown',
        webglVendor: null,
        webglRenderer: null,
        webglVersion: null,
        canvasHash: null,
        audioContext: null
    };

    try {
        // WebGL fingerprinting
        const webglInfo = getWebGLInfo();
        if (webglInfo) {
            components.webglVendor = webglInfo.vendor;
            components.webglRenderer = webglInfo.renderer;
            components.webglVersion = webglInfo.webglVersion;
        }

        // Enhanced canvas fingerprinting
        components.canvasHash = await getCanvasFingerprint();

        // Audio context fingerprinting
        components.audioContext = await getAudioFingerprint();
    } catch (error) {
        console.warn('Advanced fingerprinting failed:', error);
    }

    return components;
}

/**
 * Gets WebGL information
 */
function getWebGLInfo() {
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl');
        
        if (!gl) return null;

        return {
            vendor: gl.getParameter(gl.VENDOR),
            renderer: gl.getParameter(gl.RENDERER),
            webglVersion: gl.getParameter(gl.VERSION)
        };
    } catch {
        return null;
    }
}

/**
 * Generates enhanced canvas fingerprint
 */
async function getCanvasFingerprint(): Promise<string | null> {
    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) return null;

        // Use fixed values for consistent fingerprinting
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillStyle = '#f60';
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = '#069';
        ctx.fillText('ContentForge', 2, 15);
        
        // Add fixed pattern
        ctx.beginPath();
        ctx.arc(50, 50, 20, 0, Math.PI * 2);
        ctx.stroke();
        
        return canvas.toDataURL();
    } catch {
        return null;
    }
}

/**
 * Generates audio context fingerprint
 */
async function getAudioFingerprint(): Promise<string | null> {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        return audioContext.sampleRate.toString();
    } catch {
        return null;
    }
}

/**
 * Generates a basic fingerprint as fallback
 */
async function generateBasicFingerprint(): Promise<string> {
    const basicComponents = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: (navigator as any).userAgentData?.platform || navigator.userAgent.split('(')[1]?.split(')')[0] || 'unknown',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timestamp: Date.now(),
        rotationKey: generateRotationKey()
    };

    return await hashFingerprint(JSON.stringify(basicComponents));
}

/**
 * Hashes the fingerprint string using SHA-256
 */
export async function hashFingerprint(fingerprintString: string): Promise<string> {
    const msgBuffer = new TextEncoder().encode(fingerprintString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
