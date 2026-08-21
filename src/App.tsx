import { useRouter } from '@/hooks/useRouter';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ScrollProgress } from '@/components/motion';
import { HomePage } from '@/pages/HomePage';

function App() {
  const { route, navigate } = useRouter();
  useSmoothScroll();

  return (
    <div className="relative min-h-screen">
      <ScrollProgress />
      <Navbar route={route} navigate={navigate} />

      <main className="animate-fade-in">
        <HomePage navigate={navigate} />
      </main>

      <Footer navigate={navigate} />
    </div>
  );
}

export default App;
