import React from 'react';
import { MusicEvent } from '../types';
import { Search, SlidersHorizontal, Calendar, Clock, MapPin, Sparkles, AlertCircle } from 'lucide-react';

interface EventsListViewProps {
  events: MusicEvent[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onSelectEvent: (event: MusicEvent) => void;
  onShowNotification: (msg: string) => void;
}

export default function EventsListView({
  events,
  loading = false,
  error = null,
  onRetry,
  onSelectEvent,
  onShowNotification
}: EventsListViewProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All Events');

  const categories = ['All Events', 'Creative Gigs', 'Social Space', 'Community Hub'];

  const filteredEvents = events.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.artists.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All Events' || e.stage === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 w-full max-w-full overflow-hidden pt-4">
      {/* Search & Filtering Control Bar */}
      <section className="max-w-7xl mx-auto px-4 relative">
        <div className="absolute top-[-50px] left-[-50px] w-84 h-84 bg-[#38bdf8]/5 blur-[90px] rounded-full pointer-events-none"></div>
        <div className="absolute top-[20px] right-[-20px] w-76 h-76 bg-[#b76dff]/5 blur-[80px] rounded-full pointer-events-none"></div>

        <div className="glass-panel p-3 rounded-2xl flex flex-col lg:flex-row items-center gap-3 relative z-10">
          <div className="relative w-full lg:flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              id="search-input"
              type="text"
              placeholder="Search local venues, hosts, gigs, or community meetups..."
              className="w-full bg-[#131b2e]/60 border-none rounded-xl pl-12 pr-4 py-3 text-sm text-[#dae2fd] focus:ring-1 focus:ring-[#b76dff] placeholder-slate-500 transition-all outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0 custom-scrollbar select-none flex-nowrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-shrink-0 px-5 py-2.5 rounded-xl font-semibold text-xs tracking-wide transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#b76dff]/20 text-[#ddb7ff] border border-[#b76dff]/40'
                    : 'glass-panel text-[#cfc2d6] hover:text-[#ddb7ff]'
                }`}
              >
                {cat}
              </button>
            ))}
            <button 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All Events');
                onShowNotification('Filter presets refreshed.');
              }}
              className="glass-panel p-2.5 rounded-xl hover:text-[#ddb7ff] text-[#cfc2d6] flex-shrink-0"
              title="Reset Filters"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Curated bento grid header */}
      <section className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 text-left px-2">
          <div>
            <h2 className="font-display font-extrabold text-2xl md:text-3xl text-white tracking-tight uppercase">
              Curated Experiences
            </h2>
            <p className="text-sm text-[#cfc2d6]">
              Cozy, handpicked experiences for individuals and local creators.
            </p>
          </div>
          <span className="font-mono text-xs bg-[#b76dff]/10 text-[#ddb7ff] px-3 py-1.5 rounded-full border border-[#b76dff]/20">
            {filteredEvents.length} Sessions Available
          </span>
        </div>

        {loading ? (
          <div className="glass-panel p-12 rounded-2xl text-center text-slate-400 text-sm">
            Loading events from API...
          </div>
        ) : error ? (
          <div className="glass-panel p-12 rounded-2xl text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
            <h3 className="font-bold text-lg text-white">Could not load events</h3>
            <p className="text-sm text-[#cfc2d6]">{error}</p>
            {onRetry && (
              <button type="button" onClick={onRetry} className="text-[#38bdf8] hover:underline text-xs">
                Retry
              </button>
            )}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="glass-panel p-12 rounded-2xl text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-[#38bdf8] mx-auto" />
            <h3 className="font-bold text-lg text-white">No experiences match your query</h3>
            <p className="text-sm text-[#cfc2d6]">Try adjusting your search terms or selecting a different community stage filter.</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory('All Events'); }} 
              className="text-[#38bdf8] hover:underline text-xs"
            >
              Clear filters and query
            </button>
          </div>
        ) : (
          /* Bento Grid Layout mimicking screenshot structures */
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* FEATURED: Warehouse Acoustic Jam & Mixer (occupies 8 columns or 12 depending on results) */}
            {filteredEvents.map((ev, index) => {
              const isMainFeatured = ev.id === 'acoustic-nights-warehouse';
              
              if (isMainFeatured) {
                return (
                  <div key={ev.id} className="md:col-span-8 group xl:col-span-8">
                    <div className="glass-panel rounded-2xl overflow-hidden h-full flex flex-col lg:flex-row">
                      {/* Image block */}
                      <div className="relative lg:w-1/2 h-[260px] lg:h-auto overflow-hidden">
                        <img 
                          src={ev.imageUrl} 
                          alt={ev.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute top-4 left-4 z-10">
                          <span className="bg-[#b76dff] text-[#0b1326] px-3.5 py-1 rounded-full font-mono font-bold text-[9px] uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-[#b76dff]/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            Trending Gathering
                          </span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1326] via-transparent to-transparent"></div>
                      </div>
                      
                      {/* Text details content */}
                      <div className="p-8 lg:w-1/2 flex flex-col justify-between text-left space-y-6">
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <span className="font-mono text-xs text-[#38bdf8] uppercase tracking-wider">{ev.stage}</span>
                            <span className="text-[#ddb7ff] font-display font-extrabold text-xl">${ev.price.toFixed(2)}</span>
                          </div>
                          <h3 className="font-display font-bold text-2xl text-white tracking-tight group-hover:text-[#ddb7ff] transition-colors">{ev.title}</h3>
                          <p className="text-[#cfc2d6] text-xs font-sans leading-relaxed">{ev.description}</p>
                          
                          <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-[#b76dff]" /> {ev.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-[#b76dff]" /> {ev.time}
                            </span>
                          </div>

                          <div className="pt-2">
                            <span className="text-[10px] font-mono uppercase text-[#cfc2d6] tracking-wider block mb-1">Local Hosts / Lineup:</span>
                            <div className="flex flex-wrap gap-1">
                              {ev.artists.map(art => (
                                <span key={art} className="text-[9px] font-semibold bg-white/5 px-2 py-0.5 rounded text-[#ddb7ff] border border-white/5">
                                  {art}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                          <button 
                            onClick={() => onSelectEvent(ev)}
                            className="flex-1 bg-white/5 hover:bg-white/10 hover:border-white/40 text-white border border-white/20 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider active:scale-95 duration-200 cursor-pointer text-center"
                          >
                            RESERVE
                          </button>
                          <button 
                            onClick={() => onSelectEvent(ev)}
                            className="flex-1 electric-gradient text-[#0b1326] py-3.5 rounded-full font-bold text-xs uppercase tracking-wider active:scale-95 duration-200 shadow-md shadow-[#b76dff]/10 cursor-pointer text-center"
                          >
                            BOOK NOW
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              // Normal Card Design (occupies 4 columns)
              return (
                <div key={ev.id} className="md:col-span-4 group">
                  <div className="glass-panel rounded-2xl overflow-hidden h-full flex flex-col justify-between">
                    <div>
                      {/* Image header */}
                      <div className="relative h-[180px] overflow-hidden">
                        <img 
                          src={ev.imageUrl} 
                          alt={ev.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center z-10">
                          <span className="bg-[#0b1326]/80 backdrop-blur-md text-[#dae2fd] px-2 py-1 rounded text-[9px] font-mono uppercase tracking-wider">
                            {ev.stage}
                          </span>
                          <span className="bg-[#b76dff]/20 backdrop-blur-md text-[#ddb7ff] border border-[#b76dff]/30 px-2 py-1 rounded text-[10px] font-bold">
                            {ev.price === 0 ? 'FREE ENTRY' : `$${ev.price.toFixed(2)}`}
                          </span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1326] via-transparent to-transparent"></div>
                      </div>

                      {/* Content block */}
                      <div className="p-6 text-left space-y-3">
                        <h3 className="font-display font-extrabold text-[#dae2fd] text-base lg:text-lg group-hover:text-[#ddb7ff] transition-colors">
                          {ev.title}
                        </h3>
                        <p className="text-xs text-[#cfc2d6] line-clamp-3 leading-relaxed">
                          {ev.description}
                        </p>
                        
                        <div className="pt-2 flex flex-wrap gap-2 text-[10px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {ev.date}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="p-6 pt-0 flex gap-2">
                      <button
                        onClick={() => onSelectEvent(ev)}
                        className="flex-1 glass-panel hover:bg-white/5 border border-[#38bdf8]/25 hover:border-[#38bdf8]/55 py-2.5 rounded-full text-xs font-bold text-white uppercase tracking-wider transition-all cursor-pointer text-center"
                      >
                        RESERVE
                      </button>
                      <button
                        onClick={() => onSelectEvent(ev)}
                        className="flex-1 electric-gradient text-[#0b1326] py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all cursor-pointer text-center"
                      >
                        BOOK
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

          </div>
        )}
      </section>

      {/* Trust Call to Action */}
      <section className="max-w-7xl mx-auto px-1">
        <div className="glass-panel p-10 rounded-[2rem] text-center relative overflow-hidden">
          <div className="absolute top-[-30px] right-[-30px] w-48 h-48 bg-[#b76dff]/15 blur-2xl rounded-full"></div>
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="font-display font-extrabold text-2xl md:text-3xl text-white uppercase tracking-tight">
              Join the Neighborhood
            </h2>
            <p className="text-sm text-[#cfc2d6]">
              Get automated updates on new local gigs, creative spaces, craft workshops, and open social swaps around you.
            </p>
            <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2" onSubmit={(e) => {
              e.preventDefault();
              onShowNotification("Broadcast registered! You are now subscribed to the neighborhood digest.");
            }}>
              <input 
                id="cta-email"
                type="email" 
                required
                placeholder="Enter your email address..."
                className="flex-1 bg-[#131b2e]/60 border border-white/10 rounded-xl px-5 py-3 text-sm text-[#dae2fd] focus:border-[#b76dff] outline-none"
              />
              <button 
                type="submit"
                aria-label="Subscribe"
                className="electric-gradient text-[#0b1326] px-5 py-3 rounded-xl flex items-center justify-center hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                <img 
                  src="https://img.icons8.com/?size=100&id=85559&format=png&color=000000" 
                  alt="Mail Icon" 
                  className="w-5 h-5 object-contain"
                />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
