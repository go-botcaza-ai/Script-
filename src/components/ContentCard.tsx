import React from 'react';
import { Lock, Play, Star, Clock, ShieldCheck, Sparkles, Check, Film } from 'lucide-react';
import { ContentItem } from '../types';

interface ContentCardProps {
  item: ContentItem;
  isUnlocked: boolean;
  onSelect: (item: ContentItem) => void;
  onDirectPlay: (item: ContentItem) => void;
}

export const ContentCard: React.FC<ContentCardProps> = ({
  item,
  isUnlocked,
  onSelect,
  onDirectPlay
}) => {
  return (
    <div
      id={`content-card-${item.id}`}
      className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col"
    >
      {/* Thumbnail & Video Preview Header */}
      <div className="relative aspect-video w-full bg-slate-900 overflow-hidden cursor-pointer" onClick={() => isUnlocked ? onDirectPlay(item) : onSelect(item)}>
        <img
          src={item.thumbnail}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

        {/* Category & Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-900/80 text-white backdrop-blur-md border border-slate-700/50">
            {item.categoryLabel}
          </span>
          <span className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-white/20 text-white backdrop-blur-md">
            {item.resolution}
          </span>
        </div>

        {/* Lock or Unlock Status Pill */}
        <div className="absolute top-3 right-3">
          {isUnlocked ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500 text-white shadow-sm">
              <Check className="w-3.5 h-3.5" />
              Desbloqueado
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500 text-slate-950 shadow-sm">
              <Lock className="w-3 h-3" />
              Pay Per View
            </span>
          )}
        </div>

        {/* Center Hover Action */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-12 h-12 rounded-full bg-white/95 text-slate-900 flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110">
            {isUnlocked ? (
              <Play className="w-5 h-5 fill-slate-900 ml-0.5" />
            ) : (
              <Play className="w-5 h-5 fill-slate-900 ml-0.5" />
            )}
          </div>
        </div>

        {/* Bottom Bar on Thumbnail */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white/90 text-xs">
          <span className="flex items-center gap-1 font-medium bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs">
            <Clock className="w-3.5 h-3.5 text-slate-300" />
            {item.duration}
          </span>
          <span className="flex items-center gap-1 font-semibold text-amber-400 bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            {item.rating.toFixed(1)} ({item.reviewsCount})
          </span>
        </div>
      </div>

      {/* Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <img
              src={item.instructor.avatar}
              alt={item.instructor.name}
              className="w-5 h-5 rounded-full object-cover border border-slate-200"
            />
            <span className="text-xs text-slate-500 font-medium">
              {item.instructor.name}
            </span>
          </div>

          <h3
            id={`content-title-${item.id}`}
            onClick={() => isUnlocked ? onDirectPlay(item) : onSelect(item)}
            className="text-base font-semibold text-slate-900 line-clamp-2 hover:text-indigo-600 cursor-pointer transition-colors leading-snug"
          >
            {item.title}
          </h3>

          <p className="mt-1.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Card Footer: Price and CTA */}
        <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block uppercase font-medium">
              {isUnlocked ? 'Acceso activo' : 'Tarifa PPV'}
            </span>
            <span className="text-lg font-bold text-slate-900">
              {isUnlocked ? (
                <span className="text-emerald-600 text-sm font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Listo
                </span>
              ) : (
                `$${item.price.toFixed(2)} USD`
              )}
            </span>
          </div>

          {isUnlocked ? (
            <button
              id={`btn-play-${item.id}`}
              onClick={() => onDirectPlay(item)}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors shadow-xs"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              Ver ahora
            </button>
          ) : (
            <button
              id={`btn-unlock-${item.id}`}
              onClick={() => onSelect(item)}
              className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors shadow-xs"
            >
              <Lock className="w-3.5 h-3.5" />
              Desbloquear
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
