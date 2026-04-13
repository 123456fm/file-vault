"use client";

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-mark">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
        <div className="sidebar-title">File Vault</div>
        <div className="sidebar-subtitle">文件管理系统</div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-label">主菜单</div>
        <a className="sidebar-item active" href="#">
          <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
          </svg>
          文件管理
        </a>
      </div>

      <div style={{ marginTop: "auto", padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.02em" }}>
          v1.0.0 · File Vault
        </div>
      </div>
    </aside>
  );
}
