interface PointMarkerProps {
  point: number | null;
}

export function PointMarker({ point }: PointMarkerProps) {
  return (
    <div className="flex items-center gap-2 justify-center">
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm border-2 ${
          point != null
            ? 'bg-white text-casino-black border-white'
            : 'bg-casino-black text-white border-gray-600'
        }`}
      >
        {point != null ? (
          <div className="text-center leading-tight">
            <div className="text-[10px]">ON</div>
            <div className="text-lg -mt-1">{point}</div>
          </div>
        ) : (
          <span className="text-xs">OFF</span>
        )}
      </div>
    </div>
  );
}
