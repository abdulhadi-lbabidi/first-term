import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { roomService } from '../services';
import { Room, Branch } from '../types';

import HeroSection from '../components/home/HeroSection';
import AboutSection from '../components/home/AboutSection';
import FeaturedSection from '../components/home/FeaturedSection';
import BranchesSection from '../components/home/BranchesSection';
import ServicesSection from '../components/home/ServicesSection';
import SEO from '../components/SEO';
export default function Home() {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || 'en';
  const navigate = useNavigate();

  const [featuredRooms, setFeaturedRooms] = useState<Room[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  // Hero Search States
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedCapacity, setSelectedCapacity] = useState<number | ''>('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedBranch) params.set('branch', selectedBranch);
    if (selectedCapacity) params.set('capacity', String(selectedCapacity));
    if (searchQuery) params.set('q', searchQuery);

    navigate(`/${currentLang}/rooms?${params.toString()}`);
  };

  useEffect(() => {
    const loadHomeData = async () => {
      setLoading(true);
      try {
        const fetchedBranches = await roomService.getBranches();
        setBranches(fetchedBranches);

        const featured = await roomService.getFeaturedRooms(3);
        setFeaturedRooms(featured);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  return (
    <div className="font-interfaceEn">
      <SEO title={t('common.home')} />
      {/* 1. Hero search and presentation section */}
      <HeroSection
        branches={branches}
        currentLang={currentLang}
        selectedBranch={selectedBranch}
        setSelectedBranch={setSelectedBranch}
        selectedCapacity={selectedCapacity}
        setSelectedCapacity={setSelectedCapacity}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleHeroSearch={handleHeroSearch}
        t={t}
      />

      {/* 2. Editorial Description section */}
      <AboutSection
        currentLang={currentLang}
        t={t}
      />

      {/* 3. Featured suite selections */}
      <FeaturedSection
        featuredRooms={featuredRooms}
        branches={branches}
        loading={loading}
        currentLang={currentLang}
        t={t}
      />

      {/* 4. Hotel locations destinations grid */}
      <BranchesSection
        branches={branches}
        currentLang={currentLang}
        t={t}
      />

      {/* 5. Services grid */}
      <ServicesSection
        t={t}
        currentLang={currentLang}
      />
    </div>
  );
}
