export function cn(
  ...classes: (string | Record<string, boolean> | undefined | null | false)[]
) {
  return classes
    .flatMap((cls) => {
      if (!cls) return [];
      if (typeof cls === "string") return [cls];
      if (typeof cls === "object") {
        return Object.entries(cls)
          .filter(([_, value]) => value)
          .map(([key]) => key);
      }
      return [];
    })
    .join(" ");
}
