import { createCn } from "cn/config";

// Register semantic type sizes so class merging never mistakes them for colours.
export const cn = createCn({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display",
            "heading",
            "body",
            "app-display",
            "page-heading",
            "section-heading",
            "card-heading",
            "app-body",
            "caption",
            "metadata",
            "amount",
          ],
        },
      ],
    },
  },
});
