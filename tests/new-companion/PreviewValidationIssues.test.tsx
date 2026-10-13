import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import PreviewValidationIssues from "@/components/ui/NewTabForm/PreviewValidationIssues";

describe("PreviewValidationIssues", () => {
  it("renders nothing when every field is valid", () => {
    const { container } = render(<PreviewValidationIssues issues={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("lists the fields that still need attention", () => {
    render(
      <PreviewValidationIssues
        issues={[
          "Name must be at least 2 characters",
          "Scene must be at least 2 characters",
        ]}
      />,
    );

    expect(
      screen.getByText("A few details still need attention:"),
    ).toBeInTheDocument();
    expect(screen.getByText("Name must be at least 2 characters")).toBeInTheDocument();
    expect(screen.getByText("Scene must be at least 2 characters")).toBeInTheDocument();
  });
});
