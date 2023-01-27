import DomUtils from '@/utils/dom';
import { PlayerMenuItem } from '@/components/player-menu/model';

let menuElement: HTMLElement;
let menuMutationObserver: MutationObserver;
let menuOldVisibleState = false;

const registeredMenuItems: PlayerMenuItem[] = [];

function onMenuShow() {
  for (const menuItem of registeredMenuItems) {
    // Prevent from adding duplicate menu item element
    if (menuElement.querySelector(`li[data-action="${menuItem.dataAction}"]`)) {
      continue;
    }
    injectMenuItem(menuItem);
  }
}

function onMenuHide() {
  // just do nothing~
}

function injectMenuItem({ dataAction, label, onClick }: PlayerMenuItem): void {
  if (!menuElement) {
    throw new Error('player menu has not been captured yet');
  }
  const li = document.createElement('li');
  li.setAttribute('data-action', dataAction);
  li.innerText = label;
  li.addEventListener('click', onClick);
  menuElement.append(li);
}

function clearMenuInjector() {
  if (menuMutationObserver) {
    menuMutationObserver.disconnect();
  }
}

export async function initMenuInjector() {
  clearMenuInjector();
  // Captures player context menu element
  menuElement = await DomUtils.queryElementMust('.bpx-player-contextmenu');
  window.console.log('inject menu:', menuElement);
  // Observe menu state for custom items inject
  menuOldVisibleState = menuElement.classList.contains('bpx-player-active');
  menuMutationObserver = new MutationObserver(mutations => {
    mutations.forEach(mu => {
      // Check if menu visibility is changed
      if (mu.type === 'attributes' && mu.attributeName === 'class') {
        const newMenuElement = (mu.target as HTMLElement);
        const newVisibleState = newMenuElement.classList.contains('bpx-player-active');
        if (newVisibleState !== menuOldVisibleState) {
          menuOldVisibleState = newVisibleState;
          window.requestAnimationFrame(() => {
            if (newVisibleState) {
              onMenuShow();
            } else {
              onMenuHide();
            }
          });
        }
      }
    });
  });
  menuMutationObserver.observe(menuElement, {
    childList: true,
    attributes: true,
  });
}

export function registerMenuItem(item: PlayerMenuItem): void {
  // 防止第三方插件产生的上报数据无法区分影响官方产品统计
  if (!item.dataAction.startsWith('exbiliplayer-')) {
    throw new Error('data action should starts with "exbiliplayer-"');
  }
  // Data action should be unique in list
  if (registeredMenuItems.find(e => e.dataAction === item.dataAction)) {
    throw new Error(`duplicated data action for ${item.dataAction}`);
  }
  // Store registered items
  registeredMenuItems.push(item);
  // Inject menu item immediately if visible
  if (menuOldVisibleState) {
    injectMenuItem(item);
  }
}

export function unregisterMenuItem(dataAction: string): void {
  // TODO
}

export type {
  PlayerMenuItem,
};
