import React from 'react';

export function TopNav({ userEmail, onLogout, loggingOut }) {
  return (
    <header className="TopNav">
      <div className="TopNavLeft">
        <div className="Brand">
          <div className="BrandMark">L</div>
          <div className="BrandName">Listem Notes</div>
        </div>
      </div>

      <div className="TopNavRight">
        <div className="UserChip" title={userEmail}>
          {userEmail}
        </div>

        <button className="PrimaryButton" type="button" onClick={onLogout} disabled={loggingOut}>
          Logout
        </button>
      </div>
    </header>
  );
}
