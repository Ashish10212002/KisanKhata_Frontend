import React, { useState, useEffect } from 'react';
import { MapPin, Loader, CloudSun, Wind, Droplets, Calendar } from 'lucide-react';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export default function WeatherWidget() {
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      loadFallback();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        loadData(latitude, longitude);
      },
      () => loadFallback()
    );
  }, []);

  const loadFallback = () => {
    setCurrent({
      name: "Hyderabad",
      main: { temp: 28, humidity: 65 },
      wind: { speed: 12 },
      weather: [{ icon: "02d", description: "Partly Cloudy" }]
    });
    // Fake Forecast
    setForecast([
      { date: 'Tomorrow', temp: 29, icon: '01d' },
      { date: 'Wed', temp: 27, icon: '10d' }, // Rain
      { date: 'Thu', temp: 30, icon: '02d' }
    ]);
    setLoading(false);
  };

  const loadData = async (lat, lon) => {
    try {
      // 1. Fetch Current
      const currentRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      const currentData = await currentRes.json();
      setCurrent(currentData);

      // 2. Fetch 5-Day Forecast
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      const forecastData = await forecastRes.json();

      // Filter: Get one reading per day (e.g., Noon) to represent the daily forecast
      // The API returns data every 3 hours. We pick the one closest to 12:00 PM.
      const dailyData = forecastData.list.filter(reading => reading.dt_txt.includes("12:00:00")).slice(0, 3);
      
      const processedForecast = dailyData.map(day => ({
        date: new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
        temp: Math.round(day.main.temp),
        icon: day.weather[0].icon
      }));

      setForecast(processedForecast);

    } catch (err) {
      loadFallback();
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="bg-gray-100 rounded-2xl p-6 w-full md:w-80 h-48 animate-pulse flex flex-col gap-4">
       <div className="h-4 bg-gray-200 rounded w-1/2"></div>
       <div className="h-10 bg-gray-200 rounded w-1/3"></div>
       <div className="h-12 bg-gray-200 rounded w-full mt-auto"></div>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white shadow-xl shadow-blue-500/20 w-full md:w-80 relative overflow-hidden group">
       
       {/* Background Decoration */}
       <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>

       {/* --- TOP SECTION: Current Weather --- */}
       <div className="flex justify-between items-start relative z-10">
          <div>
            <div className="flex items-center gap-1 opacity-80 text-xs font-bold uppercase tracking-wider mb-1">
               <MapPin size={12} /> {current.name}
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight">
              {Math.round(current.main.temp)}°
            </h2>
            <p className="text-blue-100 text-xs font-medium capitalize mt-1 flex items-center gap-1">
               {current.weather[0].description}
            </p>
          </div>

          <div className="flex flex-col items-end gap-1">
            <img 
              src={`https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`} 
              alt="weather" 
              className="w-14 h-14 -mt-2 drop-shadow-lg"
            />
          </div>
       </div>

       {/* --- MIDDLE SECTION: Details --- */}
       <div className="flex gap-4 mt-3 mb-4 text-xs text-blue-100/80 font-medium">
          <div className="flex items-center gap-1">
             <Droplets size={12}/> {current.main.humidity}%
          </div>
          <div className="flex items-center gap-1">
             <Wind size={12}/> {Math.round(current.wind.speed)} km/h
          </div>
       </div>

       {/* --- BOTTOM SECTION: 3-Day Forecast --- */}
       <div className="pt-3 border-t border-white/10 grid grid-cols-3 divide-x divide-white/10 relative z-10">
          {forecast.map((day, index) => (
            <div key={index} className="flex flex-col items-center text-center px-1">
              <span className="text-[10px] uppercase opacity-70 mb-1">{day.date}</span>
              <img 
                src={`https://openweathermap.org/img/wn/${day.icon}.png`} 
                alt="icon" 
                className="w-8 h-8 -my-1"
              />
              <span className="text-sm font-bold">{day.temp}°</span>
            </div>
          ))}
       </div>
    </div>
  );
}