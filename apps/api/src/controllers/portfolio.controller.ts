import type { FastifyRequest, FastifyReply } from 'fastify';
import { getPrisma } from '@nullvoid/database';

function renderPortfolioHtml(data: {
  title: string; subtitle?: string | null; about?: string | null;
  sections: unknown[]; socialLinks: Record<string, string>;
  published: boolean; views: number; username: string;
  userId: string; avatar: string | null;
}): string {
  const sections = Array.isArray(data.sections) ? data.sections : [];
  const links = data.socialLinks ?? {};
  const avatar = data.avatar || `https://cdn.discordapp.com/embed/avatars/${Number(data.userId) % 5}.png`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(data.title)}</title>
<meta name="description" content="${esc(data.about || data.title)}">
<meta property="og:title" content="${esc(data.title)}">
<meta property="og:description" content="${esc(data.about || '')}">
<meta property="og:image" content="${avatar}">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
<style>
*{margin:0;padding:0;box-sizing:border-box}
@keyframes fadeIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes glow{0%,100%{box-shadow:0 0 20px rgba(102,126,234,0.3)}50%{box-shadow:0 0 40px rgba(102,126,234,0.6)}}
@keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
  background:#0a0a12;color:#e0e0e0;min-height:100vh;display:flex;justify-content:center;padding:2rem 1rem;
  background-image:radial-gradient(ellipse at 20% 50%,rgba(102,126,234,0.08) 0%,transparent 50%),
    radial-gradient(ellipse at 80% 50%,rgba(118,75,162,0.08) 0%,transparent 50%)}
.container{max-width:860px;width:100%;animation:fadeIn .8s ease-out}
.profile-card{background:rgba(255,255,255,0.03);backdrop-filter:blur(24px);
  border:1px solid rgba(255,255,255,0.08);border-radius:28px;padding:3rem 2.5rem;
  margin-bottom:2rem;text-align:center;position:relative;overflow:hidden}
.profile-card::before{content:'';position:absolute;top:-50%;left:-50%;width:200%;height:200%;
  background:conic-gradient(from 0deg,transparent,rgba(102,126,234,0.05),transparent,rgba(118,75,162,0.05),transparent);
  animation:spin 12s linear infinite;pointer-events:none}
@keyframes spin{to{transform:rotate(360deg)}}
.avatar-wrap{width:120px;height:120px;border-radius:50%;margin:0 auto 1.5rem;position:relative;z-index:1;
  animation:float 4s ease-in-out infinite,glow 3s ease-in-out infinite;
  border:3px solid rgba(102,126,234,0.4);padding:4px}
.avatar-wrap img{width:100%;height:100%;border-radius:50%;object-fit:cover;display:block}
h1{font-size:2.2rem;font-weight:800;margin-bottom:.35rem;position:relative;z-index:1;
  background:linear-gradient(135deg,#667eea,#764ba2,#f093fb);
  background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
  animation:shimmer 3s ease-in-out infinite}
.subtitle{color:#8888aa;font-size:1.1rem;margin-bottom:1rem;position:relative;z-index:1}
.bio{color:#b8b8d0;line-height:1.7;margin-bottom:1.5rem;font-size:.95rem;max-width:600px;margin-left:auto;margin-right:auto;position:relative;z-index:1}
.status-badge{display:inline-flex;align-items:center;gap:.4rem;padding:.3rem .9rem;border-radius:20px;
  font-size:.75rem;font-weight:500;margin-bottom:1.5rem;position:relative;z-index:1}
.status-badge.published{background:rgba(34,197,94,0.12);color:#22c55e;border:1px solid rgba(34,197,94,0.25)}
.status-badge.draft{background:rgba(234,179,8,0.12);color:#eab308;border:1px solid rgba(234,179,8,0.25)}
.links{display:flex;justify-content:center;gap:.75rem;flex-wrap:wrap;position:relative;z-index:1;margin-top:.5rem}
.links a{display:inline-flex;align-items:center;gap:.5rem;padding:.55rem 1.1rem;border-radius:14px;
  text-decoration:none;font-size:.85rem;font-weight:500;transition:all .25s ease;border:1px solid rgba(255,255,255,0.1)}
.links a.github{background:rgba(255,255,255,0.06);color:#e0e0e0}
.links a.github:hover{background:rgba(255,255,255,0.12);transform:translateY(-2px)}
.links a.twitter{background:rgba(29,161,242,0.1);color:#1da1f2;border-color:rgba(29,161,242,0.25)}
.links a.twitter:hover{background:rgba(29,161,242,0.2);transform:translateY(-2px)}
.links a.linkedin{background:rgba(0,119,181,0.1);color:#0077b5;border-color:rgba(0,119,181,0.25)}
.links a.linkedin:hover{background:rgba(0,119,181,0.2);transform:translateY(-2px)}
.links a.website{background:rgba(102,126,234,0.1);color:#667eea;border-color:rgba(102,126,234,0.25)}
.links a.website:hover{background:rgba(102,126,234,0.2);transform:translateY(-2px)}
.section-card{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);
  border-radius:20px;padding:1.75rem;margin-bottom:1.25rem;animation:fadeIn .6s ease-out;transition:all .3s ease}
.section-card:hover{border-color:rgba(102,126,234,0.2);background:rgba(255,255,255,0.035);
  transform:translateY(-2px);box-shadow:0 8px 30px rgba(0,0,0,0.2)}
.section-card h2{font-size:1.15rem;font-weight:600;margin-bottom:1rem;display:flex;align-items:center;gap:.5rem}
.section-card h2 i{color:#667eea;font-size:1rem}
.skills{display:flex;flex-wrap:wrap;gap:.5rem}
.skill-tag{padding:.4rem 1rem;border-radius:20px;
  background:linear-gradient(135deg,rgba(102,126,234,0.12),rgba(118,75,162,0.12));
  border:1px solid rgba(102,126,234,0.2);color:#a78bfa;font-size:.85rem;font-weight:450;
  transition:all .25s ease}
.skill-tag:hover{background:linear-gradient(135deg,rgba(102,126,234,0.25),rgba(118,75,162,0.25));
  transform:scale(1.05);border-color:rgba(102,126,234,0.4)}
.views-count{color:#555;font-size:.8rem;margin-top:.75rem;display:flex;align-items:center;justify-content:center;gap:.4rem;position:relative;z-index:1}
.views-count i{font-size:.75rem}
.footer{text-align:center;padding:2.5rem 0 1rem;color:#444;font-size:.75rem;letter-spacing:.5px}
.footer a{color:#555;text-decoration:none;transition:color .2s}
.footer a:hover{color:#667eea}
@media(max-width:600px){.profile-card{padding:2rem 1.25rem}.avatar-wrap{width:90px;height:90px}h1{font-size:1.6rem}}
</style>
</head>
<body>
<div class="container">
<div class="profile-card">
<div class="avatar-wrap"><img src="${avatar}" alt="${esc(data.username)}"></div>
<span class="status-badge ${data.published ? 'published' : 'draft'}">
<i class="fas ${data.published ? 'fa-globe' : 'fa-pen'}"></i> ${data.published ? 'Published' : 'Draft'}
</span>
<h1>${esc(data.subtitle || data.title)}</h1>
${data.about ? `<p class="bio">${esc(data.about).replace(/\n/g, '<br>')}</p>` : ''}
<div class="links">
${Object.entries(links).map(([k, v]) => {
  const icon = k === 'github' ? 'fab fa-github' : k === 'twitter' ? 'fab fa-x-twitter' : k === 'linkedin' ? 'fab fa-linkedin-in' : k === 'website' || k === 'web' ? 'fas fa-globe' : 'fas fa-link';
  return `<a href="${esc(v)}" target="_blank" class="${k}"><i class="${icon}"></i>${k.charAt(0).toUpperCase() + k.slice(1)}</a>`;
}).join('')}
</div>
<div class="views-count"><i class="fas fa-eye"></i> ${data.views} views</div>
</div>
${sections.map((s: any, i: number) => s?.items?.length ? `<div class="section-card" style="animation-delay:${i * 0.1}s">
<h2><i class="fas ${s.type === 'skills' ? 'fa-code' : 'fa-star'}"></i>${esc(s.title || 'Details')}</h2>
<div class="skills">${s.items.map((it: string) => `<span class="skill-tag">${esc(it)}</span>`).join('')}</div>
</div>` : '').join('')}
<div class="footer">Powered by <a href="${process.env.PUBLIC_URL || 'http://localhost:3000'}">NullVoid</a></div>
</div>
</body>
</html>`;
}

function esc(text: string): string {
  return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

export async function getPortfolio(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  const { id } = req.params;

  const portfolio = await getPrisma().portfolio.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!portfolio) {
    return reply.status(404).type('text/html').send(`<!DOCTYPE html><html><head><title>404</title><style>body{font-family:sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#0a0a12;color:#e0e0e0;flex-direction:column;gap:1rem}h1{font-size:4rem;background:linear-gradient(135deg,#667eea,#764ba2);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}p{color:#888}</style></head><body><h1>404</h1><p>Portfolio not found</p></body></html>`);
  }

  await getPrisma().portfolio.update({ where: { id }, data: { views: { increment: 1 } } }).catch(() => null);

  const socialLinks: Record<string, string> = portfolio.socialLinks ? JSON.parse(portfolio.socialLinks) : {};
  const sections: unknown[] = portfolio.sections ? JSON.parse(portfolio.sections) : [];
  const avatar = portfolio.user?.avatar
    ? (portfolio.user.avatar.startsWith('http') ? portfolio.user.avatar : `https://cdn.discordapp.com/avatars/${portfolio.userId}/${portfolio.user.avatar}.png`)
    : null;

  const html = renderPortfolioHtml({
    title: portfolio.title,
    subtitle: portfolio.subtitle,
    about: portfolio.about,
    sections,
    socialLinks,
    published: portfolio.published,
    views: portfolio.views,
    username: portfolio.user?.username ?? 'User',
    userId: portfolio.userId,
    avatar,
  });

  reply.type('text/html').send(html);
}

export async function getPortfolioByUser(req: FastifyRequest<{ Params: { userId: string } }>, reply: FastifyReply) {
  const { userId } = req.params;
  const guildId = (req.query as { guildId?: string }).guildId;

  if (!guildId) {
    return reply.status(400).send({ success: false, error: { code: 'MISSING_GUILD_ID', message: 'guildId query param required' } });
  }

  const portfolio = await getPrisma().portfolio.findUnique({
    where: { userId_guildId: { userId, guildId } },
  });

  if (!portfolio) {
    return reply.status(404).send({ success: false, error: { code: 'NOT_FOUND', message: 'Portfolio not found' } });
  }

  return { success: true, data: portfolio };
}
