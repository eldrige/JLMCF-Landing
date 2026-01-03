'use client';

import { useState, useEffect, useMemo } from 'react';

interface Participant {
  display_name: string;
  real_name?: string;
  country?: string;
  linkedin_url?: string;
  linkedin_username?: string;
  phone?: string;
  introduction?: string;
}

interface ParticipantData {
  metadata: {
    source_file: string;
    total_participants: number;
    participants_with_linkedin: number;
    participants_with_country: number;
    countries_breakdown: Record<string, number>;
  };
  participants: Participant[];
}

// Country flag emoji mapping
const countryFlags: Record<string, string> = {
  Ethiopia: '🇪🇹',
  Uganda: '🇺🇬',
  Rwanda: '🇷🇼',
  Kenya: '🇰🇪',
  Malawi: '🇲🇼',
  Cameroon: '🇨🇲',
  Zimbabwe: '🇿🇼',
  'South Sudan': '🇸🇸',
  'South Africa': '🇿🇦',
  'DR Congo': '🇨🇩',
  Zambia: '🇿🇲',
  Benin: '🇧🇯',
  Nigeria: '🇳🇬',
  Botswana: '🇧🇼',
  Tanzania: '🇹🇿',
  Sudan: '🇸🇩',
  Egypt: '🇪🇬',
  'Sierra Leone': '🇸🇱',
  Burundi: '🇧🇮',
  Eswatini: '🇸🇿',
  Namibia: '🇳🇦',
  Ghana: '🇬🇭',
  'Burkina Faso': '🇧🇫',
};

// Vibrant colors for countries
const countryColors = [
  '#D4A853', // gold
  '#10B981', // emerald
  '#F59E0B', // amber
  '#0EA5E9', // sky
  '#F43F5E', // rose
  '#8B5CF6', // violet
  '#EC4899', // pink
  '#14B8A6', // teal
  '#F97316', // orange
  '#6366F1', // indigo
];

export default function Home() {
  const [data, setData] = useState<ParticipantData | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetch('/participants.json')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setTimeout(() => setIsLoaded(true), 100);
      });
  }, []);

  const filteredParticipants = useMemo(() => {
    if (!data) return [];

    return data.participants.filter((p) => {
      const matchesSearch =
        !search ||
        p.display_name.toLowerCase().includes(search.toLowerCase()) ||
        p.real_name?.toLowerCase().includes(search.toLowerCase()) ||
        p.country?.toLowerCase().includes(search.toLowerCase());

      const matchesCountry =
        !selectedCountry ||
        p.country === selectedCountry ||
        (selectedCountry === 'Unknown' && !p.country);

      return matchesSearch && matchesCountry;
    });
  }, [data, search, selectedCountry]);

  const topCountries = useMemo(() => {
    if (!data) return [];
    return Object.entries(data.metadata.countries_breakdown)
      .filter(([country]) => country !== 'Unknown')
      .slice(0, 10);
  }, [data]);

  const maxCountryCount = topCountries[0]?.[1] || 1;

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-2 border-[var(--accent-gold)] border-t-transparent rounded-full animate-spin" />
          <span className="text-[var(--text-secondary)]">
            Loading fellows data...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen hero-gradient">
      {/* Header */}
      <header className="border-b border-[var(--border-subtle)] sticky top-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-gold)] to-[var(--accent-gold-dim)] flex items-center justify-center font-bold text-black text-lg pulse-glow">
              JL
            </div>
            <div>
              <h1 className="font-semibold text-lg tracking-tight">
                JLMCF Fellows
              </h1>
              <p className="text-xs text-[var(--text-muted)]">
                Explore Entrepreneurship 2026
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-emerald)]" />
            {data.metadata.total_participants} Fellows Connected
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Stats */}
        <section className={`mb-16 ${isLoaded ? 'stagger-children' : ''}`}>
          <div className="mb-8">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
              African{' '}
              <span className="text-[var(--accent-gold)]">Entrepreneurs</span>
            </h2>
            <p className="text-[var(--text-secondary)] text-lg max-w-2xl">
              A network of {data.metadata.total_participants} innovative minds
              from across Africa, connected through the Jim Leech Mastercard
              Foundation Fellowship.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              label="Total Fellows"
              value={data.metadata.total_participants}
              icon="👥"
              color="var(--accent-gold)"
            />
            <StatCard
              label="Countries"
              value={Object.keys(data.metadata.countries_breakdown).length - 1}
              icon="🌍"
              color="var(--accent-emerald)"
            />
            <StatCard
              label="LinkedIn Profiles"
              value={data.metadata.participants_with_linkedin}
              icon="💼"
              color="var(--accent-sky)"
            />
            <StatCard
              label="Network Rate"
              value={`${Math.round(
                (data.metadata.participants_with_linkedin /
                  data.metadata.total_participants) *
                  100
              )}%`}
              icon="📊"
              color="var(--accent-amber)"
            />
          </div>
        </section>

        {/* Country Distribution */}
        <section className="mb-16">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <span>Country Distribution</span>
            <span className="text-[var(--text-muted)] text-sm font-normal">
              Top 10
            </span>
          </h3>

          <div className="glass rounded-2xl p-6">
            <div className="space-y-4">
              {topCountries.map(([country, count], index) => (
                <div key={country} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <button
                      onClick={() =>
                        setSelectedCountry(
                          selectedCountry === country ? null : country
                        )
                      }
                      className={`flex items-center gap-2 text-sm transition-colors ${
                        selectedCountry === country
                          ? 'text-[var(--accent-gold)]'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <span className="text-lg">
                        {countryFlags[country] || '🌍'}
                      </span>
                      <span>{country}</span>
                    </button>
                    <span className="text-sm font-mono text-[var(--text-muted)]">
                      {count}
                    </span>
                  </div>
                  <div className="h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full country-bar"
                      style={{
                        width: isLoaded
                          ? `${(count / maxCountryCount) * 100}%`
                          : '0%',
                        background: countryColors[index % countryColors.length],
                        transitionDelay: `${index * 50}ms`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Search & Filters */}
        <section className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="relative flex-1 w-full">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search by name, country..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
              <button
                onClick={() => setSelectedCountry(null)}
                className={`filter-chip ${!selectedCountry ? 'active' : ''}`}
              >
                All
              </button>
              {topCountries.slice(0, 5).map(([country]) => (
                <button
                  key={country}
                  onClick={() =>
                    setSelectedCountry(
                      selectedCountry === country ? null : country
                    )
                  }
                  className={`filter-chip ${
                    selectedCountry === country ? 'active' : ''
                  }`}
                >
                  {countryFlags[country]} {country}
                </button>
              ))}
            </div>
          </div>

          <p className="text-sm text-[var(--text-muted)] mt-4">
            Showing {filteredParticipants.length} of{' '}
            {data.metadata.total_participants} fellows
          </p>
        </section>

        {/* Participants Grid */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredParticipants.map((participant, index) => (
              <ParticipantCard
                key={`${participant.display_name}-${index}`}
                participant={participant}
              />
            ))}
          </div>

          {filteredParticipants.length === 0 && (
            <div className="text-center py-16">
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-[var(--text-secondary)]">
                No fellows found matching your search
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border-subtle)] mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <p className="text-sm text-[var(--text-muted)]">
            Jim Leech Mastercard Foundation Fellowship • Explore
            Entrepreneurship 2026
          </p>
        </div>
      </footer>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: string;
  color: string;
}) {
  return (
    <div className="stat-card p-5">
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span className="w-2 h-2 rounded-full" style={{ background: color }} />
      </div>
      <div className="text-3xl font-bold mb-1" style={{ color }}>
        {value}
      </div>
      <div className="text-sm text-[var(--text-muted)]">{label}</div>
    </div>
  );
}

function ParticipantCard({ participant }: { participant: Participant }) {
  const displayName = participant.real_name || participant.display_name;
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="participant-card p-4">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--bg-tertiary)] to-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-center text-sm font-semibold text-[var(--text-secondary)] flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-[var(--text-primary)] truncate">
            {displayName}
          </h4>
          {participant.real_name &&
            participant.real_name !== participant.display_name && (
              <p className="text-xs text-[var(--text-muted)] truncate">
                @{participant.display_name}
              </p>
            )}
          {participant.country && (
            <p className="text-sm text-[var(--text-secondary)] mt-1 flex items-center gap-1">
              <span>{countryFlags[participant.country] || '🌍'}</span>
              {participant.country}
            </p>
          )}
        </div>
      </div>

      {participant.introduction && (
        <p className="text-xs text-[var(--text-muted)] mt-3 line-clamp-2 leading-relaxed">
          {participant.introduction.slice(0, 150)}
          {participant.introduction.length > 150 ? '...' : ''}
        </p>
      )}

      {participant.linkedin_url && (
        <div className="mt-3 pt-3 border-t border-[var(--border-subtle)]">
          <a
            href={participant.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            className="linkedin-btn inline-flex items-center gap-1.5"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            Connect
          </a>
        </div>
      )}
    </div>
  );
}
