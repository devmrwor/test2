"use client";
import { helperText, secondary } from "@/themes/colors";
import { helper } from "@/themes/font-style";
import styled from "@emotion/styled";

export const Div = styled.div<{ sx?: any }>`
  ${({ sx }) => sx ?? {}};
`;

export const Secondary = styled(Div)`
  color: ${secondary.value};
`;

export const HelperText = styled(Div)`
  color: ${helperText.value};
  font-size: ${helper};
`;
