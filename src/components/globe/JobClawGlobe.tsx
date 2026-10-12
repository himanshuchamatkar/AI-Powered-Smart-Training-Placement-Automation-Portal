import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import Globe from 'react-globe.gl';
import { JobPin, CountryJobCount } from '@/types/jobclaw';
import { COUNTRY_NAMES } from '@/data/jobclawJobs';

interface JobClawGlobeProps {
  pins: JobPin[];
  countryCounts: CountryJobCount[];
  selectedPin: JobPin | null;
  onSelectPin: (pin: JobPin) => void;
  onSelectCountry: (countryCode: string, countryName: string) => void;
  matchScores?: Record<string, number>;
  isRotated?: boolean;
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getMatchPinColor(score: number): string {
  if (score >= 75) return '#10b981'; // Emerald (high match)
  if (score >= 50) return '#f59e0b'; // Amber
  if (score > 0) return '#3b82f6';  // Blue
  return '#06b6d4'; // Cyan default
}

export const JobClawGlobe: React.FC<JobClawGlobeProps> = ({
  pins,
  countryCounts,
  selectedPin,
  onSelectPin,
  onSelectCountry,
  matchScores = {},
  isRotated = true,
}) => {
  const globeRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const [hasWebGL, setHasWebGL] = useState(true);
  const [countriesGeo, setCountriesGeo] = useState<any[]>([]);

  // Calculate container dimensions
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setDimensions({
          width: clientWidth || 800,
          height: clientHeight || 520,
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Fetch Natural Earth 110m countries geojson with fallback
  useEffect(() => {
    let active = true;
    fetch('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch geojson');
        return res.json();
      })
      .then((data) => {
        if (active && data?.features) {
          setCountriesGeo(data.features);
        }
      })
      .catch((err) => {
        console.warn('Globe GeoJSON online fetch failed, using point-only mode', err);
      });

    return () => {
      active = false;
    };
  }, []);

  // Map counts per country code
  const countryCountMap = useMemo(() => {
    const map = new Map<string, number>();
    countryCounts.forEach((c) => map.set(c.country, c.count));
    return map;
  }, [countryCounts]);

  const maxCount = useMemo(() => {
    return Math.max(...countryCounts.map((c) => c.count), 1);
  }, [countryCounts]);

  // Initial viewpoint: Focus on India & Indo-Pacific (lat: 20.59, lng: 78.96, altitude: 2.3)
  useEffect(() => {
    const initControls = () => {
      const globe = globeRef.current;
      if (globe && globe.pointOfView) {
        globe.pointOfView({ lat: 21.0, lng: 78.5, altitude: 2.2 }, 1000);
        const controls = globe.controls?.();
        if (controls) {
          controls.autoRotate = isRotated;
          controls.autoRotateSpeed = 0.25;
          controls.enableZoom = true;
        }
        return true;
      }
      return false;
    };

    if (!initControls()) {
      const timer = setTimeout(initControls, 400);
      return () => clearTimeout(timer);
    }
  }, [isRotated]);

  // Zoom to selected pin when user selects one
  useEffect(() => {
    if (selectedPin && globeRef.current?.pointOfView) {
      globeRef.current.pointOfView(
        {
          lat: selectedPin.job_latitude,
          lng: selectedPin.job_longitude,
          altitude: 1.5,
        },
        1200
      );
      if (globeRef.current.controls?.()) {
        globeRef.current.controls().autoRotate = false;
      }
    }
  }, [selectedPin]);

  // Rings data for high-priority placement opportunities (e.g., jobs in India & top matches)
  const ringsData = useMemo(() => {
    return pins.slice(0, 15).map((p) => {
      const score = matchScores[p.job_id] || 0;
      return {
        lat: p.job_latitude,
        lng: p.job_longitude,
        maxR: score >= 75 ? 3.5 : 2.5,
        propagationSpeed: 1.5,
        repeatPeriod: 1200,
        color: score >= 75 ? '#10b981' : '#06b6d4',
      };
    });
  }, [pins, matchScores]);

  // Country polygon color computation
  const getPolygonColor = useCallback(
    (feat: any) => {
      const iso = feat.properties?.ISO_A2 || feat.properties?.iso_a2;
      const count = countryCountMap.get(iso) || 0;
      if (count === 0) {
        return 'rgba(15, 23, 42, 0.45)'; // Sleek slate navy
      }

      const intensity = 0.4 + 0.6 * (Math.log(count + 1) / Math.log(maxCount + 1));
      if (iso === 'IN') {
        return `rgba(245, 158, 11, ${0.45 + 0.4 * intensity})`; // Warm amber glow for India
      }
      return `rgba(16, 185, 129, ${0.35 + 0.4 * intensity})`; // Emerald glow for active global tech hubs
    },
    [countryCountMap, maxCount]
  );

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-slate-950 rounded-2xl flex items-center justify-center">
      {/* Background Starfield / Atmosphere Glow */}
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-40" />

      <Globe
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        backgroundColor="rgba(3, 7, 18, 1)"
        showAtmosphere={true}
        atmosphereColor="#38bdf8"
        atmosphereAltitude={0.2}
        
        // Country Polygons
        polygonsData={countriesGeo}
        polygonCapColor={getPolygonColor}
        polygonSideColor={() => 'rgba(30, 41, 59, 0.4)'}
        polygonStrokeColor={() => 'rgba(71, 85, 105, 0.45)'}
        polygonAltitude={0.01}
        onPolygonClick={(feat: any) => {
          const iso = feat.properties?.ISO_A2 || feat.properties?.iso_a2;
          const name = feat.properties?.ADMIN || feat.properties?.name || COUNTRY_NAMES[iso] || iso;
          if (iso) onSelectCountry(iso, name);
        }}
        
        // Job Pins
        pointsData={pins}
        pointLat={(d: any) => d.job_latitude}
        pointLng={(d: any) => d.job_longitude}
        pointColor={(d: any) => {
          const score = matchScores[d.job_id] || 0;
          return getMatchPinColor(score);
        }}
        pointAltitude={(d: any) => {
          const score = matchScores[d.job_id] || 0;
          return score >= 75 ? 0.08 : 0.05;
        }}
        pointRadius={(d: any) => {
          const score = matchScores[d.job_id] || 0;
          return score >= 75 ? 0.28 : 0.18;
        }}
        pointLabel={(d: any) => {
          const pin = d as JobPin;
          const score = matchScores[pin.job_id] || 0;
          const matchBadge = score > 0
            ? `<div style="color: ${getMatchPinColor(score)}; font-size: 11px; font-weight: 700; margin-top: 4px;">⚡ ${score}% Student Skill Match</div>`
            : '';
          return `
            <div style="
              background: rgba(15, 23, 42, 0.94);
              border: 1px solid rgba(56, 189, 248, 0.35);
              border-radius: 12px;
              padding: 10px 14px;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              backdrop-filter: blur(12px);
              box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
              max-width: 260px;
              color: white;
            ">
              <div style="font-size: 13px; font-weight: 700; color: #f8fafc; line-height: 1.3;">${escapeHtml(pin.job_title)}</div>
              <div style="font-size: 11px; color: #94a3b8; margin-top: 3px; font-weight: 500;">${escapeHtml(pin.employer_name)}</div>
              <div style="font-size: 11px; color: #38bdf8; margin-top: 2px;">📍 ${escapeHtml(pin.job_location)}</div>
              ${pin.salary ? `<div style="font-size: 10px; color: #fbbf24; margin-top: 2px; font-weight: 600;">💰 ${escapeHtml(pin.salary)}</div>` : ''}
              ${matchBadge}
            </div>
          `;
        }}
        onPointClick={(d: any) => onSelectPin(d as JobPin)}
        onPointHover={(d: any) => {
          const globe = globeRef.current;
          if (globe?.controls?.()) {
            globe.controls().autoRotate = d === null && isRotated;
          }
        }}

        // Pulsing radar rings
        ringsData={ringsData}
        ringLat={(d: any) => d.lat}
        ringLng={(d: any) => d.lng}
        ringColor={(d: any) => (t: number) => {
          const alpha = 1 - t;
          return d.color === '#10b981'
            ? `rgba(16, 185, 129, ${alpha * 0.7})`
            : `rgba(6, 182, 212, ${alpha * 0.7})`;
        }}
        ringMaxRadius={(d: any) => d.maxR}
        ringPropagationSpeed={(d: any) => d.propagationSpeed}
        ringRepeatPeriod={(d: any) => d.repeatPeriod}
      />
    </div>
  );
};
