import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings, LogOut, Bell, Shield, HelpCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function Profile() {
  const [, setLocation] = useLocation();

  const menuItems = [
    { icon: Bell, label: "Notifications", testId: "button-notifications" },
    { icon: Settings, label: "Paramètres", testId: "button-settings" },
    { icon: Shield, label: "Sécurité", testId: "button-security" },
    { icon: HelpCircle, label: "Aide", testId: "button-help" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card border-b border-card-border sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center gap-3">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setLocation("/")}
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-foreground">Profile</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="space-y-6">
          <div className="bg-card border border-card-border rounded-lg p-6 flex flex-col items-center text-center">
            <Avatar className="w-24 h-24 mb-4">
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                AG
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-semibold text-foreground" data-testid="text-agent-name">
              Agent AGR
            </h2>
            <p className="text-sm text-muted-foreground mt-1" data-testid="text-agent-id">
              ID: AGR-2024-001
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              Membre depuis Jan 2024
            </p>
          </div>

          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => console.log(`${item.label} clicked`)}
                  className="w-full bg-card border border-card-border rounded-lg p-4 flex items-center justify-between hover-elevate active-elevate-2"
                  data-testid={item.testId}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-muted-foreground" />
                    <span className="text-base font-medium text-foreground">{item.label}</span>
                  </div>
                  <span className="text-muted-foreground">›</span>
                </button>
              );
            })}
          </div>

          <Button
            variant="destructive"
            className="w-full"
            onClick={() => console.log('Logout clicked')}
            data-testid="button-logout"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Déconnexion
          </Button>
        </div>
      </main>
    </div>
  );
}
