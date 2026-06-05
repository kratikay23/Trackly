import "../pages/familyTracker.css";

function RightSide() {
  return (
    <div className="family-tracker-welcome">
      <img
        src="https://cdn-icons-png.flaticon.com/512/684/684908.png"
        alt="Map illustration"
      />
      <h3>Trackly</h3>
      <p>
        Family first. Always connected. Track your loved ones and manage safety alerts,
        messages, and maps — all in one place.
      </p>
      <p className="text-muted small mt-3 mb-0 d-md-none">
        Use the bar below to open Live Map or Group Chat.
      </p>
    </div>
  );
}

export default RightSide;
