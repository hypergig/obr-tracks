import OBR from "@owlbear-rodeo/sdk";
import { logEvent } from "firebase/analytics";
import { analytics } from "./firebase";

export class ObrError extends Error {
  constructor(name: string, object: any) {
    const message = JSON.stringify(object, null, 2);
    super(message);
    this.name = name;
    logEvent(analytics, "exception", { description: name });
    OBR.notification.show(`${this.name}: ${this.message}`, "ERROR");
  }
}
