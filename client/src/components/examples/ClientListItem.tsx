import ClientListItem from '../ClientListItem';

export default function ClientListItemExample() {
  return (
    <div className="p-4 space-y-2">
      <ClientListItem
        name="Marie Kouassi"
        accountNumber="CR-2024-001"
        status="active"
        amount={250000}
        lastActivity="Il y a 2h"
        onClick={() => console.log('Client clicked')}
      />
      <ClientListItem
        name="Jean Baptiste"
        accountNumber="CR-2024-002"
        status="litigation"
        amount={180000}
        lastActivity="Hier"
        onClick={() => console.log('Client clicked')}
      />
    </div>
  );
}
