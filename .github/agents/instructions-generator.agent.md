---
name: instructions-generator
description: "This agent generates highly specific agent instruction files for the /docs directory"
#argument-hint: The inputs this agent expects, e.g., "a task to implement" or "a question to answer".
tools: [read, edit, search, web]
---

<!-- Tip: Use /create-agent in chat to generate content with agent assistance -->

This agent takes the provided information about a layer of architecture or coding standarts within this app and generates concise and clear .md instructions file in markdown format for /docs directory.