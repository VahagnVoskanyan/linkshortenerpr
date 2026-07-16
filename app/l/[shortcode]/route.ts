import { NextResponse } from "next/server";
import { getLinkByShortCode } from "@/lib/links";

const ALLOWED_REDIRECT_PROTOCOLS = new Set(["http:", "https:"]);

type RouteContext = {
  params: Promise<{ shortcode: string }>;
};

export async function GET(
  _request: Request,
  context: RouteContext,
): Promise<NextResponse> {
  const { shortcode } = await context.params;

  const link = await getLinkByShortCode(shortcode);
  if (!link) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Short link not found",
        },
      },
      { status: 404 },
    );
  }

  try {
    const destinationUrl = new URL(link.originalUrl);

    if (!ALLOWED_REDIRECT_PROTOCOLS.has(destinationUrl.protocol)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_DESTINATION_PROTOCOL",
            message: "Stored destination URL protocol is not allowed",
          },
        },
        { status: 400 },
      );
    }

    return NextResponse.redirect(destinationUrl);
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INVALID_DESTINATION_URL",
          message: "Stored destination URL is invalid",
        },
      },
      { status: 500 },
    );
  }
}
