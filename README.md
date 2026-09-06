# AST Trade International

Site public bilingue : https://ast-trade.com

## Vérification et publication

Avec Node.js 22 ou version ultérieure :

```sh
npm install
npm test
npm run build
```

Le dossier `dist/` contient uniquement les fichiers publics. Cloudflare peut publier ce dossier avec son bouton d'envoi de fichiers ou avec `npx wrangler deploy`. La configuration Wrangler reconstruit `dist/` avant publication. Les domaines restent gérés dans Cloudflare.

Les pages françaises sont les modèles ; `scripts/build_en.js` génère les pages anglaises avec les traductions de `script.js`. Modifier une page anglaise directement serait écrasé lors de la prochaine génération.

## Corrections du 6 septembre 2026

- Formulaire simplifié : six informations principales, détails facultatifs, protection des saisies en cas d'erreur et prévention des doubles envois.
- L'événement Analytics `generate_lead` n'est envoyé qu'après une réponse Formspree confirmée et avec le consentement Analytics. Aucune saisie libre ni identité n'est incluse dans cet événement.
- Google Analytics ne se charge qu'après acceptation ; le choix peut être modifié depuis le pied de page et expire après 180 jours.
- Images WebP adaptées au mobile, polices hébergées sur le site, navigation et boutons améliorés.
- Informations logistiques harmonisées, versions anglaises et données FAQ alignées.
- En-têtes de protection Cloudflare ; suppression d'un ancien script de capture de l'éditeur.

Les tests du formulaire utilisent une réponse simulée pour ne pas envoyer de faux prospects. La réception réelle des courriels reste à contrôler séparément. Les mentions légales doivent être complétées avec le capital social et le nom du directeur de publication après confirmation de l'entreprise. Les minimums de commande restent indicatifs et à confirmer commercialement.

La politique CSP autorise les scripts intégrés nécessaires aux contrôles anti-robots injectés par Cloudflare, avec l’accord du propriétaire. Une politique stricte avec nonce nécessiterait une réponse dynamique ; ce site conserve son hébergement statique.
