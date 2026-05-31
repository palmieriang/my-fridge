import { RefObject } from "react";

type MeasurableRef = {
  measureInWindow: (
    callback: (x: number, y: number, width: number, height: number) => void,
  ) => void;
};

export type MeasuredRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export const measureViewInWindow = (
  ref: RefObject<MeasurableRef | null>,
  onMeasure: (rect: MeasuredRect) => void,
) => {
  if (!ref.current) {
    return;
  }

  ref.current.measureInWindow((x, y, width, height) => {
    if (width <= 0 || height <= 0) {
      return;
    }

    onMeasure({ x, y, width, height });
  });
};
