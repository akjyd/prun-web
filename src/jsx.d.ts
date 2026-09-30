import "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "bank-list": React.HTMLAttributes<HTMLElement>;
    }
  }
}
