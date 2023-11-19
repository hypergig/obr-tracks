import OBR from "@owlbear-rodeo/sdk";
import { useEffect } from "react";
import { useMessage } from "./MessageProvider";

interface Props {
  height?: number;
}

export function ActionPopover(props: Props) {
  const { height } = props;
  useEffect(() => {
    if (height) {
      OBR.action.setHeight(height);
    }
  }, [height]);
  return null;
}

export function PlayerPopover() {
  const currentMessage = useMessage();
  return <ActionPopover height={currentMessage !== undefined ? 173 : 48} />;
}
