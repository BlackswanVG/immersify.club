import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Experiences from "@/pages/experiences";
import ExperienceDetails from "@/pages/experience-details";
import Booking from "@/pages/booking";
import Membership from "@/pages/membership";
import Franchise from "@/pages/franchise";
import Venue from "@/pages/venue";
import Merch from "@/pages/merch";
import Contact from "@/pages/contact";
import Login from "@/pages/login";
import Register from "@/pages/register";
import AdminExperiences from "@/pages/admin/experiences";
import AdminProducts from "@/pages/admin/products";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartSidebar from "@/components/layout/CartSidebar";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/experiences" component={Experiences} />
      <Route path="/experience/:slug" component={ExperienceDetails} />
      <Route path="/booking" component={Booking} />
      <Route path="/membership" component={Membership} />
      <Route path="/franchise" component={Franchise} />
      <Route path="/venue/:slug" component={Venue} />
      <Route path="/merch" component={Merch} />
      <Route path="/contact" component={Contact} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/admin/experiences" component={AdminExperiences} />
      <Route path="/admin/products" component={AdminProducts} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Router />
        </main>
        <Footer />
        <CartSidebar />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
