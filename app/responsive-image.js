/* Size gallery images for their rendered use. Originals are reserved for lightboxes. */
window.responsiveImage = function (src, sizes) {
  var image = (window.IMAGE_VARIANTS || {})[src];
  if (!image) return { src: src };
  return {
    src: image.variants[0].src,
    srcSet: image.variants.map(function (v) { return v.src + ' ' + v.width + 'w'; }).join(', '),
    sizes: sizes || '(max-width: 700px) 90vw, 600px'
  };
};
