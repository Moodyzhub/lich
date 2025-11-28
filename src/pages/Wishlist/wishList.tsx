import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/config/axiosConfig";
import HeroSection from "./components/sections/hero-section";
import WishlistContent from "./components/sections/wishlist-content";
import Pagination from "./components/sections/pagination";
import { useToast } from "@/components/ui/use-toast";
import { ROUTES } from "@/constants/routes";

interface WishlistItem {
  id: number;
  title: string;
  description: string;
  duration: number;
  price: number;
  language: string;
  thumbnailURL: string;
  categoryName: string;
  tutorName: string;
  status: string;
  isWishListed: boolean;
  isPurchased: boolean;
  learnerCount: number;
  tutorAvatarURL: string;
  tutorAddress: string;
  avgRating: number | null;
  totalRatings: number | null;
  createdAt: string;
}

const Wishlist = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  /**  Fetch wishlist */
  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);

      const token =
          localStorage.getItem("access_token") || sessionStorage.getItem("access_token");

      if (!token) {
        toast({
          variant: "destructive",
          title: "Bạn chưa đăng nhập",
          description: "Vui lòng đăng nhập để xem danh sách yêu thích.",
        });

        navigate(ROUTES.SIGN_IN);
        return;
      }

      try {
        const res = await api.get<{ code: number; result: WishlistItem[] }>("/wishlist");

        if (Array.isArray(res.data.result)) {
          const filtered = res.data.result.filter(
              (item) => item.isPurchased === false || item.isPurchased === null
          );
          setWishlistItems(filtered);
          setFilteredItems(filtered);
        }
      } catch {
        toast({
          variant: "destructive",
          title: "Không thể tải danh sách yêu thích",
          description: "Vui lòng thử lại sau.",
        });

        navigate(ROUTES.SIGN_IN);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [navigate, toast]);

  /**  Remove wishlist item */
  const removeFromWishlist = async (id: number) => {
    const token =
        localStorage.getItem("access_token") || sessionStorage.getItem("access_token");

    if (!token) {
      toast({
        variant: "destructive",
        title: "Bạn chưa đăng nhập",
        description: "Vui lòng đăng nhập để xóa mục.",
      });

      navigate(ROUTES.SIGN_IN);
      return;
    }

    try {
      await api.delete(`/wishlist/${id}`);

      setWishlistItems((prev) => prev.filter((item) => item.id !== id));
      setFilteredItems((prev) => prev.filter((item) => item.id !== id));

      toast({
        variant: "success",
        title: "Đã xóa khỏi danh sách yêu thích",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Xóa thất bại",
        description: "Vui lòng thử lại sau.",
      });
    }
  };

  /** Search */
  const handleSearch = (keyword: string) => {
    setCurrentPage(1);
    setFilteredItems(
        keyword
            ? wishlistItems.filter((item) =>
                item.title.toLowerCase().includes(keyword.toLowerCase())
            )
            : wishlistItems
    );
  };

  /** Pagination */
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
  );

  return loading ? (
      <div className="min-h-screen flex justify-center items-center text-lg text-gray-500">
        Đang tải danh sách yêu thích...
      </div>
  ) : (
      <div className="min-h-screen bg-gray-50">
        <HeroSection itemCount={wishlistItems.length} onSearch={handleSearch} />
        <WishlistContent
            wishlistItems={currentItems}
            onRemoveItem={removeFromWishlist}
        />
        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
        />
      </div>
  );
};

export default Wishlist;
