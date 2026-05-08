import "@testing-library/jest-dom/vitest";

class ResizeObserverMock {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

global.ResizeObserver = ResizeObserverMock;

if (!document.elementFromPoint) {
  document.elementFromPoint = (): Element | null => null;
}
