<h3 align="center">PeopleCert Self-Service Portal — Sitecore Search Demo</h3>

<p align="center">
 A PeopleCert-branded self-service support portal demo built on top of the Sitecore Search JS SDK for React.
  <br>
  <br>

# PeopleCert Self-Service Portal (Demo)

This repository is a customer-demo fork of the Sitecore Search JS SDK starter kit, re-skinned
and re-information-architected as a **PeopleCert Support Center**. It showcases five core
capabilities that a modern self-service portal needs:

1. **Self-service support experience** — Help-Center home, big search, intent tiles, AI answer, deflection CTAs.
2. **Strong search relevance** — Predictive PreviewSearch, faceted SearchResults, sort, active-filter chips.
3. **Consistent answers across channels** — one AI Answer, one result set, one article page, all from the same index.
4. **Single-source-of-truth architecture** — every surface queries the same Sitecore Search domain; an optional dev overlay proves it.
5. **Future extensibility** — role/audience switcher, language selector, and well-scoped widgets ready for RAG, Personalize, or a chat assistant.

All Sitecore Search widget IDs from the original starter kit are preserved (`rfkid_6`,
`rfkid_7`, `rfkid_qa`, `search_seo`, `home_hero`, `highlight_title`, `faqs_title`,
`search_home_highlights_articles`), so no CEC configuration changes are required.

## Table of contents

- [Demo script](#demo-script)
- [Prerequisites](#prerequisites)
- [Quick start](#quick-start)
- [Pages](#Pages)
    - [Home](#Home)
    - [Search](#Search)
    - [Content detail page](#Content-detail-page)
- [Events](#Events)
    - [Monitoring example](#Monitoring-example)
- [Future extensibility](#future-extensibility)
- [Documentation](#learn-more)

## Demo script

The demo is designed to be walked through in 5–7 minutes. Each pillar maps to a specific
surface in the app; the checklist below is the recommended talk track.

### 1. Self-service support experience — Home (`/`)

- Open the app. You land on the **PeopleCert Support Center** hero.
- Point out:
  - Role-aware headline ("How can we help, professional?") — the audience switcher in the hero and in the top bar drives this and sets a `PageController` attribute that CEC relevance rules can target.
  - A big **PreviewSearch** input with example questions below it (the `rfkid_6` widget).
  - **Browse by topic** intent tiles — deep-link directly into `/search` with pre-applied keyphrases.
  - **Most-asked questions** (the `rfkid_qa` Questions widget, restyled as an accordion of Q&As generated from the knowledge base).
  - **Popular solutions** — trending articles (`search_home_highlights_articles`).
  - **Still need help?** deflection CTA to human support.

### 2. Strong search relevance — Header PreviewSearch & `/search`

- Type a question in the hero or top-bar input (e.g. *"How do I reschedule my ITIL exam?"*).
- Point out:
  - Suggestions appear in real time (Sitecore's suggestion blocks).
  - Submit the query to reach `/search`.
  - Facets on the left (content type, certification, language, audience) narrow the result set.
  - Active-filter chips, sort selector, and results-per-page controls.
  - Zero-result state: a clean deflection panel with "Contact support".

### 3. Consistent answers across channels — AI Answer on `/search`

- On `/search?q=...`, the **AI Answer** card sits above the result list:
  - It is powered by the same `rfkid_qa` widget used on the home page — one Q&A surface, multiple placements.
  - A **Sources** strip shows 2–3 citations that link back to articles in the same index.
  - The `People also ask` accordion exposes related questions.
- Demo narrative: *"the same index answers the question, feeds the results grid, and backs the detail page — candidates get one answer, whether they asked, browsed, or followed a citation."*

### 4. Single source of truth — click any citation → `/detail/:id`

- Click one of the AI Answer sources. You land on the article detail page:
  - Breadcrumb is derived from the article's `type` so users can navigate back up.
  - The article body is the canonical source the AI used.
  - **Was this helpful?** dispatches a custom event (see §6) so feedback improves relevance.
  - **Related articles** at the bottom use the same index with a filter on the article's type.
- Demo narrative: *"there is no separate help-desk CMS, no duplicate content, and no second search index. Everything the portal shows comes from the Sitecore Search domain you already configured."*

### 5. Future extensibility — audience switcher and `?debug=1`

- Toggle the **audience switcher** (Professional / Organization / Partner) in the hero or top bar.
  - The hook writes the choice to `PageController.getContext().setAttribute('audience', ...)`.
  - A CEC relevance rule or a Sitecore Personalize integration can read this attribute to re-rank results.
- Append `?debug=1` to any URL to reveal the **Sitecore Search event monitor** in the bottom-right.
  - Every API call the SDK makes is shown with method, endpoint, status and latency.
  - Custom events (e.g. the article-feedback event) appear as `CUSTOM` entries.
  - Use this to prove that **all surfaces go through a single telemetry funnel** into CEC analytics.

## Future extensibility

The codebase is structured so these additions are drop-in, with no rework of the existing widgets:

| Area | What to add | Where it plugs in |
|---|---|---|
| True RAG / generative answers | Replace the `rfkid_qa` AI Answer card with a server route calling an LLM (e.g. OpenAI / Anthropic) seeded with the top-N `SearchResults` passages. | `src/widgets/QuestionsAnswers/` swap-in (keep the same `AiAnswerCard` shell with `Sources`). |
| Personalize | Read the `audience` attribute set by `useAudience` and boost/segment content in CEC or via Sitecore Personalize decisioning. | `src/hooks/useAudience.js`. |
| Chat assistant | Mount an ai12z-style assistant on every page; let it call the same `useSearchResults` hook for retrieval. | `src/App.jsx` below the Router. |
| Multi-source federation | Add CEC sources for product pages, policies, service-desk KB; expose them as a `source` facet. | `src/widgets/components/SearchFacets/`. |
| Analytics | Pipe the `pc:feedback` custom event (fired by `WasThisHelpful`) into your data warehouse or Sitecore CDP. | `src/components/WasThisHelpful/`. |

## Prerequisites
### Node.js

The Search Starter Kit needs to have Node.js installed to build the project. We recommend using the LTS version of Node.js. You can find the latest version of Node.js [here](https://nodejs.org/en/).

### Environment variables

The Sitecore Search Starter Kit needs some environment variables to work. You can get the values for them in the [Developers resources section](https://doc.sitecore.com/discover/en/developers/discover-developer-guide/index_en.html?contextId=apiaccess) of Customer Engagement Console (CEC). For full functionality, create a **.env** file in the root of the project and add the following environment variables.

The following variables should exist within the **.env** file:

```
VITE_SEARCH_ENV=<environment - Expected values: prod, staging, prodEu or apse2 >
VITE_SEARCH_CUSTOMER_KEY=<customer key>
VITE_SEARCH_API_KEY=<API key provided in CEC>
VITE_SEARCH_PATH=<Path for the site>. This variable is optional, use it only if the site domain also includes an extra path.
```

### CEC configuration

The account that will be used must have an initial configuration that needs to be made on CEC:

#### Sources

Information sources must be entered and processed in CEC, to populate the content catalog.

#### Suggestion Blocks

Suggestions blocks must have a field named `title_context_aware` (this needs to be configured for the `preview search widget`).
The following picture shows a sample configuration:

![Suggestion Blocks](https://developers.sitecorecloud.io/search-sdk/suggestion-blocks.png)

#### Sorting options

Sorting options must include `featured_desc` and `featured_asc` criteria pre-configured. The picture shows how it should look on CEC:

![Sorting options](https://developers.sitecorecloud.io/search-sdk/sorting-options.png)

Remember to reindex the relevant sources after configuring a new sorting option.

#### Pre configured widgets

The account must have the following widgets created before:

| Name                                 | ID                              | Type           | Description                                                                                                                                                                                   | Used in                |
|--------------------------------------|---------------------------------|----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------|
| [Search Results Page] Search Results | `rfkid_7`                         | `Search Results` | Search results widget. Will include a grid with the results together with the avility to filter results by different facets.                                                                  | `/search`, `/detail/*` |
| Preview Search                       | `rfkid_6`                         | `Preview Search` | It is an input that does a quick search over the content. It is included on the page header.                                                                                                  | Every page             |
| SEO                                  | `search_seo`                      | `SEO`           | A SEO widget.                                                                                                                                                                                 | Every page             |
| Home Hero                            | `home_hero`                      | `HTML Block`     | An html block that appears at the home hero. It has rules to show content dependending on the language selected.                                                                              | `/`                    |
| FAQs Title                           | `faqs_title`                      | `HTML Block`     | An html block with the title of the "Frequently asked questions" section.                                                                                                                     | `/`                    |
| Highlight Title                      | `highlight_title`                 | `HTML Block`     | An html block with the title of the "Highlighted Articles" section.                                                                                                                           | `/`                    |
| Search Home Highlights Articles      | `search_home_highlights_articles` | `Search Results` | Search Results widget used on the "Highlighted Articles section".                                                                                                                             | `/`                    |
| N/A                                  | `rfkid_qa`                        | `Questions`      | This widget appears on the home page, used on the "Frequently Asked Questions" or in the search page. Please ask for support if this does not appears as it is still an experimental feature. | `/` , `/search`        |

Please, check our [demo website](https://developers.sitecorecloud.io/search-sdk/react/website) to check and visualize the different widgets. 

## Quick start

To start using `Sitecore Search Starter Kit`:
1. Install [Node.js](htts://nodejs.org/en/). We recommend the LTS version.
2. Clone the repository: `git clone git@github.com:Sitecore/Sitecore-Search-JS-SDK-Starter-Kit.git`.
3. In the repository, to install all dependencies, run `npm install`.
4. In the root of the project, create a `.env` file then add the following environment variables to it:
```
VITE_SEARCH_ENV=<environment - Expected values: prod, staging or prodEu >
VITE_SEARCH_CUSTOMER_KEY=<customer key>
VITE_SEARCH_API_KEY=<API key provided in CEC>
VITE_SEARCH_PATH=<Path for the site> (optional)
```

5.  To start the development server, run `npm run dev`.
6.  To view the site, open your browser to **http://localhost:5173**
7.  To build the app for production, run: `npm run build`

## Pages

The JS SDK uses React Router to perform page navigation. Each page is a React component with a `useEffect` hook used to register uri change.

For example, for home page we have:

```javascript
useEffect(() => {
    PageController.getContext().setPageUri('/');
}.[]);
```

With this, the SDK can change browser context and customize tracking/service response.


### Home

Route: `/` shows the main page of the site.
The home page has the following configuration:

- 1st section: it is a content block with a locale rule to change the content if you switch the language.
- 2nd section: a content block with the title (Frequently asked questions) with the same rule than 1st section. It also has a `questions` widget below that only shows some questions based on a specific keyphrase.
- 3rd section: a content block with the title (same mechanism than 2nd section) and a `search` widget with a filter applied (type = blogs).

Events tracked are:

- A `widget appear` event per widget that appears on the page.

### Search

Route: `/search` shows the results returned after submitting the form in the header.
It contains:
- a `questions` widget in case that the application recognizes that the filtering term is a question (e.g.: `What is XM Cloud` ).
Otherwise, if it is not recognizing the search term as a question won't show anything
- A `search results` widget that will show on any case.

Events tracked are:

- A `widget appear` event for the questions and answer widget if it is present.
- A `widget appear` event for the search result widget present on the page.


### Content detail page

Route: `/detail/<content id>`. E.g.: `/detail/content-121212` shows the details of a specific content.

__Note:__
*In this example, the content information has been filtered from the `SearchResults` widget data for demonstration purposes. We do not recommend this approach in production. Restrict Search services to search and recommendations and create separate services for other data.*

Events tracked are:

- A `widget appear` event for the search result.

## Events

Events are an important part of the Search platform. The JS SDK automatically fires events it can infer when they happen. To register other events, you have to verbosely dispatch them.

Refer to the [JS SDK documentation](https://doc.sitecore.com/discover/en/developers/discover-js-sdk-for-react/index_en.html?contextId=events) for more about dispatching events.

### Monitoring example

An example of monitoring could be debug event tracking in the CEC. The following video shows how you can verify the events that the SDK trigger:

<br>


![](monitoring.gif)

### Adding a new widget

The starter kit comes with the `@sitecore-search/cli` as a dev dependency. We also added a `package.json` script as a short cut to create
a widget based on the [templates available](https://developers.sitecorecloud.io/search-sdk/react/latest/storybook/index.html?path=/docs/widget-templates-introduction--page).

For widget creation, open a terminal in the root of the project and execute the following command:
`npm run create-widget`
Then follow the instructions from the wizard. 

More documentation for the cli can be found [here](https://www.npmjs.com/package/@sitecore-search/cli).

## Documentation

Discover documentation is written for both developers and [business users](https://doc.sitecore.com/discover/en/users/discover-user-guide/index-en.html?contextId=introduction).

JS SDK for React documentation includes:
* [Components, functions, and query hooks](https://doc.sitecore.com/discover/en/developers/discover-js-sdk-for-react/index-en.html?contextId=introduction).
* [Templates and ui primitives](https://developers.sitecorecloud.io/discover-sdk/react/1.x-alpha/storybook/index.html).

For data feeds and URL configuration, refer to the [Discover developer guide](https://doc.sitecore.com/discover/en/developers/discover-js-sdk-for-react/index-en.html?contextId=introduction).

## Contributions

We are very grateful to the community for contributing bug fixes and improvements. We welcome all efforts to evolve and improve the Discover Starter Kit. The following sections explain how you can participate in these efforts.

### Bug reports

You can use GitHub to submit [bug reports](https://github.com/Sitecore/Sitecore-Search-JS-SDK-Starter-kit/issues/new?template=bug_report.md) for Discover Starter Kit.

### Feature requests

You can use GitHub to submit [feature requests](https://github.com/Sitecore/Discover-JS-SDK-Starter-kit/issues/new?template=feature_request.md) for Discover Starter Kit.


### Code of Conduct
Sitecore has adopted a [Code of Conduct](CODE_OF_CONDUCT.md) that we expect project participants to adhere to. Please read the full text so that you can understand what actions will and will not be tolerated.

### Contributing Guide

If you want to make changes to the code, follow these steps:

1. Fork the Discover Starter Kit Repo GitHub repo.
2. Clone the forked repo to your local machine.
3. Create a feature branch from `main` for your changes. e.g. `git checkout -b my-feature-branch`
4. Run `npm install`
5. Run `npm run dev` (to preview your changes locally)
6. Commit, push to your remote fork of the Discover Starter Kit repo, then open a pull request (PR) to the `main` branch of the Developer Portal repo.

Your changes will be reviewed and merged if appropriate.
