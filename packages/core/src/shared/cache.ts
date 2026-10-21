export type CacheInvalidator = (tags: string[]) => void | Promise<void>;

let invalidator: CacheInvalidator | null = null;

export function setCacheInvalidator(next: CacheInvalidator | null) {
  invalidator = next;
}

export async function invalidateTags(...tags: string[]): Promise<void> {
  if (!invalidator || tags.length === 0) return;
  try {
    await invalidator(tags);
  } catch (error) {
    console.error("cache invalidation failed", { tags, error });
  }
}
