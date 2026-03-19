#!/bin/bash
# Opens all directory submission URLs in your default browser
# Run: bash scripts/open-submissions.sh

echo "Opening directory submission pages..."
echo ""

# Tier 1 — Free, submit today
echo "=== TIER 1: FREE (Submit Today) ==="

echo "1. SaaSHub (Free, Dofollow DR 76)"
xdg-open "https://www.saashub.com/submit" 2>/dev/null || open "https://www.saashub.com/submit" 2>/dev/null
sleep 2

echo "2. G2 (Free, DR 91, 2.6M visitors)"
xdg-open "https://sell.g2.com/create-a-profile" 2>/dev/null || open "https://sell.g2.com/create-a-profile" 2>/dev/null
sleep 2

echo "3. AlternativeTo (Free, DR 79)"
xdg-open "https://alternativeto.net" 2>/dev/null || open "https://alternativeto.net" 2>/dev/null
sleep 2

echo "4. Capterra (Free, DR 90)"
xdg-open "https://www.capterra.com/vendors/sign-up" 2>/dev/null || open "https://www.capterra.com/vendors/sign-up" 2>/dev/null
sleep 2

echo "5. Peerlist (Free, DR 75)"
xdg-open "https://peerlist.io/launchpad" 2>/dev/null || open "https://peerlist.io/launchpad" 2>/dev/null
sleep 2

echo "6. BetaList (Free, Dofollow DR 75)"
xdg-open "https://betalist.com" 2>/dev/null || open "https://betalist.com" 2>/dev/null
sleep 2

echo ""
echo "=== TIER 2: PAID (Submit This Week) ==="

echo "7. There's An AI For That (\$347)"
xdg-open "https://theresanaiforthat.com/submit/" 2>/dev/null || open "https://theresanaiforthat.com/submit/" 2>/dev/null
sleep 2

echo "8. Toolify.ai (\$99, Dofollow)"
xdg-open "https://www.toolify.ai/submit" 2>/dev/null || open "https://www.toolify.ai/submit" 2>/dev/null
sleep 2

echo "9. TopAI.Tools (\$39)"
xdg-open "https://topai.tools/submit" 2>/dev/null || open "https://topai.tools/submit" 2>/dev/null
sleep 2

echo ""
echo "=== COPY-PASTE DESCRIPTION ==="
echo ""
echo "Short (60 chars): AI control plane for enterprise workflow automation"
echo ""
echo "Standard (260 chars): QorSync AI is an autonomous enterprise control plane where AI agents handle operational workflows across ERP, CRM, ITSM, and custom APIs with risk-tiered human approvals at critical decision points."
echo ""
echo "Categories: Enterprise AI, Workflow Automation, AI Agents, Business Process Automation"
echo "Alternative to: Zapier, UiPath, ServiceNow, Microsoft Power Automate"
echo ""
echo "Tools to highlight:"
echo "  https://qorsync.online/tools/approval-workflow-roi-calculator"
echo "  https://qorsync.online/tools/agent-governance-risk-matrix"
echo "  https://qorsync.online/tools/automation-readiness-assessment"
echo ""
echo "=== SOCIAL POSTS ==="
echo ""
echo "10. Google Search Console — Request Indexing"
xdg-open "https://search.google.com/search-console" 2>/dev/null || open "https://search.google.com/search-console" 2>/dev/null
sleep 2

echo "11. Bing Webmaster Tools"
xdg-open "https://www.bing.com/webmasters" 2>/dev/null || open "https://www.bing.com/webmasters" 2>/dev/null
sleep 2

echo ""
echo "Done! All pages opened. Use the copy-paste descriptions above for each form."
echo "LinkedIn posts are in: docs/LINKEDIN_POSTS_READY.md"
echo "Reddit/HN posts are in: docs/REDDIT_HN_POSTS_READY.md"
