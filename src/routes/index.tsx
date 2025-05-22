import type { SorterRouteData } from "@/types/routes";
import { type RouteObject } from "react-router";

const SORTER_VIEW__REGISTRY: Map<string, SorterRouteData> =
  new Map();

export const registerSorterView = (
  path: string,
  view: SorterRouteData
) => {
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
  return getRegisteredSorterView().map(
    ([path, { view }]) => {
      return {
        path,
        element: view,
      } as RouteObject;
    }
  );
};
