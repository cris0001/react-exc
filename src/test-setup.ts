import "@testing-library/jest-dom/vitest"
import { vi } from "vitest"

globalThis.HTMLElement.prototype.scrollIntoView = vi.fn()