import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import VoiceSelector from "@/components/ui/NewTabForm/VoiceSelector";

describe("VoiceSelector", () => {
  it("selects male or female", async () => {
    const user = userEvent.setup();
    const onSelectVoice = vi.fn();

    render(<VoiceSelector voice={null} onSelectVoice={onSelectVoice} />);

    await user.click(screen.getByRole("button", { name: "male" }));
    await user.click(screen.getByRole("button", { name: "female" }));

    expect(onSelectVoice).toHaveBeenNthCalledWith(1, "male");
    expect(onSelectVoice).toHaveBeenNthCalledWith(2, "female");
  });

  it("marks the selected voice", () => {
    render(<VoiceSelector voice="female" onSelectVoice={vi.fn()} />);

    expect(
      screen.getByRole("button", { name: "female" }).querySelector(".bg-white\\/12"),
    ).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "male" }).querySelector(".bg-white\\/12"),
    ).toBeNull();
  });

  it("brightens the voice group while a choice is focused", async () => {
    const user = userEvent.setup();
    render(<VoiceSelector voice={null} onSelectVoice={vi.fn()} />);

    const voiceGroup = screen.getByRole("group", { name: "Voice" });
    expect(voiceGroup).toHaveClass("border-white/20");
    expect(voiceGroup).not.toHaveClass("animate-search-border");

    await user.click(screen.getByRole("button", { name: "male" }));
    expect(voiceGroup).toHaveClass("animate-search-border");
  });
});
