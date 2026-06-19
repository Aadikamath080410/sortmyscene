import React, { useState } from 'react';
import { Venue, MusicEvent } from '../types';
import { mockVenues } from '../data/mockVenues';
import { MapPin, Users, Info, Compass, Calendar, Sparkles, ArrowRight, Music, AlertCircle } from 'lucide-react';

interface VenuesViewProps {
  events: MusicEvent[];
  onSelectEventDetail: (event: MusicEvent) => void;
  onShowNotification: (msg: string) => void;
}

export default function VenuesView({
  events,
  onSelectEventDetail,
  onShowNotification
}: VenuesViewProps) {
  const [selectedStageFilter, setSelectedStageFilter] = useState<string | null>(null);

  // Helper to discover events held at a specific venue/stage
  const getEventsForStage = (stageName: string) => {
    return events.filter(ev => ev.stage === stageName);
  };

  const filteredVenues = selectedStageFilter 
    ? mockVenues.filter(v => v.stage === selectedStageFilter)
    : mockVenues;

  return (
    <div className="space-y-12 animate-in fade-in-50 slide-in-from-bottom-6 duration-500">
      
      {/* Header section */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight uppercase">
          Festival Venues
        </h1>
        
        <p className="text-sm text-[#cfc2d6] leading-relaxed">
          Explore the professional, community-centric, and acoustically optimized spaces housing NeonBeat curated experiences.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={() => {
            setSelectedStageFilter(null);
            onShowNotification("Showing all festival venues");
          }}
          className={`px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
            selectedStageFilter === null
              ? 'electric-gradient text-[#0b1326] font-black'
              : 'bg-white/5 text-[#cfc2d6] hover:bg-white/10 hover:text-white border border-white/10'
          }`}
        >
          All Locations
        </button>
        {Array.from(new Set(mockVenues.map(v => v.stage))).map(stage => (
          <button
            key={stage}
            onClick={() => {
              setSelectedStageFilter(stage);
              onShowNotification(`Filtered to ${stage} venue`);
            }}
            className={`px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
              selectedStageFilter === stage
                ? 'electric-gradient text-[#0b1326] font-black'
                : 'bg-white/5 text-[#cfc2d6] hover:bg-white/10 hover:text-white border border-white/10'
            }`}
          >
            {stage}
          </button>
        ))}
      </div>

      {/* Venues Grid Layout */}
      <div className="grid grid-cols-1 gap-12 lg:gap-16">
        {filteredVenues.map((venue, idx) => {
          const stageEvents = getEventsForStage(venue.stage);
          
          return (
            <div 
              key={venue.id}
              className={`flex flex-col lg:flex-row bg-[#11192e]/60 border border-white/10 rounded-3xl overflow-hidden glass-panel hover:border-[#b76dff]/30 transition-all duration-300 shadow-xl ${
                idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
              id={`venue-${venue.id}`}
            >
              {/* Cover Image Frame */}
              <div className="w-full lg:w-1/2 relative min-h-[300px] lg:min-h-[500px]">
                <img 
                  referrerPolicy="no-referrer"
                  src={venue.imageUrl} 
                  alt={venue.name} 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#0b1326] via-transparent to-transparent opacity-80" />
                
                {/* Float coordinates badge */}
                <div className="absolute top-4 left-4 bg-[#0b1326]/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg text-[10px] font-mono text-[#38bdf8] flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 animate-spin-slow" />
                  <span>{venue.coordinates}</span>
                </div>
              </div>

              {/* Core Information & Dynamic Events list inside Venue */}
              <div className="w-full lg:w-1/2 p-6 sm:p-10 flex flex-col justify-between space-y-8">
                <div className="space-y-4">
                  {/* Category stage label */}
                  <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest text-[#38bdf8] bg-[#38bdf8]/10 border border-[#38bdf8]/20 px-3 py-1 rounded-full">
                    {venue.stage}
                  </span>

                  <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight uppercase leading-tight pt-1">
                    {venue.name}
                  </h2>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-red-400" />
                      {venue.address}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-[#b76dff]" />
                      Max {venue.capacity} capacity
                    </span>
                  </div>

                  <p className="text-sm text-[#cfc2d6] leading-relaxed font-sans">
                    {venue.description}
                  </p>

                  {/* Feature tokens list */}
                  <div className="pt-2">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-[#b76dff] mb-2">Venue Specs &amp; Highlights</p>
                    <div className="flex flex-wrap gap-2">
                      {venue.features.map(f => (
                        <span key={f} className="text-[11px] font-mono bg-[#1c2a49] text-white border border-white/5 py-1 px-2.5 rounded-md">
                          ◆ {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sub-section: Scheduled Events in this venue */}
                <div className="border-t border-white/5 pt-6 space-y-3">
                  <h3 className="text-xs uppercase font-mono tracking-widest text-[#ddb7ff] flex items-center gap-2">
                    <Music className="w-4 h-4 text-[#38bdf8]" /> Scheduled Events At This Venue
                  </h3>

                  {stageEvents.length === 0 ? (
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-mono bg-white/5 p-3 rounded-lg">
                      <AlertCircle className="w-4 h-4" /> No upcoming lineup currently scheduled.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {stageEvents.map(event => (
                        <div 
                          key={event.id}
                          onClick={() => onSelectEventDetail(event)}
                          className="group bg-[#15233c] hover:bg-[#1a2d4d] border border-white/5 hover:border-[#b76dff]/30 p-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-3 text-left"
                        >
                          <div className="space-y-1 min-w-0">
                            <h4 className="text-xs font-bold text-white group-hover:text-[#ddb7ff] transition-colors truncate">
                              {event.title}
                            </h4>
                            <p className="text-[9px] font-mono text-slate-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-[#38bdf8]" />
                              {event.date}
                            </p>
                          </div>
                          
                          <div className="flex-shrink-0 p-1.5 rounded-full bg-white/5 text-white group-hover:bg-[#b76dff]/20 group-hover:text-white transition-all">
                            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 duration-200" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
