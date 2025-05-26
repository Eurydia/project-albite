import type { SorterRouterLoaderData } from "@/types/loader-data";
import type { LoaderFunction } from "react-router";

export const sorterRouterLoader: LoaderFunction = async ({
  request,
}) => {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const paramSize = searchParams.get("size") ?? "21";

  let size = Number.parseInt(paramSize);
  if (isNaN(size)) {
    size = 21;
  } else if (size < 1) {
    size = 21;
  }
  return {
    size,
  } as SorterRouterLoaderData;
};
