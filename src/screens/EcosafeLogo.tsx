export function EcosafeLogo() {
    return (
      <div className="flex flex-col items-center py-6">
        <div className="flex items-center space-x-3 mb-2">
          {/* Leaf icon */}
          <svg width="48" height="48" viewBox="0 0 48 48" className="text-green-600">
            <path
              d="M24 4C14.4 4 9.6 12 9.6 21.6c0 11.2 8.4 16.8 14.4 16.8s14.4-5.6 14.4-16.8c0-9.6-4.8-17.6-14.4-17.6z"
              fill="currentColor"
              fillOpacity="0.9"
            />
            <path
              d="M17 14c4-4 10-4 14 0"
              stroke="white"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M19 20c3-2 6-2 9 0"
              stroke="white"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-3xl font-medium text-gray-800">ecosafe</span>
        </div>
      </div>
    );
  }