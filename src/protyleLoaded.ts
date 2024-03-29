import { parseIndex } from "./parseIndex";

export async function updateIndex({detail}:any){
    const notebookId = detail.protyle.notebookId;
    const docPath = detail.protyle.path;

    await parseIndex(notebookId, docPath);

}