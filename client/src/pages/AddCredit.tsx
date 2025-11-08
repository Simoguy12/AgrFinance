import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowLeft, CalendarIcon } from "lucide-react";
import { useLocation } from "wouter";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const zones = [
  "Marché Total",
  "Marché Fond Tié Tié",
  "Marché Châteaux",
  "Marché Mongali",
  "Marché Vindoulou",
  "Tié-Tié",
  "Mvou-Mvou",
  "Loandjili",
  "Ngoyo",
  "Mpaka",
  "Centre-ville",
];

export default function AddCredit() {
  const [, setLocation] = useLocation();
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    activite: "",
    adresse: "",
    zone: "",
    nombreCompte: "",
    garantie: "",
    echeance: "",
  });

  const generateCode = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    return `CR-${year}-${random}`;
  };

  const [codeCompte] = useState(generateCode());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newClient = {
      ...formData,
      codeCompte,
      dateCreation: date?.toISOString(),
      type: "credit",
      status: "active",
      montantTotal: parseInt(formData.nombreCompte) * 30000,
      montantAvecInteret: parseInt(formData.nombreCompte) * 35650,
      createdAt: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem("clients") || "[]");
    localStorage.setItem("clients", JSON.stringify([...existing, newClient]));
    
    console.log("Client crédit créé:", newClient);
    setLocation("/credit");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card border-b border-card-border sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center gap-3">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setLocation("/add")}
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-foreground">Nouveau Crédit</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nom">Nom</Label>
            <Input
              id="nom"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              placeholder="Nom de famille"
              required
              data-testid="input-nom"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prenom">Prénom</Label>
            <Input
              id="prenom"
              value={formData.prenom}
              onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
              placeholder="Prénom"
              required
              data-testid="input-prenom"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telephone">Téléphone</Label>
            <Input
              id="telephone"
              type="tel"
              value={formData.telephone}
              onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
              placeholder="+242 06 000 00 00"
              required
              data-testid="input-telephone"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="activite">Activité</Label>
            <Input
              id="activite"
              value={formData.activite}
              onChange={(e) => setFormData({ ...formData, activite: e.target.value })}
              placeholder="Type d'activité"
              required
              data-testid="input-activite"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="adresse">Adresse</Label>
            <Input
              id="adresse"
              value={formData.adresse}
              onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
              placeholder="Adresse complète"
              required
              data-testid="input-adresse"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="zone">Zone</Label>
            <Select value={formData.zone} onValueChange={(value) => setFormData({ ...formData, zone: value })}>
              <SelectTrigger id="zone" data-testid="select-zone">
                <SelectValue placeholder="Sélectionner une zone" />
              </SelectTrigger>
              <SelectContent>
                {zones.map((zone) => (
                  <SelectItem key={zone} value={zone}>
                    {zone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="codeCompte">Code du compte</Label>
            <Input
              id="codeCompte"
              value={codeCompte}
              disabled
              className="font-mono bg-muted"
              data-testid="input-code-compte"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nombreCompte">Nombre de compte</Label>
            <Input
              id="nombreCompte"
              type="number"
              inputMode="numeric"
              value={formData.nombreCompte}
              onChange={(e) => setFormData({ ...formData, nombreCompte: e.target.value })}
              placeholder="Ex: 6"
              className="font-mono"
              required
              data-testid="input-nombre-compte"
            />
            {formData.nombreCompte && (
              <p className="text-sm text-muted-foreground">
                Montant: {(parseInt(formData.nombreCompte) * 30000).toLocaleString()} FCFA + Intérêt = {(parseInt(formData.nombreCompte) * 35650).toLocaleString()} FCFA
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Date création</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  data-testid="button-date"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: fr }) : "Sélectionner une date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  locale={fr}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="garantie">Garantie</Label>
            <Textarea
              id="garantie"
              value={formData.garantie}
              onChange={(e) => setFormData({ ...formData, garantie: e.target.value })}
              placeholder="Description de la garantie"
              rows={3}
              data-testid="input-garantie"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="echeance">Échéance</Label>
            <Select value={formData.echeance} onValueChange={(value) => setFormData({ ...formData, echeance: value })}>
              <SelectTrigger id="echeance" data-testid="select-echeance">
                <SelectValue placeholder="Sélectionner une échéance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="31">31 jours</SelectItem>
                <SelectItem value="45">45 jours</SelectItem>
                <SelectItem value="62">62 jours</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" data-testid="button-submit">
            Enregistrer le crédit
          </Button>
        </form>
      </main>
    </div>
  );
}
