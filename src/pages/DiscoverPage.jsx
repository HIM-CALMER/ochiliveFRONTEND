import { useEffect } from 'react';
import DashboardShell from '../components/DashboardShell';
import SponsoredBanner from '../components/discovery/SponsoredBanner';
import screenLogo from '../assets/animations/screen.png';
import LiveSection from '../components/discovery/LiveSection';
import UpcomingShowsSection from '../components/discovery/UpcomingShowsSection';
import PopularClipsSection from '../components/discovery/PopularClipsSection';
import RecommendedSection from '../components/discovery/RecommendedSection';
import FreshOnTheMicSection from '../components/discovery/FreshOnTheMicSection';
import { getDiscoverItems } from '../api/dashboardApi';

function DiscoverPage() {
  useEffect(() => {
    // warm the discover API cache silently
    getDiscoverItems().catch(() => {});
  }, []);

  const placeholder = screenLogo;

  return (
    <DashboardShell title="Discover" subtitle="Curated and trending content" className="px-0">
      <div className="mx-auto w-full max-w-6xl px-4">
        <SponsoredBanner image={placeholder} />
        <LiveSection />
        <UpcomingShowsSection />
        <PopularClipsSection />
        <RecommendedSection />
        <FreshOnTheMicSection />
      </div>
    </DashboardShell>
  );
}

export default DiscoverPage;

