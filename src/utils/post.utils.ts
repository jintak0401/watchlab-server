import { Post, Recommend } from 'generated/client';

interface TagsOnPostsData {
  postId: number;
  tagId: number;
}

export interface TagCountAndView {
  count: number;
  view?: number;
}

export interface RecommendedBy {
  rank: number;
  recommender: Pick<Post, 'slug' | 'thumbnail' | 'title' | 'view'>;
}

export const flatTags = <T>(
  tags: { tag: { [key: string]: T } }[] | undefined,
  key: string,
): T[] | undefined => {
  return tags?.map((tag) => tag.tag[key]);
};

export const flatRecommend = (recommendData?: RecommendedBy[]) => {
  return recommendData
    ?.sort((a, b) => a.rank - b.rank)
    .map((recommend) => recommend.recommender);
};

export const genReturn = ({
  tags,
  writerRelation: writer,
  recommendedBy: recommend,
  ...rest
}: {
  tags?: { tag: { name: string } }[];
  writerRelation?: object;
  recommendedBy?: RecommendedBy[];
  [key: string]: any;
}) => {
  return {
    ...rest,
    writer,
    tags: flatTags(tags, 'name'),
    recommend: flatRecommend(recommend),
  };
};

/**
 * @returns { [tagId]: postId[] } --> tags
 * @returns { [postId]: { tags: postId[] } } --> posts
 */
export const data2PostAndTagList = (data: TagsOnPostsData[]) => {
  const tags: { [key: number]: number[] } = {};
  const posts: { [key: number]: { tags: number[] } } = {};
  data.forEach(({ postId, tagId }) => {
    posts[postId]
      ? posts[postId].tags.push(tagId)
      : (posts[postId] = { tags: [tagId] });
    tags[tagId] ? tags[tagId].push(postId) : (tags[tagId] = [postId]);
  });
  return { tags, posts };
};

/**
 * @return { [postId]: the number of common tag }
 */
export const getCommonTagCountObj = (
  posts: { tags?: number[] },
  tags: { [key: number]: number[] },
) => {
  return posts.tags.reduce((acc, tagId) => {
    tags[tagId]?.forEach((postId) => {
      acc[postId] = acc[postId] ? acc[postId] + 1 : 1;
    });
    return acc;
  }, {} as { [key: number]: number });
};

// key: postId
export const sortByTagAndView = (data: TagCountAndView) => {
  const sorted = Object.entries(data).sort(
    (
      [, { count: aCount, view: aView = 0 }],
      [, { count: bCount, view: bView = 0 }],
    ) => (bCount !== aCount ? bCount - aCount : bView - aView),
  );
  return sorted.map(([postId]) => Number(postId));
};

export const recommendObj2List = (data: Recommend[]) => {
  return data.reduce((acc, { recommendingId, recommenderId, rank }) => {
    (acc[recommenderId] ??= [])[rank] = recommendingId;
    return acc;
  }, {} as { [key: number]: number[] });
};
