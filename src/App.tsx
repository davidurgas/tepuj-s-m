import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AccountProvider } from "@/components/droply/account-context";
import { CartProvider } from "@/components/droply/cart-context";
import { LoyaltyProvider } from "@/components/loyalty/loyalty-context";
import Layout from "@/components/droply/Layout";
import Home from "./pages/Home";
import ProductsPage from "./pages/ProductsPage";
import HowPage from "./pages/HowPage";
import PricingPage from "./pages/PricingPage";
import ReviewsPage from "./pages/ReviewsPage";
import LoyaltyPage from "./pages/LoyaltyPage";
import LoyaltyAdminPage from "./pages/LoyaltyAdminPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" />
      <AccountProvider>
        <CartProvider>
          <LoyaltyProvider>
            <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/produkty" element={<ProductsPage />} />
                  <Route path="/ako-funguje" element={<HowPage />} />
                  <Route path="/balicky" element={<PricingPage />} />
                  <Route path="/recenzie" element={<ReviewsPage />} />
                  <Route path="/vernost" element={<LoyaltyPage />} />
                  <Route path="/vernost/admin" element={<LoyaltyAdminPage />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </LoyaltyProvider>
        </CartProvider>
      </AccountProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
