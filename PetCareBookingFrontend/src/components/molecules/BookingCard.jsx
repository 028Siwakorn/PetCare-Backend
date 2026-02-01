import Card, { CardBody, CardTitle } from "./Card";
import Badge from "../atoms/Badge";
import Button from "../atoms/Button";

/**
 * BookingCard - one booking in history list
 */
export default function BookingCard({ booking, onCancel }) {
  const { _id, petName, appointmentDateTime, serviceId, status, customerName } = booking;
  const service = serviceId && (typeof serviceId === "object" ? serviceId : { name: "-" });
  const serviceName = service.name || "-";
  const date = appointmentDateTime
    ? new Date(appointmentDateTime).toLocaleString("th-TH", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "-";

  const canCancel = status === "pending" || status === "confirmed";
  const statusLabel = { pending: "รอดำเนินการ", confirmed: "ยืนยันแล้ว", completed: "เสร็จสิ้น", cancelled: "ยกเลิก" }[status] || status;

  return (
    <Card>
      <CardBody>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <CardTitle className="flex-1 min-w-0">{serviceName}</CardTitle>
          <Badge status={status}>{statusLabel}</Badge>
        </div>
        <p className="text-sm text-base-content/70">
          สัตว์เลี้ยง: <strong>{petName}</strong>
        </p>
        <p className="text-sm text-base-content/70">วันเวลา: {date}</p>
        {customerName && (
          <p className="text-sm text-base-content/60">ลูกค้า: {customerName}</p>
        )}
        {canCancel && onCancel && (
          <div className="mt-2">
            <Button size="sm" variant="error" onClick={() => onCancel(_id)}>
              ยกเลิกการจอง
            </Button>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
