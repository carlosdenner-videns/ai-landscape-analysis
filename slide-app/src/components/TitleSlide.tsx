import { Segment } from '../types';

/**
 * Props for TitleSlide component
 */
interface TitleSlideProps {
  segment: Segment & {
    presenter?: {
      name: string;
      title: string;
      organization: string;
      date: string;
      conference: string;
    };
  };
  showNotes: boolean;
}

/**
 * Professional title slide component for conference presentations
 * Features VIDENS branding, animations, and presenter information
 */
export function TitleSlide({ segment, showNotes }: TitleSlideProps) {
  return (
    <div className="h-full relative title-slide overflow-hidden">
      {/* Animated AI dots */}
      <div className="ai-dots animate-floatingDots"></div>
      <div className="ai-dots animate-floatingDots"></div>
      <div className="ai-dots animate-floatingDots"></div>
      <div className="ai-dots animate-floatingDots"></div>
      <div className="ai-dots animate-floatingDots"></div>

      {/* Main content container */}
      <div className="h-full flex flex-col justify-center items-center px-safe py-safe text-center relative z-10">
        
        {/* VIDENS branding */}
        <div className="absolute top-8 left-8 animate-slideInLeft">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-videns-primary rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm animate-aiPulse"></div>
            </div>
            <span className="text-videns-secondary font-bold text-xl">VIDENS</span>
          </div>
        </div>

        {/* Date */}
        <div className="absolute top-8 right-8 animate-slideInRight">
          <span className="text-videns-secondary font-medium text-lg">
            {segment.presenter?.date || '14 de agosto, 2025'}
          </span>
        </div>

        {/* Main title section */}
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Main title */}
          <div className="animate-fadeIn" style={{ animationDelay: '0.5s', opacity: 0 }}>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-videns-secondary leading-tight mb-6">
              {segment.title}
            </h1>
            <h2 className="text-2xl md:text-3xl lg:text-4xl text-videns-700 leading-relaxed font-light">
              {segment.subtitle}
            </h2>
          </div>

          {/* Abstract/Description */}
          <div className="animate-fadeIn max-w-3xl mx-auto" style={{ animationDelay: '1s', opacity: 0 }}>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-videns-200">
              <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
                {segment.bullets.map((bullet, index) => (
                  <p key={index} className="animate-slideInLeft" style={{ animationDelay: `${1.2 + index * 0.2}s`, opacity: 0 }}>
                    {bullet}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Presenter information */}
          {segment.presenter && (
            <div className="animate-fadeIn" style={{ animationDelay: '2.5s', opacity: 0 }}>
              <div className="bg-videns-50/90 backdrop-blur-sm rounded-xl p-6 shadow-md border border-videns-200">
                <h3 className="text-2xl font-bold text-videns-secondary mb-2">
                  {segment.presenter.name}
                </h3>
                <p className="text-videns-700 text-lg">
                  {segment.presenter.title}
                </p>
                <p className="text-videns-600 font-medium">
                  {segment.presenter.organization}
                </p>
                {segment.presenter.conference && (
                  <p className="text-videns-500 text-sm mt-2 italic">
                    {segment.presenter.conference}
                  </p>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Subtle AI-themed decoration */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-fadeIn" style={{ animationDelay: '3s', opacity: 0 }}>
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-videns-accent rounded-full animate-aiPulse" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-videns-accent rounded-full animate-aiPulse" style={{ animationDelay: '0.3s' }}></div>
            <div className="w-2 h-2 bg-videns-accent rounded-full animate-aiPulse" style={{ animationDelay: '0.6s' }}></div>
          </div>
        </div>

      </div>

      {/* Speaker notes overlay */}
      {showNotes && segment.notes && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/90 text-white p-6 backdrop-blur-sm">
          <h4 className="font-bold mb-2 text-yellow-400">📝 Notas del Presentador:</h4>
          <p className="text-sm leading-relaxed">{segment.notes}</p>
        </div>
      )}
    </div>
  );
}
