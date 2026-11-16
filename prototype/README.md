# Nawah (نواة) — clickable prototype

A bilingual (Arabic RTL / English LTR) prototype of a B2B product-sourcing platform for Egypt.
It takes a buyer from product idea → structured spec → RFQ → normalised quote comparison → sample approval → order milestones → delivery and reorder.

**Everything uses fictional demo data.** That covers companies, prices, certificates and metrics. Payments and escrow are not real, and neither are any integrations.

## Run
Open `index.html` in a browser. There is no build step and no server: it is plain JS and the state lives in `localStorage`. Use **Reset demo** in the footer to start over.

## Files
| File | Purpose |
|---|---|
| `data.js` | Categories, request types, fictional suppliers, quotes, templates, glossary |
| `core.js` | State, i18n helpers, icons, router, layout, bound form controls, toasts and modals |
| `views-buyer.js` | Home, onboarding, categories, supplier discovery, dashboard, about, brand, help |
| `builders.js` | Builders for nuts, dishwashing liquid and wooden tables (finished and material mode), plus the template-driven form and the brief assistant |
| `project.js` | Project workspace: quotes, normalised comparison, messages, samples, order and payments, documents |
| `ops.js` | Supplier workspace (RFQs, structured quote builder, profile), ops console (review queue, matching, templates) and global actions |

## Technical handoff (production)
**Core entities:** Organisation (buyer or supplier), User, Role, SupplierProfile, Capability, Certificate(expiry), VerificationCheck(type, date, reviewer, scope), Category, SpecTemplate(fields, version), Project, SpecVersion, RFQ, RFQInvite, Quote, QuoteVersion, QuoteLine, Shortlist, SampleRequest, SampleEvaluation, SampleApprovalRecord, PurchaseOrder, Milestone, Invoice, ChangeRequest, Issue/Dispute, MessageThread, Message(original_lang, translation), Document, Notification, FeeLedger.

**Services:** auth and organisations, catalogue and templates, spec/RFQ, matching (scoring plus ops override), quotes (normalisation engine: units, quantity, VAT basis, completeness), samples, orders and milestones, documents (object storage plus virus scan), messaging and notifications (email, WhatsApp Business, in-app), ops console, analytics.

**Integrations needed:** a licensed Egyptian payment provider, e-invoicing, a translation API, an LLM for brief drafting (no prices or capabilities generated), SMS/WhatsApp, maps and logistics partners, and an inspection partner.

**Simulated here:** supplier replies and timing, matching (rules-based), the assistant, translation (pre-written), payments ("mark paid"), uploads (browser only), and all metrics.
