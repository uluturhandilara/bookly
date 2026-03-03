"use client";

export default function LoadingOverlay() {
  return (
    <div className="loading-wrapper">
      <div className="loading-shadow-wrapper bg-white rounded-xl shadow-lg">
        <div className="loading-shadow p-8">
          <div className="loading-animation size-12 border-4 border-[#663820] border-t-transparent rounded-full" />
          <p className="loading-title text-[#212a3b]">Preparing your book...</p>
        </div>
      </div>
    </div>
  );
}
