import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    Bell, Menu, X, Languages, Heart, User, LogOut,
    Settings, GraduationCap, CreditCard, Lock, LayoutDashboard, MessageCircle, DollarSign, Calendar
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import { useToast } from "@/components/ui/use-toast";
import { useNotifications } from "@/hooks/useNotifications";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@/contexts/UserContext";

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const { user, setUser, refreshUser, loading } = useUser();

    const token =
        localStorage.getItem("access_token") ||
        sessionStorage.getItem("access_token");

    const isAuthenticated = !!token;



    const { recentNotifications, unreadCount, markAsRead } = useNotifications();

    // === Logout ===
    const handleLogout = () => {
        // Clear all tokens
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("refresh_token");
        
        // Clear user state
        setUser(null);
        
        // Redirect to sign in page with full reload to clear all state
        window.location.href = ROUTES.SIGN_IN;
    };

    const getUserInitial = (fullName: string) => {
        if (!fullName) return "U";
        return fullName.trim()[0].toUpperCase();
    };

    const isTutorPage = /^\/tutor(\/|$)/.test(location.pathname);
    const isActive = (path: string) => location.pathname === path;

    // Refresh user when coming back from profile page
    useEffect(() => {
        if (isAuthenticated && location.pathname !== ROUTES.PROFILE) {
            // Small delay to ensure profile updates are saved
            const timer = setTimeout(() => {
                refreshUser();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [location.pathname]);

    return (
        <header className="bg-background border-b border-border sticky top-0 z-50 shadow-sm">
            <div className="w-full px-8 lg:px-16">
                <div className="flex justify-between items-center h-16 gap-4">
                    {/* ===== Logo ===== */}
                    <Link
                        to={ROUTES.HOME}
                        className="flex items-center gap-2 flex-shrink-0"
                        onClick={() => setMobileMenuOpen(false)}
                        style={{ minWidth: 'fit-content' }}
                    >
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg flex-shrink-0">
                            <Languages className="w-6 h-6 text-white flex-shrink-0" />
                        </div>
                        <div className="text-xl md:text-2xl font-bold text-foreground whitespace-nowrap flex-shrink-0">
                            Lingua<span className="text-primary">Hub</span>
                        </div>
                    </Link>

                    {/* ===== Navigation (ẩn trên mobile & tablet) ===== */}
                    {!isTutorPage && (
                        <nav className="hidden xl:flex flex-1 items-center justify-between px-4 2xl:px-8">
                            <div className="flex space-x-4 xl:space-x-6 2xl:space-x-8 pl-2 xl:pl-4 2xl:pl-6">
                                <Link
                                    to={ROUTES.HOME}
                                    className={cn(
                                        "font-medium transition-colors whitespace-nowrap text-sm xl:text-base",
                                        isActive(ROUTES.HOME)
                                            ? "text-primary"
                                            : "text-muted-foreground hover:text-primary"
                                    )}
                                >
                                    Trang chủ
                                </Link>
                                <Link
                                    to={ROUTES.LANGUAGES}
                                    className={cn(
                                        "font-medium transition-colors whitespace-nowrap text-sm xl:text-base",
                                        isActive(ROUTES.LANGUAGES)
                                            ? "text-primary"
                                            : "text-muted-foreground hover:text-primary"
                                    )}
                                >
                                    Ngôn ngữ
                                </Link>
                                <Link
                                    to={ROUTES.TUTORS}
                                    className={cn(
                                        "font-medium transition-colors whitespace-nowrap text-sm xl:text-base",
                                        isActive(ROUTES.TUTORS)
                                            ? "text-primary"
                                            : "text-muted-foreground hover:text-primary"
                                    )}
                                >
                                    Gia sư
                                </Link>
                                <Link
                                    to={ROUTES.BECOME_TUTOR}
                                    className={cn(
                                        "font-medium transition-colors whitespace-nowrap text-sm xl:text-base",
                                        isActive(ROUTES.BECOME_TUTOR)
                                            ? "text-primary"
                                            : "text-muted-foreground hover:text-primary"
                                    )}
                                >
                                    Trở thành gia sư
                                </Link>
                            </div>

                            <div className="flex items-center space-x-4 xl:space-x-6 pr-2 xl:pr-4 2xl:pr-6">
                                <Link
                                    to={ROUTES.POLICY}
                                    className={cn(
                                        "font-medium transition-colors opacity-70 hover:opacity-100 whitespace-nowrap text-sm xl:text-base",
                                        isActive(ROUTES.POLICY)
                                            ? "text-primary"
                                            : "text-muted-foreground hover:text-primary"
                                    )}
                                >
                                    Chính sách & Điều khoản
                                </Link>
                            </div>
                        </nav>
                    )}

                    {/* ===== Right Section ===== */}
                    <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
                        {/* Wishlist */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="flex-shrink-0"
                            onClick={() => {
                                if (!isAuthenticated) {
                                    const redirectURL = encodeURIComponent(location.pathname);
                                    navigate(`${ROUTES.SIGN_IN}?redirect=${redirectURL}`);

                                    toast({
                                        variant: "destructive",
                                        title: "Bạn chưa đăng nhập",
                                        description: "Vui lòng đăng nhập để xem danh sách yêu thích.",
                                    });
                                    return;
                                }
                                navigate(ROUTES.WISHLIST);

                            }}
                        >
                            <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                        </Button>

                        {/* Notifications */}
                        <DropdownMenu
                            open={isAuthenticated ? notificationsOpen : false}
                            onOpenChange={(open) => {
                                if (!isAuthenticated) {
                                    const redirectURL = encodeURIComponent(location.pathname);
                                    navigate(`${ROUTES.SIGN_IN}?redirect=${redirectURL}`);

                                    toast({
                                        variant: "destructive",
                                        title: "Bạn chưa đăng nhập",
                                        description: "Vui lòng đăng nhập để xem thông báo.",
                                    });
                                    return;
                                }
                                setNotificationsOpen(open);
                            }}
                        >
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="relative flex-shrink-0"
                                    onClick={() => {
                                        if (!isAuthenticated) {
                                            toast({
                                                variant: "destructive",
                                                title: "You are not logged in",
                                                description: "Please login to view notifications.",
                                            });
                                        }
                                    }}
                                >
                                    <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                                    {isAuthenticated && unreadCount > 0 && (
                                        <Badge 
                                            variant="destructive" 
                                            className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center p-0 text-[10px] sm:text-xs"
                                        >
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </Badge>
                                    )}
                                </Button>
                            </DropdownMenuTrigger>

                            {isAuthenticated && (
                                <DropdownMenuContent align="end" className="w-80">
                                    <DropdownMenuLabel className="flex items-center justify-between">
                                        <span>Thông báo</span>
                                        {unreadCount > 0 && (
                                            <Badge variant="secondary" className="ml-2">
                                                {unreadCount} mới
                                            </Badge>
                                        )}
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    
                                    {recentNotifications.length === 0 ? (
                                        <div className="px-4 py-6 text-sm text-muted-foreground text-center">
                                            Không có thông báo
                                        </div>
                                    ) : (
                                        <>
                                            <div className="max-h-[400px] overflow-y-auto">
                                                {recentNotifications.map((notification) => (
                                                    <DropdownMenuItem
                                                        key={notification.notificationId}
                                                        className={cn(
                                                            "flex flex-col items-start gap-1 p-3 cursor-pointer",
                                                            !notification.isRead && "bg-blue-50/50"
                                                        )}
                                                        onClick={async () => {
                                                            // Mark as read
                                                            if (!notification.isRead) {
                                                                await markAsRead(notification.notificationId);
                                                            }
                                                            
                                                            // Navigate to URL
                                                            if (notification.primaryActionUrl) {
                                                                navigate(notification.primaryActionUrl);
                                                            }
                                                            setNotificationsOpen(false);
                                                        }}
                                                    >
                                                        <div className="flex items-start justify-between w-full gap-2">
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-medium text-sm truncate">
                                                                    {notification.title}
                                                                </p>
                                                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2 break-words">
                                                                    {notification.content}
                                                                </p>
                                                                <p className="text-xs text-muted-foreground mt-1">
                                                                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                                </p>
                                                            </div>
                                                            {!notification.isRead && (
                                                                <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1" />
                                                            )}
                                                        </div>
                                                    </DropdownMenuItem>
                                                ))}
                                            </div>
                                            
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                className="justify-center text-primary font-medium cursor-pointer"
                                                onClick={() => {
                                                    navigate(ROUTES.NOTIFICATIONS);
                                                    setNotificationsOpen(false);
                                                }}
                                            >
                                                Tất cả thông báo
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                </DropdownMenuContent>
                            )}
                        </DropdownMenu>
                        {/* ROLE BADGE */}
                        {isAuthenticated && user?.role === "Tutor" && (
                            <div className="hidden sm:flex px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-semibold bg-purple-100 text-purple-700 rounded-full border border-purple-200 whitespace-nowrap flex-shrink-0">
                                Gia sư
                            </div>
                        )}
                        {/* Auth menu */}
                        {!isAuthenticated ? (
                            <>
                                <Button variant="ghost" asChild className="hidden sm:flex">
                                    <Link to={ROUTES.SIGN_IN}>Đăng nhập</Link>
                                </Button>
                                <Button asChild className="hidden sm:flex">
                                    <Link to={ROUTES.SIGN_UP}>Đăng ký</Link>
                                </Button>
                            </>
                        ) : (

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="h-10 w-10 rounded-full p-0 flex-shrink-0"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
                                        ) : (
                                            <img
                                                src={user?.avatarURL || "https://placehold.co/200x200?text=No+Image"}
                                                alt={user?.fullName || "User avatar"}
                                                className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-md"
                                                onError={(e) => {
                                                    e.currentTarget.src = "https://placehold.co/200x200?text=No+Image";
                                                }}
                                            />
                                        )}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">
                                                {user?.fullName || "Loading..."}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                 {user?.email || ""}
                                             </span>
                                        </div>
                                    </DropdownMenuLabel>

                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem asChild>
                                        <Link to={ROUTES.PROFILE}>
                                            <User className="mr-2 h-4 w-4" /> Hồ sơ
                                        </Link>
                                    </DropdownMenuItem>

                                    {user?.role === "Tutor" && (
                                        <DropdownMenuItem asChild>
                                            <Link to={ROUTES.TUTOR_DASHBOARD}>
                                                <LayoutDashboard className="mr-2 h-4 w-4" /> Bảng điều khiển
                                            </Link>
                                        </DropdownMenuItem>
                                    )}
                                        <>
                                            <DropdownMenuItem asChild>
                                                <Link to={ROUTES.MY_ENROLLMENTS}>
                                                    <GraduationCap className="mr-2 h-4 w-4" /> Tiến độ học tập
                                                </Link>
                                            </DropdownMenuItem>
                                        </>
                                    <DropdownMenuItem asChild>
                                        <Link to="/my-bookings" className="cursor-pointer">
                                            <Calendar className="mr-2 h-4 w-4" />
                                            <span>Lịch học của tôi</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link to="/messages">
                                            <MessageCircle className="mr-2 h-4 w-4" />Hộp chat
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link to={ROUTES.REFUND_REQUESTS} className="cursor-pointer">
                                            <DollarSign className="mr-2 h-4 w-4" />
                                            <span>Yêu cầu hoàn tiền</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link to={ROUTES.PAYMENT_HISTORY}>
                                            <CreditCard className="mr-2 h-4 w-4" /> Lịch sử thanh toán
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem asChild>
                                        <Link to={ROUTES.CHANGE_PASSWORD}>
                                            <Lock className="mr-2 h-4 w-4" /> Đổi mật khẩu
                                        </Link>
                                    </DropdownMenuItem>

                                    {(user?.role === "Tutor" || user?.role === "Admin") && (
                                        <DropdownMenuItem asChild>
                                            <Link
                                                to={
                                                    user.role === "Tutor"
                                                        ? "/tutor/settings"
                                                        : "/settings"
                                                }
                                            >
                                                <Settings className="mr-2 h-4 w-4" /> Cài đặt
                                            </Link>
                                        </DropdownMenuItem>
                                    )}

                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem
                                        className="text-red-600"
                                        onClick={handleLogout}
                                    >
                                        <LogOut className="mr-2 h-4 w-4" /> Đăng xuất
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}

                        {/* Mobile menu toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="xl:hidden flex-shrink-0"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? (
                                <X className="w-5 h-5" />
                            ) : (
                                <Menu className="w-5 h-5" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* ===== Mobile Navigation ===== */}
                {!isTutorPage && mobileMenuOpen && (
                    <div className="xl:hidden border-t bg-white shadow-lg">
                        <nav className="flex flex-col p-4 space-y-1">
                            {!isAuthenticated && (
                                <>
                                    <Link 
                                        to={ROUTES.SIGN_IN} 
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="sm:hidden px-4 py-3 text-sm font-medium text-primary hover:bg-gray-50 rounded-lg transition-colors"
                                    >
                                        Đăng nhập
                                    </Link>
                                    <Link 
                                        to={ROUTES.SIGN_UP} 
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="sm:hidden px-4 py-3 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors text-center"
                                    >
                                        Đăng ký
                                    </Link>
                                    <div className="sm:hidden h-px bg-gray-200 my-2" />
                                </>
                            )}
                            <Link 
                                to={ROUTES.HOME} 
                                onClick={() => setMobileMenuOpen(false)}
                                className={cn(
                                    "px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                                    isActive(ROUTES.HOME)
                                        ? "bg-primary/10 text-primary"
                                        : "text-gray-700 hover:bg-gray-50"
                                )}
                            >
                                Trang chủ
                            </Link>
                            <Link
                                to={ROUTES.LANGUAGES}
                                onClick={() => setMobileMenuOpen(false)}
                                className={cn(
                                    "px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                                    isActive(ROUTES.LANGUAGES)
                                        ? "bg-primary/10 text-primary"
                                        : "text-gray-700 hover:bg-gray-50"
                                )}
                            >
                                Ngôn ngữ
                            </Link>
                            <Link
                                to={ROUTES.TUTORS}
                                onClick={() => setMobileMenuOpen(false)}
                                className={cn(
                                    "px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                                    isActive(ROUTES.TUTORS)
                                        ? "bg-primary/10 text-primary"
                                        : "text-gray-700 hover:bg-gray-50"
                                )}
                            >
                                Gia sư
                            </Link>
                            <Link
                                to={ROUTES.BECOME_TUTOR}
                                onClick={() => setMobileMenuOpen(false)}
                                className={cn(
                                    "px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                                    isActive(ROUTES.BECOME_TUTOR)
                                        ? "bg-primary/10 text-primary"
                                        : "text-gray-700 hover:bg-gray-50"
                                )}
                            >
                                Trở thành gia sư
                            </Link>
                            <Link
                                to={ROUTES.POLICY}
                                onClick={() => setMobileMenuOpen(false)}
                                className={cn(
                                    "px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                                    isActive(ROUTES.POLICY)
                                        ? "bg-primary/10 text-primary"
                                        : "text-gray-700 hover:bg-gray-50"
                                )}
                            >
                                Chính sách & Điều khoản
                            </Link>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
