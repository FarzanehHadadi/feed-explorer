"use client";

import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { likePost } from "../services/api";
import type { PostsPageResponse } from "../types/posts";
import { POSTS_QUERY_KEY } from "./use-posts";

type LikeVariables = {
  postId: string;
  liked: boolean;
};

export function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, liked }: LikeVariables) => likePost(postId, liked),
    onMutate: async ({ postId, liked }) => {
      await queryClient.cancelQueries({ queryKey: [POSTS_QUERY_KEY] });

      const previous = queryClient.getQueriesData<
        InfiniteData<PostsPageResponse>
      >({
        queryKey: [POSTS_QUERY_KEY],
      });

      queryClient.setQueriesData<InfiniteData<PostsPageResponse>>(
        { queryKey: [POSTS_QUERY_KEY] },
        (old) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              posts: page.posts.map((post) =>
                post.id === postId
                  ? {
                      ...post,
                      liked,
                      likes: liked
                        ? post.likes + 1
                        : Math.max(0, post.likes - 1),
                    }
                  : post,
              ),
            })),
          };
        },
      );

      return { previous };
    },
    onError: (_error, _variables, context) => {
      context?.previous.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [POSTS_QUERY_KEY] });
    },
  });
}
