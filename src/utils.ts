import {getFrontend} from "siyuan";
import {Client} from "@siyuan-community/siyuan-sdk";


// 判断移动设备
const frontEnd: string = getFrontend();
export const isMobile: boolean = frontEnd === "mobile" || frontEnd === "browser-mobile";

// 客户端实例
export const client:Client = new Client();

