import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    if (!token) {
      return new NextResponse("Token manquant", { status: 400 });
    }

    const { adminMessaging } = await import("@/lib/firebase-admin");

    await adminMessaging.send({
      token,
      notification: {
        title: "📩 Portfolio Yahya Haroun",
        body: "Votre système de notifications fonctionne correctement.",
      },
      webpush: {
        notification: {
          icon: '/icons/icon-192x192.png',
          badge: '/icons/icon-192x192.png',
          vibrate: [200, 100, 200, 100, 200, 100, 200],
        },
        fcmOptions: {
          link: "/admin"
        }
      },
      data: {
        url: "/admin",
        title: "📩 Portfolio Yahya Haroun",
        body: "Votre système de notifications fonctionne correctement."
      }
    });

    return new NextResponse("Notification envoyée", { status: 200 });
  } catch (error) {
    console.error("Erreur d'envoi notification test FCM:", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}
