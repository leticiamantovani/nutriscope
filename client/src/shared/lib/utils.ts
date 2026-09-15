import { createCn } from "cn/config";

/**
 * Class merger aware of our design tokens, so `text-body` (size) and
 * `text-verdict-avoid` (color) are never treated as conflicting.
 * Keep these lists in sync with shared/design-system/tokens.css.
 */
export const cn = createCn({
  extend: {
    theme: {
      text: ["display", "heading", "body", "small"],
      color: [
        "brand-orange",
        "brand-orange-strong",
        "brand-coral",
        "brand-mustard",
        "brand-green",
        "brand-green-strong",
        "brand-sand",
        "brand-cocoa",
        "verdict-ok",
        "verdict-ok-soft",
        "verdict-ok-border",
        "verdict-caution",
        "verdict-caution-soft",
        "verdict-caution-border",
        "verdict-avoid",
        "verdict-avoid-soft",
        "verdict-avoid-border",
        "verdict-danger",
        "verdict-danger-soft",
        "verdict-danger-border",
        "verdict-danger-foreground",
      ],
    },
  },
});
