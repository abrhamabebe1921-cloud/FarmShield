import React, { useState, useEffect } from 'react';
import {
  Globe2,
  Search,
  Filter,
  Layers,
  Sprout,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Building2,
  MapPin,
  ExternalLink,
  ChevronRight,
  Info,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FarmShieldApi } from '../services/api';
import { CountryConfig, Crop } from '../types';
import { useFarmShield } from '../context/FarmShieldContext';
import { CountryAgricultureImage } from '../components/common/CountryAgricultureImage';
import { CountryFlag } from '../components/common/CountryFlag';

export const CountryExplorerPage: React.FC = () => {
  const navigate = useNavigate();
  const { setSelectedCountryCode: setGlobalCountryCode } = useFarmShield();
  const [countries, setCountries] = useState<CountryConfig[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('ET');
  const [activeCountry, setActiveCountry] = useState<CountryConfig | null>(null);
  const [countryCrops, setCountryCrops] = useState<Crop[]>([]);
  const [dataAvailability, setDataAvailability] = useState<any | null>(null);
  const [loadingDetails, setLoadingDetails] = useState<boolean>(false);

  // Fetch all 54 African countries and regions
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [cRes, rRes] = await Promise.all([
          FarmShieldApi.getCountries(),
          FarmShieldApi.getCountryRegions()
        ]);
        if (cRes.success && cRes.data) {
          const sorted = [...cRes.data].sort((a, b) => a.name.localeCompare(b.name));
          setCountries(sorted);
          const defaultC = sorted.find(c => c.isoCode === 'ET') || sorted[0];
          if (defaultC) {
            setSelectedCountryCode(defaultC.isoCode);
            setActiveCountry(defaultC);
          }
        }
        if (rRes.success && rRes.data) {
          setRegions(rRes.data);
        }
      } catch (err) {
        console.error('Failed to load African country catalog:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Fetch crops and data availability when active country changes
  useEffect(() => {
    if (!selectedCountryCode) return;
    async function loadCountryDetails() {
      try {
        setLoadingDetails(true);
        const [cropsRes, availRes] = await Promise.all([
          FarmShieldApi.getCountryCrops(selectedCountryCode),
          FarmShieldApi.getCountryDataAvailability(selectedCountryCode)
        ]);
        if (cropsRes.success && cropsRes.data) {
          setCountryCrops(cropsRes.data);
        }
        if (availRes.success && availRes.data) {
          setDataAvailability(availRes.data);
        }
      } catch (err) {
        console.error('Failed to load country details:', err);
      } finally {
        setLoadingDetails(false);
      }
    }
    loadCountryDetails();
  }, [selectedCountryCode]);

  // Filter countries by region, status, and search query
  const filteredCountries = countries.filter(c => {
    const matchesRegion = selectedRegion === 'ALL' || c.region?.toLowerCase() === selectedRegion.toLowerCase();
    const isPilot = c.operationalStatus === 'PILOT_OPERATIONAL' || c.supportStatus === 'fully_supported';
    const matchesStatus =
      selectedStatusFilter === 'ALL' ||
      (selectedStatusFilter === 'PILOT' && isPilot) ||
      (selectedStatusFilter === 'DIRECTORY' && !isPilot);

    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = !q ||
      c.name.toLowerCase().includes(q) ||
      c.isoCode.toLowerCase().includes(q) ||
      (c.capital && c.capital.toLowerCase().includes(q)) ||
      (c.isoAlpha3 && c.isoAlpha3.toLowerCase().includes(q));

    return matchesRegion && matchesStatus && matchesQuery;
  });

  const handleSelectCountry = (country: CountryConfig) => {
    setSelectedCountryCode(country.isoCode);
    setActiveCountry(country);
  };

  const handleSetAsActiveContext = (country: CountryConfig) => {
    setGlobalCountryCode(country.isoCode);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Dark Forest Green */}
      <div className="bg-[#132A20]/80 border border-[#8EB897]/20 rounded-3xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-[#0C1B14] border border-[#2ECC71]/30 text-[#2ECC71]">
                <Globe2 className="w-6 h-6" />
              </span>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">African Country Explorer</h1>
                <p className="text-xs sm:text-sm text-[#A0AEC0]">
                  Pan-African coverage database across all 54 African sovereign states.
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#2ECC71] text-[#0C1B14]">
              54 Sovereign States
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#F1C40F]/20 text-[#F1C40F] border border-[#F1C40F]/40">
              5 Pilot Operational
            </span>
          </div>
        </div>

        {/* Search & Region Filters */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0AEC0]" />
            <input
              type="text"
              placeholder="Search by country name, ISO code, or capital..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-[#8EB897]/20 bg-[#0C1B14] text-white focus:outline-none focus:border-[#2ECC71]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {['ALL', 'East Africa', 'West Africa', 'North Africa', 'Southern Africa', 'Central Africa'].map(reg => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedRegion === reg
                    ? 'bg-[#2ECC71] text-[#0C1B14] shadow-md font-bold'
                    : 'bg-[#0C1B14] text-[#A0AEC0] hover:text-white border border-[#8EB897]/15'
                }`}
              >
                {reg === 'ALL' ? 'All Regions' : reg}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Country List (Left) + Detailed Country Intelligence (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Country Selector List */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
          <div className="text-xs font-bold uppercase tracking-wider text-[#8EB897] px-1 flex items-center justify-between">
            <span>Matching Countries ({filteredCountries.length})</span>
            <div className="flex items-center gap-1.5 text-[10px]">
              <button
                onClick={() => setSelectedStatusFilter('ALL')}
                className={`px-2 py-0.5 rounded ${selectedStatusFilter === 'ALL' ? 'bg-[#2ECC71] text-[#0C1B14] font-bold' : 'text-[#A0AEC0]'}`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedStatusFilter('PILOT')}
                className={`px-2 py-0.5 rounded ${selectedStatusFilter === 'PILOT' ? 'bg-[#2ECC71] text-[#0C1B14] font-bold' : 'text-[#A0AEC0]'}`}
              >
                Pilots
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-[#A0AEC0]">Loading African country registry...</div>
          ) : filteredCountries.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#A0AEC0] bg-[#132A20]/80 rounded-2xl border border-[#8EB897]/15">
              No African state found matching "{searchQuery}".
            </div>
          ) : (
            filteredCountries.map(country => {
              const isSelected = country.isoCode === selectedCountryCode;
              const isPilot = country.operationalStatus === 'PILOT_OPERATIONAL' || country.supportStatus === 'fully_supported';
              return (
                <div
                  key={country.id}
                  onClick={() => handleSelectCountry(country)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#132A20] border-[#2ECC71] ring-2 ring-[#2ECC71]/30 shadow-lg'
                      : 'bg-[#132A20]/70 border-[#8EB897]/15 hover:border-[#8EB897]/35'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <CountryFlag countryCode={country.isoCode} countryName={country.name} size="md" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-xs text-white truncate">{country.name}</h3>
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-[#0C1B14] text-[#8EB897] border border-[#8EB897]/20">
                            {country.isoAlpha3 || country.isoCode}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#A0AEC0] truncate">
                          Capital: {country.capital || 'N/A'} • {country.region}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-[8px] font-bold px-1.5 py-0.5 rounded-sm uppercase ${
                          isPilot
                            ? 'bg-[#2ECC71]/20 text-[#2ECC71] border border-[#2ECC71]/40'
                            : 'bg-[#F1C40F]/15 text-[#F1C40F] border border-[#F1C40F]/30'
                        }`}
                      >
                        {isPilot ? 'Pilot' : 'Directory'}
                      </span>
                      <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-[#2ECC71]' : 'text-[#A0AEC0]/40'}`} />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Active Country Agricultural Profile */}
        <div className="lg:col-span-7 space-y-6">
          {activeCountry ? (
            <>
              {/* Country Overview Card */}
              <div className="bg-[#132A20]/80 border border-[#8EB897]/20 rounded-3xl p-6 shadow-xl space-y-5 backdrop-blur-md">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <CountryFlag countryCode={activeCountry.isoCode} countryName={activeCountry.name} size="lg" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold text-white tracking-tight">{activeCountry.name}</h2>
                        <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-[#2ECC71] text-[#0C1B14]">
                          {activeCountry.isoCode} / {activeCountry.isoAlpha3}
                        </span>
                      </div>
                      <p className="text-xs text-[#A0AEC0] mt-0.5">
                        Capital: <strong className="text-white">{activeCountry.capital || 'N/A'}</strong> • Region: <strong className="text-white">{activeCountry.region}</strong>
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      activeCountry.operationalStatus === 'PILOT_OPERATIONAL'
                        ? 'bg-[#2ECC71]/20 text-[#2ECC71] border-[#2ECC71]/40'
                        : 'bg-[#F1C40F]/20 text-[#F1C40F] border-[#F1C40F]/40'
                    }`}
                  >
                    {activeCountry.operationalStatus === 'PILOT_OPERATIONAL' ? 'PILOT OPERATIONAL' : 'DIRECTORY ONLY'}
                  </span>
                </div>

                {/* Country Specific Agricultural Visual */}
                <CountryAgricultureImage
                  countryCode={activeCountry.isoCode}
                  countryName={activeCountry.name}
                  imageUrl={activeCountry.countryImage}
                  caption={activeCountry.imageCaption}
                  agricultureSubject={activeCountry.agriculturalRegions?.[0] || 'Agronomic Observation Zone'}
                  aspectRatio="wide"
                />

                {/* Quick Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#8EB897]/15">
                  <button
                    onClick={() => handleSetAsActiveContext(activeCountry)}
                    className="px-4 py-2 rounded-xl bg-[#0C1B14] hover:bg-[#0C1B14]/80 text-[#2ECC71] border border-[#2ECC71]/30 font-bold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Set as Active Platform Context</span>
                  </button>

                  <button
                    onClick={() => navigate(`/country-dashboard/${activeCountry.isoCode}`)}
                    className="px-4 py-2 rounded-xl bg-[#2ECC71] text-[#0C1B14] hover:bg-[#27ae60] font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-[#2ECC71]/20"
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Open National Agricultural Dashboard</span>
                  </button>
                </div>
              </div>

              {/* Verified Crops in this Country */}
              <div className="bg-[#132A20]/80 border border-[#8EB897]/20 rounded-3xl p-6 shadow-xl space-y-4 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Sprout className="w-5 h-5 text-[#2ECC71]" />
                    <h3 className="font-bold text-base text-white">
                      Relevant Agricultural Crops ({countryCrops.length})
                    </h3>
                  </div>
                  <span className="text-xs text-[#8EB897]">National Package</span>
                </div>

                {loadingDetails ? (
                  <div className="py-6 text-center text-xs text-[#A0AEC0]">Loading verified crops...</div>
                ) : countryCrops.length === 0 ? (
                  <div className="py-4 text-center text-xs text-[#A0AEC0]">
                    Standard pan-African crops apply. Consult regional extension guidelines.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {countryCrops.map(crop => (
                      <div
                        key={crop.id}
                        className="p-3 rounded-xl border border-[#8EB897]/15 hover:border-[#2ECC71]/40 bg-[#0C1B14]/60 transition-all"
                      >
                        <div className="font-bold text-xs text-white">{crop.name}</div>
                        <div className="text-[10px] text-[#A0AEC0] italic mt-0.5">{crop.scientificName}</div>
                        <div className="mt-2 flex items-center justify-between text-[10px]">
                          <span className="px-1.5 py-0.5 rounded bg-[#2ECC71]/15 text-[#2ECC71] font-medium">
                            {crop.category}
                          </span>
                          <span className="text-[#A0AEC0]">
                            {crop.growingDurationDays ? `${crop.growingDurationDays.min}-${crop.growingDurationDays.max}d` : ''}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-[#132A20]/80 border border-[#8EB897]/20 rounded-3xl p-12 text-center text-sm text-[#A0AEC0]">
              Select a country from the list on the left to inspect its agricultural profile.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
