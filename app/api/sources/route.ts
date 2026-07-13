import { getCurrentUser } from "@/lib/auth";
import { listSourcesForMatters } from "@/lib/vector-store";

// First sentence of the content, used as a one-line preview in the picker.
function previewOf(content: string): string {
  const [first] = content.split(". ");
  return first.endsWith(".") ? first : first + ".";
}

// Returns the knowledge sources the current user is allowed to pick from.
// Only a short preview is exposed here; the full text is fetched on demand.
export async function GET() {
  const user = getCurrentUser();
  const sources = listSourcesForMatters(user.permittedMatterIds).map((s) => ({
    id: s.id,
    matterId: s.matterId,
    title: s.title,
    preview: previewOf(s.content),
  }));
  return Response.json({ user: { id: user.id, name: user.name }, sources });
}
