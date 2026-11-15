import React, { useState } from 'react';
import {
  CloudSun,
  Layers,
  Activity,
  Droplets,
  Database,
  Info,
  Calendar,
  Sparkles,
  TrendingUp,
  FileBarChart2,
  AlertTriangle
} from 'lucide-react';
import { useFarmShield } from '../context/FarmShieldContext';
import { ClimatePage } from './ClimatePage';
import { SoilPage } from './SoilPage';
import { VegetationPage } from './VegetationPage';
import { DroughtPage } from './DroughtPage';
import { DataSourceBadge } from '../components/common/DataSourceBadge';

export const AgriculturalDataPage: React.FC = () => {
  const { selectedCountry, selectedFarm } = useFarmShield();
  const [activeTab, setActiveTab] = useState<'climate' | 'soil' | 'vegetation' | 'drought'>('climate');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-xl bg-[#2ECC71]/10 text-[#2ECC71] border border-[#2ECC71]/20">
              <Database className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Pan-African Agricultural Data & Remote Sensing Hub
              </h1>
              <p className="text-xs sm:text-sm text-[#8EB897] mt-0.5">
                Consolidated edaphic, meteorological, satellite vegetation (NDVI), and hydrological intelligence.
              </p>
            </div>
          </div>
        </div>

        <DataSourceBadge source="CHIRPS, NASA POWER, ISRIC SoilGrids, NASA SMAP & Sentinel-2 L2A" />
      </div>

      {/* Primary Section Switcher Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#0C1B14]/70 border border-[#8EB897]/20 rounded-2xl">
        <button
          onClick={() => setActiveTab('climate')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'climate'
              ? 'bg-[#2ECC71] text-[#0C1B14] shadow-md shadow-[#2ECC71]/20'
              : 'text-[#8EB897] hover:text-white'
          }`}
        >
          <CloudSun className="w-4 h-4" />
          <span>Climate & Rainfall (CHIRPS / NASA)</span>
        </button>

        <button
          onClick={() => setActiveTab('soil')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'soil'
              ? 'bg-[#2ECC71] text-[#0C1B14] shadow-md shadow-[#2ECC71]/20'
              : 'text-[#8EB897] hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Soil Health & Moisture (SoilGrids / SMAP)</span>
        </button>

        <button
          onClick={() => setActiveTab('vegetation')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'vegetation'
              ? 'bg-[#2ECC71] text-[#0C1B14] shadow-md shadow-[#2ECC71]/20'
              : 'text-[#8EB897] hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Vegetation & Canopy Vigor (Sentinel-2 NDVI)</span>
        </button>

        <button
          onClick={() => setActiveTab('drought')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'drought'
              ? 'bg-[#2ECC71] text-[#0C1B14] shadow-md shadow-[#2ECC71]/20'
              : 'text-[#8EB897] hover:text-white'
          }`}
        >
          <Droplets className="w-4 h-4" />
          <span>Drought SPI & Water Productivity (WaPOR)</span>
        </button>
      </div>

      {/* Render Sub-View Component */}
      <div>
        {activeTab === 'climate' && <ClimatePage />}
        {activeTab === 'soil' && <SoilPage />}
        {activeTab === 'vegetation' && <VegetationPage />}
        {activeTab === 'drought' && <DroughtPage />}
      </div>
    </div>
  );
};

