import OpenGraphImage, { alt, contentType, size } from "./opengraph-image";

export { alt, contentType, size };
export const runtime = "edge";

export default async function TwitterImage({ params }: { params: Promise<{ locale: string }> }) {
  return OpenGraphImage({ params });
}
