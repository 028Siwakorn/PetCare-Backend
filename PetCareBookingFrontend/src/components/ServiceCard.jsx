import Card, { CardBody, CardTitle, CardActions } from "./Card";
import Button from "./Button";

/**
 * ServiceCard - แสดงบริการหนึ่งรายการ พร้อมปุ่มจอง
 */
export default function ServiceCard({ service, onBook }) {
  const { _id, name, description, price, imageUrl, duration, available } = service;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <figure className="w-full aspect-video overflow-hidden rounded-t-2xl bg-base-200">
        <img
          src={imageUrl || "https://placehold.co/400x225?text=Service"}
          alt={name}
          className="w-full h-full object-cover"
        />
      </figure>
      <CardBody>
        <CardTitle>{name}</CardTitle>
        <p className="text-sm text-base-content/70 line-clamp-2">{description}</p>
        <div className="flex flex-wrap gap-2 items-center text-sm">
          <span className="font-semibold text-primary">{price}฿</span>
          <span className="text-base-content/60">• {duration} min</span>
        </div>
        <CardActions>
          <Button
            size="sm"
            variant="primary"
            disabled={!available}
            onClick={() => onBook && onBook(service)}
          >
            {available ? "จองบริการ" : "ไม่ว่าง"}
          </Button>
        </CardActions>
      </CardBody>
    </Card>
  );
}
