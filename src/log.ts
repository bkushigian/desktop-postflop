import { BaseDirectory, createDir, writeFile } from "@tauri-apps/api/fs";
import { appDataDir, appLogDir } from "@tauri-apps/api/path";

await createDir('logs', { dir: BaseDirectory.AppData, recursive: true });


function getTimestampedLogFileName() {
    const now = new Date();
    const datePart = now.toISOString().split("T")[0]; // YYYY-MM-DD
    const timePart = now.toTimeString().split(" ")[0].replace(/:/g, "_"); // HH_MM_SS
    return `log_${datePart}_${timePart}.log`;
  }

const THIS_SESSION_LOG_FILE_NAME = 'logs/' + getTimestampedLogFileName();

export async function error(message: string) {
    await log(message, "ERROR");
}

export async function info(message: string) {
    await log(message, "INFO");
}

export async function warning(message: string) {
    await log(message, "WARN");
}

export async function debug(message: string) {
    await log(message, "DEBUG");
}

export async function trace(message: string) {
    await log(message, "TRACE");
}

export async function log(message: string, level: string) {
    const contents = `[${level.toUpperCase()}][${new Date().toISOString()}] ${message}\n`;
    await writeFile(
      { path: THIS_SESSION_LOG_FILE_NAME, contents },
      { dir: BaseDirectory.AppData, append: true }
    );
}
