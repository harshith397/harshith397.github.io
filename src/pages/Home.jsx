import Header from "../components/Header";
import Projects from "../components/Projects";
import Hero from "../components/Hero";
import AboutMe from "../components/AboutMe";
import Contact from "../components/Connect";
import Skills from "../components/Skills";

const Home = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-amber-200 selection:text-zinc-950 font-sans">
      <Header />
      <main>
        <Hero id="Me" />
        <AboutMe id="About" />
        <Skills id="Skills" />
        <Projects id="Work" />
        <Contact id="Connect" />
      </main>

      {/* Footer */}
      <footer className="border-t border-black/[0.05] py-10 px-6 text-center text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {currentYear} Harshith Medichelme. All rights reserved.</p>
          <p className="text-zinc-400">
            Design inspired by{" "}
            <a
              href="https://www.gowthamoleti.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-600 underline underline-offset-2 hover:text-black transition-colors"
            >
              Gowtham Oleti
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;