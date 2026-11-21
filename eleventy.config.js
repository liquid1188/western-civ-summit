export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/media");
  eleventyConfig.addCollection("summits", (api) =>
    api.getFilteredByGlob("src/summits/*.md").sort((a, b) => b.data.year - a.data.year)
  );
  eleventyConfig.addFilter("current", (summits, year) => summits.find((s) => s.data.year == year));
  eleventyConfig.addFilter("ytid", (url) => {
    if (!url) return "";
    const m = String(url).match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/);
    return m ? m[1] : url;
  });
  return { dir: { input: "src", output: "_site" }, pathPrefix: process.env.PATH_PREFIX || "/" };
}
