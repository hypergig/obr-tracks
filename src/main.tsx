import React from "react";
import ReactDOM from "react-dom/client";
import { ActionPopover } from "./Components/ActionPopover";
import { App } from "./Components/App";
import { MessageProvider } from "./Components/MessageProvider";
import { PluginGate } from "./Components/PluginGate";
import { PluginThemeProvider } from "./Components/PluginThemeProvider";
import { GMOnly, RoleProvider } from "./Components/RoleProvider";
import "./firebase";
import { setSkew } from "./time";

setSkew(() =>
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <PluginGate>
        <PluginThemeProvider>
          <MessageProvider>
            <RoleProvider>
              <GMOnly>
                <ActionPopover height={1000} />
              </GMOnly>
              <App />
            </RoleProvider>
          </MessageProvider>
        </PluginThemeProvider>
      </PluginGate>
    </React.StrictMode>,
  ),
);
