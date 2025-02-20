export default function TenantDashboard({ params }: { params: { tenantId: string } }) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Tenant Dashboard</h1>
        <p>Welcome to the dashboard for tenant {params.tenantId}</p>
      </div>
    )
  }
  
  