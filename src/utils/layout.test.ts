import { measureViewInWindow } from "./layout";

describe("measureViewInWindow", () => {
  it("does nothing when ref.current is null", () => {
    const ref = { current: null };
    const onMeasure = jest.fn();

    measureViewInWindow(ref, onMeasure);

    expect(onMeasure).not.toHaveBeenCalled();
  });

  it("calls onMeasure with the correct rect when dimensions are positive", () => {
    const measureInWindow = jest.fn((cb) => cb(10, 20, 100, 50));
    const ref = { current: { measureInWindow } };
    const onMeasure = jest.fn();

    measureViewInWindow(ref as any, onMeasure);

    expect(onMeasure).toHaveBeenCalledWith({ x: 10, y: 20, width: 100, height: 50 });
  });

  it("does not call onMeasure when width is zero", () => {
    const measureInWindow = jest.fn((cb) => cb(10, 20, 0, 50));
    const ref = { current: { measureInWindow } };
    const onMeasure = jest.fn();

    measureViewInWindow(ref as any, onMeasure);

    expect(onMeasure).not.toHaveBeenCalled();
  });

  it("does not call onMeasure when height is zero", () => {
    const measureInWindow = jest.fn((cb) => cb(10, 20, 100, 0));
    const ref = { current: { measureInWindow } };
    const onMeasure = jest.fn();

    measureViewInWindow(ref as any, onMeasure);

    expect(onMeasure).not.toHaveBeenCalled();
  });

  it("does not call onMeasure when both width and height are negative", () => {
    const measureInWindow = jest.fn((cb) => cb(0, 0, -1, -1));
    const ref = { current: { measureInWindow } };
    const onMeasure = jest.fn();

    measureViewInWindow(ref as any, onMeasure);

    expect(onMeasure).not.toHaveBeenCalled();
  });
});
