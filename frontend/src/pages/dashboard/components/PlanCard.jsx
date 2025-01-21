export function PlanCard({
  name,
  price,
  features,
  isCurrentPlan,
  onSubscribe,
  isLoading,
  disableSubscribe,
}) {
  return (
    <div className="border rounded-lg p-6 flex flex-col h-full hover:shadow-lg transition-shadow bg-secondary">
      <div className="mb-4">
        <h3 className="text-xl font-bold mb-2">{name}</h3>
        <p className="text-3xl font-bold mb-1">
          ${price}
          <span className="text-sm text-gray-500">/month</span>
        </p>
      </div>

      <ul className="space-y-2 mb-6 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-gray-500">
            <span className="mr-2">•</span>
            {feature}
          </li>
        ))}
      </ul>

      <button
        onClick={onSubscribe}
        disabled={isCurrentPlan || isLoading || disableSubscribe}
        className={`w-full py-2 px-4 rounded-lg transition-colors ${
          isCurrentPlan || disableSubscribe
            ? "bg-neutral text-gray-500 cursor-not-allowed"
            : isLoading
            ? "bg-neutral-dark text-neutral cursor-wait"
            : "bg-primary text-secondary hover:bg-primary-hover"
        }`}
      >
        {isCurrentPlan
          ? "Current Plan"
          : disableSubscribe
          ? "Default Plan"
          : isLoading
          ? "Processing..."
          : "Subscribe"}
      </button>
    </div>
  );
}
