import { TypographyH1 } from "@/ui/components/global/typography/Headers";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Github,
  Globe,
  Mail,
  Code,
  Zap,
  Palette,
  Database,
  Twitter,
  Linkedin,
} from "lucide-react";

const About = () => {
  return (
    <section className="w-full px-4 py-12 flex flex-col items-center max-w-5xl mx-auto space-y-16 animate-in fade-in duration-1000">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="inline-block p-1 rounded-full bg-gradient-to-r from-primary via-purple-500 to-blue-500 mb-4">
          <div className="px-4 py-1 rounded-full bg-background/90 text-xs font-bold tracking-widest uppercase">
            Version 1.0.0
          </div>
        </div>
        <TypographyH1 className="text-6xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/50">
          About Anime Frog
        </TypographyH1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Hi, I’m <span className="font-semibold">Mazin Emad</span>, the
          programmer behind Anime Frog. This desktop app helps anime fans
          discover, track, and organize their favorite titles with a fast,
          modern experience.
        </p>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          Data is powered by the{" "}
          <a
            href="https://anilist.co/"
            className="underline underline-offset-4 hover:text-primary"
            target="_blank"
            rel="noreferrer"
          >
            AniList
          </a>{" "}
          GraphQL API (
          <a
            href="https://anilist.gitbook.io/anilist-apiv2-docs/"
            className="underline underline-offset-4 hover:text-primary"
            target="_blank"
            rel="noreferrer"
          >
            docs
          </a>
          ), ensuring up-to-date anime information, details, and search.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <Card className="bg-gradient-to-b from-card to-card/50 border-primary/10 transition-all hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 group">
          <CardContent className="pt-8 flex flex-col items-center text-center space-y-4">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
              <Zap className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">Lightning Fast</h3>
            <p className="text-sm text-muted-foreground">
              Powered by Electron and Vite for a responsive, desktop‑class
              experience.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-b from-card to-card/50 border-primary/10 transition-all hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 group">
          <CardContent className="pt-8 flex flex-col items-center text-center space-y-4">
            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500 group-hover:scale-110 transition-transform">
              <Database className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">AniList Integration</h3>
            <p className="text-sm text-muted-foreground">
              Integrated with the AniList GraphQL API for accurate, rich anime
              data and search.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-b from-card to-card/50 border-primary/10 transition-all hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 group">
          <CardContent className="pt-8 flex flex-col items-center text-center space-y-4">
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform">
              <Palette className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">Modern Design</h3>
            <p className="text-sm text-muted-foreground">
              Crafted with Tailwind CSS and Shadcn UI for a clean, accessible
              interface.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tech Stack Section */}
      <div className="w-full space-y-8 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Built with modern tech
          </h2>
          <p className="text-muted-foreground mt-2">
            Professional grade tools for a professional grade application.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {[
            "Electron",
            "React",
            "TypeScript",
            "Tailwind CSS",
            "Vite",
            "GraphQL",
            "Shadcn UI",
            "Lucide Icons",
          ].map((tech) => (
            <div
              key={tech}
              className="px-6 py-3 rounded-xl bg-secondary/50 border border-border/50 text-sm font-medium hover:bg-secondary hover:border-primary/20 transition-colors"
            >
              {tech}
            </div>
          ))}
        </div>
      </div>

      {/* How to Use */}
      <div className="w-full space-y-6">
        <h2 className="text-3xl font-bold tracking-tight text-center">
          How to Use
        </h2>
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border/60">
            <CardContent className="pt-6 space-y-2">
              <h3 className="font-semibold">1. Browse & Search</h3>
              <p className="text-sm text-muted-foreground">
                Use the sidebar to go Home or open Search to find anime by title
                or filters.
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardContent className="pt-6 space-y-2">
              <h3 className="font-semibold">2. View Details</h3>
              <p className="text-sm text-muted-foreground">
                Open an anime to see synopsis, ratings, genres, and more fetched
                from AniList.
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardContent className="pt-6 space-y-2">
              <h3 className="font-semibold">3. Organize</h3>
              <p className="text-sm text-muted-foreground">
                Add titles to Favorites or your custom Lists to keep track of
                what you love.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Contact/Links */}
      <div className="w-full p-8 rounded-3xl bg-primary/5 border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">Contact</h3>
          <p className="text-muted-foreground">
            Have feedback or ideas? Reach out to me.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <a
              href="mailto:mazin0emd@gmail.com"
              className="inline-flex items-center gap-2 text-sm hover:text-primary transition-colors"
            >
              <Mail className="h-4 w-4" /> mazin0emd@gmail.com
            </a>
            <a
              href="https://github.com/Mazin-emad"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm hover:text-primary transition-colors"
            >
              <Github className="h-4 w-4" /> GitHub
            </a>
            <a
              href="https://x.com/MazinEmad685945"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm hover:text-primary transition-colors"
            >
              <Twitter className="h-4 w-4" /> Twitter/X
            </a>
            <a
              href="https://www.linkedin.com/in/mazin0emd/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm hover:text-primary transition-colors"
            >
              <Linkedin className="h-4 w-4" /> LinkedIn
            </a>
            <a
              href="https://mazin-emad.netlify.app/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm hover:text-primary transition-colors"
            >
              <Globe className="h-4 w-4" /> Portfolio
            </a>
          </div>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" asChild className="gap-2 px-6">
            <a
              href="https://github.com/Mazin-emad/anime-frog"
              target="_blank"
              rel="noreferrer"
            >
              <Github className="h-4 w-4" /> GitHub Repo
            </a>
          </Button>
          <Button asChild className="gap-2 px-6">
            <a
              href="https://anilist.gitbook.io/anilist-apiv2-docs/"
              target="_blank"
              rel="noreferrer"
            >
              <Code className="h-4 w-4" /> AniList API Docs
            </a>
          </Button>
        </div>
      </div>

      {/* Footer credits */}
      <footer className="pt-12 pb-6 text-center text-muted-foreground text-sm space-y-4">
        <div className="flex justify-center gap-6">
          <a
            href="https://github.com/Mazin-emad"
            target="_blank"
            rel="noreferrer"
            className="hover:text-primary transition-colors flex items-center gap-1"
          >
            <Github className="h-4 w-4" /> GitHub
          </a>
          <a
            href="https://x.com/MazinEmad685945"
            target="_blank"
            rel="noreferrer"
            className="hover:text-primary transition-colors flex items-center gap-1"
          >
            <Twitter className="h-4 w-4" /> Twitter/X
          </a>
          <a
            href="https://www.linkedin.com/in/mazin0emd/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-primary transition-colors flex items-center gap-1"
          >
            <Linkedin className="h-4 w-4" /> LinkedIn
          </a>
        </div>
        <p>
          © 2026{" "}
          <a href="https://mazin-emad.netlify.app/" className="font-bold">
            Mazin Emad
          </a>{" "}
          · Anime Frog. Built with React, Electron, and AniList.
        </p>
      </footer>
    </section>
  );
};

export default About;
