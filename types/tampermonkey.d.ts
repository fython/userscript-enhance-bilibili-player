/*
 * TamperMonkey 全局方法声明
 *
 * @author Siubeng <fython@163.com>
 */

declare function GM_setValue<T>(name: string, value: T | null);

declare function GM_getValue<T>(name: string, defaultValue?: T): T;

declare function GM_addValueChangeListener<T>(name: string, func: ValueChangeListener<T>);

declare function GM_openInTab(url: string, option?: boolean | GM_OpenInTabOptions);

declare interface GM_OpenInTabOptions {
    active?: boolean;
    insert?: boolean;
    setParent?: boolean;
    incognito?: boolean;
}

type ValueChangeListener<T> = (name: string, old_value: T | null, new_value: T | null, remote: boolean) => any;
