import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";

// Détails pour les clients de type Crédit.
// - Affiche informations uniformes pour tous les crédits
// - Versements et pénalités stockés localement sous keys payments_<id> et penalties_<id>
export default function CreditClientDetails() {
  const [, setLocation] = useLocation();
  const [client, setClient] = useState<any | null>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [penalties, setPenalties] = useState<any[]>([]);
  const [showPayments, setShowPayments] = useState(false);
  const [showPenalties, setShowPenalties] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showPenaltyForm, setShowPenaltyForm] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [penaltyAmount, setPenaltyAmount] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("selectedClient");
    if (stored) setClient(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (!client) return;
    try {
      const p = JSON.parse(localStorage.getItem(`payments_${client.id}`) || "[]");
      setPayments(Array.isArray(p) ? p : []);
    } catch (e) {
      setPayments([]);
    }
    try {
      const q = JSON.parse(localStorage.getItem(`penalties_${client.id}`) || "[]");
      setPenalties(Array.isArray(q) ? q : []);
    } catch (e) {
      setPenalties([]);
    }
    try {
      const c = localStorage.getItem(`comment_${client.id}`) || "";
      setComment(c);
    } catch (e) {}
  }, [client]);

  if (!client) return <div className="p-4">Chargement...</div>;

  const persistPayments = (arr: any[]) => {
    localStorage.setItem(`payments_${client.id}`, JSON.stringify(arr));
    setPayments(arr);
  };

  const persistPenalties = (arr: any[]) => {
    localStorage.setItem(`penalties_${client.id}`, JSON.stringify(arr));
    setPenalties(arr);
  };

  const handleAddPayment = async (amount: number) => {
    if (Number.isNaN(amount) || amount <= 0) return;

    // stocker localement
    const newP = { id: Date.now().toString(36), amount, date: new Date().toISOString() };
    persistPayments([newP, ...payments]);

    // Mettre à jour le backend: diminuer montantAvecInteret si présent sinon montant
    const prev = (client.montantAvecInteret ?? client.montantTotal ?? client.montant ?? 0) as number;
    const newTotal = prev - amount;
    try {
      await apiRequest("PATCH", `/api/clients/${client.id}`, { montantAvecInteret: newTotal });
      const updated = { ...client, montantAvecInteret: newTotal };
      localStorage.setItem("selectedClient", JSON.stringify(updated));
      setClient(updated);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddPenalty = (amount: number) => {
    if (Number.isNaN(amount) || amount <= 0) return;
    const newPen = { id: Date.now().toString(36), amount, date: new Date().toISOString() };
    persistPenalties([newPen, ...penalties]);
  };

  const handleContentieux = async () => {
    try {
      // update backend status so the client is removed from Credit list and appears in Contentieux list
      const updated = await apiRequest("PATCH", `/api/clients/${client.id}`, { status: "litigation" });
      try {
        localStorage.setItem("selectedClient", JSON.stringify(updated));
      } catch (e) {}
      // invalidate clients so lists refresh
      try { queryClient.invalidateQueries({ queryKey: ["/api/clients"] }); } catch (e) {}
      // navigate to contentieux page where selectedClient will be shown
      setLocation("/contencieux");
    } catch (e) {
      console.error("Failed to set contentieux status", e);
      // fallback: still navigate but keep current client in storage
      try { localStorage.setItem("selectedClient", JSON.stringify(client)); } catch (e) {}
      setLocation("/contencieux");
    }
  };

  const handleReturnToActive = async () => {
    try {
      const updated = await apiRequest("PATCH", `/api/clients/${client.id}`, { status: "active" });
      try { localStorage.setItem("selectedClient", JSON.stringify(updated)); } catch (e) {}
      try { queryClient.invalidateQueries({ queryKey: ["/api/clients"] }); } catch (e) {}
      setLocation("/credit");
    } catch (e) {
      console.error("Failed to return client to active", e);
    }
  };

  const handleComment = () => {
    const c = window.prompt("Commentaire", comment || "");
    if (c === null) return;
    try {
      localStorage.setItem(`comment_${client.id}`, c);
      setComment(c);
    } catch (e) {}
  };

  const creditTotal = (client.montantAvecInteret ?? client.montantTotal ?? client.montant ?? 0) as number;
  const penaltyTotal = penalties.reduce((s, p) => s + (Number(p.amount) || 0), 0);
  const paymentsTotal = payments.reduce((s, p) => s + (Number(p.amount) || 0), 0);
  const remainingToPay = creditTotal - paymentsTotal + penaltyTotal;
  const totalPaidWithPenalty = paymentsTotal + penaltyTotal;

  return (
    <div className="p-4">
      <button onClick={() => setLocation("/credit")} className="text-blue-500">← Retour</button>

      <div className="bg-white rounded-2xl p-4 mt-4 shadow">
        <h2 className="text-xl font-bold">{client.prenom} {client.nom}</h2>
        <p className="text-sm text-muted-foreground">ID: {client.id}</p>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <div>
            <p className="text-sm text-muted-foreground">Nombre de compte</p>
            <p className="font-semibold">{client.nombreCompte ?? 1}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Crédit total</p>
            <p className="font-semibold">{creditTotal.toLocaleString('fr-FR')} XAF</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Versements</p>
            <p className="font-semibold text-green-600">-{paymentsTotal.toLocaleString('fr-FR')} XAF</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Pénalités</p>
            <p className="font-semibold text-red-600">{penaltyTotal.toLocaleString('fr-FR')} XAF</p>
          </div>
        </div>

        <div className="mt-4 border-t pt-3">
          <p className="text-sm text-muted-foreground">Commentaire</p>
          <div className="flex items-center gap-2">
            <p className="flex-1">{comment || "Aucun commentaire"}</p>
            <button className="text-sm text-blue-600" onClick={handleComment}>Commenter</button>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <button className="text-left text-sm text-blue-600 underline" onClick={() => setShowPayments(true)}>Liste de versements</button>
          <button className="text-left text-sm text-blue-600 underline" onClick={() => setShowPenalties(true)}>Liste de pénalités</button>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          {!showPaymentForm ? (
            <button className="bg-blue-500 text-white py-2 rounded" onClick={() => setShowPaymentForm(true)}>Effectuer Versement</button>
          ) : (
            <div className="flex gap-2">
              <input
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="flex-1 p-2 rounded border"
                placeholder="Montant en FCFA"
              />
              <button
                className="bg-green-600 text-white px-4 rounded"
                onClick={async () => {
                  const amt = parseFloat(paymentAmount.replace(/\s|,/g, ""));
                  await handleAddPayment(amt);
                  setPaymentAmount("");
                  setShowPaymentForm(false);
                }}
              >
                Valider
              </button>
              <button className="bg-gray-200 px-4 rounded" onClick={() => { setShowPaymentForm(false); setPaymentAmount(""); }}>Annuler</button>
            </div>
          )}

          {!showPenaltyForm ? (
            <button className="bg-yellow-500 text-white py-2 rounded" onClick={() => setShowPenaltyForm(true)}>Payer la pénalité</button>
          ) : (
            <div className="flex gap-2">
              <input
                value={penaltyAmount}
                onChange={(e) => setPenaltyAmount(e.target.value)}
                className="flex-1 p-2 rounded border"
                placeholder="Montant en FCFA"
              />
              <button
                className="bg-green-600 text-white px-4 rounded"
                onClick={() => {
                  const amt = parseFloat(penaltyAmount.replace(/\s|,/g, ""));
                  handleAddPenalty(amt);
                  setPenaltyAmount("");
                  setShowPenaltyForm(false);
                }}
              >
                Valider
              </button>
              <button className="bg-gray-200 px-4 rounded" onClick={() => { setShowPenaltyForm(false); setPenaltyAmount(""); }}>Annuler</button>
            </div>
          )}

          {client.status === 'litigation' ? (
            <button className="bg-indigo-600 text-white py-2 rounded" onClick={handleReturnToActive}>Renvoyer au actif</button>
          ) : (
            <button className="bg-red-500 text-white py-2 rounded" onClick={handleContentieux}>Contentieux</button>
          )}
        </div>

        {showPayments && (
          <div className="mt-4">
            <h3 className="font-semibold">Versements</h3>
            {payments.length === 0 ? <p className="text-sm text-muted-foreground">Aucun versement</p> : (
              <div className="space-y-2 mt-2">
                {payments.map(p => (
                  <div key={p.id} className="flex justify-between bg-gray-50 p-2 rounded">
                    <div>
                      <p className="text-sm">Versement</p>
                      <p className="text-xs text-muted-foreground">{new Date(p.date).toLocaleString()}</p>
                    </div>
                    <div className="font-mono text-green-600">-{(p.amount||0).toLocaleString('fr-FR')} XAF</div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-2">
              <button className="text-sm text-blue-600" onClick={() => setShowPayments(false)}>Fermer</button>
            </div>
          </div>
        )}

        {showPenalties && (
          <div className="mt-4">
            <h3 className="font-semibold">Pénalités</h3>
            {penalties.length === 0 ? <p className="text-sm text-muted-foreground">Aucune pénalité</p> : (
              <div className="space-y-2 mt-2">
                {penalties.map(p => (
                  <div key={p.id} className="flex justify-between bg-gray-50 p-2 rounded">
                    <div>
                      <p className="text-sm">Pénalité</p>
                      <p className="text-xs text-muted-foreground">{new Date(p.date).toLocaleString()}</p>
                    </div>
                    <div className="font-mono text-red-600">{(p.amount||0).toLocaleString('fr-FR')} XAF</div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-2">
              <button className="text-sm text-blue-600" onClick={() => setShowPenalties(false)}>Fermer</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
