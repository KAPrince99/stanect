declare namespace JSX {
  interface IntrinsicElements {
    "lord-icon": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      src?: string;
      trigger?: "hover" | "click" | "loop";
      state?: string;
      colors?: string;
      style?: string;
      className?: string;
    };
  }
}
