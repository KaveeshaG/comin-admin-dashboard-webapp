import { NextRequest, NextResponse } from "next/server";
type ServiceName = "auth" | "organizations" | "employees" | "leaves" | "time";

const SERVICE_MAPPINGS: Record<ServiceName, string> = {
  auth: "https://comin.kaveeshagimhana.com",
  organizations: "https://comin.kaveeshagimhana.com",
  employees: "https://comin.kaveeshagimhana.com",
  leaves: "https://comin.kaveeshagimhana.com",
  time: "https://comin.kaveeshagimhana.com",
};

async function handleRequest(
  request: NextRequest,
  paths: string[],
  method: string
) {
  const [serviceName, ...remainingPath] = paths;

  if (!(serviceName in SERVICE_MAPPINGS)) {
    console.error(`Service '${serviceName}' not found in SERVICE_MAPPINGS`);
    return NextResponse.json(
      { message: `Service '${serviceName}' not found` },
      { status: 404 }
    );
  }

  const baseUrl = SERVICE_MAPPINGS[serviceName as ServiceName];
  const apiPath = remainingPath.join("/");
  const apiUrl = `${baseUrl}/api/v1/${apiPath}${request.nextUrl.search}`;

  const cookieHeader = request.headers.get("cookie");
  const accessToken = request.cookies.get("accessToken")?.value;
  const tenantId = request.cookies.get("currentTenantId")?.value;

  try {
    const body =
      method !== "GET" && method !== "HEAD"
        ? await request.json().catch(() => undefined)
        : undefined;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (cookieHeader) {
      headers["cookie"] = cookieHeader;
    }

    const authHeader = request.headers.get("authorization");
    if (authHeader) {
      headers["authorization"] = authHeader;
    }

    if (tenantId) {
      headers["x-tenant-id"] = tenantId;
    }

    const response = await fetch(apiUrl, {
      method,
      headers,
      body: body ? JSON.stringify(body) : body || undefined,
      credentials: "include",
    });

    const data = await response.text();

    // Check if the response is empty
    if (!data || data.trim() === "") {
      return NextResponse.json(
        {},
        {
          status: response.status,
          headers: {
            "Access-Control-Allow-Origin": request.headers.get("origin") || "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers":
              "Content-Type, Authorization, x-tenant-id",
            "Access-Control-Allow-Credentials": "true",
          },
        }
      );
    }

    try {
      // Try to parse the data as JSON
      const parsedData = JSON.parse(data.trim());

      return NextResponse.json(parsedData, {
        status: response.status,
        headers: {
          "Access-Control-Allow-Origin": request.headers.get("origin") || "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers":
            "Content-Type, Authorization, x-tenant-id",
          "Access-Control-Allow-Credentials": "true",
        },
      });
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Raw response data:", data);

      // If we can't parse the data as JSON, return it as text
      return new NextResponse(data, {
        status: response.status,
        headers: {
          "Content-Type": "text/plain",
          "Access-Control-Allow-Origin": request.headers.get("origin") || "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers":
            "Content-Type, Authorization, x-tenant-id",
          "Access-Control-Allow-Credentials": "true",
        },
      });
    }
  } catch (error) {
    console.error(`Error proxying request to ${apiUrl}:`, error);
    return NextResponse.json(
      {
        message: "Error proxying request",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(request, params.path, "GET");
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(request, params.path, "POST");
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(request, params.path, "PUT");
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(request, params.path, "DELETE");
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(request, params.path, "PATCH");
}

export async function OPTIONS(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": request.headers.get("origin") || "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, x-tenant-id",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Max-Age": "86400",
    },
  });
}
