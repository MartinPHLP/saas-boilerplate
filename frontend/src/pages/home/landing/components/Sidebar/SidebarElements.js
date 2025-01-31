import styled from "styled-components";
import { FaTimes } from "react-icons/fa";
import { Link as LinkR } from "react-router-dom";
import { Link as LinkS } from "react-scroll";
import colors from "../../theme";

export const SidebarContainer = styled.aside`
  position: fixed;
  z-index: 999;
  width: 100%;
  height: 100%;
  background: ${colors.colorc};
  box-shadow: -2px 0 10px ${colors.colord}1a;
  display: grid;
  align-items: center;
  left: 0;
  transition: 0.3s ease-in-out;
  ${({ $isOpen }) =>
    $isOpen ? "opacity: 1; top: 0;" : "opacity: 0; top: -100%;"}
`;

export const CloseIcon = styled(FaTimes)`
  color: ${colors.colord};
`;

export const Icon = styled.div`
  position: absolute;
  top: 1.2rem;
  right: 1.5rem;
  background: transparent;
  font-size: 2rem;
  cursor: pointer;
  outline: none;
`;

export const SidebarWrapper = styled.div`
  color: #fff;
`;

export const SidebarMenu = styled.ul`
  display: grid;
  grid-template-colums: 1fr;
  grid-template-rows: repeat(6, 80px);
  text-align: center;

  @media screen and (max-width: 480px) {
    grid-template-rows: repeat(6, 60px);
  }
`;

export const SidebarLink = styled(LinkS)`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  text-decoration: none;
  list-style: none;
  transition: 0.2s ease-in-out;
  color: ${colors.colord};
  cursor: pointer;

  &:hover {
    color: ${colors.colora};
    background: ${colors.colorc};
  }
`;

export const SideBtnWrap = styled.div`
  display: flex;
  justify-content: center;
`;

export const SidebarRoute = styled(LinkR)`
  border-radius: 50px;
  background: ${colors.colora};
  white-space: nowrap;
  padding: 16px 64px;
  color: #fff;
  font-size: 16px;
  outline: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;

  &:hover {
    transition: all 0.2s ease-in-out;
    background: ${colors.colorb};
  }
`;
