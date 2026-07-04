import Link from "next/link";
import { Metadata } from "next";
import {
  Zap, PenTool, ShoppingBag, Share2, Mail, Search,
  Star, ArrowRight, CheckCircle, Sparkles, Users, TrendingUp
} from "lucide-react";

export const metadata: Metadata = { title: "AIForge — AI Content Generator" };

const tools = [
  { icon: PenTool, name: "Blog Generator", desc: "Full SEO-optimized blog posts", credits: 3, color: "from-violet-500 to-purple-600" },
  { icon: ShoppingBag, name: "Product Descriptions", desc: "Conversion-focused copy", credits: 1, color: "from-blue-500 to-cyan-600" },
  { icon: Share2, name: "Social Media Posts", desc: "Platform-optimized content", credits: 1, color: "from-pink-500 to-rose-600" },
  { icon: Mail, name: "Email Generator", desc: "High-converting emails", credits: 2, color: "from-orange-500 to-amber-600" },
  { icon: Search, name: "SEO Meta Tags", desc: "Rank higher on Google", credits: 1, color: "from-green-500 to-emerald-600" },
];

const testimonials = [
  { name: "Sarah K.", role: "Content Marketer", text: "AIForge saves me 10+ hours a week. The blog generator is incredibly accurate.", stars: 5 },
  { name: "Mike R.", role: "E-commerce Owner", text: "Product descriptions went from bland to brilliant. Sales up 34%!", stars: 5 },
  { name: "Lisa T.", role: "SEO Specialist", text: "The SEO meta generator is a game changer. Rankings improved significantly.", stars: 5 },
];

const stats = [
  { value: "50K+", label: "Content Pieces Generated", icon: Sparkles },
  { value: "8,500+", label: "Happy Users", icon: Users },
  { value: "4.9/5", label: "Average Rating", icon: Star },
  { value: "10x", label: "Faster Than Manual", icon: TrendingUp },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl gradient-text">AIForge</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#tools" className="hover:text-foreground transition-colors">Tools</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">Reviews</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm font-medium hover:text-primary transition-colors px-4 py-2">
              Sign in
            </Link>
            <Link href="/auth/register" className="bg-gradient-to-r from-violet-600 to-blue-500 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-violet-200/50 hover:-translate-y-0.5 duration-200">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="hero-glow absolute inset-0 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300 text-sm font-medium px-4 py-2 rounded-full border border-violet-200 dark:border-violet-800 mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            Powered by GPT-4o · 5 AI Writing Tools
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 animate-fade-in">
            Create{" "}
            <span className="gradient-text">Stunning Content</span>
            <br />in Seconds with AI
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in">
            Generate SEO-optimized blog posts, product descriptions, social media posts, emails, and meta tags — all powered by GPT-4o.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Link href="/auth/register" className="group flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-blue-500 text-white font-semibold px-8 py-4 rounded-xl hover:opacity-90 transition-all shadow-xl hover:shadow-violet-200/50 hover:-translate-y-1 duration-300">
              Start Free — 10 Credits
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="#tools" className="flex items-center justify-center gap-2 border-2 border-border text-foreground font-semibold px-8 py-4 rounded-xl hover:border-primary hover:text-primary transition-all duration-200">
              See All Tools
            </Link>
          </div>
          <p className="text-sm text-muted-foreground mt-4">No credit card required · 10 free credits on signup</p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-border bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(({ value, label, icon: Icon }) => (
            <div key={label} className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Icon className="w-5 h-5 text-violet-500 mr-2" />
                <span className="text-3xl font-extrabold gradient-text">{value}</span>
              </div>
              <p className="text-sm text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tools */}
      <section id="tools" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold mb-4">5 Powerful AI Tools</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Everything you need to create professional content across every channel.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map(({ icon: Icon, name, desc, credits, color }) => (
              <div key={name} className="group relative bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">{name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{desc}</p>
                <span className="inline-flex items-center gap-1 text-xs font-medium bg-violet-50 dark:bg-violet-950/30 text-violet-600 px-2.5 py-1 rounded-full">
                  <Zap className="w-3 h-3" />{credits} credit{credits > 1 ? "s" : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold mb-4">Simple Pricing</h2>
            <p className="text-muted-foreground text-lg">Start free. Upgrade when you need more.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Free */}
            <div className="bg-card border border-border rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-2">Free</h3>
              <div className="text-4xl font-extrabold mb-6">$0<span className="text-lg text-muted-foreground font-normal">/mo</span></div>
              <ul className="space-y-3 mb-8">
                {["10 credits/month", "All 5 AI tools", "Basic support", "30-day history"].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />{f}</li>
                ))}
              </ul>
              <Link href="/auth/register" className="block text-center border-2 border-primary text-primary font-semibold py-3 rounded-xl hover:bg-primary hover:text-primary-foreground transition-all duration-200">
                Get Started Free
              </Link>
            </div>
            {/* Pro */}
            <div className="gradient-border bg-card rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-gradient-to-r from-violet-600 to-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">POPULAR</div>
              <h3 className="text-xl font-bold mb-2">Pro</h3>
              <div className="text-4xl font-extrabold mb-6 gradient-text">$29<span className="text-lg text-muted-foreground font-normal">/mo</span></div>
              <ul className="space-y-3 mb-8">
                {["500 credits/month", "All 5 AI tools", "Priority support", "Unlimited history", "Advanced analytics", "API access"].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm"><CheckCircle className="w-4 h-4 text-violet-500 flex-shrink-0" />{f}</li>
                ))}
              </ul>
              <Link href="/auth/register" className="block text-center bg-gradient-to-r from-violet-600 to-blue-500 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-all shadow-lg hover:-translate-y-0.5 duration-200">
                Start Pro Plan
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold mb-4">Loved by Creators</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, text, stars }) => (
              <div key={name} className="bg-card border border-border rounded-2xl p-6">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">"{text}"</p>
                <div>
                  <p className="font-semibold text-sm">{name}</p>
                  <p className="text-xs text-muted-foreground">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-violet-600 to-blue-500 rounded-3xl p-12 text-white shadow-2xl">
          <h2 className="text-4xl font-extrabold mb-4">Ready to Create Faster?</h2>
          <p className="text-violet-100 mb-8 text-lg">Join 8,500+ creators using AIForge to produce professional content in seconds.</p>
          <Link href="/auth/register" className="inline-flex items-center gap-2 bg-white text-violet-700 font-bold px-8 py-4 rounded-xl hover:bg-violet-50 transition-colors shadow-lg">
            Start Free — No Card Required
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold gradient-text">AIForge</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2024 AIForge. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
