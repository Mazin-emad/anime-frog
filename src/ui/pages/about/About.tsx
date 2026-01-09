import { TypographyH1 } from "@/ui/components/global/typography/Headers";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, Globe, Mail, Code, Zap, Palette, Database } from "lucide-react";

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
          Anime Frog
        </TypographyH1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          The ultimate desktop experience for anime enthusiasts. Discover, track, and organize your favorite titles with speed and elegance.
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
            <p className="text-sm text-muted-foreground">Powered by Electron and Vite for a reactive, instant-response desktop app experience.</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-b from-card to-card/50 border-primary/10 transition-all hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 group">
          <CardContent className="pt-8 flex flex-col items-center text-center space-y-4">
            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500 group-hover:scale-110 transition-transform">
              <Database className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">AniList Integration</h3>
            <p className="text-sm text-muted-foreground">Seamlessly synchronized with the AniList GraphQL API to fetch the most accurate data.</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-b from-card to-card/50 border-primary/10 transition-all hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 group">
          <CardContent className="pt-8 flex flex-col items-center text-center space-y-4">
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform">
              <Palette className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">Modern Design</h3>
            <p className="text-sm text-muted-foreground">Crafted with Tailwind CSS and Shadcn UI components for a premium visual aesthetic.</p>
          </CardContent>
        </Card>
      </div>

      {/* Tech Stack Section */}
      <div className="w-full space-y-8 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Built with modern tech</h2>
          <p className="text-muted-foreground mt-2">Professional grade tools for a professional grade application.</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4">
          {["Electron", "React", "TypeScript", "Tailwind CSS", "Vite", "GraphQL", "Shadcn UI", "Lucide Icons"].map((tech) => (
            <div key={tech} className="px-6 py-3 rounded-xl bg-secondary/50 border border-border/50 text-sm font-medium hover:bg-secondary hover:border-primary/20 transition-colors">
              {tech}
            </div>
          ))}
        </div>
      </div>

      {/* Contact/Links */}
      <div className="w-full p-8 rounded-3xl bg-primary/5 border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">Ready to jump in?</h3>
          <p className="text-muted-foreground">Join our community and help us build the future of anime tracking.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="gap-2 px-6">
            <Github className="h-4 w-4" />
            GitHub
          </Button>
          <Button className="gap-2 px-6">
            <Globe className="h-4 w-4" />
            Website
          </Button>
        </div>
      </div>

      {/* Footer credits */}
      <footer className="pt-12 pb-6 text-center text-muted-foreground text-sm space-y-4">
        <div className="flex justify-center gap-6">
          <a href="#" className="hover:text-primary transition-colors flex items-center gap-1">
            <Mail className="h-4 w-4" /> support@animefrog.dev
          </a>
          <a href="#" className="hover:text-primary transition-colors flex items-center gap-1">
            <Code className="h-4 w-4" /> v1.0.0 Stable
          </a>
        </div>
        <p>© 2026 Anime Frog. All rights reserved.</p>
      </footer>
    </section>
  );
};

export default About;
