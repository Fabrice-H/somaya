export function OrdersLoadingIndicator() {
  return (
    <div className="flex items-center gap-2" style={{ fontSize: 13, color: "#6b6b6b" }}>
      <div
        className="animate-spin"
        style={{
          width: 16,
          height: 16,
          border: "2px solid #511f29",
          borderTopColor: "transparent",
          borderRadius: "50%",
        }}
      />
      Chargement...
    </div>
  );
}
