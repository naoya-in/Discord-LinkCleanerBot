import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.12-alpha/deno-dom-wasm.ts";

export const amazonUrlRegex = new RegExp(
  "https?://.*?amazon\\.co\\.jp.*/((gp(/product)?|dp|ASIN)|(customer-reviews|product-reviews))/([^/?]{10,})\\S*",
  "g",
);

export interface AmazonData {
  productTitle?: string;
  price?: string;
  imageUrl?: string;
  rating?: string;
}

export async function fetchAmazonData(url: string) {
  const res = await fetch(url);
  const html = await res.text();
  const document = new DOMParser().parseFromString(html, "text/html");

  const priceQuery = [
    "span#price",
    "span#price_inside_buybox",
    "span#newBuyBoxPrice",
    "span#kindle-price",
    "span#a-price",
    "span#a-color-price",
  ].find((query) => document?.querySelector(query));

  const price = priceQuery
    ? document?.querySelector(priceQuery)?.textContent
      .replace(/^\s*(.*)\s*$/, "$1")
    : undefined;

  return {
    productTitle: document?.querySelector("#productTitle")?.textContent.trim(),
    price: price,
    imageUrl:
      document?.querySelector("#landingImage,#imgBlkFront,#ebooksImgBlkFront")
        ?.getAttribute("src") ?? undefined,
    rating: document?.querySelector('span[data-hook="rating-out-of-text"]')
      ?.textContent,
  };
}

export function shortenUrl(url: string) {
  return url.replaceAll(
    amazonUrlRegex,
    (_0, _1, _2, _3, kind, id) =>
      `https://www.amazon.co.jp/gp/${kind ?? "product"}/${id}/`,
  );
}

// Twitterリンクの正規表現
export const twitterUrlRegex = new RegExp(
  "https://twitter.com/([a-zA-Z0-9_]{1,15})/status/([0-9]+)",
  "g",
);

export function shortenTwitterUrl(url: string) {
  return url.replaceAll(
    twitterUrlRegex,
    (_0, user, status) => `https://vxtwitter.com/${user}/status/${status}`,
  );
}