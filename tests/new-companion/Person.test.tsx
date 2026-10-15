import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { renderWithProviders } from "@/tests/support/render";
import { resetTabFormStore } from "@/tests/support/tabForm";
import { useTabFormStore } from "@/store/useTabFormStore";

import Person from "@/components/ui/NewTabForm/Person";

describe("Person", () => {
  beforeEach(() => {
    resetTabFormStore();
  });

  afterEach(() => {
    resetTabFormStore();
  });

  it("shows a name error until the name is at least two characters", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Person />);

    const name = screen.getByPlaceholderText("Sophia • Alex • Mia...");
    await user.type(name, "A");

    expect(
      screen.getByText("Name must be at least 2 characters"),
    ).toBeInTheDocument();
    expect(useTabFormStore.getState().companionName).toBe("A");

    await user.type(name, "da");

    expect(
      screen.queryByText("Name must be at least 2 characters"),
    ).not.toBeInTheDocument();
    expect(useTabFormStore.getState().companionName).toBe("Ada");
  });

  it("shows a scene error until the scene is at least two characters", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Person />);

    const scene = screen.getByPlaceholderText("Gym • Coffee Shop • Bookstore...");
    await user.type(scene, "G");

    expect(
      screen.getByText("Scene must be at least 2 characters"),
    ).toBeInTheDocument();

    await user.type(scene, "ym");

    expect(
      screen.queryByText("Scene must be at least 2 characters"),
    ).not.toBeInTheDocument();
    expect(useTabFormStore.getState().scene).toBe("Gym");
  });

  it("brightens the name and scene borders while they are focused", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Person />);

    const name = screen.getByPlaceholderText("Sophia • Alex • Mia...");
    const scene = screen.getByPlaceholderText(
      "Gym • Coffee Shop • Bookstore...",
    );

    expect(name).not.toHaveClass("animate-search-border");
    expect(scene).not.toHaveClass("animate-search-border");

    await user.click(name);
    expect(name).toHaveClass("animate-search-border");
    expect(scene).not.toHaveClass("animate-search-border");

    await user.click(scene);
    expect(scene).toHaveClass("animate-search-border");
    expect(name).not.toHaveClass("animate-search-border");
  });
});
