# Portfolio redesign

The homepage now presents Sergio as an independent web designer and developer serving businesses across Spain. The sequence is: clear offer and actual work; a documented client project; selected design concepts; services; process; price; relevant experience; answers; contact.

## Design decisions

- Warm ivory, deep green ink and a restrained lime accent. A consistent type scale and section rhythm replace oversized scroll-dependent project sections.
- Fisioymés appears in the first screen and as a short case study. Its original approved screenshot is reused; no outcomes, metrics or testimonials have been invented.
- Three Spanish/Catalan concepts are featured, and all remaining concepts remain accessible in a native disclosure. The English page preserves its two original English-language concepts. Every concept is labelled.
- WhatsApp is the main conversion path. Email, phone and the existing price calculator remain available. No new form processor or tracking is introduced.
- Native disclosures, keyboard focus, a skip link, mobile navigation, responsive images and reduced-motion support work without client JavaScript.
- Spanish, Catalan and English share one component and fully translated content. Existing service, local search and review URLs remain available. The main title, description and structured service area now reflect Spain.

## Commercial assumptions

The existing base offer remains from €500 for up to five pages, including the first-year domain and launch. Seven days is described as the base-site timeline; the final schedule depends on agreed scope and materials. Existing maintenance and change prices are retained. Tax treatment is not invented and remains to be clarified in actual quotes.

## Validation

- `npm run build`: 16 static pages generated.
- `node scripts/check-build.mjs`: validates all generated routes, internal links, fragment targets, image files/dimensions/alt attributes, the three languages, canonical metadata, national structured data and contact destinations.
- Browser checks at desktop and mobile sizes: no horizontal overflow, working native disclosures and language routes, no broken images. Homepage ships no runtime JavaScript.

The legacy `scripts/verificar.mjs` checks the removed scroll animation and outdated content/language counts, so it is replaced as the default verification command by the artifact checks. Visual responsive verification remains a browser task.

This branch does not deploy. The GitHub Pages workflow remains restricted to pushes to `main` (or a manual workflow dispatch).
