import { useEffect, useState } from 'react';
import InventoryChart from '../components/InventoryChart';
import DemandChart from '../components/DemandChart';
import RFIDTable from '../components/RFIDTable';
import HeatmapChart from '../components/HeatmapChart';

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Dashboard() {
  const [inventory, setInventory] = useState([]);
  const [sales, setSales] = useState([]);
  const [predicted, setPredicted] = useState([]);
  const [rfid, setRfid] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [invRes, salesRes, predRes, rfidRes] = await Promise.all([
          fetch(`${API}/sensor-alert`),
          fetch(`${API}/sales`),
          fetch(`${API}/predict-demand`),
          fetch(`${API}/rfid-scan`),
        ]);

        if (!invRes.ok || !salesRes.ok || !predRes.ok || !rfidRes.ok) {
          throw new Error('One or more API requests failed.');
        }

        const inv = await invRes.json();
        const salesJson = await salesRes.json();
        const predJson = await predRes.json();
        const rfidJson = await rfidRes.json();

        setInventory(inv.sensor_alerts || []);
        setSales(salesJson.sales || []);
        setPredicted(predJson.predicted || []);
        setRfid(rfidJson.rfid_scans || []);
      } catch (e) {
        setError(e.message || 'Failed to load data.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '24px 32px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          color: '#64748b'
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            border: '2px solid #e2e8f0',
            borderTopColor: '#f59e0b',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          Loading dashboard...
        </div>

        {/* Heatmap Chart Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #f1f5f9',
          marginTop: '24px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#f3e8ff',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '12px'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <path d="M9 9h6v6H9z"/>
                  <path d="M9 3v6"/>
                  <path d="M15 3v6"/>
                  <path d="M9 15v6"/>
                  <path d="M15 15v6"/>
                  <path d="M3 9h6"/>
                  <path d="M3 15h6"/>
                  <path d="M15 9h6"/>
                  <path d="M15 15h6"/>
                </svg>
              </div>
              <div>
                <h2 style={{
                  margin: 0,
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1e293b'
                }}>
                  Product Movement Heatmap
                </h2>
                <p style={{
                  margin: '2px 0 0 0',
                  fontSize: '14px',
                  color: '#64748b'
                }}>
                  Activity patterns by location and time
                </p>
              </div>
            </div>
            <div style={{
              padding: '6px 12px',
              backgroundColor: '#f3e8ff',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '500',
              color: '#7c3aed'
            }}>
              24h view
            </div>
          </div>
          <div style={{
            border: '1px solid #f1f5f9',
            borderRadius: '12px',
            overflow: 'hidden',
            padding: '16px',
            minHeight: '400px'
          }}>
            <HeatmapChart data={rfid} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{
          padding: '24px 32px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          color: '#dc2626',
          border: '1px solid #fecaca'
        }}>
          <div style={{ fontWeight: '600', marginBottom: '8px' }}>Error Loading Dashboard</div>
          <div style={{ fontSize: '14px', color: '#7f1d1d' }}>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e2e8f0',
        padding: '24px 32px'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '24px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
                <path d="M15 18H9"/>
                <path d="M19 18h2a1 1 0 0 0 1-1v-3.28a1 1 0 0 0-.684-.948l-1.923-.641a1 1 0 0 1-.578-.502l-1.539-3.076A1 1 0 0 0 16.382 8H14"/>
                <circle cx="8" cy="18" r="2"/>
                <circle cx="18" cy="18" r="2"/>
              </svg>
            </div>
            <div>
              <h1 style={{
                margin: 0,
                fontSize: '28px',
                fontWeight: '700',
                color: '#1e293b',
                letterSpacing: '-0.025em'
              }}>
                Analytics Dashboard
              </h1>
              <p style={{
                margin: '4px 0 0 0',
                fontSize: '15px',
                color: '#64748b'
              }}>
                Real-time inventory and demand insights
              </p>
            </div>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            backgroundColor: '#f0fdf4',
            borderRadius: '8px',
            border: '1px solid #bbf7d0'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              backgroundColor: '#22c55e',
              borderRadius: '50%'
            }} />
            <span style={{
              fontSize: '13px',
              fontWeight: '500',
              color: '#15803d'
            }}>
              Live Data
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '32px'
      }}>
        {/* Charts Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {/* Inventory Chart Card */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #f1f5f9'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#fef3c7',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '12px'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
                  <line x1="12" y1="22.08" x2="12" y2="12"/>
                </svg>
              </div>
              <div>
                <h2 style={{
                  margin: 0,
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1e293b'
                }}>
                  Inventory Levels
                </h2>
                <p style={{
                  margin: '2px 0 0 0',
                  fontSize: '14px',
                  color: '#64748b'
                }}>
                  Current stock status
                </p>
              </div>
            </div>
            <div style={{ height: '300px' }}>
              <InventoryChart data={inventory} />
            </div>
          </div>

          {/* Demand Chart Card */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #f1f5f9'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#dbeafe',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '12px'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                  <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
                </svg>
              </div>
              <div>
                <h2 style={{
                  margin: 0,
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1e293b'
                }}>
                  Demand Analysis
                </h2>
                <p style={{
                  margin: '2px 0 0 0',
                  fontSize: '14px',
                  color: '#64748b'
                }}>
                  Predicted vs actual demand
                </p>
              </div>
            </div>
            <div style={{ height: '300px' }}>
              <DemandChart actual={sales} predicted={predicted} />
            </div>
          </div>
        </div>

        {/* RFID Table Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #f1f5f9'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#dcfce7',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '12px'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
              </div>
              <div>
                <h2 style={{
                  margin: 0,
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1e293b'
                }}>
                  Recent RFID Scans
                </h2>
                <p style={{
                  margin: '2px 0 0 0',
                  fontSize: '14px',
                  color: '#64748b'
                }}>
                  Latest product movements
                </p>
              </div>
            </div>
            <div style={{
              padding: '6px 12px',
              backgroundColor: '#dcfce7',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '500',
              color: '#22c55e'
            }}>
              {rfid.length} scans
            </div>
          </div>
          <div style={{
            border: '1px solid #f1f5f9',
            borderRadius: '12px',
            overflow: 'hidden'
          }}>
            <RFIDTable rows={rfid} />
          </div>
        </div>

        {/* Heatmap Chart Card */}
<div style={{
  backgroundColor: 'white',
  borderRadius: '16px',
  padding: '24px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  border: '1px solid #f1f5f9',
  marginTop: '32px'
}}>
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px'
  }}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{
        width: '40px',
        height: '40px',
        backgroundColor: '#f3e8ff',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '12px'
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <path d="M9 9h6v6H9z"/>
          <path d="M9 3v6"/>
          <path d="M15 3v6"/>
          <path d="M9 15v6"/>
          <path d="M15 15v6"/>
          <path d="M3 9h6"/>
          <path d="M3 15h6"/>
          <path d="M15 9h6"/>
          <path d="M15 15h6"/>
        </svg>
      </div>
      <div>
        <h2 style={{
          margin: 0,
          fontSize: '18px',
          fontWeight: '600',
          color: '#1e293b'
        }}>
          Product Movement Heatmap
        </h2>
        <p style={{
          margin: '2px 0 0 0',
          fontSize: '14px',
          color: '#64748b'
        }}>
          Activity patterns by location and time
        </p>
      </div>
    </div>
    <div style={{
      padding: '6px 12px',
      backgroundColor: '#f3e8ff',
      borderRadius: '6px',
      fontSize: '13px',
      fontWeight: '500',
      color: '#7c3aed'
    }}>
      24h view
    </div>
  </div>
  <div style={{
    border: '1px solid #f1f5f9',
    borderRadius: '12px',
    overflow: 'hidden',
    padding: '16px',
    minHeight: '400px'
  }}>
    <HeatmapChart data={rfid} />
  </div>
</div>


        {/* Optional Metabase Section */}
        {/* Uncomment below if you want to add Metabase integration */}
        {/* <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #f1f5f9',
          marginTop: '24px'
        }}>
          <iframe
            src="http://localhost:3001/public/dashboard/your-public-token"
            title="Metabase Dashboard"
            frameBorder="0"
            style={{ width: '100%', height: '600px', borderRadius: '12px' }}
            allowTransparency
          />
        </div> */}
      </div>

      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}