export const flatTags = (tags: { name: string }[]) =>
  tags.map((tag) => tag.name);

export const tags2obj = (
  data: {
    name: string;
    posts: { post: { slug: string } }[];
  }[],
) => {
  return data.reduce((acc, cur) => {
    const { name, posts } = cur;
    posts.forEach(({ post: { slug } }) => {
      if (acc[slug] === undefined) {
        acc[slug] = [];
      }
      acc[slug].push(name);
    });
    return acc;
  }, {} as { [key: string]: string[] });
};
