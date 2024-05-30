import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import { EleventyHtmlBasePlugin } from "@11ty/eleventy";

const offsetMinutes = new Date().getTimezoneOffset();

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
  eleventyConfig.addPassthroughCopy("style.css");
  eleventyConfig.addPassthroughCopy("image-carousel.js");
  eleventyConfig.addPassthroughCopy("{,!(_site)/**/}*.jpg");
  eleventyConfig.setServerPassthroughCopyBehavior("passthrough");
  eleventyConfig.addLiquidFilter("isoDate", function (value) {
    const d = new Date(value);
    d.setMinutes(d.getMinutes() + offsetMinutes);
    return d.toISOString().split("T")[0];
  });
  eleventyConfig.addLiquidFilter("localeDate", function (value) {
    const d = new Date(value);
    d.setMinutes(d.getMinutes() + offsetMinutes);
    return d.toLocaleDateString();
  });

  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    // which file extensions to process
    extensions: "html",

    // Add any other Image utility options here:

    // optional, output image formats
    formats: ["webp", "jpeg"],
    // formats: ["auto"],

    // optional, output image widths
    widths: ["auto"],

    // optional, attributes assigned on <img> override these values.
    defaultAttributes: {
      loading: "lazy",
      decoding: "async",
    },
  });
}
