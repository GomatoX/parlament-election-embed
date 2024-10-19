import manifest from "../dist/manifest.json";

const baseURL = process.env.VITE_BASE_URL;

(() => {
  if (typeof window === "undefined") {
    return;
  }

  window["election"] = {};

  const source = Object.values(manifest).find((i) => {
    return "isEntry" in i && i.isEntry;
  });

  const registerResource = (resource) => {
    window["election"][resource] = true;
  };

  const isResourceRegistered = (resource) => {
    return !!window[resource];
  };

  const appendStyles = (href) => {
    const styles = document.createElement("link");
    styles.setAttribute("rel", "stylesheet");
    styles.setAttribute("href", `${baseURL}/${href}`);

    document.body.appendChild(styles);
  };
  const appendScript = (src) => {
    const styles = document.createElement("script");
    styles.setAttribute("src", `${baseURL}/${src}`);

    document.body.appendChild(styles);
  };

  // because its not ts file
  // @ts-ignore
  source.css.forEach((url) => {
    if (!isResourceRegistered(url)) {
      appendStyles(url);
      registerResource(url);
    }
  });

  if (source.file) {
    if (!isResourceRegistered(source.file)) {
      appendScript(source.file);
      registerResource(source.file);
    }
  }
})();
