"use client";

import { Component, type ReactNode } from "react";

type Props = { fallback: ReactNode; onFail?: () => void; children: ReactNode };
type State = { failed: boolean };

// If WebGL is unavailable the hero still works, with a flat image.
export default class CanvasBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(err: unknown) {
    console.warn("[Hero] 3D scene unavailable, showing the static image instead.", err);
    this.props.onFail?.();
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
