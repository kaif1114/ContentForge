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
let lastFingerprintTime = 0;
const VISITOR_ID_STORAGE_KEY = 'SECUREFP_SEED';

// Flag to prevent concurrent fingerprinting
let isGeneratingFingerprint = false;
let pendingPromiseResolvers: Array<{resolve: (value: string) => void, reject: (reason: any) => void}> = [];

/**
 * Gets a consistent visitorId from localStorage or generates a new one
 */
async function getConsistentVisitorId(): Promise<string> {
    try {
        // Check if we have a stored visitorId
        const storedVisitorId = localStorage.getItem(VISITOR_ID_STORAGE_KEY);
        
        if (storedVisitorId) {
            return storedVisitorId;
        }
        
        // If no stored visitorId, generate a new one
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        const visitorId = result.visitorId;
        
        // Store for future use
        localStorage.setItem(VISITOR_ID_STORAGE_KEY, visitorId);
        
        return visitorId;
    } catch (error) {
        console.error('Failed to get consistent visitorId:', error);
        // Fallback to generating a more stable UUID-like identifier
        const fallbackId = generateFallbackId();
        try {
            localStorage.setItem(VISITOR_ID_STORAGE_KEY, fallbackId);
        } catch {
            // Ignore storage errors
        }
        return fallbackId;
    }
}

/**
 * Generates a fallback ID if FingerprintJS fails
 */
function generateFallbackId(): string {
    // Generate a UUID-like identifier from stable browser properties
    const baseStr = 
        navigator.userAgent + 
        navigator.language + 
        screen.width + 
        screen.height + 
        navigator.hardwareConcurrency + 
        ((navigator as any).userAgentData?.platform || 'unknown');
    
    // Create a hash of the base string
    let hash = 0;
    for (let i = 0; i < baseStr.length; i++) {
        const char = baseStr.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    
    // Convert to hex string with padding
    const hashHex = (hash >>> 0).toString(16).padStart(8, '0');
    
    // Construct a UUID-like string
    return `${hashHex.slice(0, 8)}-${hashHex.slice(0, 4)}-4${hashHex.slice(1, 4)}-${'89ab'[Math.abs(hash) % 4]}${hashHex.slice(1, 3)}-${hashHex.slice(0, 12)}`;
}

/**
 * Collects fingerprint components with privacy considerations
 */
async function collectFingerprintComponents(): Promise<FingerprintComponents> {
    // Create components with deterministic ordering
    const components: FingerprintComponents = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        colorDepth: window.screen.colorDepth,
        deviceMemory: navigator.deviceMemory || null,
        hardwareConcurrency: navigator.hardwareConcurrency || null,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timezoneOffset: new Date().getTimezoneOffset(),
        platform: (navigator as any).userAgentData?.platform || 'unknown',
        webglVendor: null,
        webglRenderer: null,
        webglVersion: null,
        canvasHash: null,
        audioContext: null
    };

    try {
        // Collect WebGL info first (synchronous)
        const webglInfo = getWebGLInfo();
        if (webglInfo) {
            components.webglVendor = webglInfo.vendor;
            components.webglRenderer = webglInfo.renderer;
            components.webglVersion = webglInfo.webglVersion;
        }
        
        // Then collect canvas fingerprint (asynchronous)
        components.canvasHash = await getCanvasFingerprint();
        
        // Finally collect audio fingerprint (asynchronous)
        components.audioContext = await getAudioFingerprint();
    } catch (error) {
        console.warn('Advanced fingerprinting failed:', error);
    }
    console.log("components", components);
    return components;
}

/**
 * Gets WebGL information
 */
function getWebGLInfo() {
    try {
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 50;
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
 * Generates canvas fingerprint with fixed values for consistency
 */
async function getCanvasFingerprint(): Promise<string | null> {
    try {
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 50;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) return null;

        // Always use fixed values and operations for consistency
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillStyle = '#f60';
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = '#069';
        ctx.fillText('ContentForge', 2, 15);
        
        // Add fixed pattern with precise coordinates
        ctx.beginPath();
        ctx.arc(50, 25, 10, 0, Math.PI * 2);
        ctx.stroke();
        
        // Use a fixed format for the data URL
        return canvas.toDataURL('image/jpeg', 0.5);
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
        
        // Just use the sample rate as is - this should be stable per device
        return audioContext.sampleRate.toString();
    } catch {
        return null;
    }
}

/**
 * Generates a basic fingerprint as fallback
 */
async function generateBasicFingerprint(): Promise<string> {
    try {
        // Get a consistent visitorId
        const visitorId = await getConsistentVisitorId();
        
        const basicComponents = {
            visitorId: visitorId,
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: (navigator as any).userAgentData?.platform || 'unknown',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };

        // Create a deterministic JSON string (sort keys alphabetically)
        const basicComponentsString = JSON.stringify(basicComponents, Object.keys(basicComponents).sort());
        return await hashFingerprint(basicComponentsString);
    } catch (error) {
        // Ultimate fallback - just hash the user agent
        console.error('Basic fingerprint generation failed:', error);
        return await hashFingerprint(navigator.userAgent);
    }
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

/**
 * Generates a unique fingerprint for the user
 * @returns Promise<string> - A unique fingerprint string
 */
export async function getFingerprint(): Promise<string> {
    // If already generating a fingerprint, wait for it to complete
    if (isGeneratingFingerprint) {
        return new Promise<string>((resolve, reject) => {
            pendingPromiseResolvers.push({ resolve, reject });
        });
    }
    
    // Set flag to prevent concurrent generation
    isGeneratingFingerprint = true;
    
    try {
        const now = Date.now();
        
        // Rate limiting
        if (now - lastFingerprintTime < RATE_LIMIT_MS) {
            throw new Error('Rate limit exceeded');
        }
        lastFingerprintTime = now;

        // Get a consistent visitorId
        const visitorId = await getConsistentVisitorId();
        
        // Collect additional components with fallbacks
        const components = await collectFingerprintComponents();
        
        // Create a deterministic fingerprint object
        const fingerprintData = {
            visitorId: visitorId,
            components: components
        };
        
        console.log("fingerprintData", fingerprintData);
        // Create a deterministic JSON string (sort keys alphabetically)
        const fingerprintString = JSON.stringify(fingerprintData, Object.keys(fingerprintData).sort());
        
        // Hash the fingerprint
        const fingerprint = await hashFingerprint(fingerprintString);
        
        // Resolve any pending promises
        pendingPromiseResolvers.forEach(({ resolve }) => resolve(fingerprint));
        pendingPromiseResolvers = [];
        
        return fingerprint;
    } catch (error) {
        console.error('Fingerprint generation failed:', error);
        
        // Generate basic fingerprint as fallback
        try {
            const basicFingerprint = await generateBasicFingerprint();
            
            // Resolve any pending promises
            pendingPromiseResolvers.forEach(({ resolve }) => resolve(basicFingerprint));
            pendingPromiseResolvers = [];
            
            return basicFingerprint;
        } catch (fallbackError) {
            // Reject any pending promises
            pendingPromiseResolvers.forEach(({ reject }) => reject(fallbackError));
            pendingPromiseResolvers = [];
            
            throw fallbackError;
        }
    } finally {
        // Reset flag
        isGeneratingFingerprint = false;
    }
}
