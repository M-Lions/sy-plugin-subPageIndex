import { isMobile, client } from "./utils";
import type * as types from '@siyuan-community/siyuan-sdk/dist/types';


export async function parseIndex(notebookId:string,docPath:string){

    const parentId:string = getDocid();

    const subPageList = await getSubPageList(notebookId, docPath);

    // 判断是否有子页面，没有则不做任何操作
    if(Array.prototype.isPrototypeOf(subPageList) && subPageList.length === 0) return;

    // 对目录块进行插入/更新
    await insertOrUpdateIndexBlock(parentId, subPageList);

}


//获取文档id
function getDocid() {
    if (isMobile)
        return document.querySelector('#editor .protyle-content .protyle-background')?.getAttribute("data-node-id");
    else
        return document.querySelector('.layout__wnd--active .protyle.fn__flex-1:not(.fn__none) .protyle-background')?.getAttribute("data-node-id");
}

// 获取子页面列表
async function getSubPageList(notebookId:string, path:string){
    const subPageList:types.kernel.api.filetree.listDocsByPath.IFile[] = await client.listDocsByPath({notebook:notebookId, path:path}).then(res => {return res.data.files});
    return subPageList;
}

// 插入/更新目录子级块
async function insertOrUpdateIndexBlock(parentId:string, subPageList: types.kernel.api.filetree.listDocsByPath.IFile[]){
    const querySql:string= `SELECT * FROM blocks WHERE root_id = '${parentId}' AND ial like '%custom-subpage-index%' order by updated desc limit 1`;
    console.log(querySql);

    const queryResult = await client.sql({stmt:querySql});

    if(Array.prototype.isPrototypeOf(queryResult.data) && queryResult.data.length === 0){
        //插入新的目录块
        const newIndexBlockId = await client.appendBlock({
            parentID: parentId,
            dataType: "markdown",
            data: createIndexBlockContent(subPageList),
        }).then(res=>{return res.data[0].doOperations[0].id});

        await setIndexBlockAttrs(newIndexBlockId);

    }else{
        await client.updateBlock({
            id:queryResult.data[0].id,
            dataType:"markdown",
            data:createIndexBlockContent(subPageList),
        });

        await setIndexBlockAttrs(queryResult.data[0].id);
    }

}

// 创建目录块
function createIndexBlockContent(subPageList:types.kernel.api.filetree.listDocsByPath.IFile[]){
    
    let textMarkdown:string = "";

    for(let doc of subPageList){
        textMarkdown += "- ";
        textMarkdown += `[${doc.name.slice(0,-3)}](siyuan://blocks/${doc.path.slice(-25,-3)})`;
        textMarkdown += "\n";
    }

    return textMarkdown;
}

// 设置目录块的块属性
async function setIndexBlockAttrs(blockId:string){
    await client.setBlockAttrs({id:blockId, attrs: {"custom-subpage-index":"true"}});
}

