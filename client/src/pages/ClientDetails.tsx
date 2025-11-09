import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/queryClient";

// Page de détails d'un client.
// Comportement ajouté : gestion locale des versements via `localStorage` (clé payments_<client.id>),
// form pour effectuer versement / retrait et mise à jour du client via PATCH /api/clients/:id.
export default function ClientDetails() {
  const [, setLocation] = useLocation();
  const [client, setClient] = useState<any>(null);
  const [payments, setPayments] = useState<Array<any>>([]);
  const [showPayments, setShowPayments] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [amountInput, setAmountInput] = useState("");

  // Récupérer les infos du client passées via le lien
  useEffect(() => {
    const storedClient = localStorage.getItem("selectedClient");
    if (storedClient) {
      const c = JSON.parse(storedClient);
      setClient(c);
    }
  }, []);

  // Charger les versements sauvegardés localement pour ce client
  useEffect(() => {
    if (!client) return;
    try {
      const raw = localStorage.getItem(`payments_${client.id}`);
      const list = raw ? JSON.parse(raw) : [];
      setPayments(Array.isArray(list) ? list : []);
    } catch (e) {
      setPayments([]);
    }
  }, [client]);

  if (!client) return <div className="p-4">Chargement...</div>;

  const persistPayments = (newPayments: any[]) => {
    try {
      localStorage.setItem(`payments_${client.id}`, JSON.stringify(newPayments));
    } catch (e) {
      // ignore
    }
    setPayments(newPayments);
  };

  const performPatchClient = async (updates: Record<string, any>) => {
    try {
      await apiRequest("PATCH", `/api/clients/${client.id}`, updates);
      const updated = { ...client, ...updates };
      // Mettre à jour le localStorage selectedClient si présent
      try {
        localStorage.setItem("selectedClient", JSON.stringify(updated));
      } catch (e) {}
      setClient(updated);
    } catch (err) {
      console.error("Failed to patch client", err);
      throw err;
    }
  };

  const handleAddPayment = async () => {
    const amount = parseFloat(amountInput.replace(/\s|,/g, ""));
    if (Number.isNaN(amount) || amount <= 0) return;

    const newPayment = { id: cryptoRandomId(), amount, date: new Date().toISOString() };
    const newPayments = [newPayment, ...payments];
    persistPayments(newPayments);

    // Mettre à jour le client : montant, nombre et total versements
    const prevMontant = (client.montant ?? 0) as number;
    const prevNombre = (client.nombreVersements ?? payments.length ?? 0) as number;
    const prevTotal = (client.totalVersements ?? sumPayments(payments)) as number;

    const newMontant = prevMontant + amount;
    const newNombre = prevNombre + 1;
    const newTotal = prevTotal + amount;

    await performPatchClient({
      montant: newMontant,
      nombreVersements: newNombre,
      totalVersements: newTotal,
    });

    setAmountInput("");
    setShowPaymentForm(false);
    setShowPayments(true);
  };

  const handleSolder = async () => {
    try {
      await performPatchClient({ status: "settled" });
      // éventuellement naviguer en arrière
    } catch (e) {}
  };

  const handleRetirer = async () => {
    const raw = window.prompt("Montant à retirer (en FCFA)", "0");
    if (!raw) return;
    const amount = parseFloat(raw.replace(/\s|,/g, ""));
    if (Number.isNaN(amount) || amount <= 0) return;
    const prevMontant = (client.montant ?? 0) as number;
    const newMontant = prevMontant - amount;
    await performPatchClient({ montant: newMontant });
    // enregistrer un retrait comme paiement négatif localement
    const newPayment = { id: cryptoRandomId(), amount: -Math.abs(amount), date: new Date().toISOString(), type: 'withdraw' };
    persistPayments([newPayment, ...payments]);
    setShowPayments(true);
  };

  function sumPayments(list: any[]) {
    return list.reduce((s, p) => s + (Number(p.amount) || 0), 0);
  }

  function cryptoRandomId() {
    try {
      return (crypto as any).randomUUID ? (crypto as any).randomUUID() : Math.random().toString(36).slice(2, 9);
    } catch (e) {
      return Math.random().toString(36).slice(2, 9);
    }
  }

  return (
    <div className="p-4 space-y-4">
      <button onClick={() => setLocation("/epargne")} className="text-blue-500">
        ← Retour
      </button>

      <div className="bg-gray-100 rounded-2xl p-4 shadow">
        <h2 className="text-xl font-bold">{client.prenom ? `${client.prenom} ${client.nom}` : client.nom}</h2>
        <p className="text-gray-500">{client.fonction || "Client"}</p>

        <div className="mt-3 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-xl p-4">
          <p>Code du compte: {client.codeCompte}</p>
          <p>Date: {client.dateCreation}</p>
          <p>Solde: {(client.montant ?? 0).toLocaleString('fr-FR')} FCFA</p>
        </div>

        <div className="bg-white mt-4 p-3 rounded-xl shadow">
          <p className="text-sm text-gray-600 inline-block mr-2">Versements</p>
          <p className="text-2xl font-semibold text-green-600 inline-block mr-3">{(client.totalVersements ?? sumPayments(payments)).toLocaleString('fr-FR')} XAF</p>
          <p className="text-gray-500 inline-block">Nombre de versements : </p>
          <button
            className="text-blue-600 underline ml-2"
            onClick={() => setShowPayments((s) => !s)}
          >
            {client.nombreVersements ?? payments.length}
          </button>

          {showPayments && (
            <div className="mt-3 space-y-2">
              {payments.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucun versement enregistré.</p>
              ) : (
                payments.map((p) => (
                  <div key={p.id} className="flex justify-between bg-gray-50 p-2 rounded">
                    <div>
                      <p className="text-sm">{p.type === 'withdraw' ? 'Retrait' : 'Versement'}</p>
                      <p className="text-xs text-muted-foreground">{new Date(p.date).toLocaleString()}</p>
                    </div>
                    <div className={"font-mono"}>
                      {(p.amount || 0).toLocaleString('fr-FR')} FCFA
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 mt-4">
          {!showPaymentForm ? (
            <button
              className="bg-blue-500 text-white py-2 rounded-xl"
              onClick={() => setShowPaymentForm(true)}
            >
              Effectuer Versement
            </button>
          ) : (
            <div className="flex gap-2">
              <input
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                className="flex-1 p-2 rounded border"
                placeholder="Montant en FCFA"
              />
              <button className="bg-green-600 text-white px-4 rounded" onClick={handleAddPayment}>
                Valider
              </button>
              <button className="bg-gray-200 px-4 rounded" onClick={() => setShowPaymentForm(false)}>
                Annuler
              </button>
            </div>
          )}

          {client.type === "compte-courant" ? (
            <button className="bg-red-500 text-white py-2 rounded-xl" onClick={handleRetirer}>
              Retirer
            </button>
          ) : (
            <button className="bg-red-500 text-white py-2 rounded-xl" onClick={handleSolder}>
              Solder le compte
            </button>
          )}
        </div>
      </div>
    </div>
  );
}