/** Search-intent improvements informed by the 2026-10-14 GSC export.
 * Metrics stay in the audit report, never in visitor-facing copy.
 */
export interface SearchGuide {
  title: string;
  description: string;
  heading: string;
  useCase: string;
  example: { input: string; output: string; note: string };
  limitation: string;
  related: string[];
  faq: { question: string; answer: string };
}

export const SEARCH_GUIDES: Record<string, SearchGuide> = {
  "extract-phone-numbers": {
    title: "Extract Phone Numbers from Text Online – Bulk Phone Extractor [Free]",
    description: "Extract international and domestic telephone numbers, mobile contacts, and hotlines from raw text, emails, or spreadsheets. 100% private in-browser tool.",
    heading: "Bulk Phone Number Extractor for Raw Text & Lead Lists",
    useCase: "Extract contact numbers, mobile hotlines, and international dialing codes from mixed customer inquiries, chat transcripts, or CRM exports. Automatically removes trailing sentence punctuation, normalizes spacing, and discards duplicate entries. Pair with [Extract Emails & URLs](/tools/extract-emails-urls) to parse website links, or clean formatting with [Remove Extra Spaces](/tools/remove-extra-spaces).",
    example: {
      input: "Contact us at +1 (555) 234-5678, toll-free 1-800-555-0199, or UK office +44 20 7946 0912.",
      output: "+1 (555) 234-5678\n1-800-555-0199\n+44 20 7946 0912",
      note: "Extracted and deduplicated international and toll-free telephone numbers."
    },
    limitation: "The extractor analyzes text for standard international (+E.164) and national telephone structures between 7 and 15 digits. Short service codes (like 911 or 3-digit extensions) are excluded by default to avoid false positives with dates or invoice quantities.",
    related: ["extract-emails-urls", "find-and-replace", "remove-duplicate-lines", "remove-special-chars"],
    faq: {
      question: "Can I extract only the raw digits without punctuation or spaces?",
      answer: "Yes. In the tool options, switch the Output Format dropdown to 'Digits Only'. The tool will strip all parentheses, hyphens, and whitespace while retaining leading international '+' signs if present."
    }
  },
  "remove-lines-containing": {
    title: "Remove Lines Containing Text Online – Filter & Delete Lines [Free]",
    description: "Remove or keep lines containing specific words, text, or regex patterns instantly. Filter bulk lists, log files, and CSVs with real-time browser preview.",
    heading: "Filter & Delete Rows Matching Words, Substrings or RegEx",
    useCase: "Clean application log dumps, server debug files, CSV exports, or email contact databases. Purge noisy debug traces or isolate critical system alerts. Use 'Keep Only Lines' mode to extract only lines containing your target term, or enable Regular Expressions for complex pattern filtering. Combine with [Remove Duplicate Lines](/tools/remove-duplicate-lines) or [Find and Replace](/tools/find-and-replace) for end-to-end data cleaning.",
    example: {
      input: "INFO 2026-11-01 Service started\nDEBUG 2026-11-01 Checking socket\nERROR 2026-11-01 Connection timeout\nINFO 2026-11-01 Worker idle\nERROR 2026-11-01 Handshake failed",
      output: "INFO 2026-11-01 Service started\nDEBUG 2026-11-01 Checking socket\nINFO 2026-11-01 Worker idle",
      note: "Removed all lines containing 'ERROR'."
    },
    limitation: "Matching operates on a line-by-line basis. When regular expression mode is enabled, invalid patterns will trigger an inline notification without modifying your original input text.",
    related: ["remove-duplicate-lines", "find-and-replace", "remove-empty-lines", "sort-lines"],
    faq: {
      question: "Can I invert the filter to keep only lines that contain a word?",
      answer: "Yes. Toggle the mode button to 'Keep Only Lines'. In this mode, any line containing your search query or regex pattern will be retained while all non-matching lines are purged."
    }
  },
  "add-prefix-suffix": {
    title: "Add Prefix and Suffix to Lines Online – Prepend & Append Text [Free]",
    description: "Add custom prefix and suffix to every line of text instantly. Generate SQL 'IN' clauses, markdown lists, HTML tags, or wrapped quotes with free in-browser tool.",
    heading: "Batch Prepend & Append Text, Quotes or HTML to Lines",
    useCase: "Format raw data into SQL queries (wrap values in single quotes and commas), create markdown checklists, generate HTML list items (<li>...</li>), or append domains to user lists. Includes one-click presets for SQL, JSON/CSV, Markdown, and HTML. Combine with [Add Line Numbers](/tools/add-line-numbers) or [Remove Duplicate Lines](/tools/remove-duplicate-lines) for rapid text structuring.",
    example: {
      input: "apple\nbanana\norange",
      output: "'apple',\n'banana',\n'orange',",
      note: "Applied SQL quotes preset (prefix: ' and suffix: ',)."
    },
    limitation: "By default, blank lines are preserved without receiving prefixes or suffixes. To prepend and append to completely empty lines as well, disable the 'Skip Empty Lines' option.",
    related: ["add-line-numbers", "sort-lines", "remove-duplicate-lines", "find-and-replace"],
    faq: {
      question: "How do I format a column of words into a SQL IN clause list?",
      answer: "Paste your values into the tool and click the 'SQL Quotes' preset button (or set Prefix to ' and Suffix to ',). Each line will be wrapped with quotes and a comma, ready to copy directly into your SELECT ... WHERE id IN (...) query."
    }
  },
  "extract-text-between": {
    title: "Extract Text Between Quotes or Characters Online [Free]",
    description: "Extract text and substrings between quotes, brackets, parentheses, or custom delimiter characters instantly. 100% free and private in-browser tool.",
    heading: "Batch Extract Strings Inside Quotes, Brackets & Custom Delimiters",
    useCase: "Extract quoted words from documents, parse IP addresses inside brackets [192.168.1.1], isolate SQL values ('active', 'pending'), or scrape text between custom HTML/XML tags. Features one-click presets for double quotes, single quotes, parentheses, square brackets, curly braces, and angle brackets. Combine with [Remove Duplicate Lines](/tools/remove-duplicate-lines) or [Find and Replace](/tools/find-and-replace) for powerful data parsing.",
    example: {
      input: 'The system logged "authentication_failure" for user "admin" from IP "192.168.1.50".',
      output: "authentication_failure\nadmin\n192.168.1.50",
      note: "Extracted all substrings enclosed in double quotes (start: \", end: \")."
    },
    limitation: "Matching operates non-greedily between the specified start and end delimiters. If delimiters are nested within each other (such as nested parentheses), the extractor matches from each opening delimiter to the nearest closing delimiter.",
    related: ["find-and-replace", "extract-emails-urls", "extract-phone-numbers", "remove-special-chars"],
    faq: {
      question: "Can I extract text between different starting and ending characters?",
      answer: "Yes. You can specify different characters for Start and End delimiters. For example, set Start to '(' and End to ')' to pull text inside parentheses, or set Start to '<b>' and End to '</b>' to isolate bold text."
    }
  },
  "extract-capitalized-words": {
    title: "Extract Capitalized Words from Text Online – Proper Nouns [Free]",
    description: "Extract words starting with uppercase, acronyms, and proper noun phrases from raw text or articles. Fast, 100% private in-browser text analyzer.",
    heading: "Extract Capitalized Words, Acronyms & Proper Nouns",
    useCase: "Extract proper nouns (names of people, places, organizations), brand names, or all-caps acronyms (NASA, FBI, UNESCO) from articles, academic papers, and interview transcripts. Switch between all capitalized words, acronym-only filtering, or multi-word proper noun phrases. Pair with [Case Converter](/tools/case-converter) to transform casing, or [Word Counter](/tools/word-counter) to inspect entity density.",
    example: {
      input: "Alice Johnson visited the United Nations headquarters in New York.",
      output: "Alice\nJohnson\nUnited\nNations\nNew\nYork",
      note: "Extracted all words starting with an uppercase letter."
    },
    limitation: "The default mode extracts every word starting with an uppercase letter, including the first word of each sentence. To isolate multi-word entities, switch to the 'Proper Nouns (Phrases)' mode.",
    related: ["case-converter", "word-counter", "extract-text-between", "find-and-replace"],
    faq: {
      question: "Can I extract only all-caps acronyms like NASA or API?",
      answer: "Yes. Click the 'Acronyms (ALL CAPS)' mode button. The tool will filter the text and isolate only words where all letters are capitalized, excluding standard title-case words."
    }
  },
  "find-and-replace": {
    title: "Find and Replace Text Online – Search, Match & Batch Replace [Free]",
    description: "Search and replace text, words, and regex patterns online. Match case, whole words, and batch replace strings instantly with live counts. Free in-browser tool.",
    heading: "Batch Find and Replace Words, Phrases & Regex Patterns",
    useCase: "Quickly swap repeated terms, replace variables in code snippets, update templates, or bulk substitute typos across large documents. Use Whole Word mode to prevent accidental mid-word replacements, or regex mode for advanced token substitutions. For cleaning up whitespace after replacements, combine with [Remove Extra Spaces](/tools/remove-extra-spaces), or inspect length with [Word Counter](/tools/word-counter).",
    example: {
      input: "The quick brown fox jumps over the lazy dog. The fox was nimble and quick.",
      output: "The quick brown cat jumps over the lazy dog. The cat was nimble and quick.",
      note: "Substituted 'fox' with 'cat' across the sample text."
    },
    limitation: "Find and replace operates directly on plain text in your browser. In regular expression mode, unescaped special characters like parentheses and asterisks are evaluated as regex tokens. Verify capture group references ($1, $2) before replacing.",
    related: ["remove-special-chars", "remove-extra-spaces", "case-converter", "word-counter"],
    faq: {
      question: "Can I replace words without accidentally replacing substrings?",
      answer: "Yes. Check the 'Whole Words Only' option. When enabled, the tool enforces word boundary matching (\b) so searching for 'cat' will replace 'cat' while leaving 'category', 'scratched', or 'locates' untouched."
    }
  },
  "remove-hidden-characters": {
    title: "Remove Hidden Characters Online – Clean Zero-Width & Invisible AI Text [Free]",
    description: "Detect and remove hidden Unicode characters, zero-width spaces, soft hyphens, and invisible AI markers instantly. Free in-browser text sanitizer.",
    heading: "Purge Invisible Unicode Characters & AI Watermarks",
    useCase: "Clean copied text from ChatGPT, web documents, or PDF extracts that harbor hidden zero-width spaces, soft hyphens, or directional overrides. Prevents code compiler errors, JSON parse failures, and hidden AI tracking markers. For general punctuation cleanup, use [Remove Special Characters](/tools/remove-special-chars), or naturalize phrasing with [AI Humanizer](/tools/ai-humanizer).",
    example: {
      input: "Here\u200Bis\u200Ctext\u200Dwith\uFEFFinvisible\u00ADcharacters.",
      output: "Hereistextwithinvisiblecharacters.",
      note: "Purges zero-width spaces, joiners, BOMs, and soft hyphens."
    },
    limitation: "This utility targets non-rendering, zero-width, and invisible Unicode codepoints. It does not sanitize HTML tags or strip standard alphanumeric letters. Verify your target application requirements before stripping non-breaking spaces or directional marks.",
    related: ["remove-special-chars", "remove-extra-spaces", "ai-humanizer", "word-counter"],
    faq: {
      question: "What invisible characters does this tool remove?",
      answer: "The tool purges Zero-Width Spaces (U+200B), Zero-Width Non-Joiners (U+200C), Zero-Width Joiners (U+200D), Byte Order Marks (U+FEFF), Soft Hyphens (U+00AD), Word Joiners (U+2060), directional marks (LTR/RTL), and optionally normalizes non-breaking spaces."
    }
  },
  "ai-humanizer": {
    title: "AI Humanizer – Convert AI Text to Natural Human Writing [Free]",
    description: "Turn stiff, robotic ChatGPT and AI drafts into natural, human-like prose with an AI provider. Free online AI humanizer that improves flow and rhythm instantly.",
    heading: "Humanize Robotic AI Text into Authentic Writing",
    useCase: "Paste drafts generated by ChatGPT, Claude, Gemini, or Copilot to replace repetitive phrasing and monotonous sentence rhythms with lively, authentic human voice. Perfect for blog posts, essays, and creative newsletters. For formal business documents, try [AI Professional Tone](/tools/ai-professional), or test your output length with [Word Counter](/tools/word-counter).",
    example: {
      input: "In today's fast-paced digital era, it is crucial to delve into the intricate tapestry of technological advancements.",
      output: "Today, understanding how fast technology is moving has become essential for everyone.",
      note: "Illustrative rewrite using active conversational rhythm and everyday vocabulary."
    },
    limitation: "The AI Humanizer rewrites text to improve conversational rhythm, style, and natural phrasing. While it reduces typical generative AI clichés, it is an editing utility and does not guarantee that academic or institutional proctoring detectors will never flag content. Always review generated output for factual accuracy.",
    related: ["ai-paraphrase", "ai-friendly", "ai-professional", "word-counter"],
    faq: {
      question: "How does the AI Humanizer make text sound human?",
      answer: "The humanizer identifies and rewrites robotic AI patterns—such as overly complex transition words ('furthermore', 'moreover'), repetitive sentence structures, and predictable vocabulary ('delve', 'tapestry')—substituting them with authentic, varied phrasing and dynamic conversational rhythm."
    }
  },
  "diff-checker": {
    title: "Online Diff Checker – Compare Two Texts Free",
    description: "Compare two texts side by side with this free online diff checker. Highlight added and removed words or lines, ignore case or extra spaces, and export a report.",
    heading: "See what changed between two versions",
    useCase: "Compare an edited draft, a revised email or a plain-text file. Paste the original and revised versions, choose word or line mode, then select Compare texts.",
    example: { input: "Original: The quick brown fox.\nRevised: The quick red fox.", output: "Removed: brown\nAdded: red", note: "Word comparison highlights the replacement while keeping the surrounding text unchanged." },
    limitation: "This compares text, not meaning or plagiarism. Limit: 30,000 characters and 2,000 comparison units per panel for differing texts. Word mode counts whitespace and punctuation as units too. Try line mode for longer passages. CRLF and CR line endings are treated as LF.",
    related: ["remove-extra-spaces", "remove-duplicate-lines", "word-counter"],
    faq: { question: "Is my comparison text uploaded or saved?", answer: "The comparison runs in your browser without uploading or saving the text. You can copy or download a report yourself. Closing or refreshing the page clears the workspace." },
  },
  "slug-generator": {
    title: "Slug Generator – Free Online URL & SEO Slug Creator",
    description: "Convert article titles and headings into clean, SEO-friendly URL slugs instantly. Customize delimiters, strip special characters, and copy URL-safe slugs with one click.",
    heading: "Generate Clean, URL-Safe SEO Slugs from Any Title",
    useCase: "Create readable, SEO-optimized permalinks for blog articles, web pages, documentation, and e-commerce products. Automatically normalizes Unicode characters and accents. For stripping symbols in general text, explore our [Remove Special Characters](/tools/remove-special-chars) cleaner.",
    example: { input: "How to Build Modern Web Apps with Next.js in 2026! 🚀", output: "how-to-build-modern-web-apps-with-nextjs-in-2026", note: "Symbols, punctuation, and emojis are cleanly stripped into a standard kebab-case URL permalink." },
    limitation: "Generates deterministic, URL-safe slugs from your input string. It does not check database slug availability, register domain names, or configure web server redirects.",
    related: ["remove-special-chars", "remove-accents", "case-converter", "url-encoder"],
    faq: { question: "Is this an AI slug generator?", answer: "No. This text-to-slug converter uses fast, deterministic rules directly in your browser. It formats your existing title without sending text across the network or altering your word choice." },
  },
  "lorem-ipsum": {
    title: "Lorem Ipsum Generator – Placeholder Text Online",
    description: "Generate Lorem Ipsum placeholder text by paragraphs, sentences or words. Set the amount, generate a sample and copy it into your design or mockup.",
    heading: "Fill a mockup with placeholder text",
    useCase: "Choose paragraphs for a page layout, sentences for a card, or words for a short text block. Replace the dummy content with real copy before publishing.",
    example: { input: "Choose a text unit and amount, then select Generate", output: "Lorem ipsum dolor sit amet…", note: "Illustrative placeholder excerpt; generated text varies with your options." },
    limitation: "Lorem Ipsum is layout filler, not a translation service or finished article. It cannot predict how your final copy will wrap at every screen size.",
    related: ["word-counter", "character-frequency", "case-converter"],
    faq: { question: "Does this translate Lorem Ipsum into English?", answer: "No. It generates placeholder text for designs. For meaningful English copy, write the actual content instead of treating Latin-style filler as a translation." },
  },
  "ai-professional": {
    title: "AI Professional Tone Rewriter – Polish Business Emails & Text Online",
    description: "Rewrite casual drafts into authoritative, polished business text with an AI provider. Free online AI tool for emails, reports, and workplace messages.",
    heading: "Convert Casual Drafts into Executive Business Communication",
    useCase: "Turn quick bullet points, casual messages, or informal drafts into crisp, professional communication suitable for executives, clients, stakeholders, or managers. If you need a more casual, warm tone instead, switch to our [AI Friendly Rewriter](/tools/ai-friendly), or verify readability with our [Word Counter](/tools/word-counter).",
    example: { input: "Hey, need this done asap. Can you check the doc and tell me if its ok?", output: "Hello team, could you please review the attached document at your earliest convenience and confirm whether the revisions are approved?", note: "Illustrative rewrite; casual, informal phrasing is elevated into polite, clear, and professional business correspondence." },
    limitation: "Text is processed via secure HTTPS through the configured AI provider. Review dates, commitments, and proper names before sending. The tool does not store your submitted text in any database.",
    related: ["ai-friendly", "ai-grammar", "ai-paraphrase", "word-counter"],
    faq: { question: "Can I make an email professional without changing its request?", answer: "That is the primary goal of the tool. It preserves your underlying action items and questions while reframing them with professional diplomacy. Always compare the draft before sending." },
  },
  "ai-paraphrase": {
    title: "AI Paraphrasing Tool Free Online – Rephrase Sentences & Text",
    description: "Rephrase sentences, paragraphs, and essays with fresh vocabulary using an AI provider. Online AI paraphrasing tool with no sign-up required. Review suggestions before use.",
    heading: "Rephrase Sentences & Passages with Natural Vocabulary",
    useCase: "Overcome repetitive phrasing, improve sentence variety, and express ideas with fresh vocabulary while preserving the original intent and core facts of your text. To verify spelling and grammatical structure, use our [AI Proofreader](/tools/ai-grammar), or check length with [Word Counter](/tools/word-counter).",
    example: { input: "Effective communication requires clarity, active listening, and precision in language.", output: "Clear communication depends on expressing ideas plainly, listening attentively, and choosing words with care.", note: "Illustrative rewrite; sentence structure and vocabulary are varied naturally while the essential meaning remains intact." },
    limitation: "Rephrasing does not verify historical facts, establish original scholarship, or eliminate citation requirements. Always verify names, statistics, and citations yourself.",
    related: ["ai-grammar", "ai-professional", "ai-expand", "word-counter"],
    faq: { question: "Does paraphrasing guarantee plagiarism-free writing?", answer: "No. Changing wording does not alter intellectual ownership. Always maintain proper citations and verify factual accuracy when working with academic or published material." },
  },
  "ai-expand": {
    title: "AI Text Expander Free Online – Expand Sentences & Elaborate Ideas",
    description: "Elaborate on short sentences, bullet points, and brief notes with an AI provider. Free online AI text expander for essays, emails, and articles.",
    heading: "Elaborate Brief Thoughts into Structured, Detailed Paragraphs",
    useCase: "Develop concise notes, thesis statements, or bullet points into clear explanatory paragraphs with supporting reasoning, illustrative examples, and smooth transitions. When you need to condense longer passages instead, use our [AI Summarizer](/tools/ai-summarize), or check length with our [Word Counter](/tools/word-counter).",
    example: { input: "Client-side browser tools protect user privacy.", output: "Client-side browser tools protect user privacy by executing all parsing, transformation, and document processing entirely within the user's local browser memory, ensuring confidential text is never transmitted to remote servers.", note: "Illustrative expansion; a concise 6-word premise is elaborated into a comprehensive, informative explanatory paragraph." },
    limitation: "This is an AI writing expander for prose and ideas, not an operating system keyboard shortcut macro tool. AI additions should be reviewed for accuracy and factual consistency before publishing.",
    related: ["word-counter", "ai-summarize", "ai-grammar", "ai-paraphrase"],
    faq: { question: "Is this a text expander for keyboard shortcuts?", answer: "No. This AI text expander develops short writing into a longer draft. It does not install OS keyboard shortcuts or replace typed snippet abbreviations across other desktop apps." },
  },
  "ai-friendly": {
    title: "AI Friendly Text Rewriter – Make Blunt Text Polite & Warm Online",
    description: "Turn blunt, harsh, or stiff messages into warm, polite, and friendly text with an AI provider. Free online AI tone rewriter for emails, customer replies, and team chats.",
    heading: "Make Blunt Text Friendly, Polite, and Approachable",
    useCase: "Use this tool when an email, Slack message, or client reply sounds too abrupt, demanding, or cold. It softens phrasing while keeping your core message, deadlines, and questions completely intact. For formal workplace communication, try our [AI Professional Tone](/tools/ai-professional) rewriter.",
    example: { input: "The proposal you submitted is incomplete. Send the updated figures immediately.", output: "Thanks for sending over the proposal! It looks like a few figures are still missing. Could you please send through the updated numbers when you have a moment?", note: "Illustrative rewrite; blunt, demanding phrasing is softened into polite, collaborative workplace language." },
    limitation: "Tone adjustments are subjective. This tool rewrites human text into warmer conversational phrasing; it does not bypass AI detectors or optimize content for search engine web crawlers.",
    related: ["ai-professional", "ai-paraphrase", "ai-grammar", "word-counter"],
    faq: { question: "What does AI friendly mean on this page?", answer: "Here it means using AI to rewrite a message in a warmer, more conversational tone. It softens harsh commands into courteous, polite requests." },
  },
  "ai-grammar": {
    title: "AI Proofreader – Grammar & Spelling Checker Online",
    description: "Check grammar, spelling and punctuation with an AI provider. Review the proofread draft and compare suggested corrections with your original text.",
    heading: "Proofread before you send or publish",
    useCase: "Paste a draft and review the corrected version. Pay particular attention to names, quoted language and terminology that the model may mistakenly rewrite.",
    example: { input: "She go to work every day.", output: "She goes to work every day.", note: "Illustrative correction; actual suggestions vary." },
    limitation: "This produces a revised draft, not a tracked-changes report or certified proofreading. It may miss errors. Text leaves your browser for AI processing.",
    related: ["ai-paraphrase", "ai-professional", "word-counter"],
    faq: { question: "Can an online AI proofreader find every mistake?", answer: "No. Review the suggestions yourself, especially proper names, technical wording and facts. A fluent sentence can still be inaccurate." },
  },
  "remove-special-chars": {
    title: "Remove Special Characters Online – Strip Symbols & Keep Spaces [Free]",
    description: "Quickly remove symbols, punctuation, and special characters from text while preserving letters and numbers. Free, instant in-browser cleaner with custom symbol options.",
    heading: "Strip Unwanted Symbols, Glyphs & Special Characters Online",
    useCase: "Clean copied labels, database records, product descriptions, or code identifiers when target applications reject special characters. Keep alphanumeric characters and spaces intact, retain numeric-only values, or strip non-ASCII glyphs. Runs 100% locally in your browser memory. For formatting spacing between words, combine with [Remove Extra Spaces](/tools/remove-extra-spaces), or convert headings into clean URLs using our [Slug Generator](/tools/slug-generator).",
    example: { input: "Order #9842* & SKU: [AX-99] @ $49.99 (Discount: 15%!)", output: "Order 9842 SKU AX99 4999 Discount 15", note: "Default alphanumeric-only mode. Standard punctuation and custom allowed symbols can also be preserved." },
    limitation: "Retains Unicode letters and numbers across languages. Stripping characters is a client-side text formatting utility; it does not perform server-side database SQL escaping or HTML security sanitization.",
    related: ["remove-extra-spaces", "remove-emojis", "remove-accents", "slug-generator"],
    faq: { question: "Will the special character remover delete all non-English letters?", answer: "No. The default mode retains Unicode letters and numbers across all languages. Diacritics and international scripts (like accented Latin, Cyrillic, and Greek) remain intact." },
  },
  "remove-extra-spaces": {
    title: "Remove Extra Spaces Online – Collapse Double & Multiple Whitespace",
    description: "Instantly remove double spaces, collapse multiple whitespaces, and trim leading or trailing spaces from text. Free online whitespace cleaner with live browser formatting.",
    heading: "Collapse Double Spaces & Clean Erratic Whitespace Online",
    useCase: "Format copied text from PDFs, OCR, emails, or spreadsheets where erratic double spaces, multiple spaces, or accidental indentation disrupt your layout. To remove empty rows, pair with [Remove Empty Lines](/tools/remove-empty-lines), or clean up line endings using [Remove Line Breaks](/tools/remove-line-breaks).",
    example: { input: "This    sentence     contains   way     too     many   erratic      spaces.", output: "This sentence contains way too many erratic spaces.", note: "Multiple consecutive spaces are collapsed into clean single spaces instantly while preserving line breaks." },
    limitation: "Collapses extra spaces rather than deleting every space between words. The default Spaces Only mode preserves line breaks; All Whitespace mode collapses line breaks into single spaces.",
    related: ["trim-lines", "remove-line-breaks", "remove-empty-lines", "tabs-to-spaces"],
    faq: { question: "Does this remove all spaces between words?", answer: "No. It reduces repeated spaces to one clean space. All-whitespace mode also turns tabs and line breaks into single spaces; it does not delete legitimate word spacing." },
  },
  "remove-duplicate-lines": {
    title: "Duplicate Line Remover – Remove Repeated Lines Online",
    description: "Remove duplicate lines from a pasted list while keeping the first occurrence. Choose case and whitespace comparison options, then copy the unique lines.",
    heading: "Deduplicate a list without sorting it",
    useCase: "Paste one item per line, decide whether letter case and surrounding whitespace should matter, and keep the first occurrence of each matching line.",
    example: { input: "apple\nbanana\napple", output: "apple\nbanana", note: "Default case-sensitive comparison." },
    limitation: "This compares whole lines, not similar sentences or duplicate words within a paragraph. Different spellings remain separate. Review settings before deduplicating identifiers.",
    related: ["sort-lines", "trim-lines", "remove-empty-lines", "word-frequency"],
    faq: { question: "Does the duplicate line remover keep the original order?", answer: "Yes. It keeps the first occurrence in input order. Use Sort Lines separately if you also want alphabetical ordering." },
  },
  "strip-html-tags": {
    title: "Strip HTML Tags – Convert HTML to Plain Text",
    description: "Remove HTML tags from pasted markup and extract plain text. Choose line-break and entity-decoding options, then review and copy the result.",
    heading: "Extract readable text from pasted HTML",
    useCase: "Paste markup from a document or template to get a plain-text version. Keep line breaks for paragraphs or flatten the output when preparing one-line fields.",
    example: { input: "<p>Hello <strong>world</strong> &amp; friends</p>", output: "Hello world & friends", note: "Default entity decoding enabled." },
    limitation: "This does not fetch a URL or preserve rendered browser layout. It uses text-based matching, so malformed markup needs checking. Do not use its output as trusted HTML or as a security sanitizer.",
    related: ["html-minifier", "markdown-to-html", "remove-extra-spaces", "remove-line-breaks"],
    faq: { question: "Is stripping HTML the same as minifying HTML?", answer: "No. Stripping tags produces plain text. Minifying HTML keeps markup while reducing parts of its source formatting. Choose the tool that matches your destination." },
  },
  "html-minifier": {
    title: "HTML & Text Minifier Online – Minify Code & Compress Markup [Free]",
    description: "Minify HTML code, strip unnecessary whitespace, and remove comment tags in your browser. Fast, free HTML and text compression tool for developers.",
    heading: "Minify HTML without flattening its visible text",
    useCase: "Use this for HTML source, then test the result in the destination page. It compacts tag formatting conservatively instead of deleting whitespace throughout a document.",
    example: { input: '<div   class="note" >Hello world</div>', output: '<div class="note" >Hello world</div>', note: "Tag-spacing example; visible text is retained." },
    limitation: "This is an HTML minifier, not a general text minifier, JavaScript optimizer or sanitizer. Text whitespace is preserved, so savings depend on the input. Use whitespace cleanup for ordinary prose.",
    related: ["strip-html-tags", "remove-extra-spaces", "json-formatter", "markdown-to-html"],
    faq: { question: "Can I minify ordinary text with this tool?", answer: "For plain text, use Remove Extra Spaces or Remove Line Breaks. This tool targets HTML tag formatting and intentionally preserves text-node whitespace." },
  },
  "hash-generator": {
    title: "Text Hash Generator – SHA-256, SHA-384 & SHA-512",
    description: "Generate SHA hashes from text in your browser. Select an algorithm and copy the digest for comparison. Hashing is one-way; this tool does not decode hashes.",
    heading: "Generate a digest for exact text comparison",
    useCase: "Use the same algorithm and exactly the same input when comparing digests. A changed newline, space or letter produces a different result.",
    example: { input: "hello", output: "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824", note: "SHA-256, lowercase hello without a trailing newline." },
    limitation: "A hash is not reversible encryption. This tool cannot recover text or passwords from a digest. Raw SHA hashes are not a complete password-storage scheme.",
    related: ["base64", "url-encoder", "password-generator"],
    faq: { question: "Can this convert a hash back to text?", answer: "No. It generates a digest from text. Hashing is one-way, so there is no decode operation that recovers the original text or password." },
  },
  "regex-tester": {
    title: "Regex Tester – Test JavaScript Regular Expressions",
    description: "Test a regular expression against sample text, inspect matches and adjust flags. Uses JavaScript regex syntax; this tool does not generate patterns with AI.",
    heading: "Check a pattern against matching and nonmatching text",
    useCase: "Enter your regex and a small representative sample. Include cases that should match and cases that should not, then inspect the highlighted results.",
    example: { input: "Pattern: [0-9]+  |  Text: Order 123", output: "123", note: "Illustrative match for a run of digits." },
    limitation: "This tests JavaScript regex syntax, which differs from some other engines. A worker deadline limits expensive matches. It does not turn natural-language requests into regex patterns.",
    related: ["extract-emails-urls", "remove-special-chars", "json-formatter"],
    faq: { question: "Is this an automatic regex generator?", answer: "No. You supply the pattern and sample text. The tool tests the pattern and shows matches; it does not generate regular expressions from a description." },
  },
  "pii-sanitizer": {
    title: "PII Sanitizer & AI Prompt Scrubber Online – 100% Private [Free]",
    description: "Anonymize emails, phone numbers, API keys, and names before pasting into ChatGPT, Claude, or DeepSeek. 100% in-browser privacy with 1-click restoration.",
    heading: "In-Browser PII Masking & AI Prompt Anonymizer",
    useCase: "Safely interact with LLMs without violating GDPR, HIPAA, or corporate data privacy rules. Anonymize customer records, medical notes, server debugging logs, and internal credentials into synthetic tokens. Once your AI model finishes generating its answer, use Tab 2 to de-anonymize the response back into its original text. Pair with [Extract Emails & URLs](/tools/extract-emails-urls) and [Extract Phone Numbers](/tools/extract-phone-numbers) for advanced data parsing.",
    example: {
      input: "Customer Dr. Gregory House (gregory.house@hospital.org, phone +1 555-0199) reported database timeout on host 192.168.1.105.",
      output: "Customer [NAME_1] ([EMAIL_1], phone [PHONE_1]) reported database timeout on host [IP_ADDRESS_1].",
      note: "All PII replaced with reversible tokens while preserving syntactic meaning."
    },
    limitation: "The in-browser engine uses deterministic regex and entropy heuristics to identify common identifiers. For highly irregular or novel secret patterns, verify the detection chips before submitting prompts to external AI models.",
    related: ["extract-phone-numbers", "extract-emails-urls", "find-and-replace", "remove-special-chars"],
    faq: {
      question: "Are my confidential files or prompts stored or sent to any server?",
      answer: "No. All scanning, regex tokenization, and de-anonymization take place locally in your browser session. No text is ever uploaded, cached, or transmitted over the internet."
    }
  },
  "word-frequency": {
    title: "Keyword Frequency Counter – Word & Content Density Analyzer Online [Free]",
    description: "Analyze keyword frequency, word repetition, and keyword density percentages from text or articles in your browser. Free, instant, and 100% private.",
    heading: "Analyze Keyword Frequency, Repetition & Content Density Online",
    useCase: "Analyze text density, keyword repetition, and word count distributions for SEO copywriting, academic essays, and marketing collateral. Calculate exact repetition frequency and percentage density to prevent keyword stuffing and ensure natural editorial flow. Pair with [Word Counter](/tools/word-counter) for reading time metrics and [Character Frequency Counter](/tools/character-frequency) for letter breakdown.",
    example: {
      input: "SEO content optimization requires keyword research. Proper keyword research ensures high search ranking and keyword density balance.",
      output: "keyword: 3 (16.7%)\nresearch: 2 (11.1%)\nseo: 1 (5.6%)\noptimization: 1 (5.6%)\nranking: 1 (5.6%)",
      note: "Calculated keyword occurrences and percentage density."
    },
    limitation: "Calculations strip standard punctuation and normalize terms to lowercase for accurate frequency counting. Stop words can be filtered depending on chosen tool preferences. Processing runs entirely in-memory in your client browser.",
    related: ["word-counter", "character-frequency", "remove-duplicate-lines", "find-and-replace"],
    faq: {
      question: "How does this tool calculate keyword density?",
      answer: "Keyword density is calculated by dividing the number of times a specific word appears by the total word count of the text, multiplied by 100. This percentage helps SEO specialists maintain balanced keyword distribution without penalty."
    }
  },
  "json-to-typescript": {
    title: "JSON to TypeScript Interface Generator – Convert JSON to TS [Free]",
    description: "Convert JSON objects into clean TypeScript interfaces, type aliases, and Zod schemas instantly. 100% private in-browser code generator for developers.",
    heading: "Generate TypeScript Interfaces and Zod Schemas from JSON Online",
    useCase: "Instantly generate type-safe TypeScript interfaces, types, and Zod validation schemas directly from raw JSON objects, REST API payloads, or webhook responses. Supports deep nested types, unified multi-record array schema generation, optional property detection, and readonly modifiers. Pair with [JSON Formatter & Validator](/tools/json-formatter) to validate payloads, or [JSON to CSV](/tools/json-to-csv) to export tabular rows.",
    example: {
      input: '{\n  "userId": 1,\n  "title": "Sample Post",\n  "published": true,\n  "author": {\n    "name": "Alice",\n    "email": "alice@example.com"\n  }\n}',
      output: 'export interface Author {\n  name: string;\n  email: string;\n}\n\nexport interface RootObject {\n  userId: number;\n  title: string;\n  published: boolean;\n  author: Author;\n}',
      note: "Nested objects are automatically extracted into distinct, reusable TypeScript interfaces."
    },
    limitation: "The generator analyzes runtime data types provided in your JSON sample. If a field is null across all array objects, it will default to 'any'. Provide representative data with non-null values for the most accurate type inference.",
    related: [
      "json-formatter",
      "json-to-csv",
      "csv-to-json",
      "regex-tester"
    ],
    faq: {
      question: "Is my JSON payload or code sent to any external server?",
      answer: "No. The TypeScript interface generator operates 100% client-side in your web browser. No payload or generated types are ever uploaded, logged, or transmitted anywhere."
    }
  },
  "remove-line-breaks": {
    title: "Remove Line Breaks Online – Strip Line Separators Free",
    description: "Remove hard line breaks and clean line separators to format run-on text into structured paragraphs or single continuous lines. 100% private in-browser tool.",
    heading: "Remove Hard Line Separators & Format Structured Paragraphs",
    useCase: "Remove hard line breaks, paragraph breaks, and unwanted line separators from copied text. Ideal for formatting messy PDF exports, email threads, OCR scans, and terminal outputs into two clean, structured paragraphs or a continuous single line. Pair with [Remove Extra Spaces](/tools/remove-extra-spaces) to normalize spacing, [Remove Empty Lines](/tools/remove-empty-lines) to purge blank rows, or [AI Summarizer](/tools/ai-summarize) to condense long documents.",
    example: {
      input: "First line of paragraph one.\nSecond line of paragraph one.\n\nFirst line of paragraph two.\nSecond line of paragraph two.",
      output: "First line of paragraph one. Second line of paragraph one.\n\nFirst line of paragraph two. Second line of paragraph two.",
      note: "Preserved double line breaks between paragraphs while joining wrapped lines."
    },
    limitation: "The line break cleaner joins text lines and preserves paragraph spacing using your chosen delimiter. It does not alter your wording, correct typos, or rejoin hyphenated words. All processing executes locally in your browser without uploading data.",
    related: ["remove-extra-spaces", "remove-empty-lines", "ai-summarize", "word-counter"],
    faq: {
      question: "Can I format text and remove line breaks without uploading data to a server?",
      answer: "Yes. All line break removal and paragraph formatting executes 100% locally in your web browser using JavaScript. No text, confidential documents, or copied notes are ever sent over the network or stored on external servers."
    }
  },
  "ai-summarize": {
    title: "AI Text Summarizer – Condense Long Articles Online [Free]",
    description: "Condense long articles, reports, and run-on text into structured paragraphs or key bullet points with an AI provider. Free online text summarizer.",
    heading: "Condense Long Articles & Multi-Paragraph Text Online",
    useCase: "Condense rambling articles, meeting notes, research drafts, and run-on text into two structured paragraphs or high-impact bullet points. Clean messy text formatting with [Remove Line Breaks](/tools/remove-line-breaks) first, or refine the summary tone with [AI Paraphraser](/tools/ai-paraphrase) and [AI Proofreader](/tools/ai-grammar).",
    example: {
      input: "Artificial Intelligence search algorithms and conversational engines synthesize vast amounts of documentation across the open web to answer user questions directly. Web publishers and content creators must format their articles with clear heading structures, citable answer blocks, and front-loaded summaries so that generative models can cite key findings accurately.\n\nBrowser-based utilities provide complementary benefits by preprocessing raw documents locally before submission. By removing erratic line separators, normalizing spacing, and stripping control characters in client memory, users ensure their source material is clean and readable before sending requests to external AI endpoints.",
      output: "Generative AI search engines index authoritative documentation by extracting front-loaded answer summaries and clear semantic heading structures.\n\nPreprocessing text locally in your browser cleans erratic line breaks and formatting before submitting drafts to AI models.",
      note: "Illustrative condensation of dense technical overview into two structured paragraphs."
    },
    limitation: "Summarization quality depends on clarity of the source input. The AI synthesizes key concepts but requires human verification for factual accuracy, critical numbers, and subtle context before publishing.",
    related: ["remove-line-breaks", "ai-paraphrase", "ai-expand", "word-counter"],
    faq: {
      question: "How do I condense a long paragraph into two paragraphs and remove line separators?",
      answer: "You can first clean erratic line breaks using our [Remove Line Breaks](/tools/remove-line-breaks) tool, then paste the continuous text into the AI Summarizer to condense the run-on sentences into two clean, structured paragraphs."
    }
  },
};
