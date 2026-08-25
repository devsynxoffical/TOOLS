const LOGO_BY_SLUG: Record<string, string> = {
  semrush: "/tool-logos/semrush.png",
  moz: "/tool-logos/moz.png",
  majestic: "/tool-logos/majestic.png",
  spyfu: "/tool-logos/spyfu.png",
  ubersuggest: "/tool-logos/ubersuggest.png",
  "keywords-everywhere": "/tool-logos/keywords-everywhere.png",
  kwfinder: "/tool-logos/kwfinder.png",
  "lynda-com": "/tool-logos/lynda-com.png",
  picmonkey: "/tool-logos/picmonkey.png",
  placeit: "/tool-logos/placeit.png",
  quetext: "/tool-logos/quetext.png",
  quillbot: "/tool-logos/quillbot.png",
  rytr: "/tool-logos/rytr.png",
  scribd: "/tool-logos/scribd.png",
  slideshare: "/tool-logos/slideshare.png",
  spamzilla: "/tool-logos/spamzilla.png",
  "spin-rewriter": "/tool-logos/spin-rewriter.png",
  "tuts-plus": "/tool-logos/tuts-plus.png",
  woorank: "/tool-logos/woorank.png",
  wordai: "/tool-logos/wordai.png",
  wordhero: "/tool-logos/wordhero.png",
  wordtracker: "/tool-logos/wordtracker.png",
  wordtune: "/tool-logos/wordtune.png",
  writehuman: "/tool-logos/writehuman.png",
  writerzen: "/tool-logos/writerzen.png",
};

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getToolLogoUrl({
  slug,
  name,
}: {
  slug?: string | null;
  name: string;
}): string | null {
  const key = (slug || slugify(name)).toLowerCase();
  return LOGO_BY_SLUG[key] ?? null;
}
