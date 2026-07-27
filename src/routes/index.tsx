import type { RouteObject } from "react-router";
import type { SorterRouteData } from "@/types/routes";

const SORTER_VIEW__REGISTRY: Map<string, SorterRouteData> = new Map();

export const registerSorterView = (path: string, view: SorterRouteData) => {
  if (SORTER_VIEW__REGISTRY.has(path)) {
    return false;
  }
  SORTER_VIEW__REGISTRY.set(path, view);
  return true;
};

export const getRegisteredSorterView = () => {
  return Array.from(SORTER_VIEW__REGISTRY.entries());
};

export const getSorterRoutes = () => {
  return getRegisteredSorterView().map(([path, { view }]) => {
    return {
      path,
      element: view,
      loader: async ({ request }) => {
        const url = new URL(request.url);
        const searchParams = url.searchParams;
        const paramSize = searchParams.get("size") ?? "21";

        const size = Number(paramSize);

        return Number.isFinite(size) && Number.isInteger(size) ? size : 21;
      },
    } as RouteObject;
  });
};
