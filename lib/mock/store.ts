import {
  AccessSource,
  AccessStatus,
  Role,
  SubStatus,
  UserStatus,
} from "@prisma/client";
import { isDemoAccountEmail } from "@/lib/demo-accounts";
import { INDIVIDUAL_TOOL_PRICES } from "@/lib/data/individual-tool-prices";

export type MockUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  status: UserStatus;
  createdAt: Date;
};

export type MockTool = {
  id: string;
  name: string;
  slug: string;
  iconUrl: string | null;
  description: string | null;
  pricePkr: number;
  active: boolean;
};

export type MockPlan = {
  id: string;
  name: string;
  description: string | null;
  pricePkr: number;
  durationDays: number;
  active: boolean;
  toolIds: string[];
};

export type MockSubscription = {
  id: string;
  userId: string;
  planId: string | null;
  status: SubStatus;
  startedAt: Date | null;
  expiresAt: Date | null;
  createdAt: Date;
  notes: string | null;
};

export type MockUserToolAccess = {
  id: string;
  userId: string;
  toolId: string;
  status: AccessStatus;
  grantedAt: Date;
  expiresAt: Date | null;
  source: AccessSource;
};

export type MockToolRequest = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  toolIds: string[];
  note: string | null;
  status: "PENDING" | "FULFILLED";
  createdAt: Date;
};

function daysFromNow(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

function createInitialStore() {
  const priceBySlug = Object.fromEntries(
    INDIVIDUAL_TOOL_PRICES.map((t) => [t.slug, t.pricePkr])
  );

  const tools: MockTool[] = [
    { id: "tool-1", name: "Keywords Everywhere", slug: "keywords-everywhere", iconUrl: "/tool-logos/keywords-everywhere.png", description: "Search volume and keyword metrics inside browser.", pricePkr: priceBySlug["keywords-everywhere"] ?? 0, active: true },
    { id: "tool-2", name: "KWFinder", slug: "kwfinder", iconUrl: "/tool-logos/kwfinder.png", description: "Long-tail keyword research with difficulty scoring.", pricePkr: priceBySlug["kwfinder"] ?? 0, active: true },
    { id: "tool-3", name: "Lynda.com", slug: "lynda-com", iconUrl: "/tool-logos/lynda-com.png", description: "Learning library for marketing and SEO skills.", pricePkr: priceBySlug["lynda-com"] ?? 0, active: true },
    { id: "tool-4", name: "Majestic", slug: "majestic", iconUrl: "/tool-logos/majestic.png", description: "Link intelligence metrics.", pricePkr: priceBySlug["majestic"] ?? 0, active: true },
    { id: "tool-5", name: "Moz Pro", slug: "moz", iconUrl: "/tool-logos/moz.png", description: "Domain authority tracking.", pricePkr: priceBySlug["moz"] ?? 0, active: true },
    { id: "tool-6", name: "PicMonkey", slug: "picmonkey", iconUrl: "/tool-logos/picmonkey.png", description: "Visual content editor for banners and creatives.", pricePkr: priceBySlug["picmonkey"] ?? 0, active: true },
    { id: "tool-7", name: "Placeit", slug: "placeit", iconUrl: "/tool-logos/placeit.png", description: "Mockups and social design assets.", pricePkr: priceBySlug["placeit"] ?? 0, active: true },
    { id: "tool-8", name: "Quetext", slug: "quetext", iconUrl: "/tool-logos/quetext.png", description: "Plagiarism and duplicate content detection.", pricePkr: priceBySlug["quetext"] ?? 0, active: true },
    { id: "tool-9", name: "QuillBot", slug: "quillbot", iconUrl: "/tool-logos/quillbot.png", description: "Paraphrasing and writing refinement assistant.", pricePkr: priceBySlug["quillbot"] ?? 0, active: true },
    { id: "tool-10", name: "Rytr", slug: "rytr", iconUrl: "/tool-logos/rytr.png", description: "AI writing assistant for content drafting.", pricePkr: priceBySlug["rytr"] ?? 0, active: true },
    { id: "tool-11", name: "Scribd", slug: "scribd", iconUrl: "/tool-logos/scribd.png", description: "Document and publication research library.", pricePkr: priceBySlug["scribd"] ?? 0, active: true },
    { id: "tool-12", name: "Semrush", slug: "semrush", iconUrl: "/tool-logos/semrush.png", description: "All-in-one marketing toolkit.", pricePkr: priceBySlug["semrush"] ?? 0, active: true },
    { id: "tool-13", name: "SlideShare", slug: "slideshare", iconUrl: "/tool-logos/slideshare.png", description: "Presentation discovery for research and outreach.", pricePkr: priceBySlug["slideshare"] ?? 0, active: true },
    { id: "tool-14", name: "SpamZilla", slug: "spamzilla", iconUrl: "/tool-logos/spamzilla.png", description: "Expired domain spam analysis and filtering.", pricePkr: priceBySlug["spamzilla"] ?? 0, active: true },
    { id: "tool-15", name: "Spin Rewriter", slug: "spin-rewriter", iconUrl: "/tool-logos/spin-rewriter.png", description: "Article rewriting and spinning workflows.", pricePkr: priceBySlug["spin-rewriter"] ?? 0, active: true },
    { id: "tool-16", name: "SpyFu", slug: "spyfu", iconUrl: "/tool-logos/spyfu.png", description: "Competitor keyword research.", pricePkr: priceBySlug["spyfu"] ?? 0, active: true },
    { id: "tool-17", name: "Tuts+", slug: "tuts-plus", iconUrl: "/tool-logos/tuts-plus.png", description: "Tutorial library for digital professionals.", pricePkr: priceBySlug["tuts-plus"] ?? 0, active: true },
    { id: "tool-18", name: "WooRank", slug: "woorank", iconUrl: "/tool-logos/woorank.png", description: "Website audit and optimization reports.", pricePkr: priceBySlug["woorank"] ?? 0, active: true },
    { id: "tool-19", name: "WordAI", slug: "wordai", iconUrl: "/tool-logos/wordai.png", description: "AI content rewriting and readability improvement.", pricePkr: priceBySlug["wordai"] ?? 0, active: true },
    { id: "tool-20", name: "WordHero", slug: "wordhero", iconUrl: "/tool-logos/wordhero.png", description: "AI content generation for blogs and ads.", pricePkr: priceBySlug["wordhero"] ?? 0, active: true },
    { id: "tool-21", name: "Wordtracker", slug: "wordtracker", iconUrl: "/tool-logos/wordtracker.png", description: "Keyword discovery and SERP analysis.", pricePkr: priceBySlug["wordtracker"] ?? 0, active: true },
    { id: "tool-22", name: "Wordtune", slug: "wordtune", iconUrl: "/tool-logos/wordtune.png", description: "Sentence rewriting and tone optimization.", pricePkr: priceBySlug["wordtune"] ?? 0, active: true },
    { id: "tool-23", name: "WriteHuman", slug: "writehuman", iconUrl: "/tool-logos/writehuman.png", description: "AI text humanization and style enhancement.", pricePkr: priceBySlug["writehuman"] ?? 0, active: true },
    { id: "tool-24", name: "WriterZen", slug: "writerzen", iconUrl: "/tool-logos/writerzen.png", description: "Keyword clustering and content briefing platform.", pricePkr: priceBySlug["writerzen"] ?? 0, active: true },
  ];

  const idBySlug = Object.fromEntries(tools.map((t) => [t.slug, t.id]));
  const toolIdsFromSlugs = (slugs: string[]) =>
    slugs.map((slug) => idBySlug[slug]).filter(Boolean);

  const plans: MockPlan[] = [
    {
      id: "plan-1",
      name: "Starter",
      description: "Essential tools for freelancers.",
      pricePkr: 4500,
      durationDays: 30,
      active: true,
      toolIds: toolIdsFromSlugs([
        "keywords-everywhere",
        "kwfinder",
        "moz",
        "quillbot",
        "rytr",
        "scribd",
        "slideshare",
        "tuts-plus",
        "wordtune",
        "writehuman",
      ]),
    },
    {
      id: "plan-2",
      name: "Pro",
      description: "Full toolkit for agencies.",
      pricePkr: 12000,
      durationDays: 30,
      active: true,
      toolIds: tools.map((t) => t.id),
    },
    {
      id: "plan-3",
      name: "Agency",
      description: "Everything plus priority support.",
      pricePkr: 18000,
      durationDays: 30,
      active: true,
      toolIds: tools.map((t) => t.id),
    },
  ];

  const users: MockUser[] = [
    { id: "user-demo", name: "Demo User", email: "user@demo.com", password: "demo1234", role: "USER", status: "ACTIVE", createdAt: daysFromNow(-30) },
    { id: "user-admin", name: "Demo Admin", email: "admin@demo.com", password: "demo1234", role: "ADMIN", status: "ACTIVE", createdAt: daysFromNow(-60) },
    { id: "user-2", name: "Sarah Khan", email: "sarah@agency.com", password: "demo1234", role: "USER", status: "ACTIVE", createdAt: daysFromNow(-14) },
    { id: "user-3", name: "James Wilson", email: "james@seo.io", password: "demo1234", role: "USER", status: "SUSPENDED", createdAt: daysFromNow(-45) },
  ];

  const subscriptions: MockSubscription[] = [
    { id: "sub-1", userId: "user-demo", planId: "plan-2", status: "ACTIVE", startedAt: daysFromNow(-12), expiresAt: daysFromNow(18), createdAt: daysFromNow(-12), notes: null },
    { id: "sub-2", userId: "user-2", planId: "plan-1", status: "ACTIVE", startedAt: daysFromNow(-25), expiresAt: daysFromNow(5), createdAt: daysFromNow(-25), notes: null },
    { id: "sub-3", userId: "user-3", planId: null, status: "PENDING", startedAt: null, expiresAt: null, createdAt: daysFromNow(-3), notes: "Awaiting offline payment" },
  ];

  const toolAccess: MockUserToolAccess[] = [
    { id: "access-1", userId: "user-demo", toolId: idBySlug["semrush"], status: "ACTIVE", grantedAt: daysFromNow(-12), expiresAt: daysFromNow(18), source: "PLAN" },
    { id: "access-2", userId: "user-demo", toolId: idBySlug["moz"], status: "ACTIVE", grantedAt: daysFromNow(-12), expiresAt: daysFromNow(18), source: "PLAN" },
    { id: "access-3", userId: "user-demo", toolId: idBySlug["spyfu"], status: "ACTIVE", grantedAt: daysFromNow(-12), expiresAt: daysFromNow(18), source: "PLAN" },
    { id: "access-4", userId: "user-2", toolId: idBySlug["kwfinder"], status: "ACTIVE", grantedAt: daysFromNow(-25), expiresAt: daysFromNow(5), source: "PLAN" },
    { id: "access-5", userId: "user-2", toolId: idBySlug["wordtune"], status: "ACTIVE", grantedAt: daysFromNow(-25), expiresAt: daysFromNow(5), source: "PLAN" },
  ];

  const toolRequests: MockToolRequest[] = [];

  return { tools, plans, users, subscriptions, toolAccess, toolRequests };
}

type Store = ReturnType<typeof createInitialStore>;

const globalStore = globalThis as unknown as { __mockStore?: Store };

function ensureDemoAccountsActive(store: Store) {
  for (const user of store.users) {
    if (isDemoAccountEmail(user.email)) {
      user.status = "ACTIVE";
    }
  }
}

function getStore(): Store {
  if (!globalStore.__mockStore) {
    globalStore.__mockStore = createInitialStore();
  }
  const store = globalStore.__mockStore;
  if (!store.toolRequests) {
    store.toolRequests = [];
  }
  ensureDemoAccountsActive(store);
  return store;
}

export const mockStore = {
  get users() { return getStore().users; },
  get tools() { return getStore().tools; },
  get plans() { return getStore().plans; },
  get subscriptions() { return getStore().subscriptions; },
  get toolAccess() { return getStore().toolAccess; },
  get toolRequests() { return getStore().toolRequests; },
};

export function mockId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
