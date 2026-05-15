const resources = [
  {
    title: "Research in the Time of AI",
    author: "Paul Goldsmith-Pinkham",
    url: "https://paulgp.com/2026/03/16/research-in-time-of-ai.html",
    topic: "Start Here",
    level: "Beginner",
    type: "Essay",
    audience: "All researchers",
    summary: "A clear map of where AI changes the economics research pipeline, from ideation to publishing.",
    useful: "Best first reading for framing AI as research leverage rather than only automation.",
    tags: ["research pipeline", "economics", "workflow"]
  },
  {
    title: "Some Thoughts on AI and Research",
    author: "Isaiah Andrews",
    url: "https://economics.mit.edu/sites/default/files/2026-04/IA%20AI%20note_3.pdf",
    topic: "Start Here",
    level: "Beginner",
    type: "Memo",
    audience: "PhD students and faculty",
    summary: "Scenario-based advice on how AI may change skill acquisition, research judgment, and economics careers.",
    useful: "Use this to discuss what remains scarce when models get better at coding, writing, and proofs.",
    tags: ["career", "judgment", "graduate students"]
  },
  {
    title: "AI Is Already 10x-ing Academic Research",
    author: "Andrew Hall",
    url: "https://newsletter.rootsofprogress.org/p/ai-is-already-10x-ing-academic-research",
    topic: "Start Here",
    level: "Beginner",
    type: "Essay",
    audience: "All researchers",
    summary: "Argues that AI already increases research productivity when paired with expert direction and open workflows.",
    useful: "Good motivation for moving from casual chatbots to repeatable research systems.",
    tags: ["productivity", "open science", "benchmarks"]
  },
  {
    title: "A User's Guide to GPT and LLMs for Economic Research",
    author: "Anton Korinek",
    url: "https://bcf.princeton.edu/wp-content/uploads/2023/05/A_User_s_Guide_to_GPT_and_LLMs_for_Economic_Research.pdf",
    topic: "Start Here",
    level: "Beginner",
    type: "Guide",
    audience: "Economists",
    summary: "Practical overview of LLM uses in economic research, including ideation, writing, coding, and data work.",
    useful: "A broad entry point for participants who want concrete use cases before installing tools.",
    tags: ["LLM basics", "economics", "prompting"]
  },
  {
    title: "GPT Guide for Economists",
    author: "AEA / economics guide",
    url: "https://www.aeaweb.org/content/file?id=21046",
    topic: "Start Here",
    level: "Beginner",
    type: "Guide",
    audience: "Economists",
    summary: "A compact economist-oriented guide for integrating GPT-style systems into everyday research tasks.",
    useful: "Useful handout for people who want a conventional academic reference.",
    tags: ["economics", "guide", "LLMs"]
  },
  {
    title: "Modern AI for Economics Research: Resources",
    author: "UCSB Economics Agents Workshop",
    url: "https://www.ucsb-econ-agents-workshop.com/slides/10",
    topic: "Start Here",
    level: "Beginner",
    type: "Resource list",
    audience: "Workshop participants",
    summary: "A live workshop resource page collecting papers, guides, and hands-on agentic AI materials for economists.",
    useful: "Good companion list when you want more links after this presentation.",
    tags: ["workshop", "agents", "economics"]
  },
  {
    title: "Claude Code for Economists: Getting Started",
    author: "Paul Goldsmith-Pinkham",
    url: "https://github.com/paulgp/claude-container/blob/master/docs/getting-started.md",
    topic: "Code and Agents",
    level: "Beginner",
    type: "Code starter",
    audience: "Empirical researchers",
    summary: "A container-based setup for using Claude Code in reproducible empirical research environments.",
    useful: "Best starting point for participants who want to try agentic coding without wrecking their machine setup.",
    tags: ["Claude Code", "container", "reproducibility"]
  },
  {
    title: "Claude Code Guide",
    author: "Claes Backman",
    url: "https://claesbackman.com/claude-code-guide.html",
    topic: "Code and Agents",
    level: "Beginner",
    type: "Code starter",
    audience: "Researchers new to coding agents",
    summary: "A pragmatic introduction to using Claude Code for research and development tasks.",
    useful: "A readable first walkthrough for participants who prefer examples over abstract advice.",
    tags: ["Claude Code", "guide", "workflow"]
  },
  {
    title: "AI Agents for Economics Research",
    author: "AI MBA",
    url: "https://ai-mba.io/tutorials/ai-agents-for-economics-research",
    topic: "Code and Agents",
    level: "Beginner",
    type: "Tutorial",
    audience: "Economics researchers",
    summary: "Introduces agentic workflows for economics research, with an emphasis on practical task decomposition.",
    useful: "Good for showing how to move beyond one-off chatbot prompts.",
    tags: ["agents", "economics", "tutorial"]
  },
  {
    title: "Claude Code Changed How I Work",
    author: "Scott Cunningham",
    url: "https://causalinf.substack.com/p/claude-code-changed-how-i-work-part",
    topic: "Code and Agents",
    level: "Intermediate",
    type: "Workflow",
    audience: "Applied economists",
    summary: "A field report on integrating Claude Code into causal inference and empirical research workflows.",
    useful: "Use when discussing how an economist's day-to-day work changes with coding agents.",
    tags: ["Claude Code", "causal inference", "workflow"]
  },
  {
    title: "How I Use Claude Code for Empirical Research",
    author: "Scott Cunningham",
    url: "https://causalinf.substack.com/p/claude-code-part-12-how-i-use-claude",
    topic: "Code and Agents",
    level: "Intermediate",
    type: "Workflow",
    audience: "Empirical researchers",
    summary: "A concrete account of using Claude Code for empirical projects, including iteration and code review habits.",
    useful: "Helpful for researchers who already code and want a realistic workflow model.",
    tags: ["empirical work", "Claude Code", "research process"]
  },
  {
    title: "Claude Code My Workflow",
    author: "Pedro Sant'Anna",
    url: "https://psantanna.com/claude-code-my-workflow/",
    topic: "Code and Agents",
    level: "Intermediate",
    type: "Workflow",
    audience: "Applied econometricians",
    summary: "Personal workflow notes for using Claude Code in applied econometrics and research programming.",
    useful: "Good bridge from demonstration to an economist's actual project habits.",
    tags: ["econometrics", "Claude Code", "coding"]
  },
  {
    title: "Claude Academic Guide",
    author: "Cornwl",
    url: "https://cornwl.github.io/files/claude-academic-guide.html",
    topic: "Code and Agents",
    level: "Intermediate",
    type: "Guide",
    audience: "Academics",
    summary: "A guide for configuring Claude-based academic workflows, including teams, project structure, and skills.",
    useful: "Useful when a participant wants to systematize repeated research tasks.",
    tags: ["Claude", "academic workflow", "skills"]
  },
  {
    title: "CGPT Codex Skills",
    author: "P. V. Sundar Balakrishnan",
    url: "https://github.com/pvsundar/CGPT-CODEX-SKILLS",
    topic: "Code and Agents",
    level: "Advanced",
    type: "Code starter",
    audience: "Academic Codex users",
    summary: "A public collection of reusable Codex skills for academic writing, review, presentation, auditing, and software workflows.",
    useful: "Good source for participants who want to turn recurring research tasks into reusable agent skills.",
    tags: ["Codex skills", "academic workflow", "automation"]
  },
  {
    title: "Research Project Flow",
    author: "Black JL",
    url: "https://black-jl.github.io/Research-Project-Flow/",
    topic: "Code and Agents",
    level: "Intermediate",
    type: "Workflow",
    audience: "Academic researchers",
    summary: "A structured view of how AI can support a research project from question to outputs.",
    useful: "Good for thinking about division of labor between human judgment and AI execution.",
    tags: ["project management", "research flow", "Claude"]
  },
  {
    title: "Roo Code",
    author: "RooVetGit",
    url: "https://github.com/RooVetGit/Roo-Code",
    topic: "Code and Agents",
    level: "Advanced",
    type: "Tool",
    audience: "Technical users",
    summary: "An open-source coding agent environment that gives users multiple AI agent modes inside an editor.",
    useful: "For participants comparing agentic coding tools beyond Claude Code.",
    tags: ["coding agent", "open source", "editor"]
  },
  {
    title: "Karpathy-Style Claude Guidelines",
    author: "Forrest Chang / Andrej Karpathy notes",
    url: "https://github.com/forrestchang/andrej-karpathy-skills/blob/main/CLAUDE.md",
    topic: "Code and Agents",
    level: "Advanced",
    type: "Prompting",
    audience: "Technical users",
    summary: "A concise set of instructions for steering Claude Code toward better engineering behavior.",
    useful: "Good example of how system instructions shape agent reliability.",
    tags: ["CLAUDE.md", "instructions", "agent behavior"]
  },
  {
    title: "Claude Code Skills for Academics",
    author: "Alessandro Spina",
    url: "https://github.com/aspi6246/Claude-Code-Skills-for-Academics/tree/main/beamer-slides-teaching",
    topic: "Code and Agents",
    level: "Advanced",
    type: "Code starter",
    audience: "Academic power users",
    summary: "Reusable Claude Code skills for academic tasks such as teaching slides and research workflows.",
    useful: "Shows how academics can package repeated workflows as reusable AI skills.",
    tags: ["skills", "academic work", "automation"]
  },
  {
    title: "Academic PPTX Skill",
    author: "Gabberflast",
    url: "https://github.com/Gabberflast/academic-pptx-skill/blob/main/SKILL.md",
    topic: "Teaching and Communication",
    level: "Intermediate",
    type: "Code starter",
    audience: "Presenters and teachers",
    summary: "A Claude skill for producing academic PowerPoint presentations from structured instructions.",
    useful: "Relevant for participants who want to turn research outputs into talks quickly.",
    tags: ["presentations", "slides", "Claude skills"]
  },
  {
    title: "Writing and Thinking with AI Assistance",
    author: "Paul Goldsmith-Pinkham",
    url: "https://paulgp.substack.com/p/writing-and-thinking-with-ai-assistance",
    topic: "Writing and Papers",
    level: "Beginner",
    type: "Guide",
    audience: "Researchers and writers",
    summary: "Part of a Claude Code for economists series, focused on writing, analysis, and thought partnership.",
    useful: "Strong reading for people who think AI is only useful for coding.",
    tags: ["writing", "thinking", "Claude"]
  },
  {
    title: "LLM-Friendly Academic Papers",
    author: "Paul Goldsmith-Pinkham",
    url: "https://paulgp.substack.com/p/llm-friendly-academic-papers-a-proposal",
    topic: "Writing and Papers",
    level: "Intermediate",
    type: "Proposal",
    audience: "Authors and journal editors",
    summary: "A proposal for making academic papers easier for LLMs to parse, inspect, and build on.",
    useful: "Use when discussing how publication formats may adapt to machine readers.",
    tags: ["LLM readability", "publishing", "paper design"]
  },
  {
    title: "llms.txt",
    author: "Jeremy Howard and contributors",
    url: "https://llmstxt.org/",
    topic: "Writing and Papers",
    level: "Intermediate",
    type: "Standard",
    audience: "Authors and web maintainers",
    summary: "A proposed convention for making website content easier for language models to discover and use.",
    useful: "Practical reference for researchers who publish web-based documentation or papers.",
    tags: ["discoverability", "web", "LLMs"]
  },
  {
    title: "GPT Prompt Collection",
    author: "linexjlin",
    url: "https://github.com/linexjlin/GPTs",
    topic: "Writing and Papers",
    level: "Beginner",
    type: "Prompting",
    audience: "Prompt experimenters",
    summary: "A public collection of GPT prompts and GPT-style workflows.",
    useful: "Useful as inspiration, with the caveat that prompts should be adapted to the research task.",
    tags: ["prompts", "GPTs", "experimentation"]
  },
  {
    title: "AI One-Shot Papers",
    author: "Paul Goldsmith-Pinkham",
    url: "https://paulgp.substack.com/p/ai-one-shot-papers",
    topic: "Automated Research",
    level: "Intermediate",
    type: "Essay",
    audience: "Empirical economists",
    summary: "Critiques automated policy evaluation workflows and argues that many lean heavily on diff-in-diff designs.",
    useful: "Important cautionary piece for evaluating AI-generated empirical papers.",
    tags: ["policy evaluation", "diff-in-diff", "APE"]
  },
  {
    title: "The APE Project",
    author: "Social Catalyst Lab",
    url: "https://ape.socialcatalystlab.org/",
    topic: "Automated Research",
    level: "Intermediate",
    type: "Project",
    audience: "Empirical researchers",
    summary: "A project exploring autonomous policy evaluation and AI-generated empirical research papers.",
    useful: "Use this as the central case study for what automated empirical research can and cannot do.",
    tags: ["APE", "policy evaluation", "autonomous research"]
  },
  {
    title: "Too Small by Design",
    author: "APEP Autonomous Research",
    url: "https://ape.socialcatalystlab.org/papers/apep_0727/v4/paper.pdf",
    topic: "Automated Research",
    level: "Advanced",
    type: "Paper",
    audience: "Applied micro researchers",
    summary: "An autonomous policy-evaluation paper on German solar policy thresholds and bunching behavior.",
    useful: "Good concrete example for discussing the quality and limits of AI-produced empirical papers.",
    tags: ["autonomous paper", "climate policy", "bunching"]
  },
  {
    title: "A Comparison of Agentic AI Systems and Human Economists",
    author: "Serafin Grundl",
    url: "https://ssrn.com/abstract=6219138",
    topic: "Automated Research",
    level: "Advanced",
    type: "Paper",
    audience: "Researchers evaluating agents",
    summary: "Compares agentic AI systems with human economists on research-like tasks.",
    useful: "Relevant for evidence-based discussion of agent performance instead of vibes alone.",
    tags: ["agent evaluation", "economists", "SSRN"]
  },
  {
    title: "Vibe Econometrics and the Analysis Contract",
    author: "SSRN paper",
    url: "https://ssrn.com/abstract=6699999",
    topic: "Automated Research",
    level: "Advanced",
    type: "Paper",
    audience: "Econometricians",
    summary: "A paper on AI-assisted empirical analysis and the need to formalize commitments in the research workflow.",
    useful: "Useful for discussing auditability, pre-analysis discipline, and model-generated code.",
    tags: ["econometrics", "analysis contract", "audit"]
  },
  {
    title: "Deep Learning for Economists",
    author: "arXiv paper",
    url: "https://arxiv.org/pdf/2407.15339",
    topic: "Economic Papers",
    level: "Intermediate",
    type: "Paper",
    audience: "Economists",
    summary: "A paper-length introduction to deep learning concepts and applications for economics.",
    useful: "Good technical bridge for economists who know statistics but not modern deep learning.",
    tags: ["deep learning", "economics", "methods"]
  },
  {
    title: "Behavioral LLMs",
    author: "Nature",
    url: "https://www.nature.com/articles/s41586-025-09215-4#code-availability",
    topic: "Economic Papers",
    level: "Advanced",
    type: "Paper",
    audience: "Behavioral and computational social scientists",
    summary: "A Nature article and code-availability page on behavioral modeling with large language models.",
    useful: "Good example of LLMs as behavioral models rather than only productivity tools.",
    tags: ["behavior", "LLMs", "Nature"]
  },
  {
    title: "MIT Paper on AI Negotiations",
    author: "MIT / arXiv",
    url: "https://arxiv.org/pdf/2503.06416v1",
    topic: "Economic Papers",
    level: "Advanced",
    type: "Paper",
    audience: "Game theorists and market designers",
    summary: "Research on AI systems in negotiation settings.",
    useful: "Use this for participants interested in strategic interaction between AI agents.",
    tags: ["negotiation", "agents", "game theory"]
  },
  {
    title: "More Versus Better: AI Incentives and the Emerging Crisis",
    author: "Claudine Gartenberg, Sharique Hasan, Alex Murray, Lamar Pierce",
    url: "https://doi.org/10.1287/orsc.2026.ed.v37.n3",
    topic: "Publishing and Incentives",
    level: "Advanced",
    type: "Paper",
    audience: "Research leaders and editors",
    summary: "Analyzes how AI changes incentives in knowledge production, with a focus on quantity versus quality.",
    useful: "Best academic anchor for discussing institutional response rather than individual productivity.",
    tags: ["incentives", "publishing", "quality"]
  },
  {
    title: "Academics Need to Wake Up on AI",
    author: "Alexander Kustov",
    url: "https://www.popularbydesign.org/p/academics-need-to-wake-up-on-ai",
    topic: "Publishing and Incentives",
    level: "Beginner",
    type: "Opinion",
    audience: "Academics",
    summary: "A provocative set of theses about how AI changes social science research and academic status games.",
    useful: "Good discussion starter when the room needs a sharper claim.",
    tags: ["academia", "opinion", "social science"]
  },
  {
    title: "Academics Need to Wake Up on AI, Part II",
    author: "Alexander Kustov",
    url: "https://www.popularbydesign.org/p/academics-need-to-wake-up-on-ai-part",
    topic: "Publishing and Incentives",
    level: "Intermediate",
    type: "Opinion",
    audience: "Academics",
    summary: "Reflects on responses to the first essay and clarifies the argument about AI and academic work.",
    useful: "Use after the first essay if participants want the backlash and refinement.",
    tags: ["academia", "debate", "AI use"]
  },
  {
    title: "Academics Need to Wake Up on AI, Part III",
    author: "Alexander Kustov",
    url: "https://www.popularbydesign.org/p/academics-need-to-wake-up-on-ai-part-4c6",
    topic: "Publishing and Incentives",
    level: "Advanced",
    type: "Opinion",
    audience: "Academics",
    summary: "Moves from diagnosis to what academics can and cannot do as AI lowers the cost of producing research-like work.",
    useful: "Useful for a closing debate on status, quality, and what humans still contribute.",
    tags: ["academia", "quality", "future of research"]
  },
  {
    title: "Research and Publishing Are Now Two Different Things",
    author: "Scott Cunningham",
    url: "https://causalinf.substack.com/p/claude-code-27-research-and-publishing",
    topic: "Publishing and Incentives",
    level: "Intermediate",
    type: "Opinion",
    audience: "Researchers and editors",
    summary: "A near-future thought experiment on how coding agents may increase research output while publication remains scarce.",
    useful: "Good for separating knowledge production from journal bottlenecks.",
    tags: ["publishing", "Claude Code", "journals"]
  },
  {
    title: "Who Checks the Magic Square?",
    author: "Ulrich Atz",
    url: "https://ulrichatz.org/blog/2026-05-01-bottlenecks-to-science/",
    topic: "Publishing and Incentives",
    level: "Advanced",
    type: "Essay",
    audience: "Social scientists",
    summary: "Argues that verification quality is a central bottleneck for social science in an AI-rich world.",
    useful: "Excellent source for the question: if research gets cheaper, who checks it?",
    tags: ["verification", "peer review", "science"]
  },
  {
    title: "The AI Scientist",
    author: "The Conversation",
    url: "https://theconversation.com/the-ai-scientist-now-academic-papers-can-be-fully-automated-what-does-this-mean-for-the-future-of-research-282161",
    topic: "Publishing and Incentives",
    level: "Beginner",
    type: "Article",
    audience: "General academic audience",
    summary: "Accessible overview of automated scientific discovery systems and what they imply for research.",
    useful: "Good nontechnical reading for participants new to agentic AI in science.",
    tags: ["AI scientist", "automation", "science"]
  },
  {
    title: "Recent Pieces on AI and Research",
    author: "Claes Backman",
    url: "https://claesbackman.substack.com/p/recent-pieces-on-ai-and-research",
    topic: "Publishing and Incentives",
    level: "Beginner",
    type: "Reading list",
    audience: "Academics",
    summary: "A short curated note connecting recent arguments about AI, academia, and research quality.",
    useful: "Good lightweight bridge to several of the debate pieces.",
    tags: ["reading list", "academia", "AI research"]
  },
  {
    title: "OpenAIReview",
    author: "OpenAIReview",
    url: "https://openaireview.org/",
    topic: "Review and Quality",
    level: "Beginner",
    type: "Tool",
    audience: "Authors and reviewers",
    summary: "An AI-assisted academic paper review tool.",
    useful: "Easy demonstration of how AI can help inspect drafts before submission.",
    tags: ["paper review", "feedback", "tool"]
  },
  {
    title: "coarse.ink",
    author: "David Van Dijcke",
    url: "https://coarse.ink/",
    topic: "Review and Quality",
    level: "Beginner",
    type: "Tool",
    audience: "Authors and reviewers",
    summary: "A free AI academic paper-review interface surfaced in the recent AI research debate.",
    useful: "Good practical tool for participants who want immediate feedback on a draft.",
    tags: ["paper review", "academic writing", "tool"]
  },
  {
    title: "Reviewer",
    author: "Ingar30",
    url: "https://github.com/Ingar30/reviewer",
    topic: "Review and Quality",
    level: "Advanced",
    type: "Code starter",
    audience: "Economists and reviewers",
    summary: "A reproducible multi-agent reviewer for academic economics papers, with preprocessing, reviewer prompts, validation, normalization, and editor report assembly.",
    useful: "Best for people who want a local, inspectable paper-review pipeline rather than a hosted review tool.",
    tags: ["paper review", "multi-agent", "economics"]
  },
  {
    title: "Crossref Reference Checker",
    author: "Jussi Aalto",
    url: "https://github.com/jusi-aalto/crossref",
    topic: "Review and Quality",
    level: "Advanced",
    type: "Tool",
    audience: "Authors and editors",
    summary: "A tool for checking whether references are real and traceable through Crossref.",
    useful: "Useful safeguard against hallucinated or malformed references.",
    tags: ["references", "hallucination", "Crossref"]
  },
  {
    title: "Proof Benchmark",
    author: "VALS AI",
    url: "https://www.vals.ai/benchmarks/proof_bench",
    topic: "Math and Proofs",
    level: "Advanced",
    type: "Benchmark",
    audience: "Theorists and formal methods users",
    summary: "Benchmark for evaluating AI systems on proof-oriented tasks.",
    useful: "Good empirical anchor for claims about AI reasoning and mathematical proof.",
    tags: ["proofs", "benchmark", "reasoning"]
  },
  {
    title: "A Recent Experience with ChatGPT 5.5 Pro",
    author: "Timothy Gowers",
    url: "https://gowers.wordpress.com/2026/05/08/a-recent-experience-with-chatgpt-5-5-pro/",
    topic: "Math and Proofs",
    level: "Advanced",
    type: "Essay",
    audience: "Mathematicians and theorists",
    summary: "A detailed account of ChatGPT producing a substantial mathematical improvement in additive combinatorics.",
    useful: "Strong case study for discussing when AI reasoning begins to look like original research.",
    tags: ["mathematics", "proofs", "ChatGPT"]
  },
  {
    title: "LLM-Generated Proof",
    author: "arXiv",
    url: "https://arxiv.org/abs/2410.00315",
    topic: "Math and Proofs",
    level: "Advanced",
    type: "Paper",
    audience: "Theorists",
    summary: "Research paper on LLM-generated mathematical proof.",
    useful: "Useful for a more technical discussion of proof generation beyond anecdotes.",
    tags: ["proof generation", "arXiv", "LLMs"]
  },
  {
    title: "DeepSeek-Prover-V2 Testing",
    author: "Apidog",
    url: "https://apidog.com/blog/deepseek-prover-v2-671b/",
    topic: "Math and Proofs",
    level: "Advanced",
    type: "Article",
    audience: "Technical users",
    summary: "A quick look at DeepSeek-Prover-V2 and its mathematical proving capabilities.",
    useful: "Good context for participants curious about specialized proof models.",
    tags: ["DeepSeek", "proofs", "model testing"]
  },
  {
    title: "Natural Math",
    author: "Natural Math",
    url: "https://naturalmath.com/",
    topic: "Math and Proofs",
    level: "Intermediate",
    type: "Project",
    audience: "Mathematicians and formal methods users",
    summary: "A project focused on natural-language mathematical reasoning and tooling.",
    useful: "Helpful pointer for the bridge between informal math and formal verification.",
    tags: ["math", "formalization", "reasoning"]
  },
  {
    title: "Awesome Econ AI Stuff",
    author: "Antonio Mele",
    url: "https://meleantonio.github.io/awesome-econ-ai-stuff/",
    topic: "Resource Lists",
    level: "Beginner",
    type: "Resource list",
    audience: "Economists",
    summary: "A broad curated list of AI resources for economics and related research.",
    useful: "Best onward path for participants who want many more links.",
    tags: ["awesome list", "economics", "AI"]
  },
  {
    title: "AI for Economists",
    author: "Jesse Lastunen",
    url: "https://policy.fi/ai-econ/",
    topic: "Resource Lists",
    level: "Beginner",
    type: "Resource list",
    audience: "Economists",
    summary: "A categorized resource hub for AI in economics, including papers, tools, and teaching materials.",
    useful: "Good complement to this page, especially for newer resources.",
    tags: ["economics", "resource hub", "LLMs"]
  },
  {
    title: "AI Resources for Academic Research",
    author: "Jukka Sihvonen",
    url: "https://www.linkedin.com/pulse/ai-resources-academic-research-curated-list-jukka-sihvonen-hijpf",
    topic: "Resource Lists",
    level: "Beginner",
    type: "Resource list",
    audience: "Academics",
    summary: "A curated LinkedIn list of AI tools and references for academic research.",
    useful: "Useful for people who want an expansive tool catalogue.",
    tags: ["resource list", "tools", "academia"]
  },
  {
    title: "KI Tools fuer Oekonomen",
    author: "Gen-LI",
    url: "https://gen-li.notion.site/339195e07a238020b8aae6b5a1661f08?v=339195e07a2380c0ad01000c92c92011",
    topic: "Resource Lists",
    level: "Beginner",
    type: "Resource list",
    audience: "German-speaking economists",
    summary: "A German-language Notion resource list for AI tools relevant to economists.",
    useful: "Handy for German-speaking participants who want locally accessible resources.",
    tags: ["German", "tools", "economics"]
  },
  {
    title: "Kevin Bryan's Tools",
    author: "Kevin Bryan",
    url: "https://kevinbryanecon.com/tools.html",
    topic: "Resource Lists",
    level: "Beginner",
    type: "Resource list",
    audience: "Economists",
    summary: "A practical page of research tools maintained by an economist.",
    useful: "Useful broader context for integrating AI tools with standard research infrastructure.",
    tags: ["tools", "economics", "research"]
  },
  {
    title: "EconPapers",
    author: "Eduard Bruell",
    url: "https://econpapers.eduard-bruell.de",
    topic: "Resource Lists",
    level: "Beginner",
    type: "Tool",
    audience: "Economists",
    summary: "A tool for discovering and tracking economics papers.",
    useful: "Good for combining AI-assisted reading with paper discovery.",
    tags: ["papers", "discovery", "economics"]
  },
  {
    title: "Resources for Economists and AI Users",
    author: "Claes Backman",
    url: "https://claesbackman.com/resources.html",
    topic: "Resource Lists",
    level: "Beginner",
    type: "Resource list",
    audience: "Economists and PhD students",
    summary: "A broad economics research resource page with sections on AI, Claude Code, coding-agent workflows, writing, publishing, refereeing, and data visualization.",
    useful: "A strong second-stop resource after this page because it mixes AI-specific links with classic research craft advice.",
    tags: ["resource list", "economics", "Claude Code"]
  },
  {
    title: "Inducing Sustained Creativity and Diversity in Large Language Models",
    author: "Queenie Luo, Gary King, Michael Puett, Michael D. Smith",
    url: "https://arxiv.org/abs/2603.19519",
    topic: "Economic Papers",
    level: "Advanced",
    type: "Paper",
    audience: "Researchers using LLMs for exploration",
    summary: "An arXiv paper proposing a decoding scheme for keeping LLM outputs diverse and creative across long exploratory search tasks.",
    useful: "Useful for research ideation workflows where the goal is to explore many non-obvious alternatives rather than get one conventional answer.",
    tags: ["creativity", "exploratory search", "LLMs"]
  },
  {
    title: "AI Academy: Unstructured to Structured Data",
    author: "Google Slides",
    url: "https://docs.google.com/presentation/d/1kUf2MZUf8O9A5UPX5VCZIjblwlJVMe_bubzdPHnY2z8/mobilepresent",
    topic: "Teaching and Communication",
    level: "Beginner",
    type: "Slides",
    audience: "Researchers and analysts",
    summary: "Slides on using AI to move from unstructured information to structured data.",
    useful: "Practical demonstration topic for empirical researchers handling messy text.",
    tags: ["structured data", "slides", "AI academy"]
  },
  {
    title: "ChatGPT in Teaching",
    author: "Harvard Business Publishing Education",
    url: "https://hbsp.harvard.edu/",
    topic: "Teaching and Communication",
    level: "Beginner",
    type: "Teaching",
    audience: "Teachers",
    summary: "Teaching-oriented material on incorporating ChatGPT into classroom practice.",
    useful: "For participants interested in AI beyond research production.",
    tags: ["teaching", "ChatGPT", "classroom"]
  }
];

const pathFilters = {
  beginner: { level: "Beginner", topic: "All topics", type: "All types" },
  empirical: { level: "All levels", topic: "Code and Agents", type: "All types" },
  advanced: { level: "Advanced", topic: "All topics", type: "All types" }
};

const state = {
  search: "",
  topic: "All topics",
  level: "All levels",
  type: "All types"
};

const els = {
  search: document.querySelector("#search"),
  topic: document.querySelector("#topic"),
  level: document.querySelector("#level"),
  type: document.querySelector("#type"),
  resources: document.querySelector("#resources"),
  count: document.querySelector("#result-count"),
  clear: document.querySelector("#clear")
};

function uniqueOptions(key, label) {
  return [label, ...Array.from(new Set(resources.map((item) => item[key]))).sort()];
}

function populateSelect(select, options) {
  select.innerHTML = options.map((option) => `<option value="${option}">${option}</option>`).join("");
}

function normalize(value) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function matches(item) {
  const haystack = normalize([
    item.title,
    item.author,
    item.topic,
    item.level,
    item.type,
    item.audience,
    item.summary,
    item.useful,
    item.tags.join(" ")
  ].join(" "));

  return (
    (!state.search || haystack.includes(normalize(state.search))) &&
    (state.topic === "All topics" || item.topic === state.topic) &&
    (state.level === "All levels" || item.level === state.level) &&
    (state.type === "All types" || item.type === state.type)
  );
}

function badgeClass(level) {
  return level.toLowerCase();
}

function render() {
  const filtered = resources.filter(matches);
  els.count.textContent = `${filtered.length} of ${resources.length} resources shown`;

  if (!filtered.length) {
    els.resources.innerHTML = `<div class="empty">No resources match those filters. Try clearing one filter or searching a broader term.</div>`;
    return;
  }

  els.resources.innerHTML = filtered.map((item) => `
    <article class="card">
      <div class="badges">
        <span class="badge topic">${item.topic}</span>
        <span class="badge ${badgeClass(item.level)}">${item.level}</span>
        <span class="badge">${item.type}</span>
      </div>
      <div>
        <h3>${item.title}</h3>
        <p class="byline">${item.author} · ${item.audience}</p>
      </div>
      <p class="summary">${item.summary}</p>
      <p class="useful"><strong>Use it for:</strong> ${item.useful}</p>
      <a href="${item.url}" target="_blank" rel="noreferrer">Open original source</a>
    </article>
  `).join("");
}

function syncControls() {
  els.search.value = state.search;
  els.topic.value = state.topic;
  els.level.value = state.level;
  els.type.value = state.type;
}

function updateFromControls() {
  state.search = els.search.value.trim();
  state.topic = els.topic.value;
  state.level = els.level.value;
  state.type = els.type.value;
  render();
}

populateSelect(els.topic, uniqueOptions("topic", "All topics"));
populateSelect(els.level, uniqueOptions("level", "All levels"));
populateSelect(els.type, uniqueOptions("type", "All types"));

els.search.addEventListener("input", updateFromControls);
els.topic.addEventListener("change", updateFromControls);
els.level.addEventListener("change", updateFromControls);
els.type.addEventListener("change", updateFromControls);
els.clear.addEventListener("click", () => {
  state.search = "";
  state.topic = "All topics";
  state.level = "All levels";
  state.type = "All types";
  syncControls();
  render();
});

document.querySelectorAll(".path").forEach((button) => {
  button.addEventListener("click", () => {
    const filters = pathFilters[button.dataset.path];
    Object.assign(state, filters, { search: "" });
    syncControls();
    render();
    document.querySelector(".controls").scrollIntoView({ block: "start" });
  });
});

render();
