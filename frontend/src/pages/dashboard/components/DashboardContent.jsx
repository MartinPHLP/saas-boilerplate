export function DashboardContent() {
  return (
    <div className="p-8">
      {/* Dashboard header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to your personal space</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: "Active Projects", value: "12", color: "bg-blue-500" },
          { title: "Current Tasks", value: "34", color: "bg-green-500" },
          { title: "Unread Messages", value: "7", color: "bg-yellow-500" },
          { title: "Notifications", value: "23", color: "bg-purple-500" },
        ].map((stat, index) => (
          <div
            key={index}
            className={`${stat.color} p-6 rounded-lg shadow-lg text-white`}
          >
            <h3 className="text-lg font-semibold mb-2">{stat.title}</h3>
            <p className="text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main section with grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent activities */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="border-b border-gray-200 pb-4 last:border-0"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                    <div>
                      <p className="font-semibold">Action #{index + 1}</p>
                      <p className="text-sm text-gray-600">
                        {Math.floor(Math.random() * 60)} minutes ago
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">Details</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-8">
          {/* Todo tasks */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Todo Tasks</h2>
            <div className="space-y-3">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded"
                >
                  <input type="checkbox" className="w-4 h-4" />
                  <span>Important Task #{index + 1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent messages */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Recent Messages</h2>
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                  <div>
                    <p className="font-semibold">User {index + 1}</p>
                    <p className="text-sm text-gray-600">
                      New message received...
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chart example */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Statistics</h2>
            <div className="h-48 bg-gray-100 rounded flex items-center justify-center">
              <p className="text-gray-500">Chart placeholder</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional section to test scroll */}
      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Current Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <h3 className="font-bold mb-2">Project #{index + 1}</h3>
              <div className="h-2 bg-gray-200 rounded">
                <div
                  className="h-2 bg-blue-500 rounded"
                  style={{ width: `${Math.floor(Math.random() * 100)}%` }}
                ></div>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
