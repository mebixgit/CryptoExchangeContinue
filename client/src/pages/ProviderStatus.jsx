import { useProviderStatus } from '../hooks/useApi';
import LoadingSpinner from '../components/LoadingSpinner';

const ProviderStatus = () => {
  const { data, loading, error } = useProviderStatus(60000);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="card bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <p className="text-red-600 dark:text-red-400">Error loading status: {error}</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-500';
      case 'offline':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-500';
      default:
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border-yellow-500';
    }
  };

  const getStatusIcon = (status) => {
    if (status === 'online') {
      return (
        <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
    } else {
      return (
        <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Provider Status</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor the health and availability of all integrated providers
        </p>
      </div>

      {data && (
        <div className="mb-8">
          <div className={`card ${data.overallStatus === 'healthy' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'}`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">Overall Status</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {data.onlineCount} of {data.totalCount} providers online
                </p>
              </div>
              <div className={`px-6 py-3 rounded-lg font-bold text-xl ${data.overallStatus === 'healthy' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}`}>
                {data.overallStatus.toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.providers.map((provider) => (
          <div key={provider.provider} className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getStatusIcon(provider.status)}
                <h3 className="text-xl font-bold">{provider.provider}</h3>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(provider.status)}`}>
                  {provider.status.toUpperCase()}
                </span>
              </div>

              {provider.latency && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Latency</span>
                  <span className="text-sm font-semibold">{provider.latency}</span>
                </div>
              )}

              {provider.serverTime && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Server Time</span>
                  <span className="text-sm font-semibold">
                    {new Date(provider.serverTime).toLocaleTimeString()}
                  </span>
                </div>
              )}

              {provider.error && (
                <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    <span className="font-semibold">Error:</span> {provider.error}
                  </p>
                </div>
              )}

              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Last checked: {new Date(provider.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Status refreshes every 60 seconds
        </p>
      </div>
    </div>
  );
};

export default ProviderStatus;
