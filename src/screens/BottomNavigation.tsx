export function BottomNavigation() {
    return (
      <div className="flex justify-center items-center py-4 bg-white">
        <div className="flex items-center space-x-12">
          {/* Recent apps button */}
          <button className="p-2 active:scale-90 transition-transform touch-manipulation">
            <div className="w-6 h-6 border-2 border-gray-600 rounded-sm"></div>
          </button>
          
          {/* Home button */}
          <button className="p-2 active:scale-90 transition-transform touch-manipulation">
            <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
          </button>
          
          {/* Back button */}
          <button className="p-2 active:scale-90 transition-transform touch-manipulation">
            <svg width="24" height="24" viewBox="0 0 24 24" className="text-gray-600">
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  }