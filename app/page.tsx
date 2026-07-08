import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Link2, Zap, Share2 } from "lucide-react";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Create shortened links instantly with just a few clicks",
    },
    {
      icon: Share2,
      title: "Shareable Links",
      description: "Generate clean, memorable short URLs perfect for sharing",
    },
    {
      icon: Link2,
      title: "Secure & Reliable",
      description: "Your links are safe, secure, and always accessible",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                Shorten Your URLs,{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Share Everywhere
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                Transform long, unwieldy URLs into clean, shareable links. Fast,
                simple, and built for modern sharing.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <SignUpButton mode="modal">
                <Button size="lg" className="px-8">
                  Get Started Free
                </Button>
              </SignUpButton>
              <SignInButton mode="modal">
                <Button size="lg" variant="outline" className="px-8">
                  Sign In
                </Button>
              </SignInButton>
            </div>

            <p className="text-sm text-muted-foreground pt-4">
              No credit card required. Start shortening links in seconds.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-20 md:py-32 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Why Choose Link Shortener?
              </h2>
              <p className="text-xl text-muted-foreground">
                Everything you need to shorten and share your links
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature) => {
                const IconComponent = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="p-6 rounded-lg border border-border bg-black/50 hover:bg-black/80 transition-colors"
                  >
                    <div className="mb-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full py-20 md:py-32 px-4">
          <div className="max-w-3xl mx-auto text-center space-y-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                How It Works
              </h2>
              <p className="text-xl text-muted-foreground">
                Get started in three simple steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "Paste Your URL",
                  description: "Enter any long URL you want to shorten",
                },
                {
                  step: "2",
                  title: "Click Shorten",
                  description: "Generate your custom short link instantly",
                },
                {
                  step: "3",
                  title: "Copy & Share",
                  description:
                    "Use your short link anywhere you want to share it",
                },
              ].map((item) => (
                <div key={item.step} className="space-y-4">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold mx-auto">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-20 md:py-32 px-4 bg-muted/30">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold">
                Ready to Shorten Your Links?
              </h2>
              <p className="text-xl text-muted-foreground">
                Join thousands of users who are already using Link Shortener to
                share smarter
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SignUpButton mode="modal">
                <Button size="lg" className="px-8">
                  Create Free Account
                </Button>
              </SignUpButton>
              <SignInButton mode="modal">
                <Button size="lg" variant="outline" className="px-8">
                  Sign In
                </Button>
              </SignInButton>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
