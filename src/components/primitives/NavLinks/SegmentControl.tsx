import styled from "@emotion/styled";
import { SegmentedControl as SControl } from "@mantine/core";
import { size } from "@/themes/font-style";
import { disguised, general, primary } from "@/themes/colors";

const SegmentControl = styled(SControl)<{ fullWidth?: boolean }>`
  // width: ${({ fullWidth }) => (fullWidth ? "100%" : "auto")};
  //width: 100%;
  color: ${primary.value};
  background-color: ${disguised.value};

  // & .mantine-SegmentedControl-label {
  //   font-size: ${size.regular}px;
  // }
`;

export default SegmentControl;
