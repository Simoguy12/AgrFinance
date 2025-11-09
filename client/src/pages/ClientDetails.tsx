import { useLocation } from "wouter";
import { useEffect, useState } from "react";

export default function ClientDetails() {
  const [location, setLocation] = useLocation();
  const [client, setClient] = useState<any>(null);

  // Récupérer les infos du client passées via le lien
  useEffect(() => {
    const storedClient = localStorage.getItem("selectedClient");
    if (storedClient) {
      setClient(JSON.parse(storedClient));
    }
  }, []);

  if (!client) return <div className="p-4">Chargement...</div>;

  return (
    <div className="p-4 space-y-4">
      <button onClick={() => setLocation("/epargne")} className="text-blue-500">
        ← Retour
      </button>

      <div className="bg-gray-100 rounded-2xl p-4 shadow">
        <h2 className="text-xl font-bold">{client.nom}</h2>
        <p className="text-gray-500">{client.fonction || "Client"}</p>

        <div className="mt-3 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-xl p-4">
          <p>Code du compte: {client.codeCompte}</p>
          <p>Date: {client.dateCreation}</p>
          <p>Limite crédit: {client.limiteCredit} XAF</p>
        </div>

        <div className="bg-white mt-4 p-3 rounded-xl shadow">
          <p className="text-sm text-gray-600">Versements</p>
          <p className="text-2xl font-semibold text-green-600">{client.totalVersements} XAF</p>
          <p className="text-gray-500">Nombre de versements : {client.nombreVersements}</p>
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <button className="bg-blue-500 text-white py-2 rounded-xl">
            Effectuer Versement
          </button>
          <button className="bg-red-500 text-white py-2 rounded-xl">
            Solder le compte
          </button>
        </div>
      </div>
    </div>
  );
}