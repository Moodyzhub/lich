import { AppRoutes } from '@/routes/AppRoutes';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { ScrollToTop } from "@/hooks/ScrollToTop";
import { Toaster } from "@/components/ui/toaster.tsx";
import { useLocation } from 'react-router-dom';

function App() {
    const location = useLocation();
    
    // Hide footer for admin and tutor routes
    const tutorRoutes = [
        '/dashboard',
        '/students', 
        '/schedule',
        '/booked-slots',
        '/packages',
        '/tutor/courses',
        '/create-course',
        '/payments',
        '/withdrawal'
    ];
    
    const hideFooter = location.pathname.startsWith('/admin') || 
                       tutorRoutes.some(route => location.pathname.startsWith(route));

    return (
        <SidebarProvider>
            <ScrollToTop />
            <div className="min-h-screen bg-background">
                <Header />
                <main>
                    <AppRoutes />
                    <Toaster />
                </main>
                {!hideFooter && <Footer />}
            </div>
        </SidebarProvider>
    );
}

export default App;
