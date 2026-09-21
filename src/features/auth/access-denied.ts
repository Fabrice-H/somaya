const ACCESS_DENIED_HTML = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Accès refusé | SO'MAYA</title>
<style>
*{box-sizing:border-box}
body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;background:#f4f4f2;color:#141414;font-family:"Helvetica Neue",Arial,sans-serif;text-align:center}
main{max-width:420px}
.eyebrow{margin:0 0 16px;font-size:11.5px;letter-spacing:.3em;text-transform:uppercase;color:#511f29}
h1{margin:0;font-size:32px;font-weight:500;letter-spacing:-.01em}
.text{margin:16px 0 40px;font-size:15px;font-weight:300;line-height:1.65;color:#6b6b6b}
a{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 32px;background:#511f29;color:#fff;text-decoration:none;font-size:12px;letter-spacing:.18em;text-transform:uppercase}
a:hover{background:#3c161e}
</style>
</head>
<body>
<main>
<p class="eyebrow">Erreur 403</p>
<h1>Accès refusé</h1>
<p class="text">Cette page est réservée aux administrateurs.</p>
<a href="/">Retour à l'accueil</a>
</main>
</body>
</html>`;

export function accessDeniedResponse(): Response {
  return new Response(ACCESS_DENIED_HTML, {
    status: 403,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      "x-robots-tag": "noindex, nofollow",
    },
  });
}
