module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("style.css");
  eleventyConfig.addPassthroughCopy("**/*.jpg");
  eleventyConfig.setServerPassthroughCopyBehavior("passthrough");
};
