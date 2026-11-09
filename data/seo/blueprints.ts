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

  "extract-emails-urls": {
    slug: "extract-emails-urls",
    title: "Email Extractor from Text Online – Free Email & URL Address Parser",
    metaDescription:
      "Extract emails, website links, and domain addresses from raw text, documents, or spreadsheets in your browser. 100% private, instant deduplication.",
    h1: "Email & URL Extractor from Text",
    aboveTheFoldIntro:
      "Extract contact email addresses, website links, and domains from unstructured text, client logs, or contact databases with zero server uploads.",
    primaryKeyword: "email extractor from text",
    secondaryKeywords: [
      "extract email from text",
      "extract emails from text",
      "email address extractor",
      "extract url from text",
      "link extractor online",
      "email parser from text",
      "parse emails online",
    ],
    popularAnchor: "Email Extractor from Text",
    clusterSlugs: [
      "remove-duplicate-lines",
      "sort-lines",
      "url-encoder",
      "remove-special-chars",
    ],
  },
  "character-frequency": {
    slug: "character-frequency",
    title: "Character Frequency Counter Online – Free Letter & Symbol Analyzer",
    metaDescription:
      "Count character frequencies, letter distributions, and occurrence percentages in real-time. 100% private in-browser character frequency analyzer.",
    h1: "Character Frequency Counter Online",
    aboveTheFoldIntro:
      "Count character occurrences, percentages, and letter frequency distributions in real time. Inspect symbol frequency, whitespace, and case differences directly in your browser.",
    primaryKeyword: "character frequency",
    secondaryKeywords: [
      "character frequency counter",
      "letter frequency counter",
      "symbol frequency analyzer",
      "character occurrence counter",
      "count letter frequency",
      "letter count distribution",
    ],
    popularAnchor: "Character Frequency Counter",
    clusterSlugs: [
      "word-frequency",
      "word-counter",
      "regex-tester",
    ],
  },
  "date-difference": {
    slug: "date-difference",
    title: "Date Difference Calculator – Calculate Days Between Dates Online [Free]",
    metaDescription:
      "Calculate exact days, weeks, months, and working days between two dates online. Free date difference calculator with timezone and inclusive options.",
    h1: "Date Difference Calculator",
    aboveTheFoldIntro:
      "Compare two dates and times to view elapsed days, hours, and minutes with customizable timezone handling and inclusive-end settings.",
    primaryKeyword: "date difference calculator",
    secondaryKeywords: [
      "calculate days between dates",
      "days between two dates",
      "date difference",
      "weeks between dates",
      "days calculator between dates",
      "time between dates",
      "date span calculator",
    ],
    popularAnchor: "Date Difference Calculator",
    clusterSlugs: [
      "unix-timestamp",
      "word-counter",
      "json-formatter",
    ],
  },
  "ai-summarize": {
    slug: "ai-summarize",
    title: "AI Text Summarizer Online – Condense Articles & Bullet Points [Free]",
    metaDescription:
      "Summarize long articles, essays, and text documents into concise bullet points or summaries. Text is sent to an AI provider; compare key points with the source.",
    h1: "AI Text Summarizer Online",
    aboveTheFoldIntro:
      "Condense lengthy articles, customer research, and documents into clear bullet points or an executive summary in seconds with assisted AI.",
    primaryKeyword: "ai text summarizer",
    secondaryKeywords: [
      "ai summarizer",
      "summarize text online",
      "article summarizer",
      "summarize text free",
      "ai paragraph summarizer",
      "bullet point summarizer",
    ],
    popularAnchor: "AI Text Summarizer",
    clusterSlugs: [
      "word-counter",
      "ai-paraphrase",
      "ai-expand",
    ],
  },
  "ai-grammar": {
    slug: "ai-grammar",
    title: "AI Grammar Checker & Proofreader Online – Fix Spelling & Punctuation",
    metaDescription:
      "Review grammar, spelling, and sentence phrasing with AI assistance. Text is sent to an AI provider; check suggested edits before use.",
    h1: "AI Grammar Checker and Proofreader",
    aboveTheFoldIntro:
      "Inspect text for grammar, spelling, comma placement, and phrasing issues in one click. Receive clear suggestions to elevate clarity and correctness.",
    primaryKeyword: "ai grammar checker",
    secondaryKeywords: [
      "ai proofreader online",
      "free grammar checker",
      "fix grammar mistakes",
      "ai spelling checker",
      "proofread text online",
      "sentence corrector",
    ],
    popularAnchor: "AI Grammar Checker and Proofreader",
    clusterSlugs: [
      "ai-paraphrase",
      "ai-professional",
      "word-counter",
    ],
  },
  "sort-lines": {
    slug: "sort-lines",
    title: "Sort Lines Alphabetically & Numerically Online – Free Text Sorter",
    metaDescription:
      "Sort text lines alphabetically, numerically, by length, or in reverse order instantly. Organize lists, CSV entries, and text files directly in your browser.",
    h1: "Sort Text Lines Online",
    aboveTheFoldIntro:
      "Sort text lines alphabetically (A-Z or Z-A), numerically, by line length, or randomize order. Clean and structure list data in seconds.",
    primaryKeyword: "sort lines alphabetically",
    secondaryKeywords: [
      "sort lines online",
      "sort text lines",
      "alphabetize list online",
      "numerical line sorter",
      "text line organizer",
      "order lines alphabetically",
    ],
    popularAnchor: "Sort Text Lines Online",
    clusterSlugs: [
      "remove-duplicate-lines",
      "trim-lines",
      "add-line-numbers",
    ],
  },
  "query-string-parser": {
    slug: "query-string-parser",
    title: "URL Query String Parser & Decoder Online – Inspect URL Parameters",
    metaDescription:
      "Parse URL query strings into readable parameters, keys, and decoded values. Inspect complex URL parameters with zero network transmission.",
    h1: "URL Query String Parser",
    aboveTheFoldIntro:
      "Inspect URL search parameters, path components, and decoded keys or values. Useful for checking tracking tags, redirects, and API endpoints.",
    primaryKeyword: "query string parser",
    secondaryKeywords: [
      "url parameter parser",
      "parse query string",
      "url query string decoder",
      "query param inspector",
      "decode url parameters",
    ],
    popularAnchor: "URL Query String Parser",
    clusterSlugs: [
      "url-encoder",
      "jwt-decoder",
      "json-formatter",
    ],
  },
  "remove-accents": {
    slug: "remove-accents",
    title: "Remove Accents & Diacritics from Text Online [Free]",
    metaDescription:
      "Strip accents, diacritical marks, and Latin accents (é, à, ñ, ü) into standard ASCII letters instantly. Fast, private in-browser text normalizer.",
    h1: "Remove Accents and Diacritics",
    aboveTheFoldIntro:
      "Normalize accented Latin letters to their plain ASCII equivalents. Useful for slug generation, search indexing, and plain-text exports.",
    primaryKeyword: "remove letter accents",
    secondaryKeywords: [
      "remove accents from text",
      "diacritics remover",
      "normalize accented characters",
      "strip accents online",
      "accent mark remover",
    ],
    popularAnchor: "Remove Accents and Diacritics",
    clusterSlugs: [
      "slug-generator",
      "remove-special-chars",
      "case-converter",
    ],
  },
  "tabs-to-spaces": {
    slug: "tabs-to-spaces",
    title: "Tabs to Spaces Converter Online – Convert Indentation [Free]",
    metaDescription:
      "Convert tabs to spaces or spaces to tabs with custom indentation widths (2, 4, 8 spaces). 100% private in-browser code and text formatter.",
    h1: "Tabs to Spaces and Spaces to Tabs",
    aboveTheFoldIntro:
      "Convert tab characters to spaces or leading space runs back into tabs. Useful for code indent consistency across editors and terminal displays.",
    primaryKeyword: "tabs to spaces",
    secondaryKeywords: [
      "spaces to tabs",
      "convert tabs to spaces",
      "indentation converter",
      "tab to space converter",
      "replace tabs with spaces",
    ],
    popularAnchor: "Tabs to Spaces Converter",
    clusterSlugs: [
      "remove-extra-spaces",
      "trim-lines",
      "json-formatter",
    ],
  },
  "remove-empty-lines": {
    slug: "remove-empty-lines",
    title: "Remove Empty Lines Online – Delete Blank Lines from Text [Free]",
    metaDescription:
      "Delete empty lines, strip trailing blank lines, and compact paragraph spacing instantly in your browser. 100% private text cleaner.",
    h1: "Remove Empty Lines from Text",
    aboveTheFoldIntro:
      "Strip blank lines, lines containing only spaces, or consecutive empty rows from text. Useful before sorting, counting, or formatting lists.",
    primaryKeyword: "remove empty lines",
    secondaryKeywords: [
      "delete empty lines",
      "remove blank lines",
      "strip empty lines",
      "delete blank rows",
      "clean empty lines online",
    ],
    popularAnchor: "Remove Empty Lines Online",
    clusterSlugs: [
      "remove-duplicate-lines",
      "trim-lines",
      "remove-extra-spaces",
    ],
  },
  "trim-lines": {
    slug: "trim-lines",
    title: "Trim Lines Online – Strip Leading & Trailing Whitespace [Free]",
    metaDescription:
      "Trim whitespace, remove leading tabs, and strip trailing spaces from every line of text instantly in your browser.",
    h1: "Trim Whitespace from Every Line",
    aboveTheFoldIntro:
      "Strip leading and trailing spaces or tabs from every line while keeping line breaks intact. Useful for cleaning raw logs and CSV exports.",
    primaryKeyword: "trim lines",
    secondaryKeywords: [
      "trim whitespace online",
      "strip leading spaces",
      "remove trailing whitespace",
      "trim text lines",
      "clean line edges",
    ],
    popularAnchor: "Trim Lines Online",
    clusterSlugs: [
      "remove-extra-spaces",
      "remove-duplicate-lines",
      "remove-empty-lines",
    ],
  },
  "remove-line-breaks": {
    slug: "remove-line-breaks",
    title: "Remove Line Breaks Online – Convert Multi-Line to Single Line [Free]",
    metaDescription:
      "Strip unwanted line breaks, newlines, and carriage returns to join text into a continuous single line or paragraph. Free in-browser tool.",
    h1: "Remove Line Breaks and Join Text",
    aboveTheFoldIntro:
      "Replace hard line breaks with spaces or custom delimiters to produce a single continuous block. Useful for re-wrapping copied paragraphs.",
    primaryKeyword: "remove line breaks",
    secondaryKeywords: [
      "remove newlines",
      "convert multiline to single line",
      "join lines online",
      "strip carriage returns",
      "remove line breaks online",
    ],
    popularAnchor: "Remove Line Breaks Online",
    clusterSlugs: [
      "remove-extra-spaces",
      "remove-empty-lines",
      "word-counter",
    ],
  },
  "remove-emojis": {
    slug: "remove-emojis",
    title: "Remove Emojis from Text Online – Strip Symbols & Emoticons [Free]",
    metaDescription:
      "Remove emojis, Unicode pictographs, and decorative emoticons from text, social posts, or documents. 100% private in-browser tool.",
    h1: "Remove Emojis from Text",
    aboveTheFoldIntro:
      "Strip emojis and Unicode pictographs from pasted text while keeping punctuation and letters intact. Useful for clean imports and database safety.",
    primaryKeyword: "remove emojis from text",
    secondaryKeywords: [
      "strip emojis online",
      "remove emoticons from text",
      "delete emojis",
      "emoji remover online",
      "clean emojis from text",
    ],
    popularAnchor: "Remove Emojis Online",
    clusterSlugs: [
      "remove-special-chars",
      "remove-accents",
      "word-counter",
    ],
  },
  "reverse-text": {
    slug: "reverse-text",
    title: "Reverse Text Online – Flip Words, Letters & Backwards Text [Free]",
    metaDescription:
      "Reverse text, invert letter order, flip word order, or reverse entire lines instantly with free in-browser text tool.",
    h1: "Reverse Text, Words, or Lines",
    aboveTheFoldIntro:
      "Invert letter order, flip words in sentences, or reverse the order of entire lines. Useful for puzzle solving, mirror text, and testing display logic.",
    primaryKeyword: "reverse text",
    secondaryKeywords: [
      "backwards text generator",
      "flip text online",
      "reverse words",
      "reverse letters online",
      "mirror text generator",
    ],
    popularAnchor: "Reverse Text Online",
    clusterSlugs: [
      "rot13",
      "sort-lines",
      "case-converter",
    ],
  },
  "rot13": {
    slug: "rot13",
    title: "ROT13 Cipher Encoder & Decoder Online – Free Caesar Shift Tool",
    metaDescription:
      "Encode and decode text using the ROT13 substitution cipher instantly. Rotate letters 13 positions forward or backward directly in your browser.",
    h1: "ROT13 Encoder and Decoder",
    aboveTheFoldIntro:
      "Apply the classic ROT13 letter-rotation cipher to obscure text or decode existing ROT13 messages. Non-alphabetic characters are preserved as-is.",
    primaryKeyword: "rot13 cipher",
    secondaryKeywords: [
      "rot13 decoder",
      "rot13 encoder",
      "caesar cipher rot13",
      "rotate 13 letters",
      "decode rot13 online",
    ],
    popularAnchor: "ROT13 Cipher Tool",
    clusterSlugs: [
      "base64",
      "reverse-text",
      "hash-generator",
    ],
  },
  "add-line-numbers": {
    slug: "add-line-numbers",
    title: "Add Line Numbers to Text Online – Number List Lines [Free]",
    metaDescription:
      "Prepend line numbers to text, code snippets, or lists with custom padding, separators, and starting indexes in your browser.",
    h1: "Add Line Numbers to Text",
    aboveTheFoldIntro:
      "Prepend sequential line numbers to every line with customizable separators, starting indices, and zero-padding options.",
    primaryKeyword: "add line numbers",
    secondaryKeywords: [
      "number lines online",
      "add line numbering",
      "prepend line numbers",
      "line numbering tool",
      "number a list online",
    ],
    popularAnchor: "Add Line Numbers Online",
    clusterSlugs: [
      "add-prefix-suffix",
      "sort-lines",
      "trim-lines",
    ],
  },
  "diff-checker": {
    slug: "diff-checker",
    title: "Online Diff Checker – Compare Two Texts & Find Differences Free",
    metaDescription:
      "Compare two text files side by side and highlight added, removed, or modified words and lines. Fast, free in-browser diff comparison tool with report export.",
    h1: "Online Diff Checker",
    aboveTheFoldIntro:
      "Compare two texts side by side to instantly visualize differences, added content, and removed lines with customizable case and whitespace sensitivity.",
    primaryKeyword: "online diff checker",
    secondaryKeywords: [
      "diff checker online",
      "compare text online",
      "text difference checker",
      "code diff tool",
      "side by side text comparison",
      "find differences in text",
      "compare two texts",
    ],
    popularAnchor: "Online Diff Checker",
    clusterSlugs: [
      "remove-extra-spaces",
      "remove-duplicate-lines",
      "word-counter",
      "case-converter",
    ],
  },
  "extract-phone-numbers": {
    slug: "extract-phone-numbers",
    title: "Extract Phone Numbers from Text Online – Bulk Phone Extractor [Free]",
    metaDescription:
      "Extract international and domestic telephone numbers, mobile contacts, and hotlines from raw text, emails, or spreadsheets. 100% private in-browser tool.",
    h1: "Extract Phone Numbers from Text Online",
    aboveTheFoldIntro:
      "Instantly isolate, clean, and deduplicate phone and mobile numbers from unstructured text, web scrapes, or messy customer lists with zero server uploads.",
    primaryKeyword: "extract phone numbers from text",
    secondaryKeywords: [
      "extract phone numbers",
      "phone number extractor",
      "extract phone numbers online",
      "phone extractor online",
      "bulk phone number extractor",
      "extract mobile numbers from text",
      "phone regex extractor",
      "scrape phone numbers from text",
    ],
    popularAnchor: "Extract Phone Numbers",
    clusterSlugs: [
      "extract-emails-urls",
      "find-and-replace",
      "remove-duplicate-lines",
      "remove-special-chars",
    ],
  },

  "remove-lines-containing": {
    slug: "remove-lines-containing",
    title: "Remove Lines Containing Text Online – Filter & Delete Lines [Free]",
    metaDescription:
      "Remove or keep lines containing specific words, text, or regex patterns instantly. Filter bulk lists, log files, and CSVs with real-time browser preview.",
    h1: "Remove Lines Containing Text Online",
    aboveTheFoldIntro:
      "Filter, delete, or isolate lines matching specific words, prefixes, or regular expressions across multi-gigabyte lists and server logs with zero server uploads.",
    primaryKeyword: "remove lines containing",
    secondaryKeywords: [
      "remove lines containing text",
      "delete lines containing",
      "filter lines online",
      "remove lines with word",
      "delete rows containing string",
      "filter text lines",
      "keep lines containing",
      "regex line filter",
    ],
    popularAnchor: "Remove Lines Containing",
    clusterSlugs: [
      "remove-duplicate-lines",
      "find-and-replace",
      "remove-empty-lines",
      "sort-lines",
    ],
  },

  "add-prefix-suffix": {
    slug: "add-prefix-suffix",
    title: "Add Prefix and Suffix to Lines Online – Prepend & Append Text [Free]",
    metaDescription:
      "Add custom prefix and suffix to every line of text instantly. Generate SQL 'IN' clauses, markdown lists, HTML tags, or wrapped quotes with free in-browser tool.",
    h1: "Add Prefix and Suffix to Lines Online",
    aboveTheFoldIntro:
      "Prepend and append characters, quotes, bullets, or HTML markup to every line of text in real time with instant live preview and zero server uploads.",
    primaryKeyword: "add prefix and suffix to lines",
    secondaryKeywords: [
      "add prefix suffix online",
      "add prefix to each line",
      "add suffix to each line",
      "prepend and append text",
      "add quotes to lines",
      "sql quote list generator",
      "prefix suffix generator",
      "wrap lines in quotes",
    ],
    popularAnchor: "Add Prefix & Suffix",
    clusterSlugs: [
      "add-line-numbers",
      "sort-lines",
      "remove-duplicate-lines",
      "find-and-replace",
    ],
  },

  "extract-text-between": {
    slug: "extract-text-between",
    title: "Extract Text Between Quotes or Characters Online [Free]",
    metaDescription:
      "Extract text and substrings between quotes, brackets, parentheses, or custom delimiter characters instantly. 100% free and private in-browser tool.",
    h1: "Extract Text Between Quotes or Characters",
    aboveTheFoldIntro:
      "Isolate and extract text enclosed inside double quotes, single quotes, brackets, parentheses, or custom tags across multi-line logs, datasets, and documents.",
    primaryKeyword: "extract text between quotes",
    secondaryKeywords: [
      "extract text between",
      "extract text between brackets",
      "extract text between parentheses",
      "text between delimiter",
      "extract text between two characters",
      "string between extractor",
      "extract quotes from text",
      "get text inside quotes",
    ],
    popularAnchor: "Extract Text Between",
    clusterSlugs: [
      "find-and-replace",
      "extract-emails-urls",
      "extract-phone-numbers",
      "remove-special-chars",
    ],
  },

  "extract-capitalized-words": {
    slug: "extract-capitalized-words",
    title: "Extract Capitalized Words from Text Online – Proper Nouns [Free]",
    metaDescription:
      "Extract words starting with uppercase, acronyms, and proper noun phrases from raw text or articles. Fast, 100% private in-browser text analyzer.",
    h1: "Extract Capitalized Words from Text Online",
    aboveTheFoldIntro:
      "Extract capitalized words, proper nouns, corporate names, and all-caps acronyms from articles, legal documents, and transcripts with zero server uploads.",
    primaryKeyword: "extract capitalized words from text",
    secondaryKeywords: [
      "extract capitalized words",
      "capital words extractor",
      "extract proper nouns",
      "extract uppercase words",
      "acronym extractor",
      "find capitalized words",
      "capitalized word finder",
      "extract title case words",
    ],
    popularAnchor: "Extract Capitalized Words",
    clusterSlugs: [
      "case-converter",
      "word-counter",
      "extract-text-between",
      "find-and-replace",
    ],
  },

  "find-and-replace": {
    slug: "find-and-replace",
    title: "Find and Replace Text Online – Search, Match & Batch Replace [Free]",
    metaDescription:
      "Search and replace text, words, and regex patterns online. Match case, whole words, and batch replace strings instantly with live counts. Free in-browser tool.",
    h1: "Find and Replace Text Online",
    aboveTheFoldIntro:
      "Search and replace text, words, and regular expression patterns in real time. Customize case matching and whole-word boundaries with instant occurrence counters.",
    primaryKeyword: "find and replace text online",
    secondaryKeywords: [
      "find and replace",
      "find and replace text",
      "replace text online",
      "search and replace online",
      "regex replace text",
      "batch replace words",
      "replace words in text",
    ],
    popularAnchor: "Find and Replace",
    clusterSlugs: [
      "remove-special-chars",
      "remove-extra-spaces",
      "case-converter",
      "word-counter",
    ],
  },

  "remove-hidden-characters": {
    slug: "remove-hidden-characters",
    title: "Remove Hidden Characters Online – Clean Zero-Width & Invisible AI Text [Free]",
    metaDescription:
      "Detect and remove hidden Unicode characters, zero-width spaces, soft hyphens, and invisible AI markers instantly. Free in-browser text sanitizer.",
    h1: "Remove Hidden & Invisible Characters Online",
    aboveTheFoldIntro:
      "Detect and purge hidden Unicode characters, zero-width spaces (ZWSP), and invisible AI text markers in real time. Sanitize copied content safely in your browser.",
    primaryKeyword: "remove hidden characters",
    secondaryKeywords: [
      "remove zero width space",
      "invisible character remover",
      "clean invisible characters",
      "remove hidden ai characters",
      "zero width space cleaner",
      "remove non breaking spaces",
      "unicode cleaner",
    ],
    popularAnchor: "Remove Hidden Characters",
    clusterSlugs: [
      "remove-special-chars",
      "remove-extra-spaces",
      "ai-humanizer",
      "word-counter",
    ],
  },

  "ai-humanizer": {
    slug: "ai-humanizer",
    title: "AI Humanizer – Convert AI Text to Natural Human Writing [Free]",
    metaDescription:
      "Turn stiff, robotic ChatGPT and AI drafts into natural, human-like prose with an AI provider. Free online AI humanizer that improves flow and rhythm instantly.",
    h1: "AI Humanizer & Text Rewriter",
    aboveTheFoldIntro:
      "Transform formulaic AI drafts from ChatGPT, Gemini, or Claude into authentic, conversational human text. Break robotic patterns and enhance readability in seconds.",
    primaryKeyword: "ai humanizer",
    secondaryKeywords: [
      "humanize ai text",
      "bypass ai detector",
      "ai to human converter",
      "undetectable ai free",
      "make ai sound human",
      "humanize chatgpt text",
      "ai text rewriter",
    ],
    popularAnchor: "AI Humanizer",
    clusterSlugs: [
      "ai-paraphrase",
      "ai-friendly",
      "ai-professional",
      "word-counter",
    ],
  },

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
    popularAnchor: "Placeholder & Dummy Text",
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
    title: "HTML & Text Minifier Online – Minify Code & Compress Markup [Free]",
    metaDescription:
      "Minify HTML code, strip unnecessary whitespace, and remove comment tags in your browser. Fast, free HTML and text compression tool for developers.",
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
    title: "Unix Timestamp to Date Converter – Epoch to Human DateTime [Free]",
    metaDescription:
      "Convert Unix timestamps to readable human date, UTC time, and local timezone formats. Instant bi-directional epoch converter with millisecond support.",
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
    title: "Free AI Professional Tone Converter – Sound Confident & Executive in 1-Click",
    metaDescription:
      "Convert casual emails, drafts, and messages into authoritative, polished business English instantly. 100% free AI professional tone converter online.",
    h1: "AI Professional Tone Rewriter",
    aboveTheFoldIntro:
      "Transform casual messages, informal notes, or quick thoughts into polished, authoritative executive communication. Paste your message to generate crisp, professional text in seconds.",
    primaryKeyword: "ai professional tone converter",
    secondaryKeywords: [
      "ai professional tone",
      "professional text converter",
      "make text sound professional",
      "convert casual to professional email",
      "executive tone rewriter",
      "formal email generator",
      "business english rewriter",
    ],
    popularAnchor: "AI Professional Tone Converter",
    clusterSlugs: [
      "ai-friendly",
      "ai-grammar",
      "ai-paraphrase",
      "word-counter",
      "word-frequency",
    ],
  },
  "word-frequency": {
    slug: "word-frequency",
    title: "Keyword & Word Frequency Counter Online – Free Text Density Analyzer",
    metaDescription:
      "Calculate keyword frequency, word repetition count, and phrase density online. Free in-browser keyword frequency counter to optimize SEO content and eliminate duplicate words.",
    h1: "Keyword & Word Frequency Counter Online",
    aboveTheFoldIntro:
      "Analyze keyword frequency, word repetition, and density percentages in real time with 100% client-side privacy. Find overused phrases and optimize content effortlessly.",
    primaryKeyword: "keyword frequency counter",
    secondaryKeywords: [
      "word frequency counter",
      "keyword frequency analyzer",
      "check keyword frequency",
      "word repetition counter",
      "keyword density counter online",
      "word occurrence counter",
      "keyword frequency tool",
    ],
    popularAnchor: "Keyword Frequency Counter",
    clusterSlugs: [
      "word-counter",
      "character-frequency",
      "remove-duplicate-lines",
      "slug-generator",
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
  "pii-sanitizer": {
    slug: "pii-sanitizer",
    title: "PII Sanitizer & AI Prompt Scrubber Online – 100% Private [Free]",
    metaDescription:
      "Anonymize emails, phone numbers, API keys, and names before pasting into ChatGPT, Claude, or DeepSeek. 100% in-browser privacy with 1-click restoration.",
    h1: "PII Sanitizer & AI Prompt Scrubber Online",
    aboveTheFoldIntro:
      "Scrub confidential personal data, secrets, IP addresses, and customer records from AI prompts with zero server uploads and instant 1-click token restoration.",
    primaryKeyword: "pii sanitizer",
    secondaryKeywords: [
      "ai prompt sanitizer",
      "sanitize prompt for chatgpt",
      "anonymize text for ai",
      "redact sensitive data",
      "prompt scrubber",
      "local pii anonymizer",
      "ai data privacy tool",
      "de-identify data online",
    ],
    popularAnchor: "PII & Prompt Sanitizer",
    clusterSlugs: [
      "extract-phone-numbers",
      "extract-emails-urls",
      "find-and-replace",
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
