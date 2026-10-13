import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { InstallPrompt } from "@/components/ui/InstallPrompt";

const originalMatchMedia = window.matchMedia;
const originalUserAgent = navigator.userAgent;

function setUserAgent(userAgent: string) {
  Object.defineProperty(navigator, "userAgent", {
    configurable: true,
    value: userAgent,
  });
}

function setInstalled(installed: boolean) {
  window.matchMedia = (query: string) => ({
    matches: installed && query === "(display-mode: standalone)",
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

describe("InstallPrompt", () => {
  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    setUserAgent(originalUserAgent);
    delete (window as Window & { MSStream?: unknown }).MSStream;
  });

  it("offers to install the app in a browser", async () => {
    setInstalled(false);
    setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)");

    render(<InstallPrompt />);

    expect(
      await screen.findByRole("heading", { name: "Install App" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Add to Home Screen" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/To install this app on your iOS device/),
    ).not.toBeInTheDocument();
  });

  it("hides the prompt when the app is already installed", async () => {
    setInstalled(true);
    setUserAgent(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
    );

    render(<InstallPrompt />);

    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: "Add to Home Screen" }),
      ).not.toBeInTheDocument();
    });
    expect(
      screen.queryByRole("heading", { name: "Install App" }),
    ).not.toBeInTheDocument();
  });

  it("shows the iOS instructions on an iPhone", async () => {
    setInstalled(false);
    setUserAgent(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
    );

    render(<InstallPrompt />);

    expect(
      await screen.findByText(/To install this app on your iOS device/),
    ).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "share icon" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "plus icon" })).toBeInTheDocument();
  });

  it("shows the iOS instructions on an iPad", async () => {
    setInstalled(false);
    setUserAgent("Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15");

    render(<InstallPrompt />);

    expect(
      await screen.findByText(/tap the share button/),
    ).toBeInTheDocument();
  });
});
