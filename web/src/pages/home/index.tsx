import { RecentApplications } from '@/pages/dashboard/RecentApplications';
import { WelcomeBanner } from '@/pages/dashboard/WelcomeBanner';
import { StatsCards } from '@/pages/dashboard/StatsCards';
import { UsageDetails } from '@/pages/dashboard/UsageDetails';
import { useNavigate } from 'react-router-dom';


export function Home() {
    const navigate = useNavigate();
    const handleNavigate = (page: string) => {
        navigate(`/${page}`);
    };
    return( <>
        <WelcomeBanner />
            <StatsCards />
            <RecentApplications onNavigate={handleNavigate} />
        <UsageDetails />
        </>)
}