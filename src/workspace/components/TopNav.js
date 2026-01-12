import React from 'react';
import { Link } from 'react-router-dom';

export function TopNav({ userEmail, onLogout, loggingOut }) {
  return (
    <header className="TopNav">
      <div className="TopNavLeft">
        <Link to="/" className="Brand BrandLink" aria-label="Back to home">
          <div className="BrandMark">L</div>
          <div className="BrandName">Listem Notes</div>
        </Link>
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
