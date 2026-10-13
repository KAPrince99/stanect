import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { PushNotificationsManager } from "@/components/ui/PushNotificationsManager";

const { subscribeUser, unsubscribeUser, sendNotification } = vi.hoisted(() => ({
  subscribeUser: vi.fn(),
  unsubscribeUser: vi.fn(),
  sendNotification: vi.fn(),
}));

vi.mock("@/app/actions", () => ({
  subscribeUser,
  unsubscribeUser,
  sendNotification,
}));

const VAPID_PUBLIC_KEY =
  "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U";

type PushMock = {
  endpoint: string;
  keys?: { p256dh: string; auth: string };
  unsubscribe: ReturnType<typeof vi.fn>;
};

function subscription(endpoint: string): PushMock {
  return {
    endpoint,
    keys: { p256dh: "key", auth: "auth" },
    unsubscribe: vi.fn().mockResolvedValue(true),
  };
}

function installPushSupport() {
  const pushManager = {
    getSubscription: vi.fn().mockResolvedValue(null),
    subscribe: vi.fn(),
  };
  const registration = { pushManager };
  const serviceWorker = {
    register: vi.fn().mockResolvedValue(registration),
    ready: Promise.resolve(registration),
  };

  Object.defineProperty(navigator, "serviceWorker", {
    configurable: true,
    value: serviceWorker,
  });
  Object.defineProperty(window, "PushManager", {
    configurable: true,
    value: class PushManager {},
  });

  return { pushManager, serviceWorker };
}

function removePushSupport() {
  delete (navigator as Navigator & { serviceWorker?: ServiceWorkerContainer })
    .serviceWorker;
  delete (window as Window & { PushManager?: unknown }).PushManager;
}

describe("PushNotificationsManager", () => {
  beforeEach(() => {
    subscribeUser.mockReset();
    unsubscribeUser.mockReset();
    sendNotification.mockReset();
    subscribeUser.mockResolvedValue({ success: true });
    unsubscribeUser.mockResolvedValue({ success: true });
    sendNotification.mockResolvedValue({ success: true });
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY = VAPID_PUBLIC_KEY;
    removePushSupport();
  });

  afterEach(() => {
    removePushSupport();
    vi.restoreAllMocks();
  });

  it("says when this browser cannot receive push", () => {
    render(<PushNotificationsManager />);

    expect(
      screen.getByText("Push notifications are not supported in this browser."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Subscribe" })).not.toBeInTheDocument();
  });

  it("registers the worker and starts unsubscribed", async () => {
    const { serviceWorker } = installPushSupport();

    render(<PushNotificationsManager />);

    expect(
      await screen.findByText("You are not subscribed to push notifications."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Subscribe" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Send Test" })).not.toBeInTheDocument();

    await waitFor(() => {
      expect(serviceWorker.register).toHaveBeenCalledWith("/sw.js", {
        scope: "/",
        updateViaCache: "none",
      });
    });
  });

  it("shows the current subscription when one already exists", async () => {
    const current = subscription("https://push.example/current");
    const { pushManager } = installPushSupport();
    pushManager.getSubscription.mockResolvedValue(current);

    render(<PushNotificationsManager />);

    expect(
      await screen.findByText("You are subscribed to push notifications."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Unsubscribe" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Send Test" })).toBeInTheDocument();
  });

  it("subscribes with the new push subscription", async () => {
    const user = userEvent.setup();
    const created = subscription("https://push.example/new");
    const { pushManager, serviceWorker } = installPushSupport();
    pushManager.subscribe.mockResolvedValue(created);

    render(<PushNotificationsManager />);

    await waitFor(() => {
      expect(serviceWorker.register).toHaveBeenCalled();
    });
    await user.click(screen.getByRole("button", { name: "Subscribe" }));

    expect(
      await screen.findByText("You are subscribed to push notifications."),
    ).toBeInTheDocument();
    expect(pushManager.subscribe).toHaveBeenCalledWith({
      userVisibleOnly: true,
      applicationServerKey: expect.any(Uint8Array),
    });
    expect(subscribeUser).toHaveBeenCalledWith({
      endpoint: "https://push.example/new",
      keys: { p256dh: "key", auth: "auth" },
    });
  });

  it("stays unsubscribed when subscribe fails", async () => {
    const user = userEvent.setup();
    const { pushManager } = installPushSupport();
    pushManager.subscribe.mockRejectedValue(new Error("denied"));
    vi.spyOn(console, "error").mockImplementation(() => {});

    render(<PushNotificationsManager />);

    await user.click(await screen.findByRole("button", { name: "Subscribe" }));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
    });
    expect(
      screen.getByText("You are not subscribed to push notifications."),
    ).toBeInTheDocument();
    expect(subscribeUser).not.toHaveBeenCalled();
  });

  it("unsubscribes the current subscription", async () => {
    const user = userEvent.setup();
    const current = subscription("https://push.example/current");
    const { pushManager } = installPushSupport();
    pushManager.getSubscription.mockResolvedValue(current);

    render(<PushNotificationsManager />);

    await user.click(await screen.findByRole("button", { name: "Unsubscribe" }));

    expect(
      await screen.findByText("You are not subscribed to push notifications."),
    ).toBeInTheDocument();
    expect(current.unsubscribe).toHaveBeenCalledOnce();
    expect(unsubscribeUser).toHaveBeenCalledOnce();
    expect(screen.queryByRole("button", { name: "Send Test" })).not.toBeInTheDocument();
  });

  it("sends the typed message through the current subscription", async () => {
    const user = userEvent.setup();
    const current = subscription("https://push.example/current");
    const { pushManager } = installPushSupport();
    pushManager.getSubscription.mockResolvedValue(current);

    render(<PushNotificationsManager />);

    const message = await screen.findByPlaceholderText("Enter notification message");
    await user.type(message, "Practice time");
    await user.click(screen.getByRole("button", { name: "Send Test" }));

    await waitFor(() => {
      expect(sendNotification).toHaveBeenCalledWith("Practice time");
    });
    expect(message).toHaveValue("");
  });

  it("keeps the typed message when sending fails", async () => {
    const user = userEvent.setup();
    const current = subscription("https://push.example/current");
    const { pushManager } = installPushSupport();
    pushManager.getSubscription.mockResolvedValue(current);
    sendNotification.mockRejectedValue(new Error("No subscription available"));
    vi.spyOn(console, "error").mockImplementation(() => {});

    render(<PushNotificationsManager />);

    const message = await screen.findByPlaceholderText("Enter notification message");
    await user.type(message, "Practice time");
    await user.click(screen.getByRole("button", { name: "Send Test" }));

    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
    });
    expect(message).toHaveValue("Practice time");
    expect(
      screen.getByText("You are subscribed to push notifications."),
    ).toBeInTheDocument();
  });
});
