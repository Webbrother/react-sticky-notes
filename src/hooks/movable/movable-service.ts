import { RefObject } from 'react';

export interface MovableNode {
  movableRef: RefObject<HTMLElement>;
  handleRef: RefObject<HTMLElement>;
  onMoveFinish(coordinates: MovableCoordinates): void;
  id: number;
}

export interface MovableCoordinates {
  x: number;
  y: number;
}

export type IdCallback = (id: number) => void;

class MovableService {
  private _context: RefObject<HTMLElement> | null = null;
  private _droppableTarget: RefObject<HTMLElement> | null = null;
  private _nodes: MovableNode[] = [];
  private _shiftX: number = 0;
  private _shiftY: number = 0;
  private _activeMovableNode: MovableNode | null = null;
  private _previousIsOverDroppable = false;
  private _onDropCallback: IdCallback = () => {};

  init() {
    this._context?.current?.addEventListener('mousedown', this._onMoseDown, true);
  }

  setContext(ref: RefObject<HTMLElement>) {
    this._context = ref;
    this.init();
  }

  setDroppableTarget(ref: RefObject<HTMLElement> | null) {
    this._droppableTarget = ref;
  }

  setOnDropCallback(cb: IdCallback) {
    this._onDropCallback = cb;
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
    this._onMouseUpFinish();
  };

  // This method is used in two methods - _onMouseUp, _onDrop
  private _onMouseUpFinish() {
    this._activeMovableNode = null;
    this._shiftX = 0;
    this._shiftY = 0;
    this._context?.current?.removeEventListener('mouseup', this._onMouseUp);
    this._context?.current?.removeEventListener('mousemove', this._onMouseMove);
  }

  private _onMouseMove = (event: MouseEvent) => {
    this._moveTo(event.pageX, event.pageY);

    const isOverDroppable = this._isOverDroppable(event);

    // Come to droppable zone
    if (isOverDroppable && !this._previousIsOverDroppable) {
      this._droppableTarget?.current?.classList.add('droppable-active');
      this._context?.current?.addEventListener('mouseup', this._onDrop);
      this._context?.current?.removeEventListener('mouseup', this._onMouseUp);
    }

    // Come out of droppable zone
    if (!isOverDroppable && this._previousIsOverDroppable) {
      this._droppableTarget?.current?.classList.remove('droppable-active');
      this._context?.current?.removeEventListener('mouseup', this._onDrop);
      this._context?.current?.addEventListener('mouseup', this._onMouseUp);
    }

    this._previousIsOverDroppable = isOverDroppable;
  };

  private _moveTo(pageX: number, pageY: number) {
    this._target!.style.left = `${pageX - this._shiftX}px`;
    this._target!.style.top = `${pageY - this._shiftY}px`;
  }

  private get _target() {
    if (!this._activeMovableNode) return null;
    return this._activeMovableNode.movableRef.current;
  }

  private _isOverDroppable(event: MouseEvent) {
    if (!this._target) return false;

    const oldDisplayValue = this._target.style.display;
    this._target.style.display = 'none';
    let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
    this._target.style.display = oldDisplayValue;

    if (!elemBelow) return false;

    return elemBelow === this._droppableTarget?.current;
  }

  private _onDrop = () => {
    if (!this._activeMovableNode) return;

    this._droppableTarget?.current?.classList.remove('droppable-active');
    this._onDropCallback(this._activeMovableNode.id);
    this._onMouseUpFinish();
  };
}

export const movableService = new MovableService();
