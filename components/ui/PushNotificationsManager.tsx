"use client";

import {
  sendNotification,
  subscribeUser,
  unsubscribeUser,
} from "@/app/actions";
import { useEffect, useState } from "react";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function PushNotificationsManager() {
  const supportsPush =
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window;

  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [message, setMessage] = useState("");

  async function registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
        updateViaCache: "none",
      });

      const sub = await registration.pushManager.getSubscription();

      // This triggers the warning if called synchronously inside useEffect.
      setSubscription(sub);
    } catch (err) {
      console.error("SW registration failed:", err);
    }
  }

  useEffect(() => {
    if (!supportsPush) return;

    queueMicrotask(() => {
      registerServiceWorker();
    });
  }, [supportsPush]);

  async function subscribeToPush() {
    try {
      const registration = await navigator.serviceWorker.ready;

      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
        ),
      });

      setSubscription(sub);

      const serializedSub = JSON.parse(JSON.stringify(sub));
      await subscribeUser(serializedSub);
    } catch (err) {
      console.error("Failed to subscribe:", err);
    }
  }

  async function unsubscribeFromPush() {
    try {
      await subscription?.unsubscribe();
      setSubscription(null);
      await unsubscribeUser();
    } catch (err) {
      console.error("Failed to unsubscribe:", err);
    }
  }

  async function sendTestNotification() {
    if (!subscription) return;

    try {
      await sendNotification(message);
      setMessage("");
    } catch (err) {
      console.error("Notification failed:", err);
    }
  }

  if (!supportsPush) {
    return <p>Push notifications are not supported in this browser.</p>;
  }

  return (
    <div>
      <h3>Push Notifications</h3>

      {subscription ? (
        <>
          <p>You are subscribed to push notifications.</p>

          <button onClick={unsubscribeFromPush}>Unsubscribe</button>

          <input
            type="text"
            placeholder="Enter notification message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button onClick={sendTestNotification}>Send Test</button>
        </>
      ) : (
        <>
          <p>You are not subscribed to push notifications.</p>
          <button onClick={subscribeToPush}>Subscribe</button>
        </>
      )}
    </div>
  );
}
