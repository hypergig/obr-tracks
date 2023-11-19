import { logEvent } from "firebase/analytics";
import { ObrError } from "./errors";
import { analytics } from "./firebase";
import { now } from "./time";

// get number of seconds between two times
export function getSeconds(time: Date) {
  return (now().getTime() - new Date(time).getTime()) / 1000;
}

// if url is a google drive share link, it changes it into a direct download url, if it isn't do nothing
export function convertGoogleDrive(driveUrl: string): string {
  let url: URL;
  try {
    url = new URL(driveUrl);
  } catch (error: unknown) {
    let message = driveUrl;
    if (error instanceof Error) {
      message += ` ${error.message}`;
    }
    new ObrError("url failure", message);
    return "";
  }

  logEvent(analytics, "audio_src", { src: url.hostname });

  if (
    url.hostname === "drive.google.com" &&
    url.pathname.startsWith("/file/d/")
  ) {
    return `https://drive.google.com/uc?export=download&id=${
      url.pathname.split("/")[3]
    }`;
  }

  return driveUrl;
}
