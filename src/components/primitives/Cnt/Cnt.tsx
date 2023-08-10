import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { container, element, feature, padding } from "@/themes/spacings";
import { Div } from "../Text/Text";

export const flex = css`
  display: flex;
`;

export const column = css`
  flex-direction: column;
`;

export const vp = css`
  padding-top: ${padding.general.v}px;
  padding-bottom: ${padding.general.v}px;
`;

export const hp = css`
  padding-left: ${padding.general.h}px;
  padding-right: ${padding.general.h}px;
`;

export type Facet = "element" | "feature" | "container" | "flex";

export const getFacet = (facet?: Facet) => {
  switch (facet) {
    case "container":
      return `
        row-gap: ${container.gap.row}px;
        column-gap: ${container.gap.column}px;
      `;
    case "element":
      return `
        row-gap: ${element.gap.row}px;
        column-gap: ${element.gap.h}px;
      `;
    case "flex":
      return ``;
    default:
      return `
        row-gap: ${feature.gap.row}px;
        column-gap: ${feature.gap.column}px;
      `;
  }
};

export const Cnt = styled(Div)<{
  column?: boolean;
  facet?: Facet;
  hp?: boolean;
  vp?: boolean;
}>`
  ${flex};
  flex-direction: ${({ column }) => column && "column"};
  ${({ facet }) => getFacet(facet)};
  padding: ${({ vp }) => (vp ? `${padding.general.v}px` : "0")}
    ${({ hp }) => (hp ? `${padding.general.h}px` : "0")};
`;
