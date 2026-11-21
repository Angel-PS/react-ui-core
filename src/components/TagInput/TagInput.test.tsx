import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { TagInput, cleanTag, splitPastedTags } from "./TagInput";
import type { TagInputProps } from "./TagInput";

const isUrl = (v: string) => /^https?:\/\/\S+$/.test(v);

function Controlled({
  initial = [],
  spy,
  ...rest
}: Partial<TagInputProps> & { initial?: string[]; spy?: (tags: string[]) => void }) {
  const [tags, setTags] = useState<string[]>(initial);
  return (
    <TagInput
      label="Redirect URIs"
      name="uris"
      {...rest}
      value={tags}
      onChange={(next) => {
        spy?.(next);
        setTags(next);
      }}
    />
  );
}

const input = () => screen.getByLabelText("Redirect URIs") as HTMLInputElement;

describe("TagInput helpers", () => {
  it("cleanTag trims whitespace and trailing separators", () => {
    expect(cleanTag("  a.com, ")).toBe("a.com");
    expect(cleanTag(";b.com;")).toBe("b.com");
    expect(cleanTag("   ")).toBe("");
  });

  it("splitPastedTags splits on newlines, commas and semicolons", () => {
    expect(splitPastedTags("a\nb, c;d\r\n\n")).toEqual(["a", "b", "c", "d"]);
  });
});

describe("TagInput", () => {
  it("links the label to the draft input", () => {
    render(<Controlled />);
    expect(input().tagName).toBe("INPUT");
    expect(input()).toHaveAttribute("id", "uris");
  });

  it("adds a tag on Enter and on comma", () => {
    const spy = vi.fn();
    render(<Controlled spy={spy} />);
    fireEvent.change(input(), { target: { value: "https://a.com" } });
    fireEvent.keyDown(input(), { key: "Enter" });
    expect(spy).toHaveBeenLastCalledWith(["https://a.com"]);
    fireEvent.change(input(), { target: { value: "https://b.com" } });
    fireEvent.keyDown(input(), { key: "," });
    expect(spy).toHaveBeenLastCalledWith(["https://a.com", "https://b.com"]);
    expect(input()).toHaveValue("");
  });

  it("commits the draft on blur", () => {
    const spy = vi.fn();
    render(<Controlled spy={spy} />);
    fireEvent.change(input(), { target: { value: "x" } });
    fireEvent.blur(input());
    expect(spy).toHaveBeenLastCalledWith(["x"]);
  });

  it("drops duplicates", () => {
    const spy = vi.fn();
    render(<Controlled spy={spy} initial={["a"]} />);
    fireEvent.change(input(), { target: { value: "a" } });
    fireEvent.keyDown(input(), { key: "Enter" });
    expect(spy).not.toHaveBeenCalled();
    expect(input()).toHaveValue("");
    expect(screen.getAllByText("a")).toHaveLength(1);
  });

  it("removes a chip with its button and the last chip with Backspace", () => {
    const spy = vi.fn();
    render(<Controlled spy={spy} initial={["a", "b", "c"]} />);
    fireEvent.click(screen.getByRole("button", { name: "Remove b" }));
    expect(spy).toHaveBeenLastCalledWith(["a", "c"]);
    fireEvent.keyDown(input(), { key: "Backspace" });
    expect(spy).toHaveBeenLastCalledWith(["a"]);
  });

  it("rejects an invalid value, keeps it in the draft and shows the message", () => {
    const spy = vi.fn();
    render(<Controlled spy={spy} validate={isUrl} invalidMessage="Enter a full URL" />);
    fireEvent.change(input(), { target: { value: "not a url" } });
    fireEvent.keyDown(input(), { key: "Enter" });
    expect(spy).not.toHaveBeenCalled();
    expect(input()).toHaveValue("not a url");
    expect(screen.getByRole("alert")).toHaveTextContent("Enter a full URL");
    expect(input()).toHaveAttribute("aria-invalid", "true");
    expect(input()).toHaveAttribute("aria-describedby", "uris-error");
    // Typing again clears the message.
    fireEvent.change(input(), { target: { value: "https://ok.com" } });
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("splits a pasted list into chips and keeps invalid items in the draft", () => {
    const spy = vi.fn();
    render(<Controlled spy={spy} validate={isUrl} />);
    fireEvent.paste(input(), {
      clipboardData: { getData: () => "https://a.com\nbad, https://b.com" },
    });
    expect(spy).toHaveBeenLastCalledWith(["https://a.com", "https://b.com"]);
    expect(input()).toHaveValue("bad");
    expect(screen.getByRole("alert")).toHaveTextContent("Invalid value");
  });

  it("a paste without separators goes into the draft unchanged", () => {
    const spy = vi.fn();
    render(<Controlled spy={spy} />);
    fireEvent.paste(input(), { clipboardData: { getData: () => "https://a.com" } });
    expect(spy).not.toHaveBeenCalled();
  });

  it("disabled hides the remove buttons and disables the input", () => {
    render(<Controlled initial={["a"]} disabled />);
    expect(input()).toBeDisabled();
    expect(screen.queryByRole("button", { name: "Remove a" })).not.toBeInTheDocument();
  });

  it("shows the placeholder only when there are no tags", () => {
    const { rerender } = render(
      <TagInput label="Redirect URIs" name="u" value={[]} onChange={() => {}} placeholder="Add one" />,
    );
    expect(input()).toHaveAttribute("placeholder", "Add one");
    rerender(
      <TagInput label="Redirect URIs" name="u" value={["a"]} onChange={() => {}} placeholder="Add one" />,
    );
    expect(input()).toHaveAttribute("placeholder", "");
  });

  it("wires the hint and an external error", () => {
    render(
      <TagInput
        label="Redirect URIs"
        name="h"
        value={[]}
        onChange={() => {}}
        hint="One per tag"
        error="At least one URI"
      />,
    );
    expect(input()).toHaveAttribute("aria-describedby", "h-error h-hint");
    expect(screen.getByRole("alert")).toHaveTextContent("At least one URI");
  });
});
