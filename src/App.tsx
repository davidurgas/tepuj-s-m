import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StoreProvider, useStore } from "@/lib/workout/store";
import { RestTimerProvider } from "@/components/workout/RestTimer";
import Layout from "@/components/workout/Layout";
import Dashboard from "./pages/workout/Dashboard";
import Plans from "./pages/workout/Plans";
import PlanEditor from "./pages/workout/PlanEditor";
import ActiveWorkout from "./pages/workout/ActiveWorkout";
import Progress from "./pages/workout/Progress";
import NotFound from "./pages/NotFound";

function AppShell() {
  const { data } = useStore();
  return (
    <RestTimerProvider soundEnabled={data.settings.sound}>
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/plany" element={<Plans />} />
            <Route path="/plany/:id" element={<PlanEditor />} />
            <Route path="/trening" element={<ActiveWorkout />} />
            <Route path="/progres" element={<Progress />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </RestTimerProvider>
  );
}

const App = () => (
  <TooltipProvider>
    <Sonner position="top-center" />
    <StoreProvider>
      <AppShell />
    </StoreProvider>
  </TooltipProvider>
);

export default App;
