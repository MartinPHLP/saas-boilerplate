import styled from "styled-components";
import { Link } from "react-scroll";
import colors from "../theme";

export const Button = styled(Link)`
  border-radius: 50px;
  background: ${({ primary }) => (primary ? `${colors.colora}` : "#fff")};
  white-space: nowrap;
  padding: ${({ big }) => (big ? "14px 48px" : "12px 30px")};
  color: ${({ primary }) => (primary ? "#fff" : `${colors.colora}`)};
  font-size: ${({ fontBig }) => (fontBig ? "20px" : "16px")};
  outline: none;
  border: ${({ primary }) => (primary ? "none" : `2px solid ${colors.colora}`)};
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease-in-out;

  &:hover {
    transition: all 0.2s ease-in-out;
    background: ${({ primary }) =>
      primary ? `${colors.colorb}` : `${colors.colorc}`};
    color: ${({ primary }) => (primary ? "#fff" : `${colors.colora}`)};
  }
`;
