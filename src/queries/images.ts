import { getImages } from "@linode/api-v4";
import { useQuery } from "@tanstack/react-query";
import { Params } from "../utils/types";

const queryKey = "image";

export const useImagesQuery = (params?: Params, filter?: any) =>
  useQuery([queryKey, params, filter], () => getImages(params, filter));