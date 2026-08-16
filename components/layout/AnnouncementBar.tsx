const messages = ['New Season Edit', 'Complimentary Shipping on Orders Over \u20B912,000', 'Everyday Luxury'];

export function AnnouncementBar() {
  const items = [...messages, ...messages];
  return (
    <div className="announcement" aria-label="Store announcements">
      <div className="announcement__track">
        {items.map((message, index) => <span aria-hidden={index >= messages.length} key={`${message}-${index}`}>{message}</span>)}
      </div>
    </div>
  );
}