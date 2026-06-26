import { SystemDefaults } from '../types';

/**
 * Parses and extracts named bindings from an ES6 import statement.
 */
export function parseImportBindings(importStr: string): Array<{ name: string; isDefault?: boolean; isNamespace?: boolean; original?: string }> {
  const cleanStr = importStr.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '').trim();
  const content = cleanStr
    .replace(/^import\s+/, '')
    .replace(/\s+from\s+["'].*?["'];?$/, '')
    .trim();

  const bindings: Array<{ name: string; isDefault?: boolean; isNamespace?: boolean; original?: string }> = [];

  if (content.startsWith('*')) {
    const match = content.match(/\*\s+as\s+(\w+)/);
    if (match) bindings.push({ name: match[1], isNamespace: true });
    return bindings;
  }

  const braceStart = content.indexOf('{');
  if (braceStart !== -1) {
    const defaultPart = content.slice(0, braceStart).replace(/,/, '').trim();
    if (defaultPart) {
      bindings.push({ name: defaultPart, isDefault: true });
    }
    const bracePart = content.slice(braceStart + 1, content.lastIndexOf('}')).trim();
    const namedImports = bracePart.split(',').map(s => s.trim()).filter(Boolean);
    namedImports.forEach(item => {
      if (item.includes(' as ')) {
        const parts = item.split(/\s+as\s+/);
        bindings.push({ name: parts[1], original: parts[0] });
      } else {
        bindings.push({ name: item });
      }
    });
  } else {
    bindings.push({ name: content, isDefault: true });
  }

  return bindings;
}

/**
 * Inject custom user settings into the SYSTEM_DEFAULTS object in the raw worker code.
 */
export function injectCustomDefaults(code: string, config: Partial<SystemDefaults>): string {
  // We locate the SYSTEM_DEFAULTS object declaration in the code and replace its values
  const defaultsRegex = /(const\s+SYSTEM_DEFAULTS\s*=\s*\{)([\s\S]*?)(\};)/;
  
  if (!defaultsRegex.test(code)) {
    return code; // If defaults structure is not found, return code as is
  }

  return code.replace(defaultsRegex, (match, prefix, defaultsBody, suffix) => {
    // Reconstruct the system defaults block dynamically based on user config
    let lines = defaultsBody.split('\n');
    const updatedLines = lines.map((line: string) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('//')) return line;
      
      const parts = trimmed.split(':');
      if (parts.length < 2) return line;
      
      const key = parts[0].trim();
      if (key in config) {
        const value = config[key as keyof SystemDefaults];
        const comma = trimmed.endsWith(',') ? ',' : '';
        
        let formattedValue = '';
        if (typeof value === 'string') {
          formattedValue = `"${value.replace(/"/g, '\\"')}"`;
        } else if (typeof value === 'boolean') {
          formattedValue = value ? 'true' : 'false';
        } else if (typeof value === 'number') {
          formattedValue = String(value);
        } else if (Array.isArray(value)) {
          formattedValue = JSON.stringify(value);
        } else {
          formattedValue = 'null';
        }
        
        // Preserve indentation of original line
        const indentMatch = line.match(/^(\s*)/);
        const indent = indentMatch ? indentMatch[1] : '    ';
        return `${indent}${key}: ${formattedValue}${comma}`;
      }
      return line;
    });

    return `${prefix}\n${updatedLines.join('\n')}\n${suffix}`;
  });
}

/**
 * Encrypts and compiles the source code using UTF-8 XOR byte-shifting.
 */
export function obfuscateCode(srcText: string): string {
  const importRegex = /^import\s+[\s\S]*?from\s+["'].*?["'];?$/gm;
  const imports: string[] = [];
  let match;

  while ((match = importRegex.exec(srcText)) !== null) {
    imports.push(match[0].trim());
  }

  let cleanCode = srcText.replace(importRegex, '').trim();

  const bindings: Array<{ name: string; isDefault?: boolean; isNamespace?: boolean; original?: string }> = [];
  imports.forEach(imp => {
    const parsed = parseImportBindings(imp);
    bindings.push(...parsed);
  });

  const uniqueBindings: Array<{ name: string; isDefault?: boolean; isNamespace?: boolean; original?: string }> = [];
  const seenNames = new Set<string>();
  bindings.forEach(b => {
    if (!seenNames.has(b.name)) {
      seenNames.add(b.name);
      uniqueBindings.push(b);
    }
  });

  if (cleanCode.includes('export default')) {
    cleanCode = cleanCode.replace(/export\s+default\s+/, 'const _0xNahanModule = ');
    cleanCode += '\nreturn _0xNahanModule;';
  } else {
    cleanCode += '\nreturn undefined;';
  }

  // Generate a cryptographically secure random XOR key (Uint8Array size 16)
  const keyBytes = new Uint8Array(16);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(keyBytes);
  } else {
    for (let i = 0; i < 16; i++) {
      keyBytes[i] = Math.floor(Math.random() * 256);
    }
  }

  // Convert source code to UTF-8 bytes
  const encoder = new TextEncoder();
  const bytes = encoder.encode(cleanCode);

  // Apply XOR shift
  const xoredBytes = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) {
    xoredBytes[i] = bytes[i] ^ keyBytes[i % keyBytes.length];
  }

  // Convert to Base64 payload safely in chunks to avoid stack overflow
  let binaryString = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < xoredBytes.length; i += chunkSize) {
    const subArray = xoredBytes.subarray(i, i + chunkSize);
    // Convert subarray to string of characters
    let subStr = '';
    for (let j = 0; j < subArray.length; j++) {
      subStr += String.fromCharCode(subArray[j]);
    }
    binaryString += subStr;
  }
  const b64Payload = btoa(binaryString);
  const keyHex = Array.from(keyBytes).map(b => b.toString(16).padStart(2, '0')).join('');

  const rawImportsStr = imports.join('\n');
  const bindingNames = uniqueBindings.map(b => b.name);
  const bindingParams = bindingNames.map(n => `"${n}"`).join(', ');
  const bindingArgs = bindingNames.join(', ');

  const finalLoaderCode = `${rawImportsStr}

// =========================================================================
// Nahan Serverless Telemetry Gateway Node - Modular Obfuscated Loader
// Encrypted using: Dynamic UTF-8 Byte-Shifting with Multi-byte XOR Cipher
// Compatibility Date: 2024-03-01
// =========================================================================

const _0xPayload = "${b64Payload}";
const _0xKeyHex = "${keyHex}";
const _0xKey = _0xKeyHex.match(/.{1,2}/g).map(h => parseInt(h, 16));
const _0xRaw = atob(_0xPayload);
const _0xBytes = new Uint8Array(_0xRaw.length);
for (let i = 0; i < _0xRaw.length; i++) {
    _0xBytes[i] = _0xRaw.charCodeAt(i) ^ _0xKey[i % _0xKey.length];
}
const _0xCode = new TextDecoder().decode(_0xBytes);
const _0xRuntime = new Function(${bindingParams}, _0xCode)(${bindingArgs});

export default _0xRuntime;`;

  return finalLoaderCode;
}
