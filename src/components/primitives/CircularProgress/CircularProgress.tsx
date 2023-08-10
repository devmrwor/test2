interface CircularProgressProps {
  value: number;
}

export function CircularProgress({ value }: CircularProgressProps) {
  return (
    <div className="h-8 w-8 rounded-full relative">
      <div
        style={{ backgroundImage: `conic-gradient(#fff ${Math.abs(1 - value) * 360}deg, #3aa4cb 0deg)` }}
        className="absolute -top-0.75 -left-0.75 h-9.5 w-9.5 rounded-full transition-all"
      ></div>
      <div className="w-full h-full flex items-center justify-center relative z-10 bg-white rounded-full">
        <span className="text-text-secondary text-sm">{Math.round(value * 100)}%</span>
      </div>
    </div>
  );
}
