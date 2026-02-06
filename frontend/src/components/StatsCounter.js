import { useEffect, useState, useRef } from "react";
import { Users, Eye, Calendar, MapPin } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

const StatsCounter = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState({
    visitors: 0,
    followers: 0,
    events: 0,
    countries: 0
  });
  const ref = useRef(null);
  const { t } = useLanguage();

  const targetCounts = {
    visitors: 5000000,
    followers: 150000,
    events: 365,
    countries: 45
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setCounts({
        visitors: Math.floor(targetCounts.visitors * easeOut),
        followers: Math.floor(targetCounts.followers * easeOut),
        events: Math.floor(targetCounts.events * easeOut),
        countries: Math.floor(targetCounts.countries * easeOut)
      });

      if (step >= steps) {
        clearInterval(timer);
        setCounts(targetCounts);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [isVisible]);

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
  };

  const stats = [
    {
      icon: Users,
      value: counts.visitors,
      label: t('pilgrims'),
      suffix: "+"
    },
    {
      icon: Eye,
      value: counts.followers,
      label: t('onlineFollowers'),
      suffix: "+"
    },
    {
      icon: Calendar,
      value: counts.events,
      label: t('daysOfDevotion'),
      suffix: "/an"
    },
    {
      icon: MapPin,
      value: counts.countries,
      label: t('countriesRepresented'),
      suffix: ""
    }
  ];

  return (
    <section ref={ref} className="py-16 bg-[#004D33]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-2">
            {t('statsTitle')}
          </h2>
          <div className="w-24 h-1 bg-[#D4AF37] mx-auto"></div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="text-center group"
              >
                <div className="w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-8 h-8 text-[#004D33]" />
                </div>
                <p className="text-4xl lg:text-5xl font-bold text-white mb-2">
                  {formatNumber(stat.value)}{stat.suffix}
                </p>
                <p className="text-white/70">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsCounter;
