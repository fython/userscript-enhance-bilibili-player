export default class DomUtils {
  static queryElementMust<T extends Element>(selector: string): Promise<T> {
    return new Promise<T>((resolve) => {
      const cur = document.querySelector<T>(selector);
      if (cur) {
        return resolve(cur);
      }

      const observer = new MutationObserver(mutations => {
        mutations.forEach(mu => {
          mu.addedNodes.forEach(node => {
            if (node instanceof Element) {
              if (node.matches(selector)) {
                resolve(node as T);
                observer.disconnect();
              }
            }
          });
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false,
      });
    });
  }
}
