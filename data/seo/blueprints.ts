import { SUPPLEMENTAL_GUIDES } from "./supplementalGuides.ts";
import { SEARCH_GUIDES } from "./searchGuides.ts";

export interface ToolSeoBlueprint {
  slug: string;
  title: string;
  metaDescription: string;
  h1: string;
  aboveTheFoldIntro: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  popularAnchor: string;
  clusterSlugs: string[];
}

export const SEO_BLUEPRINT_MAP: Record<string, ToolSeoBlueprint> = {
  ...Object.fromEntries(Object.entries(SUPPLEMENTAL_GUIDES).map(([slug, guide]) => [slug, {
    slug, title: guide.title, metaDescription: guide.description, h1: guide.title,
    aboveTheFoldIntro: guide.description, primaryKeyword: guide.title.toLowerCase(),
    secondaryKeywords: [], popularAnchor: guide.title, clusterSlugs: guide.related,
  }])),
  "remove-duplicate-lines": {
    slug: "remove-duplicate-lines",
    title: "Remove Duplicate Lines Online – Dedupe Text Lists Instantly [Free]",
    metaDescription:
      "Quickly remove duplicate lines from lists and text documents. Preserve original line order, configure case sensitivity, and copy deduplicated lines in seconds.",
    h1: "Remove Duplicate Lines Online",
    aboveTheFoldIntro:
      "Clean and deduplicate pasted text lists with a deterministic in-browser algorithm. Retain the first occurrence of each unique row with full control over case and whitespace.",
    primaryKeyword: "duplicate line remover",
    secondaryKeywords: [
      "remove duplicate lines text",
      "dedupe lines online",
      "duplicate line remover online",
      "remove duplicate lines",
      "delete duplicate rows",
      "unique lines filter",
    ],
    popularAnchor: "Duplicate Line Remover",
    clusterSlugs: [
      "sort-lines",
      "trim-lines",
      "remove-empty-lines",
      "remove-extra-spaces",
    ],
  },
  "strip-html-tags": {
    slug: "strip-html-tags",
    title: "Strip HTML Tags to Plain Text – Extract Clean Text from Code [Instant]",
    metaDescription:
      "Strip HTML tags and convert markup into clean plain text instantly. Extract readable content from email templates and web code with entity decoding in your browser.",
    h1: "Strip HTML Tags to Plain Text",
    aboveTheFoldIntro:
      "Extract readable, clean copy from raw HTML markup in real time. Strip formatting tags, convert block elements to neat line breaks, and decode HTML character entities securely.",
    primaryKeyword: "strip html tags to plain text",
    secondaryKeywords: [
      "remove all html tags from string",
      "strip code",
      "html strip",
      "html to plain text",
      "remove html tags online",
      "clean html code to text",
    ],
    popularAnchor: "Strip HTML Tags",
    clusterSlugs: [
      "html-minifier",
      "markdown-to-html",
      "remove-extra-spaces",
      "remove-line-breaks",
    ],
  },

  "word-counter": {
    slug: "word-counter",
    title: "Word Counter – Free Online Word Count & Character Counter",
    metaDescription:
      "Count words, characters, sentences and paragraphs instantly with this free online word counter. Fast, accurate and easy to use.",
    h1: "Free Word Counter",
    aboveTheFoldIntro:
      "Count words and characters instantly. Paste or type your text to see word count, character count, sentences, paragraphs and more in real time.",
    primaryKeyword: "word counter",
    secondaryKeywords: [
      "word counter online",
      "word count",
      "word count checker",
      "count words",
      "online word counter",
      "character counter",
      "character count",
      "sentence counter",
      "paragraph counter",
      "reading time",
    ],
    popularAnchor: "Free Word Counter",
    clusterSlugs: [
      "character-frequency",
      "word-frequency",
      "case-converter",
      "remove-duplicate-lines",
      "regex-tester",
    ],
  },
  "json-formatter": {
    slug: "json-formatter",
    title: "JSON Formatter & Validator – Free Online JSON Beautifier",
    metaDescription:
      "Format, beautify and validate JSON online. Fix unreadable JSON, check syntax and instantly view properly formatted JSON for free.",
    h1: "JSON Formatter & Validator",
    aboveTheFoldIntro:
      "Format and validate JSON instantly. Paste your JSON to beautify its structure, improve readability and detect syntax errors.",
    primaryKeyword: "json formatter",
    secondaryKeywords: [
      "json formatter online",
      "json beautifier",
      "json validator",
      "format json",
      "json pretty print",
      "json viewer",
      "json checker",
      "json parser",
    ],
    popularAnchor: "Online JSON Formatter",
    clusterSlugs: [
      "json-to-csv",
      "csv-to-json",
      "query-string-parser",
      "jwt-decoder",
      "base64",
    ],
  },
  "password-generator": {
    slug: "password-generator",
    title: "Password Generator – Free Strong & Random Password Generator",
    metaDescription:
      "Generate strong, random passwords instantly. Choose password length, characters and options with this free online password generator.",
    h1: "Strong Password Generator",
    aboveTheFoldIntro:
      "Generate strong random passwords with customizable length and character options. Create a new password instantly in your browser.",
    primaryKeyword: "password generator",
    secondaryKeywords: [
      "random password generator",
      "strong password generator",
      "secure password generator",
      "password generator online",
      "strong random password",
      "16 character password generator",
      "20 character password generator",
      "random password",
    ],
    popularAnchor: "Strong Password Generator",
    clusterSlugs: [
      "uuid-generator",
      "base64",
      "hash-generator",
      "lorem-ipsum",
    ],
  },
  "uuid-generator": {
    slug: "uuid-generator",
    title: "UUID Generator – Free Random UUID v4 Generator Online",
    metaDescription:
      "Generate random UUID v4 identifiers instantly. Free online UUID generator with one-click copying and no unnecessary setup.",
    h1: "UUID v4 Generator",
    aboveTheFoldIntro:
      "Generate random UUID v4 identifiers instantly. Create a UUID, copy it with one click and generate another whenever you need one.",
    primaryKeyword: "uuid generator",
    secondaryKeywords: [
      "uuid generator online",
      "UUID v4 generator",
      "random UUID generator",
      "generate UUID",
      "UUID creator",
      "GUID generator",
      "UUID generator free",
      "random UUID",
    ],
    popularAnchor: "UUID Generator",
    clusterSlugs: [
      "password-generator",
      "base64",
      "json-formatter",
      "hash-generator",
    ],
  },
  "regex-tester": {
    slug: "regex-tester",
    title: "Regex Tester – Free Online Regular Expression Tester",
    metaDescription:
      "Test regular expressions online with this free regex tester. Check matches, validate patterns and quickly debug your regular expressions.",
    h1: "Regex Tester",
    aboveTheFoldIntro:
      "Test and debug regular expressions instantly. Enter a regex pattern and sample text to find matches and verify your expression.",
    primaryKeyword: "regex tester",
    secondaryKeywords: [
      "regex tester online",
      "regular expression tester",
      "regex checker",
      "regex validator",
      "regex debugger",
      "test regex",
      "regular expression tester online",
    ],
    popularAnchor: "Online Regex Tester",
    clusterSlugs: [
      "extract-emails-urls",
      "character-frequency",
      "word-frequency",
      "query-string-parser",
    ],
  },
  "case-converter": {
    slug: "case-converter",
    title: "Case Converter – Uppercase, Lowercase & Title Case Online",
    metaDescription:
      "Convert text to uppercase, lowercase, title case and more with this free online case converter. Fast, simple and easy to use.",
    h1: "Case Converter",
    aboveTheFoldIntro:
      "Convert text between uppercase, lowercase, title case, sentence case and other formats instantly.",
    primaryKeyword: "case converter",
    secondaryKeywords: [
      "uppercase converter",
      "lowercase converter",
      "title case converter",
      "sentence case converter",
      "change case",
      "text case converter",
      "uppercase lowercase converter",
      "proper case converter",
    ],
    popularAnchor: "Case Converter",
    clusterSlugs: [
      "word-counter",
      "remove-accents",
      "fancy-fonts",
      "reverse-text",
      "sort-lines",
    ],
  },
  "base64": {
    slug: "base64",
    title: "Base64 Encoder & Decoder – Free Online Base64 Tool",
    metaDescription:
      "Encode text to Base64 or decode Base64 back to text online. Fast, free and easy-to-use Base64 encoder and decoder.",
    h1: "Base64 Encoder & Decoder",
    aboveTheFoldIntro:
      "Encode text to Base64 or decode Base64 strings instantly. Use the tool directly in your browser.",
    primaryKeyword: "base64 encoder",
    secondaryKeywords: [
      "base64 decoder",
      "base64 encode",
      "base64 decode",
      "base64 converter",
      "base64 encoder online",
      "base64 decoder online",
      "decode base64",
      "encode to base64",
    ],
    popularAnchor: "Base64 Encoder & Decoder",
    clusterSlugs: [
      "url-encoder",
      "json-formatter",
      "hash-generator",
      "jwt-decoder",
    ],
  },
  "url-encoder": {
    slug: "url-encoder",
    title: "URL Encoder & Decoder – Free Online URL Encoding Tool",
    metaDescription:
      "Encode or decode URLs online with this free URL encoder and decoder. Convert special characters to percent encoding instantly.",
    h1: "URL Encoder & Decoder",
    aboveTheFoldIntro:
      "Encode URLs or decode percent-encoded text instantly. Convert special characters into URL-safe encoded values with ease.",
    primaryKeyword: "url encoder",
    secondaryKeywords: [
      "url decoder",
      "url encode",
      "url decode",
      "percent encoding",
      "url encoding online",
      "encode url",
      "decode url",
      "percent encode",
    ],
    popularAnchor: "URL Encoder & Decoder",
    clusterSlugs: [
      "base64",
      "query-string-parser",
      "slug-generator",
      "html-minifier",
      "json-formatter",
    ],
  },
  "jwt-decoder": {
    slug: "jwt-decoder",
    title: "JWT Decoder – Decode JSON Web Tokens Online",
    metaDescription:
      "Decode JWT tokens online and inspect their header and payload. Free JWT decoder for quickly viewing JSON Web Token data.",
    h1: "JWT Decoder",
    aboveTheFoldIntro:
      "Decode a JSON Web Token and inspect its header and payload instantly. Paste a JWT to view its encoded data in a readable format.",
    primaryKeyword: "jwt decoder",
    secondaryKeywords: [
      "jwt decoder online",
      "decode jwt",
      "jwt token decoder",
      "json web token decoder",
      "jwt debugger",
      "jwt parser",
      "decode jwt token",
    ],
    popularAnchor: "JWT Decoder",
    clusterSlugs: [
      "json-formatter",
      "base64",
      "hash-generator",
      "query-string-parser",
    ],
  },
  "lorem-ipsum": {
    slug: "lorem-ipsum",
    title: "Lorem Ipsum Generator – Free Dummy Text Generator",
    metaDescription:
      "Generate Lorem Ipsum placeholder text instantly. Create paragraphs, sentences or words of dummy text for websites, designs and layouts.",
    h1: "Lorem Ipsum Generator",
    aboveTheFoldIntro:
      "Generate placeholder Lorem Ipsum text for websites, designs, mockups and layouts. Choose the amount of text you need and copy it instantly.",
    primaryKeyword: "lorem ipsum generator",
    secondaryKeywords: [
      "lorem ipsum",
      "lorem ipsum text",
      "dummy text generator",
      "placeholder text generator",
      "random text generator",
      "lorem ipsum generator online",
      "dummy text",
    ],
    popularAnchor: "Lorem Ipsum Generator",
    clusterSlugs: [
      "word-counter",
      "case-converter",
      "fancy-fonts",
      "character-frequency",
    ],
  },
  "fancy-fonts": {
    slug: "fancy-fonts",
    title: "Fancy Font Generator – Cool Text & Stylish Fonts Copy Paste",
    metaDescription:
      "Generate fancy fonts and stylish text instantly. Create cool copy-and-paste fonts for Instagram, TikTok, Discord, gaming profiles, bios and social posts.",
    h1: "Fancy Font Generator",
    aboveTheFoldIntro:
      "Generate stylish Unicode text and fancy fonts instantly. Type your text once and copy cool font styles for Instagram bios, TikTok captions, Discord, gaming profiles and social media.",
    primaryKeyword: "fancy font generator",
    secondaryKeywords: [
      "fancy font generator",
      "fancy text generator",
      "cool fonts",
      "stylish text generator",
      "font generator copy paste",
      "instagram font generator",
      "instagram fonts",
      "tiktok fonts",
      "discord fonts",
      "cool text generator",
      "cursive text generator",
      "gothic text generator",
      "aesthetic fonts",
      "unicode font generator",
      "fancy letters",
      "stylish fonts copy paste",
    ],
    popularAnchor: "Fancy Font Generator",
    clusterSlugs: [
      "case-converter",
      "lorem-ipsum",
      "word-counter",
      "reverse-text",
      "remove-emojis",
    ],
  },
  "slug-generator": {
    slug: "slug-generator",
    title: "Slug Generator – Instant URL & SEO Friendly Slug Creator [Free]",
    metaDescription:
      "Convert article titles and headings into clean, SEO-friendly URL slugs instantly. Customize delimiters, strip special characters, and copy URL-safe slugs with one click.",
    h1: "Online SEO Slug Generator",
    aboveTheFoldIntro:
      "Transform article titles, product names, and headings into clean, SEO-optimized URL slugs. Automatically strips special characters, accents, and unwanted symbols in real time.",
    primaryKeyword: "slug generator",
    secondaryKeywords: [
      "ai slug generator",
      "online text to slug generator",
      "text to slug",
      "seo slug generator",
      "url slug creator",
      "permalink generator",
      "kebab case converter",
      "url slug maker",
    ],
    popularAnchor: "SEO Slug Generator",
    clusterSlugs: [
      "remove-special-chars",
      "remove-accents",
      "case-converter",
      "url-encoder",
    ],
  },
  "json-to-csv": {
    slug: "json-to-csv",
    title: "JSON to CSV Converter – Convert JSON to CSV Online Free",
    metaDescription:
      "Convert JSON to CSV online instantly. Transform JSON arrays and structured data into clean CSV format for Excel, spreadsheets and data analysis.",
    h1: "JSON to CSV Converter",
    aboveTheFoldIntro:
      "Convert JSON data into clean CSV format instantly. Paste your JSON and generate spreadsheet-ready CSV for Excel, Google Sheets, databases and data workflows.",
    primaryKeyword: "json to csv",
    secondaryKeywords: [
      "json to csv",
      "json to csv converter",
      "convert json to csv",
      "json to csv online",
      "json converter",
      "json array to csv",
      "json file to csv",
      "json to excel",
      "json to spreadsheet",
      "convert json array to csv",
      "online json to csv converter",
      "json csv converter",
      "json data to csv",
      "json export csv",
      "json to comma separated values",
    ],
    popularAnchor: "JSON to CSV Converter",
    clusterSlugs: [
      "csv-to-json",
      "json-formatter",
      "query-string-parser",
      "base64",
      "word-counter",
    ],
  },
  "csv-to-json": {
    slug: "csv-to-json",
    title: "CSV to JSON Converter – Convert CSV to JSON Online Free",
    metaDescription:
      "Convert CSV to JSON online instantly. Transform spreadsheet rows into structured JSON objects for APIs, development, databases and data workflows.",
    h1: "CSV to JSON Converter",
    aboveTheFoldIntro:
      "Convert CSV data into structured JSON instantly. Paste spreadsheet-style rows and generate clean JSON objects for APIs, web apps, databases and development workflows.",
    primaryKeyword: "csv to json",
    secondaryKeywords: [
      "csv to json",
      "csv to json converter",
      "convert csv to json",
      "csv to json online",
      "csv converter",
      "csv file to json",
      "spreadsheet to json",
      "excel csv to json",
      "csv rows to json",
      "convert csv file to json",
      "online csv to json converter",
      "csv json converter",
      "csv data to json",
      "csv to json array",
      "tabular data to json",
    ],
    popularAnchor: "CSV to JSON Converter",
    clusterSlugs: [
      "json-to-csv",
      "json-formatter",
      "query-string-parser",
      "base64",
      "html-minifier",
    ],
  },
  "markdown-to-html": {
    slug: "markdown-to-html",
    title: "Markdown to HTML Converter – Convert Markdown Online Free",
    metaDescription:
      "Convert Markdown to clean HTML instantly. Transform headings, links, lists, code blocks and formatted Markdown into HTML directly in your browser.",
    h1: "Markdown to HTML Converter",
    aboveTheFoldIntro:
      "Convert Markdown into clean HTML instantly. Paste Markdown syntax and generate ready-to-use HTML for websites, documentation, blogs and developer workflows.",
    primaryKeyword: "markdown to html",
    secondaryKeywords: [
      "markdown to html",
      "markdown to html converter",
      "convert markdown to html",
      "markdown converter",
      "markdown to html online",
      "md to html",
      "markdown html converter",
      "markdown parser",
      "markdown renderer",
      "markdown to html code",
      "convert md to html",
      "markdown preview",
      "online markdown converter",
      "markdown syntax to html",
      "markdown editor html",
    ],
    popularAnchor: "Markdown to HTML Converter",
    clusterSlugs: [
      "html-minifier",
      "strip-html-tags",
      "json-formatter",
      "word-counter",
      "case-converter",
    ],
  },
  "html-minifier": {
    slug: "html-minifier",
    title: "HTML Minifier – Minify HTML Code and Compress Markup Online [Instant]",
    metaDescription:
      "Minify HTML online: remove standard comments and compact attribute gaps while preserving text whitespace. Process markup locally in your browser.",
    h1: "HTML Minifier",
    aboveTheFoldIntro:
      "Remove standard HTML comments and compact attribute gaps. Text whitespace and attribute values stay intact; review comment-dependent templates before using the output.",
    primaryKeyword: "html minifier",
    secondaryKeywords: [
      "html minifier",
      "minify html",
      "html minifier online",
      "html compressor",
      "compress html",
      "html minification",
      "html code minifier",
      "online html minifier",
      "html size reducer",
      "remove whitespace html",
      "html optimizer",
      "compact html",
      "minify html online",
      "html compression tool",
      "reduce html file size",
    ],
    popularAnchor: "HTML Minifier",
    clusterSlugs: [
      "markdown-to-html",
      "strip-html-tags",
      "json-formatter",
      "remove-extra-spaces",
    ],
  },
  "hash-generator": {
    slug: "hash-generator",
    title: "Hash Generator – SHA-256 & SHA-512 Hash Online Free",
    metaDescription:
      "Generate cryptographic hashes from text instantly. Create SHA-256, SHA-512 and other supported hash values directly in your browser for free.",
    h1: "Online Hash Generator",
    aboveTheFoldIntro:
      "Generate cryptographic hash values from text instantly. Choose a supported hashing algorithm and create a deterministic digest directly in your browser.",
    primaryKeyword: "hash generator",
    secondaryKeywords: [
      "online hash generator",
      "sha256 generator",
      "sha 256 hash generator",
      "sha512 generator",
      "sha 512 hash generator",
      "sha384 generator",
      "text hash generator",
      "cryptographic hash generator",
      "generate hash online",
      "string hash generator",
      "sha hash generator",
      "sha1 generator",
      "hash calculator",
      "hash text online",
    ],
    popularAnchor: "Online Hash Generator",
    clusterSlugs: [
      "base64",
      "password-generator",
      "uuid-generator",
      "jwt-decoder",
    ],
  },
  "unix-timestamp": {
    slug: "unix-timestamp",
    title: "Unix Timestamp Converter – Convert Epoch to Date and Date to Epoch [Instant]",
    metaDescription:
      "Convert Unix timestamps to readable dates and dates back to epoch time instantly. Supports common timestamp formats directly in your browser.",
    h1: "Unix Timestamp Converter",
    aboveTheFoldIntro:
      "Convert Unix epoch timestamps into readable dates and turn dates back into Unix time instantly. Useful for APIs, logs, databases and developer workflows.",
    primaryKeyword: "unix timestamp converter",
    secondaryKeywords: [
      "epoch converter",
      "timestamp converter",
      "unix time converter",
      "epoch time converter",
      "unix timestamp to date",
      "timestamp to date",
      "epoch to date",
      "date to unix timestamp",
      "date to epoch",
      "unix timestamp online",
      "epoch timestamp converter",
      "convert timestamp",
      "unix time to date",
      "timestamp calculator",
    ],
    popularAnchor: "Unix Timestamp Converter",
    clusterSlugs: [
      "date-difference",
      "jwt-decoder",
      "json-formatter",
      "query-string-parser",
    ],
  },
    "ai-professional": {
    slug: "ai-professional",
    title: "AI Professional Tone Rewriter – Turn Casual Drafts into Executive Emails [Free]",
    metaDescription:
      "Convert casual drafts into authoritative, polished business text. Free online AI tool to rewrite emails, reports, and workplace messages in clear executive English.",
    h1: "AI Professional Tone Rewriter",
    aboveTheFoldIntro:
      "Elevate casual notes, informal drafts, or quick thoughts into polished, executive business communication. Paste your message to generate crisp, professional text in seconds.",
    primaryKeyword: "text professional",
    secondaryKeywords: [
      "ai professional tone",
      "professional text rewriter",
      "business email rewriter",
      "formal rewrite online",
      "executive english rewriter",
    ],
    popularAnchor: "Professional Text Rewriter",
    clusterSlugs: [
      "ai-friendly",
      "ai-grammar",
      "ai-paraphrase",
      "word-counter",
    ],
  },
  "ai-expand": {
    slug: "ai-expand",
    title: "AI Text Expander Free Online – Expand Sentences & Elaborate Ideas",
    metaDescription:
      "Elaborate on short sentences, bullet points, and brief notes with descriptive detail and logical context. Free online AI text expander for essays, emails, and articles.",
    h1: "AI Text & Sentence Expander",
    aboveTheFoldIntro:
      "Turn brief notes, bullet points, and short sentences into thorough, well-structured paragraphs. Paste your idea below to expand it with helpful context and natural flow.",
    primaryKeyword: "text expander free online",
    secondaryKeywords: [
      "ai expander text",
      "expand text ai",
      "expand sentences online",
      "elaborate ideas ai",
      "sentence expander free",
    ],
    popularAnchor: "AI Text Expander",
    clusterSlugs: [
      "word-counter",
      "ai-summarize",
      "ai-grammar",
      "ai-paraphrase",
    ],
  },
  "ai-paraphrase": {
    slug: "ai-paraphrase",
    title: "AI Paraphrasing Tool Free Online – Rephrase Sentences & Text",
    metaDescription:
      "Rephrase sentences, paragraphs, and essays with fresh vocabulary using an AI provider. Online AI paraphrasing tool with no sign-up required. Review suggestions before use.",
    h1: "Free Online AI Paraphrasing Tool",
    aboveTheFoldIntro:
      "Rewrite text with alternative wording, fresh vocabulary, and polished sentence flow while preserving your original meaning. Connects securely to your configured AI provider.",
    primaryKeyword: "ai paraphrasing tool",
    secondaryKeywords: [
      "online ai paraphraser",
      "rephrase sentences online",
      "paraphrase tool free",
      "online ai proofreader",
      "sentence rewriter",
    ],
    popularAnchor: "AI Paraphraser",
    clusterSlugs: [
      "ai-grammar",
      "ai-professional",
      "ai-expand",
      "word-counter",
    ],
  },
"ai-friendly": {
    slug: "ai-friendly",
    title: "AI Friendly Text Rewriter – Make Blunt Text Polite & Warm Online",
    metaDescription:
      "Turn blunt, harsh, or stiff messages into warm, polite, and friendly text instantly. Free online AI tone rewriter for emails, customer replies, and team chats.",
    h1: "AI Friendly Text Rewriter",
    aboveTheFoldIntro:
      "Transform blunt, stiff, or demanding drafts into warm, empathetic, and approachable messages. Paste your text below to generate a friendly, professional rewrite in seconds.",
    primaryKeyword: "ai friendly",
    secondaryKeywords: [
      "ai-friendly",
      "ai friendly text",
      "friendly text rewriter",
      "friendly tone rewriter",
      "make text friendly",
      "make message more polite",
      "polite text rewriter",
      "warm tone rewriter",
      "make email sound friendly",
    ],
    popularAnchor: "AI Friendly Rewriter",
    clusterSlugs: [
      "ai-professional",
      "ai-grammar",
      "ai-paraphrase",
      "word-counter",
    ],
  },
  "remove-special-chars": {
    slug: "remove-special-chars",
    title: "Remove Special Characters Online – Strip Symbols & Keep Spaces [Free]",
    metaDescription:
      "Quickly remove symbols, punctuation, and special characters from text while preserving letters and numbers. Free, instant in-browser cleaner with custom symbol options.",
    h1: "Remove Special Characters Online",
    aboveTheFoldIntro:
      "Strip unwanted symbols, non-alphanumeric characters, and punctuation from your text instantly. Customize which characters to keep or remove with real-time browser processing.",
    primaryKeyword: "remove special characters online",
    secondaryKeywords: [
      "remove special characters",
      "keep alphanumeric & spaces only",
      "keep alphanumeric and spaces",
      "remove all non alphanumeric characters",
      "keep numeric only",
      "keep numbers only online",
      "keep ascii only",
      "special character remover",
      "strip special characters",
      "remove symbols from text",
      "alphanumeric text cleaner",
      "clean symbols online",
    ],
    popularAnchor: "Remove Special Characters",
    clusterSlugs: [
      "remove-extra-spaces",
      "remove-emojis",
      "remove-accents",
      "slug-generator",
    ],
  },
  "remove-extra-spaces": {
    slug: "remove-extra-spaces",
    title: "Remove Extra Spaces Online – Collapse Double & Multiple Whitespace",
    metaDescription:
      "Instantly remove double spaces, collapse multiple whitespaces, and trim leading or trailing spaces from text. Free online whitespace cleaner with live browser formatting.",
    h1: "Remove Extra Spaces from Text",
    aboveTheFoldIntro:
      "Clean up messy formatting by collapsing multiple spaces into a single space, removing trailing spaces, and normalizing whitespace. Runs 100% privately in your browser.",
    primaryKeyword: "remove extra spaces",
    secondaryKeywords: [
      "remove spaces",
      "remove extra spaces from text",
      "remove double spaces",
      "collapse multiple spaces",
      "extra space remover",
      "whitespace cleaner online",
      "multiple space remover",
    ],
    popularAnchor: "Remove Extra Spaces",
    clusterSlugs: [
      "trim-lines",
      "remove-line-breaks",
      "remove-empty-lines",
      "tabs-to-spaces",
      "remove-special-chars",
    ],
  },
};


import { getToolBySlug } from "../tools/index.ts";

export function getToolSeoBlueprint(slug: string): ToolSeoBlueprint | undefined {
  const canonicalSlug = getToolBySlug(slug)?.slug || slug;
  const searchGuide = SEARCH_GUIDES[canonicalSlug];
  if (searchGuide) {
    const original = SEO_BLUEPRINT_MAP[canonicalSlug];
    return {
      slug: canonicalSlug, title: searchGuide.title,
      metaDescription: searchGuide.description,
      h1: original?.h1 || searchGuide.title.split(" – ")[0],
      aboveTheFoldIntro: original?.aboveTheFoldIntro || searchGuide.description,
      primaryKeyword: original?.primaryKeyword || searchGuide.title.split(" – ")[0].toLowerCase(),
      secondaryKeywords: original?.secondaryKeywords || [],
      popularAnchor: searchGuide.title.split(" – ")[0],
      clusterSlugs: searchGuide.related,
    };
  }
  if (SEO_BLUEPRINT_MAP[slug]) return SEO_BLUEPRINT_MAP[slug];
  const tool = getToolBySlug(slug);
  if (tool && SEO_BLUEPRINT_MAP[tool.slug]) {
    return SEO_BLUEPRINT_MAP[tool.slug];
  }
  return undefined;
}

export const TOP_10_P0_TOOLS: string[] = [
  "word-counter",
  "json-formatter",
  "password-generator",
  "uuid-generator",
  "regex-tester",
  "case-converter",
  "base64",
  "url-encoder",
  "jwt-decoder",
  "lorem-ipsum",
];
