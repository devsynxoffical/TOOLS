import {
  AccessSource,
  AccessStatus,
  PaymentOrderStatus,
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
  accessDurationDays: number;
  launchUrl: string | null;
  active: boolean;
};

export type MockPlatformSettings = {
  whatsappNumber: string | null;
  defaultAccessDays: number;
  paymentInstructions: string | null;
};

export type MockBankAccount = {
  id: string;
  bankName: string;
  accountTitle: string;
  accountNumber: string;
  iban: string | null;
  active: boolean;
  sortOrder: number;
  createdAt: Date;
};

export type MockPaymentOrder = {
  id: string;
  userId: string;
  toolId: string;
  amountPkr: number;
  bankAccountId: string;
  screenshotUrl: string | null;
  status: PaymentOrderStatus;
  userNote: string | null;
  adminNote: string | null;
  reviewedAt: Date | null;
  reviewedById: string | null;
  createdAt: Date;
};

export type MockToolAccount = {
  id: string;
  toolId: string;
  label: string;
  cookieDataEnc: string;
  maxConcurrentUsers: number;
  active: boolean;
  lastVerifiedAt: Date | null;
  notes: string | null;
  createdAt: Date;
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
  status: "PENDING" | "FULFILLED" | "DISMISSED";
  createdAt: Date;
};

function daysFromNow(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

function makeTool(
  id: string,
  name: string,
  slug: string,
  iconUrl: string,
  description: string,
  pricePkr: number
): MockTool {
  return {
    id,
    name,
    slug,
    iconUrl,
    description,
    pricePkr,
    accessDurationDays: 30,
    launchUrl: null,
    active: true,
  };
}

function createInitialStore() {
  const priceBySlug = Object.fromEntries(
    INDIVIDUAL_TOOL_PRICES.map((t) => [t.slug, t.pricePkr])
  );

  const tools: MockTool[] = [
    makeTool("tool-1", "Keywords Everywhere", "keywords-everywhere", "/tool-logos/keywords-everywhere.png", "Search volume and keyword metrics inside browser.", priceBySlug["keywords-everywhere"] ?? 0),
    makeTool("tool-2", "KWFinder", "kwfinder", "/tool-logos/kwfinder.png", "Long-tail keyword research with difficulty scoring.", priceBySlug["kwfinder"] ?? 0),
    makeTool("tool-3", "Lynda.com", "lynda-com", "/tool-logos/lynda-com.png", "Learning library for marketing and SEO skills.", priceBySlug["lynda-com"] ?? 0),
    makeTool("tool-4", "Majestic", "majestic", "/tool-logos/majestic.png", "Link intelligence metrics.", priceBySlug["majestic"] ?? 0),
    makeTool("tool-5", "Moz Pro", "moz", "/tool-logos/moz.png", "Domain authority tracking.", priceBySlug["moz"] ?? 0),
    makeTool("tool-6", "PicMonkey", "picmonkey", "/tool-logos/picmonkey.png", "Visual content editor for banners and creatives.", priceBySlug["picmonkey"] ?? 0),
    makeTool("tool-7", "Placeit", "placeit", "/tool-logos/placeit.png", "Mockups and social design assets.", priceBySlug["placeit"] ?? 0),
    makeTool("tool-8", "Quetext", "quetext", "/tool-logos/quetext.png", "Plagiarism and duplicate content detection.", priceBySlug["quetext"] ?? 0),
    makeTool("tool-9", "QuillBot", "quillbot", "/tool-logos/quillbot.png", "Paraphrasing and writing refinement assistant.", priceBySlug["quillbot"] ?? 0),
    makeTool("tool-10", "Rytr", "rytr", "/tool-logos/rytr.png", "AI writing assistant for content drafting.", priceBySlug["rytr"] ?? 0),
    makeTool("tool-11", "Scribd", "scribd", "/tool-logos/scribd.png", "Document and publication research library.", priceBySlug["scribd"] ?? 0),
    makeTool("tool-12", "Semrush", "semrush", "/tool-logos/semrush.png", "All-in-one marketing toolkit.", priceBySlug["semrush"] ?? 0),
    makeTool("tool-13", "SlideShare", "slideshare", "/tool-logos/slideshare.png", "Presentation discovery for research and outreach.", priceBySlug["slideshare"] ?? 0),
    makeTool("tool-14", "SpamZilla", "spamzilla", "/tool-logos/spamzilla.png", "Expired domain spam analysis and filtering.", priceBySlug["spamzilla"] ?? 0),
    makeTool("tool-15", "Spin Rewriter", "spin-rewriter", "/tool-logos/spin-rewriter.png", "Article rewriting and spinning workflows.", priceBySlug["spin-rewriter"] ?? 0),
    makeTool("tool-16", "SpyFu", "spyfu", "/tool-logos/spyfu.png", "Competitor keyword research.", priceBySlug["spyfu"] ?? 0),
    makeTool("tool-17", "Tuts+", "tuts-plus", "/tool-logos/tuts-plus.png", "Tutorial library for digital professionals.", priceBySlug["tuts-plus"] ?? 0),
    makeTool("tool-18", "WooRank", "woorank", "/tool-logos/woorank.png", "Website audit and optimization reports.", priceBySlug["woorank"] ?? 0),
    makeTool("tool-19", "WordAI", "wordai", "/tool-logos/wordai.png", "AI content rewriting and readability improvement.", priceBySlug["wordai"] ?? 0),
    makeTool("tool-20", "WordHero", "wordhero", "/tool-logos/wordhero.png", "AI content generation for blogs and ads.", priceBySlug["wordhero"] ?? 0),
    makeTool("tool-21", "Wordtracker", "wordtracker", "/tool-logos/wordtracker.png", "Keyword discovery and SERP analysis.", priceBySlug["wordtracker"] ?? 0),
    makeTool("tool-22", "Wordtune", "wordtune", "/tool-logos/wordtune.png", "Sentence rewriting and tone optimization.", priceBySlug["wordtune"] ?? 0),
    makeTool("tool-23", "WriteHuman", "writehuman", "/tool-logos/writehuman.png", "AI text humanization and style enhancement.", priceBySlug["writehuman"] ?? 0),
    makeTool("tool-24", "WriterZen", "writerzen", "/tool-logos/writerzen.png", "Keyword clustering and content briefing platform.", priceBySlug["writerzen"] ?? 0),
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

  const platformSettings: MockPlatformSettings = {
    whatsappNumber: null,
    defaultAccessDays: 30,
    paymentInstructions:
      "Transfer the exact amount to the selected bank account, then upload your payment screenshot below.",
  };

  const bankAccounts: MockBankAccount[] = [];

  const paymentOrders: MockPaymentOrder[] = [];

  const toolAccounts: MockToolAccount[] = [];

  return {
    tools,
    plans,
    users,
    subscriptions,
    toolAccess,
    toolRequests,
    platformSettings,
    bankAccounts,
    paymentOrders,
    toolAccounts,
  };
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
  get platformSettings() { return getStore().platformSettings; },
  set platformSettings(value: MockPlatformSettings) {
    getStore().platformSettings = value;
  },
  get bankAccounts() { return getStore().bankAccounts; },
  get paymentOrders() { return getStore().paymentOrders; },
  get toolAccounts() { return getStore().toolAccounts; },
};

export function mockId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
