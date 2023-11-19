import OBR, { Player } from "@owlbear-rodeo/sdk";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const RoleContext = createContext("");

export const useRole = () => useContext(RoleContext);

export function RoleProvider({ children }: { children?: ReactNode }) {
  const [role, setRole] = useState<"GM" | "PLAYER">("PLAYER");
  useEffect(() => {
    const handlePlayerChange = (player: Player) => {
      setRole(player.role);
    };
    OBR.player.getRole().then(setRole);
    return OBR.player.onChange(handlePlayerChange);
  }, []);
  return <RoleContext.Provider value={role}>{children}</RoleContext.Provider>;
}

interface Props {
  gm?: ReactNode;
  player?: ReactNode;
}

export function WithRole(props: Props) {
  const { gm, player } = props;
  const role = useRole();
  switch (role) {
    case "GM":
      return gm;
      break;
    case "PLAYER":
      return player;
      break;
    default:
      return null;
  }
}

export function GMOnly({ children }: { children?: ReactNode }) {
  return <WithRole gm={children} />;
}

export function PlayerOnly({ children }: { children?: ReactNode }) {
  return <WithRole player={children} />;
}
