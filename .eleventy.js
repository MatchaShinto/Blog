const offsetMinutes = new Date().getTimezoneOffset();

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("style.css");
  eleventyConfig.addPassthroughCopy("**/*.jpg");
  eleventyConfig.setServerPassthroughCopyBehavior("passthrough");
  eleventyConfig.addLiquidFilter("isoDate", function(value) {
    const d = new Date(value);
    d.setMinutes(d.getMinutes() + offsetMinutes);
    return d.toISOString().split('T')[0];
  });
  eleventyConfig.addLiquidFilter("localeDate", function(value) {
    const d = new Date(value);
    d.setMinutes(d.getMinutes() + offsetMinutes);
    return d.toLocaleDateString();
  });
};
