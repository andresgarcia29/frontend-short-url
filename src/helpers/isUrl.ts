export function isUrl(url: string): boolean {
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    return false;
  }

  return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
}
