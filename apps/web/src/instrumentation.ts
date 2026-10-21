export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const [{ setCacheInvalidator }, { revalidateTag }] = await Promise.all([
    import("@somaya/core/shared/cache"),
    import("next/cache"),
  ]);
  setCacheInvalidator((tags) => {
    for (const tag of tags) revalidateTag(tag, "max");
  });
}
