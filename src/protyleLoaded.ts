import { client, isMobile } from "./utils";
import { fetchPost } from "siyuan";

export async function updateIndex({ detail }: any){
    const notebookId = detail.protyle.notebookId;
    const docPath = detail.protyle.path;
    const parentID = detail.protyle.block.rootID;

    const subPageList = await getSubPageList(notebookId, docPath);

    if(Array.prototype.isPrototypeOf(subPageList) && subPageList.length === 0){
        return;
    }else{
        createIndex(subPageList,parentID);
    }
    

}

// createIndex
async function createIndex(subPageList,parentID){
    let mdText:string = "";

    for(let doc of subPageList){
        mdText += `- [${doc.name}](${doc.path})`;
        mdText += '<br>';
    }

    const a = await client.appendBlock({data:mdText, dataType:'markdown', parentID: parentID})

    console.log(a);
}

// 获取文档id
export function getDocid() {
    if (isMobile)
        return document.querySelector('#editor .protyle-content .protyle-background')?.getAttribute("data-node-id");
    else
        return document.querySelector('.layout__wnd--active .protyle.fn__flex-1:not(.fn__none) .protyle-background')?.getAttribute("data-node-id");
}

// 获取子文档列表
async function getSubPageList(notebookId:string, path:string){
    //const path = await client.getHPathByID({id:parentId}).then(result => {return result.data;})

    const subPageList= await client.listDocsByPath({notebook:notebookId, path:path}).then(res => {return res.data.files});

    return subPageList;

}