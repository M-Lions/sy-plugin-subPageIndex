import {Plugin} from 'siyuan';
import {updateIndex} from './protyleLoaded';

export default class SubPageIndex extends Plugin{

    onload() : void{
        console.log("SubPageIndex onloaded");
        
        // 监听编辑器加载
        this.eventBus.on("loaded-protyle-static", updateIndex);

    }

    onunload(): void {
        console.log("SubPageIndex unloaded");

        // 取消监听编辑器加载
        this.eventBus.off("loaded-protyle-static", updateIndex)
    }

    
}