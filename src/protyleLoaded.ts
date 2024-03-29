import { parseIndex } from "./parseIndex";

export function updateIndex({detail}:any){
    const notebookId = detail.protyle.notebookId;
    const docPath = detail.protyle.path;

    console.log(detail);
    parseIndex(notebookId, docPath);
}