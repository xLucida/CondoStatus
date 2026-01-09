/**
 * Input validation and sanitization utilities
 * Prevents injection attacks and ensures data integrity
 */

/**
 * Sanitizes property address input
 * Removes dangerous characters and limits length
 */
export function sanitizePropertyAddress(address: string): string {
  if (typeof address !== 'string') {
    return '';
  }
  
  return address
    .trim()
    .replace(/[<>\"'`]/g, '') // Remove potentially dangerous characters
    .replace(/\s+/g, ' ') // Normalize whitespace
    .slice(0, 200); // Max length
}

/**
 * Validates property address format
 * Basic validation - can be enhanced with more specific rules
 */
export function validatePropertyAddress(address: string): { valid: boolean; error?: string } {
  const sanitized = sanitizePropertyAddress(address);
  
  if (!sanitized || sanitized.length < 5) {
    return { valid: false, error: 'Property address must be at least 5 characters' };
  }
  
  if (sanitized.length > 200) {
    return { valid: false, error: 'Property address is too long (max 200 characters)' };
  }
  
  return { valid: true };
}

/**
 * Sanitizes file name to prevent path traversal and injection
 */
export function sanitizeFileName(fileName: string): string {
  if (typeof fileName !== 'string') {
    return 'unnamed.pdf';
  }
  
  // Remove path separators and parent directory references
  let sanitized = fileName
    .replace(/[\/\\]/g, '_') // Replace path separators
    .replace(/\.\./g, '') // Remove parent directory references
    .replace(/^\.+/, '') // Remove leading dots
    .trim();
  
  // Only allow safe characters: alphanumeric, dots, hyphens, underscores
  sanitized = sanitized.replace(/[^a-zA-Z0-9._-]/g, '_');
  
  // Ensure it ends with .pdf
  if (!sanitized.toLowerCase().endsWith('.pdf')) {
    sanitized = sanitized + '.pdf';
  }
  
  // Limit length (255 is max filename length on most systems)
  sanitized = sanitized.slice(0, 255);
  
  // Fallback if empty
  if (!sanitized || sanitized === '.pdf') {
    return 'unnamed.pdf';
  }
  
  return sanitized;
}

/**
 * Validates base64 string format
 */
export function validateBase64(base64: string): { valid: boolean; error?: string } {
  if (typeof base64 !== 'string' || base64.length === 0) {
    return { valid: false, error: 'Base64 string is required' };
  }
  
  // Base64 regex: allows A-Z, a-z, 0-9, +, /, and = for padding
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  
  if (!base64Regex.test(base64)) {
    return { valid: false, error: 'Invalid base64 format' };
  }
  
  // Check padding (should be 0, 1, or 2 = signs)
  const padding = (base64.match(/=/g) || []).length;
  if (padding > 2) {
    return { valid: false, error: 'Invalid base64 padding' };
  }
  
  return { valid: true };
}

/**
 * Sanitizes property unit number
 */
export function sanitizePropertyUnit(unit: string | undefined): string | undefined {
  if (!unit || typeof unit !== 'string') {
    return undefined;
  }
  
  return unit
    .trim()
    .replace(/[<>\"'`]/g, '')
    .slice(0, 50); // Max length
}

/**
 * Sanitizes property city
 */
export function sanitizePropertyCity(city: string | undefined): string | undefined {
  if (!city || typeof city !== 'string') {
    return undefined;
  }
  
  return city
    .trim()
    .replace(/[<>\"'`]/g, '')
    .slice(0, 100); // Max length
}

/**
 * Validates file size
 */
export function validateFileSize(sizeBytes: number, maxBytes: number): { valid: boolean; error?: string } {
  if (typeof sizeBytes !== 'number' || sizeBytes < 0) {
    return { valid: false, error: 'Invalid file size' };
  }
  
  if (sizeBytes > maxBytes) {
    const maxMB = (maxBytes / 1024 / 1024).toFixed(1);
    const currentMB = (sizeBytes / 1024 / 1024).toFixed(1);
    return { 
      valid: false, 
      error: `File size (${currentMB}MB) exceeds maximum (${maxMB}MB)` 
    };
  }
  
  return { valid: true };
}

/**
 * Validates document type
 */
export function validateDocType(docType: string): boolean {
  const validTypes = [
    'status_certificate',
    'budget',
    'financial_statements',
    'reserve_fund_study',
    'insurance_certificate',
    'declaration_bylaws',
    'other',
  ];
  
  return validTypes.includes(docType);
}
