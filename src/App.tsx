import { useRouter } from '@/hooks/useRouter';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { HomePage } from '@/pages/HomePage';

function App() {
  const { route, navigate } = useRouter();

  return (
    <div className="relative min-h-screen">
      <Navbar route={route} navigate={navigate} />

      <main className="animate-fade-in">
        <HomePage navigate={navigate} />
      </main>

      <Footer navigate={navigate} />
    </div>
  );
}

export default App;
