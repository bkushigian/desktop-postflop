import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./components/App.vue";
import "./style.css";
import "tippy.js/dist/tippy.css";
import { info } from './log';

info("Testing logging");

// import { BaseDirectory, createDir } from "@tauri-apps/api/fs";
// import { appDataDir, appLogDir } from "@tauri-apps/api/path";

// console.log("getting appDataDir");
// const dirToCreate = await appDataDir();
// console.log("got appDataDir: ", dirToCreate);
// console.log("creating log dir");

// await createDir(dirToCreate, );
// await createDir('logs', { dir: BaseDirectory.AppData, recursive: true });
// console.log("created dir");

createApp(App).use(createPinia()).mount("#app");


// disable the right click menu
document.addEventListener("contextmenu", (e) => e.preventDefault());
