export function setCanonical(url) {
  let link = document.querySelector("link[rel='canonical']");

  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }

  link.setAttribute("href", url);

  document
    .querySelectorAll("link[rel='canonical']")
    .forEach((canonicalLink) => {
      if (canonicalLink !== link) canonicalLink.remove();
    });
}
