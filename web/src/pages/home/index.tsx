import {  RecentApplications, WelcomeBanner, StatsCards, UsageDetails } from '@/pages';
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