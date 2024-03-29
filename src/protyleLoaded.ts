import { block } from "@siyuan-community/siyuan-sdk/dist/types/kernel/api";
import { client, isMobile } from "./utils";
import { fetchPost } from "siyuan";

export async function updateIndex({ detail }: any){
    const notebookId = detail.protyle.notebookId;
    const docPath = detail.protyle.path;
    const parentID = detail.protyle.block.rootID;

    const blockAttr = await client.getBlockAttrs({id:parentID}).then(res => {return res.data})
    console.log(blockAttr)

    const childBlocks = await client.getChildBlocks({id:parentID}).then(res => {return res.data})
    const blockId = childBlocks[1].id;
    const setBlockAttr1 = await client.setBlockAttrs({id:blockId, attrs:{"iategory":"haha"}});
    console.log(setBlockAttr1)

    const blockAttr2 = await client.getBlockAttrs({id:blockId}).then(res => {return res.data})
    console.log(blockAttr2)

    const subPageList = await getSubPageList(notebookId, docPath);

    if(Array.prototype.isPrototypeOf(subPageList) && subPageList.length === 0){
        return;
    }else{
        createIndex(subPageList,parentID);
    }
    

}

// createIndex
async function createIndex(subPageList, parentID){
    let mdText:string = "";

    for(let doc of subPageList){
        mdText += `- [${doc.name}](siyuan://blocks/${doc.path.slice(-25,-3)})\n`;
    }

    const a = await client.appendBlock({data:mdText, dataType:'markdown', parentID: parentID})
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