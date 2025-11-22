import { ConnectButton, useCurrentAccount, useSignAndExecuteTransaction, useSuiClientQuery } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useState } from "react";
import Package3D from "./Package3D"; // Pastikan nama file ini sesuai

function App() {
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const [itemName, setItemName] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // STATE POP-UP
  const [selectedPackage, setSelectedPackage] = useState<any>(null);

  // --- KONFIGURASI ---
  // Pastikan ID ini adalah yang terbaru dari deploy tracking.move
  const PACKAGE_ID = "0x2935f11d00f65e7d7108396eb2c330f813b158bf444f7ee4bad82c93a8925d16"; 
  const MODULE_NAME = "tracking";
  const STRUCT_NAME = "Paket";

  const { data: paketList, refetch } = useSuiClientQuery(
    "getOwnedObjects",
    {
      owner: account?.address as string,
      filter: { StructType: `${PACKAGE_ID}::${MODULE_NAME}::${STRUCT_NAME}` },
      options: { showContent: true, showDisplay: true },
    },
    { enabled: !!account }
  );

  const handleCreate = () => {
    if (!account) return alert("Connect wallet dulu bos!");
    const tx = new Transaction();
    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::create_package`,
      arguments: [tx.pure.string(itemName)],
    });

    signAndExecute(
      { transaction: tx },
      {
        onSuccess: (result) => {
          alert(`Sukses! ID: ${result.digest}`);
          setItemName("");
          refetch();
        },
        onError: (err) => alert("Gagal: " + err.message),
      },
    );
  };

  // Hitung Statistik
  const totalBarang = paketList?.data?.length || 0;
  const barangDiPabrik = paketList?.data?.filter((item: any) => item.data?.content?.fields?.status.includes("Pabrik")).length || 0;

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "#09090b", 
      color: "#e4e4e7", 
      fontFamily: "'Inter', sans-serif",
      display: "flex"
    }}>
      
      {/* SIDEBAR MENU (Tetap di Kiri) */}
      <aside style={{ 
        width: "260px", 
        padding: "30px 20px", 
        borderRight: "1px solid #27272a",
        display: "flex", 
        flexDirection: "column",
        gap: "40px",
        position: "fixed",
        height: "100vh",
        top: 0,
        left: 0,
        zIndex: 50,
        background: "#09090b"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", paddingLeft: "10px" }}>
          <div style={{ width: "36px", height: "36px", background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", borderRadius: "10px", boxShadow: "0 0 15px rgba(59, 130, 246, 0.6)" }}></div>
          <div>
            <h1 style={{ fontSize: "18px", fontWeight: "bold", margin: 0, letterSpacing: "0.5px" }}>Sui Logistics</h1>
            <span style={{ fontSize: "10px", color: "#71717a", background: "#27272a", padding: "2px 6px", borderRadius: "4px" }}>PRO v2.0</span>
          </div>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <button onClick={() => setActiveTab("dashboard")} style={{ ...menuBtnStyle, background: activeTab === "dashboard" ? "#27272a" : "transparent", color: activeTab === "dashboard" ? "white" : "#a1a1aa" }}>
            📊 Dashboard
          </button>
          <button onClick={() => setActiveTab("produksi")} style={{ ...menuBtnStyle, background: activeTab === "produksi" ? "#27272a" : "transparent", color: activeTab === "produksi" ? "white" : "#a1a1aa" }}>
            🏭 Produksi
          </button>
          <button style={{ ...menuBtnStyle, opacity: 0.5, cursor: "not-allowed" }}>
            🚚 Pengiriman (Coming Soon)
          </button>
        </nav>

        <div style={{ marginTop: "auto", padding: "15px", background: "#18181b", borderRadius: "12px", border: "1px solid #27272a" }}>
          <p style={{ fontSize: "11px", color: "#71717a", marginBottom: "10px" }}>Wallet Status</p>
          <ConnectButton />
        </div>
      </aside>

      {/* MAIN CONTENT - SEKARANG FULL WIDTH */}
      <main style={{ 
        marginLeft: "260px", 
        padding: "40px", 
        flex: 1, // Mengisi sisa ruang
        width: "calc(100% - 260px)", // Memastikan lebar pas
        boxSizing: "border-box"
      }}>
        
        <header style={{ marginBottom: "40px", display: "flex", justifyContent: "space-between", alignItems: "end", borderBottom: "1px solid #27272a", paddingBottom: "20px" }}>
          <div>
            <h2 style={{ fontSize: "32px", fontWeight: "bold", margin: 0, color: "white" }}>Dashboard Supply Chain</h2>
            <p style={{ color: "#a1a1aa", marginTop: "8px" }}>Pantau aset digital secara real-time.</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <span style={{ background: "#064e3b", color: "#34d399", padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", border: "1px solid #059669" }}>
              ● Testnet Aktif
            </span>
          </div>
        </header>

        {/* GRID LAYOUT - Disesuaikan agar responsive */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", // Responsive Grid
          gap: "24px" 
        }}>

          {/* STATS */}
          <div style={{ ...bentoBox, background: "linear-gradient(135deg, #1e3a8a 0%, #172554 100%)", borderColor: "#1e40af" }}>
            <h3 style={{ ...bentoTitle, color: "#93c5fd" }}>Total Aset</h3>
            <p style={{ fontSize: "42px", fontWeight: "800", margin: 0, color: "white" }}>{totalBarang}</p>
          </div>

          <div style={bentoBox}>
            <h3 style={bentoTitle}>Dalam Produksi</h3>
            <p style={{ fontSize: "42px", fontWeight: "800", margin: 0, color: "#fbbf24" }}>{barangDiPabrik}</p>
          </div>

          {/* PANEL PRODUKSI + 3D (Lebar 2 Kolom jika cukup ruang) */}
          <div style={{ ...bentoBox, gridColumn: "span 2", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", right: "-30px", top: "0", width: "220px", height: "100%", zIndex: 0, opacity: 0.9 }}>
              <Package3D />
            </div>
            <div style={{ position: "relative", zIndex: 1, paddingRight: "160px" }}>
              <h3 style={bentoTitle}>🏭 Mulai Produksi Baru</h3>
              <p style={{ fontSize: "13px", color: "#a1a1aa", marginBottom: "15px" }}>
                Buat paket digital baru yang terdaftar abadi di blockchain.
              </p>
              {account ? (
                <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
                  <input 
                    placeholder="Nama Produk..." 
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    style={inputStyle}
                  />
                  <button onClick={handleCreate} style={primaryBtnStyle}>
                    + Buat
                  </button>
                </div>
              ) : (
                <p style={{ color: "#ef4444", fontSize: "14px" }}>🔒 Hubungkan wallet.</p>
              )}
            </div>
          </div>

          {/* GUDANG (Full Width Grid) */}
          <div style={{ ...bentoBox, gridColumn: "1 / -1", background: "transparent", border: "none", padding: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", alignItems: "center" }}>
              <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "white", margin: 0 }}>📦 Inventaris & Tracking</h3>
              <button onClick={() => refetch()} style={{ background: "#27272a", border: "none", color: "white", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "13px" }}>
                ↻ Refresh Data
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "20px" }}>
              {paketList?.data.map((item: any) => {
                const fields = item.data?.content?.fields;
                const history = fields?.location_history || [];

                return (
                  <div key={item.data?.objectId} style={cardStyle}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "20px" }}>
                      <div style={{ display: "flex", gap: "15px" }}>
                        <div style={{ background: "white", padding: "5px", borderRadius: "8px" }}>
                           <img 
                             src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${item.data?.objectId}`} 
                             alt="QR" 
                             style={{ width: "60px", height: "60px" }} 
                           />
                        </div>
                        <div>
                          <h4 style={{ margin: "0 0 5px 0", color: "#fff", fontSize: "18px" }}>{fields?.item_name}</h4>
                          <span style={statusBadgeStyle}>{fields?.status}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ borderTop: "1px solid #27272a", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <code style={{ fontSize: "10px", color: "#52525b" }}>ID: {item.data?.objectId.slice(0, 10)}...</code>
                      <button 
                        onClick={() => setSelectedPackage({ 
                          id: item.data?.objectId, 
                          name: fields?.item_name, 
                          status: fields?.status, 
                          owner: fields?.current_owner, 
                          history: history 
                        })}
                        style={{ fontSize: "11px", background: "none", border: "none", color: "#3b82f6", cursor: "pointer", fontWeight: "bold" }}
                      >
                        Detail &gt;
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </main>

      {/* MODAL POPUP */}
      {selectedPackage && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "20px", borderBottom: "1px solid #27272a", paddingBottom: "15px" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "24px", color: "white" }}>{selectedPackage.name}</h2>
                <span style={{ fontSize: "12px", color: "#a1a1aa" }}>Detail Tracking Asset</span>
              </div>
              <button onClick={() => setSelectedPackage(null)} style={{ background: "#27272a", border: "none", color: "white", width: "30px", height: "30px", borderRadius: "50%", cursor: "pointer", fontWeight: "bold" }}>✕</button>
            </div>
            <div style={{ display: "flex", gap: "30px" }}>
              <div style={{ flex: "0 0 150px", textAlign: "center" }}>
                <div style={{ background: "white", padding: "10px", borderRadius: "12px", display: "inline-block", marginBottom: "10px" }}>
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${selectedPackage.id}`} alt="QR Besar" style={{ width: "130px", height: "130px" }} />
                </div>
                <span style={{ ...statusBadgeStyle, width: "100%", boxSizing: "border-box", textAlign: "center", display: "block" }}>{selectedPackage.status}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: "20px" }}>
                  <p style={labelStyle}>Object ID</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#27272a", padding: "10px 15px", borderRadius: "8px", border: "1px solid #3f3f46" }}>
                    <code style={{ color: "#a1a1aa", fontSize: "12px", fontFamily: "monospace", flex: 1, wordBreak: "break-all" }}>{selectedPackage.id}</code>
                    <button onClick={() => navigator.clipboard.writeText(selectedPackage.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "14px" }}>📋</button>
                  </div>
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <p style={labelStyle}>Pemilik Saat Ini</p>
                  <code style={codeBlockStyle}>{selectedPackage.owner}</code>
                </div>
                <div>
                  <p style={labelStyle}>Riwayat Perjalanan</p>
                  <div style={{ background: "#09090b", padding: "15px", borderRadius: "8px", border: "1px solid #27272a", maxHeight: "150px", overflowY: "auto" }}>
                    {selectedPackage.history && selectedPackage.history.length > 0 ? (
                      <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "13px", color: "#d4d4d8" }}>
                        {selectedPackage.history.map((log: string, index: number) => (
                          <li key={index} style={{ marginBottom: "8px" }}>{log}</li>
                        ))}
                      </ul>
                    ) : <p style={{ fontSize: "13px", color: "#52525b", margin: 0 }}>Belum ada riwayat.</p>}
                  </div>
                </div>
              </div>
            </div>
            <div style={{ marginTop: "30px", paddingTop: "20px", borderTop: "1px solid #27272a", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button onClick={() => setSelectedPackage(null)} style={{ padding: "10px 20px", background: "transparent", border: "1px solid #3f3f46", color: "white", borderRadius: "8px", cursor: "pointer", fontSize: "14px" }}>Tutup</button>
              <button onClick={() => window.open(`https://suiscan.xyz/testnet/object/${selectedPackage.id}`, '_blank')} style={{ padding: "10px 20px", background: "#3b82f6", border: "none", color: "white", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: "14px" }}>Lihat di Explorer ↗</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- STYLES ---
const bentoBox = { background: "#18181b", border: "1px solid #27272a", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column" as const, justifyContent: "center" };
const bentoTitle = { fontSize: "12px", fontWeight: "700", color: "#71717a", margin: "0 0 10px 0", textTransform: "uppercase" as const, letterSpacing: "1px" };
const menuBtnStyle = { textAlign: "left" as const, padding: "12px 16px", borderRadius: "8px", border: "none", fontSize: "14px", fontWeight: "500", cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: "10px" };
const inputStyle = { flex: 1, background: "#27272a", border: "1px solid #3f3f46", borderRadius: "8px", padding: "12px 16px", color: "white", outline: "none", fontSize: "14px" };
const primaryBtnStyle = { background: "#3b82f6", color: "white", border: "none", borderRadius: "8px", padding: "0 24px", fontWeight: "600", cursor: "pointer", fontSize: "14px", whiteSpace: "nowrap" as const };
const cardStyle = { background: "#18181b", borderRadius: "16px", padding: "20px", border: "1px solid #27272a", transition: "transform 0.2s", display: "flex", flexDirection: "column" as const };
const statusBadgeStyle = { background: "rgba(16, 185, 129, 0.1)", color: "#34d399", fontSize: "11px", padding: "4px 10px", borderRadius: "20px", fontWeight: "600", border: "1px solid rgba(16, 185, 129, 0.2)", display: "inline-block" };
const modalOverlayStyle: React.CSSProperties = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0, 0, 0, 0.8)", backdropFilter: "blur(8px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 };
const modalContentStyle: React.CSSProperties = { background: "#18181b", border: "1px solid #3f3f46", borderRadius: "24px", padding: "30px", width: "90%", maxWidth: "800px", color: "white", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8)" };
const labelStyle = { fontSize: "11px", color: "#71717a", marginBottom: "6px", fontWeight: "bold" as const, textTransform: "uppercase" as const, letterSpacing: "0.5px" };
const codeBlockStyle = { display: "block", background: "transparent", color: "#a1a1aa", fontSize: "12px", fontFamily: "monospace", wordBreak: "break-all" as const };

export default App;