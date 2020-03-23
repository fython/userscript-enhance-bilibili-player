import {SELECTORS, IDS} from './constants';

class MenuActionItem {
    /**
     * @constructor
     * @param {({id: string, title: string, callback: Function})} data 数据 
     */
    constructor({id, title, callback}) {
        this.id = id;
        this.title = title;
        this.callback = callback;
    }
}

class EnhanceUIOptions {
    /**
     * @constructor
     * @param {({toastTimeout: number, menuActions: Array<MenuActionItem>})} data 数据
     */
    constructor({toastTimeout = 3000, menuActions = []}) {
        this.toastTimeout = toastTimeout;
        this.menuActions = menuActions;
    }
}

/**
 * 懒加载 selector 指定的元素
 * @param {string} selector 选择器
 * @returns {Promise<JQuery<HTMLElement>>}
 */
export function lazyElement(selector) {
    return new Promise((resolve) => {
        const callback = setInterval(() => {
            const injectNode = $(selector);
            if (injectNode.length) {
                clearInterval(callback);
                resolve(injectNode);
            }
        });
    });
}

export class EnhanceUI {
    /**
     * @constructor
     * @param {JQuery<HTMLElement>} player
     * @param {EnhanceUIOptions} options 
     */
    constructor(player, {toastTimeout = 3000, menuActions = []}) {
        this.player = player;
        this.menu = null;
        this.lastToastCallback = null;
        this.toastTimeout = toastTimeout;
        this.menuActions = menuActions;
        
        this._menuObserver = new MutationObserver(() => this.onMenuMutated(this.menu));
        this._playerObserver = new MutationObserver(() => {
            const menu = player.find(SELECTORS.MENU);
            if (menu.length) {
                this.menu = menu;
                this._playerObserver.disconnect();
                this._bindMenu();
            }
        });
        this._playerObserver.observe(player[0], { childList: true });
    }

    /**
     * 隐藏 Toast
     */
    hideToast() {
        const currentToast = $('#' + IDS.TOAST);
        if (currentToast.length) {
            currentToast.remove();
        }
        if (this.lastToastCallback) {
            clearTimeout(this.lastToastCallback);
        }
        this.lastToastCallback = null;
    }

    /**
     * 显示文本为 message 的 Toast
     * @param {string} message 文本
     */
    showToast(message) {
        const container = $(SELECTORS.TOAST_CONTAINER);
        if (container.length) {
            this.hideToast();
            const toastItem = $(`<div id="${IDS.TOAST}" class="bilibili-player-video-toast-item" style="margin-top: 4px;"></div>`);
            const toastText = $(`<div class="bilibili-player-video-toast-item-text"></div>`);
            toastText.append($('<span></span>').text(message));
            toastItem.append(toastText);
            container.append(toastItem);
            this.lastToastCallback = setTimeout(this.hideToast, this.toastTimeout);
        } else {
            // Fallback：当 Toast 版本已经改变时，使用普通的 alert
            alert(message);
        }
    }

    /**
     * 菜单变化事件
     * @param {JQuery<HTMLDivElement>} menu 菜单元素
     */
    onMenuMutated(menu) {
        const ul = menu.find('ul');
        if (menu.hasClass('active')) {
            // 不要注入弹幕菜单
            if (menu.find('.context-menu-danmaku').length) {
                return;
            }
            this.menuActions.forEach((action) => {
                const actionEl = menu.find('#' + action.id);
                if (actionEl.length === 0) {
                    ul.append(this._createMenuAction(action));
                }
            });
        } else {
            ul.empty();
        }
    }

    /**
     * 开始监听菜单
     */
    _bindMenu() {
        this._menuObserver.observe(this.menu[0], { childList: true, attributes: true });
        this.onMenuMutated(this.menu);
    }
    
    /**
     * 创建菜单操作的元素
     * @param {MenuActionItem} action 菜单操作 
     * @returns {JQuery<HTMLLIElement>}
     */
    _createMenuAction({id, title, callback}) {
        const li = $(`<li id="${id}" class="context-line context-menu-action"></li>`);
        const a = $('<a class="context-menu-a js-action" title></a>').text(title);
        li.append(a);
        // 应用选项 Hover 样式
        li.mouseenter(() => li.addClass('hover'));
        li.mouseleave(() => li.removeClass('hover'));
        // 选项点击事件
        li.click(callback);
        return li;
    }
}