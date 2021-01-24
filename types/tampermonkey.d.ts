/*
 * TamperMonkey 全局方法声明
 *
 * @author Siubeng <fython@163.com>
 */

declare function GM_setValue(name: string, value: any);

declare function GM_getValue<T>(name: string, defaultValue?: T): T;

declare function GM_addValueChangeListener(name: string, func: ValueChangeListener);

declare function GM_openInTab(url: string, option?: boolean | GM_OpenInTabOptions);

declare interface GM_OpenInTabOptions {
    active?: boolean;
    insert?: boolean;
    setParent?: boolean;
    incognito?: boolean;
}

type ValueChangeListener = (name: string, old_value: any, new_value: any, remote: boolean) => any;
