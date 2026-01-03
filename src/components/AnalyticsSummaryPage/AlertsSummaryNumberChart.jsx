const AlertsSummaryNumberChart = () => {
  const alertsTable = [
    { date: "Sat, 25 Dec", trips: 12, over: 0, out: 0 },
    { date: "Sun, 26 Dec", trips: 9, over: 0, out: 0 },
    { date: "Mon, 27 Dec", trips: 10, over: 0, out: 0 },
    { date: "Tue, 28 Dec", trips: 8, over: 0, out: 0 },
    { date: "Wed, 29 Dec", trips: 6, over: 0, out: 0 },
    { date: "Thu, 30 Dec", trips: 10, over: 0, out: 0 },
    { date: "Fri, 31 Dec", trips: 11, over: 0, out: 0 },
  ];
  return (
    <div className="min-h-57.5 p-2">
      <div className="font-semibold text-base text-gray-600 mb-8">
        Last 7 Days Alerts, Summary
      </div>
      <table className="text-xs w-full mt-3">
        <thead>
          <tr className="text-gray-400 mb-2">
            <th>Date</th>
            <th>Trips</th>
            <th>Over Speed</th>
            <th>Forced Out</th>
          </tr>
        </thead>
        <tbody>
          {alertsTable.map((row) => (
            <tr key={row.date}>
              <td className="p-1">{row.date}</td>
              <td className="text-center p-2">{row.trips}</td>
              <td className="text-center p-2">{row.over}</td>
              <td className="text-center p-2">{row.out}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AlertsSummaryNumberChart;
