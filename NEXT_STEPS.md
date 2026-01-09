# Next Steps - Action Plan

## 🎯 Immediate Priorities (This Week)

### 1. **Implement Distributed Rate Limiting** ⚠️ CRITICAL
**Why:** Current in-memory rate limiting won't work in production (serverless/multi-instance)

**Options:**
- **Vercel KV** (Recommended if deploying on Vercel)
  ```bash
  npm install @vercel/kv
  ```
  ```typescript
  // app/api/analyze/route.ts
  import { kv } from '@vercel/kv';
  
  const rateLimitKey = `rate_limit:${ip}`;
  const count = await kv.incr(rateLimitKey);
  if (count === 1) {
    await kv.expire(rateLimitKey, 60); // 60 second window
  }
  if (count > RATE_LIMIT_MAX) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }
  ```

- **Upstash Redis** (Alternative)
  ```bash
  npm install @upstash/redis
  ```

**Estimated Time:** 2-3 hours  
**Priority:** 🔴 Critical for production

---

### 2. **Add Input Sanitization** ⚠️ CRITICAL
**Why:** Security vulnerability - user inputs not validated/sanitized

**Implementation:**
```typescript
// lib/validation.ts (new file)
export function sanitizePropertyAddress(address: string): string {
  // Remove dangerous characters, limit length
  return address
    .trim()
    .replace(/[<>\"']/g, '')
    .slice(0, 200); // Max length
}

export function sanitizeFileName(fileName: string): string {
  // Remove path traversal attempts, special chars
  const sanitized = fileName
    .replace(/[\/\\]/g, '_') // Remove path separators
    .replace(/\.\./g, '') // Remove parent directory
    .replace(/[^a-zA-Z0-9._-]/g, '_') // Only allow safe chars
    .slice(0, 255); // Max filename length
  return sanitized;
}

export function validateBase64(base64: string): boolean {
  // Check if valid base64
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  return base64Regex.test(base64) && base64.length > 0;
}
```

**Update:**
- `app/api/analyze/route.ts` - Add validation before processing
- `app/analyze/page.tsx` - Validate on client side too

**Estimated Time:** 3-4 hours  
**Priority:** 🔴 Critical for security

---

### 3. **Add Request Timeout Handling** ⚠️ HIGH
**Why:** Long-running requests (up to 5 min) can hang indefinitely

**Implementation:**
```typescript
// app/api/analyze/route.ts
export const maxDuration = 300; // Already set, good!

// Add client-side timeout
// app/analyze/page.tsx
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 4 * 60 * 1000); // 4 min timeout

const response = await fetch('/api/analyze', {
  method: 'POST',
  signal: controller.signal,
  // ...
});

clearTimeout(timeoutId);
```

**Estimated Time:** 1-2 hours  
**Priority:** 🟠 High (UX improvement)

---

### 4. **Add Error Boundaries to Key Components** ⚠️ HIGH
**Why:** Single component error crashes entire page

**Implementation:**
```typescript
// app/analyze/page.tsx
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function AnalyzePage() {
  return (
    <ErrorBoundary>
      {/* existing content */}
    </ErrorBoundary>
  );
}
```

**Files to update:**
- `app/analyze/page.tsx`
- `app/report/[id]/page.tsx`

**Estimated Time:** 1 hour  
**Priority:** 🟠 High (resilience)

---

## 📅 Short-term (Next 2 Weeks)

### 5. **Update Next.js Version**
```bash
npm install next@latest
npm install react@latest react-dom@latest
```
**Check for breaking changes:** Review Next.js 14.x changelog  
**Estimated Time:** 1-2 hours (including testing)

---

### 6. **Add Comprehensive Input Validation**
Create validation schema for:
- Property address format
- File size limits (already done, but add better error messages)
- File type validation (already done, but enhance)

**Estimated Time:** 2-3 hours

---

### 7. **Improve Health Check Endpoint**
```typescript
// app/api/health/route.ts
export async function GET() {
  const checks = {
    api: !!process.env.VENICE_API_KEY?.trim(),
    // Add more checks as needed
  };
  
  const healthy = Object.values(checks).every(v => v);
  
  return NextResponse.json(
    { 
      ok: healthy, 
      checks,
      timestamp: new Date().toISOString()
    },
    { status: healthy ? 200 : 503 }
  );
}
```

**Estimated Time:** 30 minutes

---

### 8. **Add Structured Logging**
Replace `console.log` with proper logging:
```bash
npm install pino
```

**Estimated Time:** 2-3 hours

---

## 🔄 Medium-term (Next Month)

### 9. **Convert section-normalizer.js to TypeScript**
- Rename to `.ts`
- Add proper types
- Update imports

**Estimated Time:** 1 hour

---

### 10. **Add Request ID Tracking**
```typescript
// middleware.ts or custom middleware
const requestId = crypto.randomUUID();
// Add to headers, logs, error responses
```

**Estimated Time:** 2 hours

---

### 11. **Implement Caching Strategy**
- Add cache headers to static responses
- Consider caching analysis results (if appropriate)

**Estimated Time:** 3-4 hours

---

### 12. **Add API Documentation**
- Document all API endpoints
- Add request/response examples
- Consider OpenAPI/Swagger

**Estimated Time:** 4-6 hours

---

## 🧪 Testing & Quality (Ongoing)

### 13. **Set Up Test Suite**
```bash
# Tests are configured but need actual test files
npm test
```

**Create test files:**
- `tests/lib/section-normalizer.test.ts`
- `tests/lib/pdf-parser.test.ts`
- `tests/api/analyze.test.ts`

**Estimated Time:** 8-10 hours (initial setup)

---

### 14. **Add E2E Tests**
```bash
# Playwright is already installed
npx playwright install
```

**Estimated Time:** 6-8 hours

---

### 15. **Code Quality Improvements**
- Enable stricter TypeScript checks
- Add more ESLint rules
- Set up pre-commit hooks (husky is installed)

**Estimated Time:** 2-3 hours

---

## 🚀 Deployment Readiness Checklist

Before deploying to production:

- [ ] ✅ Fixed vitest config (DONE)
- [ ] ✅ Fixed deprecated methods (DONE)
- [ ] ✅ Added security headers (DONE)
- [ ] ⏳ Implement distributed rate limiting
- [ ] ⏳ Add input sanitization
- [ ] ⏳ Add request timeout handling
- [ ] ⏳ Add error boundaries
- [ ] ⏳ Update Next.js version
- [ ] ⏳ Improve health check
- [ ] ⏳ Add structured logging
- [ ] ⏳ Set up monitoring/alerting
- [ ] ⏳ Load testing
- [ ] ⏳ Security audit

---

## 📝 Quick Wins (Can Do Today)

1. **Add .gitignore entry for .env.local** (if not already present)
2. **Add JSDoc comments** to complex functions
3. **Create CONTRIBUTING.md** with development guidelines
4. **Add CHANGELOG.md** to track changes
5. **Update README.md** with more deployment details

---

## 🎯 Recommended Order

**Week 1:**
1. Distributed rate limiting (Critical)
2. Input sanitization (Critical)
3. Request timeout handling (High)
4. Error boundaries (High)

**Week 2:**
5. Update Next.js
6. Improve health check
7. Add structured logging
8. Convert section-normalizer to TypeScript

**Week 3-4:**
9. Set up test suite
10. Add E2E tests
11. Code quality improvements
12. API documentation

---

## 💡 Pro Tips

1. **Start with rate limiting** - It's the most critical for production
2. **Test incrementally** - Don't wait until the end to test
3. **Use feature flags** - For gradual rollout of new features
4. **Monitor in production** - Set up Sentry alerts (already integrated)
5. **Document as you go** - Don't let documentation lag behind

---

## 🔗 Resources

- [Vercel KV Documentation](https://vercel.com/docs/storage/vercel-kv)
- [Next.js Security Headers](https://nextjs.org/docs/app/api-reference/next-config/headers)
- [Input Validation Best Practices](https://owasp.org/www-project-web-security-testing-guide/)
- [Rate Limiting Strategies](https://stripe.com/docs/rate-limits)

---

*Last updated: January 2025*
