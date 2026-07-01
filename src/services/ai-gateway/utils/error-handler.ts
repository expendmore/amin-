export function normalizeGatewayError(err: any): {
  code: string;
  message: string;
  statusCode: number;
} {
  const msg = err?.message || "An unexpected gateway error occurred.";

  if (
    msg.includes("429") ||
    msg.includes("rate limit") ||
    msg.includes("Rate limit") ||
    msg.includes("quota")
  ) {
    return {
      code: "RATE_LIMIT_EXCEEDED",
      message: "Upstream provider rate limit or quota exceeded. Please wait before retrying.",
      statusCode: 429,
    };
  }

  if (
    msg.includes("401") ||
    msg.includes("API key") ||
    msg.includes("api key") ||
    msg.includes("credentials")
  ) {
    return {
      code: "INVALID_API_KEY",
      message: "Authentication failure with provider credentials. Invalid API key settings.",
      statusCode: 401,
    };
  }

  if (msg.includes("timeout") || msg.includes("Timeout") || msg.includes("abort")) {
    return {
      code: "PROVIDER_TIMEOUT",
      message: "Connection to upstream provider timed out.",
      statusCode: 504,
    };
  }

  if (
    msg.includes("503") ||
    msg.includes("502") ||
    msg.includes("outage") ||
    msg.includes("offline") ||
    msg.includes("Unavailable")
  ) {
    return {
      code: "PROVIDER_OFFLINE",
      message: "The requested provider service is currently offline or undergoing maintenance.",
      statusCode: 503,
    };
  }

  return {
    code: "INTERNAL_GATEWAY_ERROR",
    message: msg,
    statusCode: 500,
  };
}
export default normalizeGatewayError;
