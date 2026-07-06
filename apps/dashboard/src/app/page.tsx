'use client';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="text-center max-w-2xl">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-600 mb-6">
          <span className="text-2xl font-bold text-white">N</span>
        </div>

        <h1 className="text-4xl font-bold tracking-tight mb-4">
          NullVoid
        </h1>

        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
          Enterprise-Grade Discord Bot — AI, Moderation, Tickets, Economy, Leveling, Music &amp; Portfolio Generator
        </p>

        <div className="flex items-center justify-center gap-4">
          <a
            href={`https://discord.com/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&permissions=8&scope=bot%20applications.commands`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Add to Discord
          </a>

          <button
            onClick={() => {
              window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/discord`;
            }}
            className="btn-secondary"
          >
            Login
          </button>
        </div>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { label: 'Servers', value: '100K+' },
            { label: 'Commands', value: '200+' },
            { label: 'Modules', value: '15+' },
            { label: 'Uptime', value: '99.9%' },
          ].map((stat) => (
            <div key={stat.label} className="card">
              <div className="text-2xl font-bold text-primary-600">{stat.value}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
