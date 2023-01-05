import { KubernetesCluster, Linode } from "@linode/api-v4";
import { UseInfiniteQueryResult } from "@tanstack/react-query";
import { useInfinateKubernetesClusterSearchQuery } from "../queries/kubernetes";
import { useInfinateLinodesSearchQuery } from "../queries/linodes";

interface Page {
  linodes: Linode[];
  kubernetes: KubernetesCluster[];
}

export function useSearch(query: string) {
  const linodes = useInfinateLinodesSearchQuery(query);
  const kubernetes = useInfinateKubernetesClusterSearchQuery(query);

  const queries: { name: keyof Page, query: UseInfiniteQueryResult<any, any> }[] = [ 
    { name: 'linodes', query: linodes },
    { name: 'kubernetes', query: kubernetes }
  ];

  const queriesArray = Object.values(queries).map(i => i.query);

  const canLoadMore = queriesArray.map(q => q.hasNextPage).includes(true);

  const isLoading = queriesArray.map(q => q.isLoading).includes(true);

  const queriesThatCanFetchMore = queriesArray.filter(q => q.hasNextPage);

  const loadMore = () => {
    return Promise.all(queriesThatCanFetchMore.map(q => q.fetchNextPage));
  };

  const pages = queries.reduce((acc: Page[], query) => {
    const numberOfPages = query.query.data?.pages?.length ?? 0;

    for (let i = 0; i < numberOfPages; i++) {
      const pageData = query.query.data?.pages?.[i].data ?? [];
      if (!acc[i]) {
        acc[i] = { linodes: [], kubernetes: [] };
      }
      acc[i][query.name] = pageData;
    }

    return acc;
  }, []);

  return { canLoadMore, isLoading, pages, loadMore };
}