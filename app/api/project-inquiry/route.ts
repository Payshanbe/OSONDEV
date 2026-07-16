import { NextRequest, NextResponse } from "next/server";

const PROJECT_TYPES = new Set(["website", "product", "design", "motion", "other"]);
const TIMELINES = new Set(["urgent", "1-2-months", "3-4-months", "flexible"]);

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const rateLimits = new Map<string, { count: number; resetAt: number }>();

type Inquiry = {
  locale: "en" | "ru";
  projectType: string;
  brief: string;
  timeline: string;
  name: string;
  company: string;
  contact: string;
};

function readText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function getClientIp(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const current = rateLimits.get(ip);

  if (!current || current.resetAt <= now) {
    rateLimits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  current.count += 1;
  return current.count > RATE_LIMIT_MAX;
}

function parseInquiry(body: Record<string, unknown>): Inquiry | null {
  const inquiry: Inquiry = {
    locale: body.locale === "ru" ? "ru" : "en",
    projectType: readText(body.projectType, 40),
    brief: readText(body.brief, 2000),
    timeline: readText(body.timeline, 40),
    name: readText(body.name, 100),
    company: readText(body.company, 100),
    contact: readText(body.contact, 160),
  };

  if (
    !PROJECT_TYPES.has(inquiry.projectType) ||
    !TIMELINES.has(inquiry.timeline) ||
    inquiry.brief.length < 20 ||
    inquiry.name.length < 2 ||
    inquiry.contact.length < 3
  ) {
    return null;
  }

  return inquiry;
}

function formatInquiry(inquiry: Inquiry, requestId: string) {
  return [
    "New project inquiry — OSONDEV",
    "",
    `Name: ${inquiry.name}`,
    `Company: ${inquiry.company || "—"}`,
    `Contact: ${inquiry.contact}`,
    `Project type: ${inquiry.projectType}`,
    `Timeline: ${inquiry.timeline}`,
    `Language: ${inquiry.locale.toUpperCase()}`,
    "",
    "Brief:",
    inquiry.brief,
    "",
    `Request ID: ${requestId}`,
  ].join("\n");
}

async function sendToTelegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) throw new Error("Telegram delivery is not configured");

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
    cache: "no-store",
  });

  if (!response.ok) throw new Error(`Telegram delivery failed: ${response.status}`);
}

export async function POST(request: NextRequest) {
  if (isRateLimited(getClientIp(request))) {
    return NextResponse.json({ ok: false, error: "Too many requests" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  if (readText(body.website, 200)) {
    return NextResponse.json({ ok: true });
  }

  const inquiry = parseInquiry(body);
  if (!inquiry) {
    return NextResponse.json({ ok: false, error: "Invalid form data" }, { status: 400 });
  }

  const requestId = crypto.randomUUID();
  const text = formatInquiry(inquiry, requestId);
  try {
    await sendToTelegram(text);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: "Delivery failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, requestId });
}
