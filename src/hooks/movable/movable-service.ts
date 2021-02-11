import { RefObject } from 'react';

export interface MovableNode {
  movableRef: RefObject<HTMLElement>;
  handleRef: RefObject<HTMLElement>;
  onMoveFinish(coordinates: MovableCoordinates): void;
}

export interface MovableCoordinates {
  x: number;
  y: number;
}

class MovableService {
  private _context: RefObject<HTMLElement> | null = null;
  private _nodes: MovableNode[] = [];
  private _shiftX: number = 0;
  private _shiftY: number = 0;
  private _activeMovableNode: MovableNode | null = null;

  init() {
    this._context?.current?.addEventListener('mousedown', this._onMoseDown, true);
  }

  setContext(ref: RefObject<HTMLElement>) {
    this._context = ref;
    this.init();
  }

  addNode(node: MovableNode) {
    this._nodes.push(node);
  }

  removeNode(_node: MovableNode) {
    this._nodes = this._nodes.filter(node => node !== _node);
  }

  destroy() {
    this._context?.current?.removeEventListener('mousedown', this._onMoseDown);
    this._context = null;
    this._nodes = [];
  }

  private _onMoseDown = (event: MouseEvent) => {
    const movableNode = this._nodes.find(node => node.handleRef.current === event.target);

    if (!movableNode) return;

    event.preventDefault();
    this._activeMovableNode = movableNode;

    if (!this._target) return;

    // Here we should put the note to the bottom befor the data mode will be updated
    this._target.parentNode!.appendChild(this._target);

    this._shiftX = event.clientX - this._target.getBoundingClientRect().x;
    this._shiftY = event.clientY - this._target.getBoundingClientRect().y;

    this._target.style.position = 'absolute';
    this._moveTo(event.pageX, event.pageY);

    this._context?.current?.addEventListener('mouseup', this._onMouseUp);
    this._context?.current?.addEventListener('mousemove', this._onMouseMove);
  };

  private _onMouseUp = () => {
    const coordinates: MovableCoordinates = {
      x: parseInt(this._target!.style.left),
      y: parseInt(this._target!.style.top),
    };

    this._activeMovableNode?.onMoveFinish(coordinates);
    this._activeMovableNode = null;
    this._shiftX = 0;
    this._shiftY = 0;
    this._context?.current?.removeEventListener('mouseup', this._onMouseUp);
    this._context?.current?.removeEventListener('mousemove', this._onMouseMove);
  };

  private _onMouseMove = (event: MouseEvent) => {
    this._moveTo(event.pageX, event.pageY);
  };

  private _moveTo(pageX: number, pageY: number) {
    this._target!.style.left = `${pageX - this._shiftX}px`;
    this._target!.style.top = `${pageY - this._shiftY}px`;
  }

  private get _target() {
    if (!this._activeMovableNode) return null;
    return this._activeMovableNode.movableRef.current;
  }
}

export const movableService = new MovableService();
