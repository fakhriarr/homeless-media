import { handleError, json } from "@/lib/api-helpers";
import { getSession, toSafeUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getSession();
    return json({ user: user ? toSafeUser(user) : null });
  } catch (error) {
    return handleError(error);
  }
}