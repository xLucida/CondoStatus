import type { Section } from '@/types';

declare const SECTION_KEY_MAP: Record<string, string>;

declare function normalizeSections(
  sections: Record<string, Section>
): Record<string, Section>;

export { SECTION_KEY_MAP, normalizeSections };
