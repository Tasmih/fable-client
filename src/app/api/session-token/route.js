import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.session?.token) {
      return Response.json(
        { message: "unauthorized access" },
        { status: 401 }
      );
    }

    return Response.json({
      token: session.session.token,
      user: session.user,
    });
  } catch (error) {
    return Response.json(
      {
        message: "failed to get session token",
        error: error.message,
      },
      { status: 500 }
    );
  }
}