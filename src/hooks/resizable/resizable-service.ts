import { debounce } from '../../utils/debounce';

export interface ResizableSizes {
  width: number;
  height: number;
}

export type OnResizeCallback = (sizes: ResizableSizes) => void;

interface ResizableSubscriber {
  callbacks: OnResizeCallback[];
}

let initCall = true;

class ResizableService {
  private _ro: ResizeObserver;
  private _subscribersMap = new Map<Element, ResizableSubscriber>();

  constructor() {
    const onObserve = debounce(this.onObserve);

    this._ro = new ResizeObserver(entries => {
      if (initCall) {
        initCall = false;
        return;
      }

      for (let entry of entries) {
        onObserve(entry);
      }
    });
  }

  onObserve = (entry: ResizeObserverEntry) => {
    const subscriber = this._subscribersMap.get(entry.target);

    if (!subscriber) return;

    const [borderBoxSize] = entry.borderBoxSize;

    const sizes: ResizableSizes = {
      width: borderBoxSize.inlineSize,
      height: borderBoxSize.blockSize,
    };

    subscriber.callbacks.forEach(cb => {
      cb(sizes);
    });
  };

  subscribe(cb: OnResizeCallback, target: HTMLElement) {
    let subscriber = this._subscribersMap.get(target);

    if (!subscriber) {
      subscriber = { callbacks: [] };
      this._subscribersMap.set(target, subscriber);
    }

    subscriber.callbacks.push(cb);

    return () => {
      this._subscribersMap.delete(target);
    };
  }

  observe(target: HTMLElement) {
    this._ro.observe(target);

    return () => {
      this._ro.unobserve(target);
    };
  }
}

export const resizableService = new ResizableService();
