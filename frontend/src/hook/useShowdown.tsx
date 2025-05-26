import showdown from "showdown";
import { useEffect, useState } from "react";

let converter: showdown.Converter;

function getConverter() {
  if (!converter) {
    converter = new showdown.Converter({
      tables: true,
      strikethrough: true,
      tasklists: true,
      simplifiedAutoLink: true,
    });
  }
  return converter;
}

export function useShowDown(markdown: string): { html: string } {
  const [html, setHtml] = useState("");

  useEffect(() => {
    const html = getConverter().makeHtml(markdown);
    setHtml(html);
  }, [markdown]);

  return { html };
}
