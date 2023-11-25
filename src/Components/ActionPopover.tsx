import OBR from "@owlbear-rodeo/sdk";
import { ReactNode, useEffect } from "react";

interface Props {
  children?: ReactNode;
  height?: number;
  badgeText?: string;
  badgeColor?: string;
}

export function ActionPopover(props: Props) {
  const { children, height, badgeText, badgeColor } = props;
  useEffect(() => {
    if (height) {
      OBR.action.setHeight(height);
    }
  }, [height]);
  useEffect(() => {
    if (badgeText) {
      OBR.action.setBadgeText(badgeText);
    }
  }, [badgeText]);
  useEffect(() => {
    if (badgeColor) {
      OBR.action.setBadgeBackgroundColor(badgeColor);
    }
  }, [badgeColor]);
  return children;
}
